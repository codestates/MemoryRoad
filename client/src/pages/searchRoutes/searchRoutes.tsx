import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FakeHeader from '../../components/map-test/fakeHeader';
import SearchRoutesBar from '../../components/searchRoutesBar/searchRoutesBar';
import SearchSideBar from '../../components/searchSideBar/searchSideBar';
import { RootState } from '../../redux/reducer';
import './searchRoutes.css';
import { Route } from './../../types/searchRoutesTypes';
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수

//declare : 변수 상수, 함수 또는 클래스가 어딘가에 선언되어 있음을 알린다.
// declare global : 전역 참조가 가능
declare global {
  interface Window {
    kakao: any;
  }
}
const kakao = window.kakao;

function SearchRoutes() {
  const dispatch = useDispatch();
  /* redux 전역 상태관리 */ // 왜 type 할당 : RootState는 되고 RootPersistState는 안되나요 ?
  const routeState: any = useSelector(
    (state: RootState) => state.createRouteReducer,
  );

  //state들
  //지도의 확대 정도
  const [currLevel, setCurrLevel] = useState(8);
  //검색 버튼을 눌러 가져온 루트의 정보들
  const [searchResult, setSearchResult] = useState<Route[]>([]);
  //총 루트의 개수. 페이지네이션에 사용
  const [routeCount, setRouteCount] = useState<number>(0);
  //검색 요청을 보냈을 때, 검색어
  const [searchKeyword, setSearchKeyword] = useState('');
  //사이드바의 열림 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //검색후 선택한 루트의 정보
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  //회색 핀 이미지 생성
  const pinImgSrc = 'http://127.0.0.1:5500/client/public/img/gray_marker.png';
  const pinImgSize = new kakao.maps.Size(33, 54);
  const pinImgOpt = { offset: new kakao.maps.Point(16, 55) };
  const pinImgObj = new kakao.maps.MarkerImage(
    pinImgSrc,
    pinImgSize,
    pinImgOpt,
  );

  //파랑 핀 이미지 생성
  const selectedPinImgSrc =
    'http://127.0.0.1:5500/client/public/img/blue_marker.png';
  const selectedPinImgSize = new kakao.maps.Size(33, 54);
  const selectedPinImgOpt = { offset: new kakao.maps.Point(16, 55) };
  const selectedPinImgObj = new kakao.maps.MarkerImage(
    selectedPinImgSrc,
    selectedPinImgSize,
    selectedPinImgOpt,
  );

  // *infoWindow 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }

  //루트를 받아 핀 객체들을 만들고, 랜더링 한다.
  function generatePins(routeInfo: Route, map: any) {
    for (const pin of routeInfo.Pins) {
      const pinObj = new kakao.maps.Marker({
        image:
          selectedRoute?.id === routeInfo.id ? selectedPinImgObj : pinImgObj,
        map: map,
        position: new kakao.maps.LatLng(
          Number(pin.latitude),
          Number(pin.longitude),
        ),
        clickable: true,
      });

      //인포윈도우 설정
      const infoWindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 마커 위에 마우스를 올렸을 때 발생되는 이벤트
      kakao.maps.event.addListener(pinObj, 'mouseover', function () {
        const content = InfoWindowContent(
          pin.locationName,
          pin.lotAddress,
          pin.roadAddress,
        );
        infoWindow.setContent(content);
        infoWindow.open(map, pinObj);
        // infoWindow 기본 css 없애기
        const infoWindowHTMLTags = document.querySelectorAll(
          '.windowInfo-content-container',
        );
        removeInfoWindowStyle(infoWindowHTMLTags[0]);
      });
      // 마커 위에서 마우스를 뗐을 때 발생되는 이벤트
      kakao.maps.event.addListener(pinObj, 'mouseout', function () {
        infoWindow.close();
      });
    }
  }

  //루트의 핀 정보를 이용해 루트의 중심 좌표를 구한다
  function getRouteCenter(routeInfo: Route | null) {
    //선택된 핀의 정보가 없는 경우 기본값 반환 & 확대 수준을 8로 한다.
    if (routeInfo === null || routeInfo.Pins.length === 0) {
      setCurrLevel(8);
      return new kakao.maps.LatLng(37.566826, 126.9786567);
    }
    const minLat = routeInfo.Pins.reduce(
      (acc, cur) => Math.min(acc, Number(cur.latitude)),
      Number.MAX_SAFE_INTEGER,
    );
    const maxLat = routeInfo.Pins.reduce(
      (acc, cur) => Math.max(acc, Number(cur.latitude)),
      Number.MIN_SAFE_INTEGER,
    );
    const minLng = routeInfo.Pins.reduce(
      (acc, cur) => Math.min(acc, Number(cur.longitude)),
      Number.MAX_SAFE_INTEGER,
    );
    const maxLng = routeInfo.Pins.reduce(
      (acc, cur) => Math.max(acc, Number(cur.longitude)),
      Number.MIN_SAFE_INTEGER,
    );
    //지도 레벨 변경(확대)
    setCurrLevel(4);
    //소수 계산 문제를 해결하기 위해 toFixed함수를 사용해 16자리에서 반올림 해 평균을 계산한다
    return new kakao.maps.LatLng(
      Number(((minLat + maxLat) / 2).toFixed(15)),
      Number(((minLng + maxLng) / 2).toFixed(15)),
    );
  }

  useEffect(() => {
    // *지도를 표시할 div
    const mapContainer = document.getElementById('map');

    const mapOptions = {
      center: getRouteCenter(selectedRoute),
      level: currLevel,
      draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
    };

    // 지도를 생성
    const map = new kakao.maps.Map(mapContainer, mapOptions);

    //검색 후 핀과 선 랜더링
    for (const route of searchResult) {
      generatePins(route, map);

      for (let i = 1; i < route.Pins.length; i++) {
        const prevLat = route.Pins[i - 1].latitude;
        const prevLng = route.Pins[i - 1].longitude;
        const linePath = [
          new kakao.maps.LatLng(prevLat, prevLng),
          new kakao.maps.LatLng(
            route.Pins[i].latitude,
            route.Pins[i].longitude,
          ),
        ];
        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: route.id === selectedRoute?.id ? '#4646CD' : '#eb3838',
          strokeOpacity: 0.7,
          strokeStyle: 'dashed',
        });
        polyline.setMap(map);
      }
    }
  }, [currLevel, searchResult, selectedRoute]);

  return (
    <>
      <div id="map-whole-container">
        <div id="map-navigator-top">
          <FakeHeader />
          <SearchRoutesBar
            setIsSidebarOpen={setIsSidebarOpen}
            setRouteCount={setRouteCount}
            setSearchKeyword={setSearchKeyword}
            setSearchResult={setSearchResult}
            setSelectedRoute={setSelectedRoute}
          />
          <SearchSideBar
            isSidebarOpen={isSidebarOpen}
            routeCount={routeCount}
            searchKeyword={searchKeyword}
            searchResult={searchResult}
            selectedRoute={selectedRoute}
            setIsSidebarOpen={setIsSidebarOpen}
            setSelectedRoute={setSelectedRoute}
          />
        </div>
        <div id="map"></div>
      </div>
    </>
  );
}
export default SearchRoutes;
