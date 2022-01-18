import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FakeHeader from '../../components/map-test/fakeHeader';
import SearchRoutesBar from '../../components/searchRoutesBar/searchRoutesBar';
import SearchSideBar from '../../components/searchSideBar/searchSideBar';
import { RootState } from '../../redux/reducer';
import './searchRoutes.css';
import { Route } from './../../types/searchRoutesTypes';
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수
import geojson from './memoryRoad.json';
import axios from 'axios';

//declare : 변수 상수, 함수 또는 클래스가 어딘가에 선언되어 있음을 알린다.
// declare global : 전역 참조가 가능
declare global {
  interface Window {
    kakao: any;
  }
}
const kakao = window.kakao;

//지도 인스턴스를 담을 변수
let map: any = [];

function SearchRoutes() {
  // const dispatch = useDispatch();
  // /* redux 전역 상태관리 */ // 왜 type 할당 : RootState는 되고 RootPersistState는 안되나요 ?
  // const routeState: any = useSelector(
  //   (state: RootState) => state.createRouteReducer,
  // );

  //state들
  //지도의 확대 정도
  const [currLevel, setCurrLevel] = useState(9);
  //검색 버튼을 눌러 가져온 루트의 정보들--->이게 없으면 범주화 기능
  const [searchResult, setSearchResult] = useState<Route[]>([]);
  //총 루트의 개수. 페이지네이션에 사용
  const [routeCount, setRouteCount] = useState<number>(0);
  //검색 요청을 보낼 때 사용하는 쿼리 객체
  const [searchQuery, setSearchQuery] = useState<{
    rq?: string;
    lq?: string;
    location?: string;
    time?: number;
    page: number;
  }>({ page: 1 });
  //사이드바의 열림 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //검색후 선택한 루트의 정보
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  //현재 페이지
  const [curPage, setCurPage] = useState(1);
  //현재 지도의 중심 위도, 경도
  const [centerLatLng, setCenterLatLng] = useState([37.566826, 126.9786567]);

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
    //선택된 핀의 정보가 없는 경우 기본값 반환
    if (routeInfo === null || routeInfo.Pins.length === 0) {
      // setCurrLevel(8);
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

  async function getWardCount() {
    const wardCount = await axios.get('https://server.memory-road.net/wards');
    // console.log(wardCount.data.result);
    return wardCount.data.result;
  }

  useEffect(() => {
    if (searchResult.length !== 0) {
      //검색 결과가 있는 경우, 폴리곤을 없애고 검색 결과들을 보여준다.
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
      map = new kakao.maps.Map(mapContainer, mapOptions);

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
    } else {
      //검색 결과가 없는 경우, 폴리곤을 보여주고, 위도, 경도에 따라 루트들을 검색해 불러온다.
      if (currLevel >= 8) {
        const data = geojson.features;
        let coordinates = []; //좌표 저장 배열
        let name = ''; //행정구 이름

        //루트의 개수를 엔드포인트에 요청해서 받아와야 한다.
        const polygons: any = [];

        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        const mapOption = {
          center: new kakao.maps.LatLng(centerLatLng[0], centerLatLng[1]), // 지도의 중심좌표
          level: 9, // 지도의 확대 레벨
          draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
          scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
          disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
        };

        map = new kakao.maps.Map(mapContainer, mapOption);
        const customOverlay = new kakao.maps.CustomOverlay({});

        const displayArea = (coordinates: any, name: any) => {
          let PoligonColor = ''; //폴리곤 색상
          let routeCount = 0; // 지역별 루트 개수
          const path: any = [];
          const points = [];

          coordinates[0].forEach((coordinate: any) => {
            const point: any = {};
            point.x = coordinate[1];
            point.y = coordinate[0];

            points.push(point);
            path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
          });

          getWardCount() //루트 리스트
            .then((routeList) => {
              // console.log(routeList[0].id, routeList[0].routesNumber);

              // 지역 이름이 같으면 루트 개수를 집어넣고 반복문 종료
              for (let i = 0; i < routeList.length; i++) {
                if (routeList[i].id === name) {
                  routeCount = routeList[i].routesNumber;
                  // console.log(routeList[i].routesNumber);
                  break;
                }
              }
              // 루트의 개수가 0~10인 경우, 11~30, 30~100인 경우 설정
              if (routeCount >= 0 && routeCount <= 30) {
                PoligonColor = '#FFFFFF';
              } else if (routeCount >= 31 && routeCount <= 80) {
                PoligonColor = '#FEFBDA';
              } else if (routeCount >= 81 && routeCount <= 100) {
                PoligonColor = '#FFF47C';
              } else if (routeCount >= 101) {
                PoligonColor = '#FFED27';
              }

              const polygon = new kakao.maps.Polygon({
                map: map,
                path: path, // 그려질 다각형의 좌표 배열입니다
                strokeWeight: 1, // 선의 두께입니다
                strokeColor: '#004c80', // 선의 색깔입니다
                strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'solid', // 선의 스타일입니다
                fillColor: PoligonColor, // 채우기 색깔입니다
                fillOpacity: 0.7, // 채우기 불투명도 입니다
              });

              polygons.push(polygon);

              // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
              // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
              // kakao.maps.event.addListener(
              //   polygon,
              //   'mouseover',
              //   function (mouseEvent: any) {
              //     polygon.setOptions({ fillColor: '#1E90FF' });

              //     customOverlay.setContent(
              //       '<div class="area" >' + name + '</div>',
              //     );

              //     customOverlay.setPosition(mouseEvent.latLng);
              //     customOverlay.setMap(map);
              //   },
              // );

              // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
              kakao.maps.event.addListener(
                polygon,
                'mousemove',
                function (mouseEvent: any) {
                  polygon.setOptions({ fillColor: '#1E90FF' });
                  // customOverlay.setPosition(mouseEvent.latLng);
                },
              );

              // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
              // 커스텀 오버레이를 지도에서 제거합니다
              kakao.maps.event.addListener(polygon, 'mouseout', function () {
                polygon.setOptions({ fillColor: PoligonColor });
                // customOverlay.setMap(null);
              });
            });
        };

        data.forEach((val) => {
          coordinates = val.geometry.coordinates;
          name = val.properties.SIG_KOR_NM;

          displayArea(coordinates, name);
        });

        // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'idle', function () {
          // 지도의 현재 레벨, 중심 좌표를 state로 관리한다.
          setCurrLevel((prev) => {
            if (prev === 8 && map.getLevel() <= 7) {
              //지도 레벨이 낮아지면, 폴리곤을 지운다
              polygons.forEach((pol: any) => pol.setMap(null));
            }

            return map.getLevel();
          });
          const latLngObj = map.getCenter();
          setCenterLatLng([latLngObj.getLat(), latLngObj.getLng()]);
        });
      } else {
        // 현재 레밸이 일정 레밸 이하면 폴리곤을 없앤다.
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        const mapOption = {
          center: new kakao.maps.LatLng(centerLatLng[0], centerLatLng[1]), // 지도의 중심좌표
          level: currLevel, // 지도의 확대 레벨
          draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
          scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
          disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
        };

        map = new kakao.maps.Map(mapContainer, mapOption);

        kakao.maps.event.addListener(map, 'idle', function () {
          // 지도의 현재 레벨, 중심 좌표를 state로 관리한다.
          setCurrLevel(map.getLevel());
          const latLngObj = map.getCenter();
          setCenterLatLng([latLngObj.getLat(), latLngObj.getLng()]);
        });
      }
    }
  }, [currLevel, searchResult, selectedRoute]);

  //검색 결과가 없으면서(검색 버튼을 누르지 않은 경우), 지도가 일정 레벨 이하이면, 꼭지점의 위도, 경도를 이용해 루트들을 조회한다.
  useEffect(() => {
    if (searchResult.length === 0 && currLevel <= 7) {
      //지도 영역정보
      const bounds = map.getBounds();
      //지도의 북동쪽 위도, 경도
      const neLatLng = bounds.getNorthEast();
      //지도의 남서쪽 위도, 경도
      const swLatLng = bounds.getSouthWest();

      //북서, 남동쪽 정보를 보내야 한다.
      axios
        .get(
          `https://server.memory-road.net/routes?search=true&nwLat=${swLatLng.getLat()}&nwLng=${neLatLng.getLng()}&seLat=${neLatLng.getLat()}&seLng=${swLatLng.getLng()}`,
        )
        .then((result) => {
          console.log(result.data);
          //검색 후 핀과 선 랜더링
          for (const route of result.data.routes) {
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
                strokeColor:
                  route.id === selectedRoute?.id ? '#4646CD' : '#eb3838',
                strokeOpacity: 0.7,
                strokeStyle: 'dashed',
              });
              polyline.setMap(map);
            }
          }
        })
        .catch((err) => {
          alert('서버 에러');
        });
    }
  }, [currLevel, centerLatLng]);

  return (
    <>
      <div id="map-whole-container">
        <div id="map-navigator-top">
          <FakeHeader />
          <SearchRoutesBar
            searchQuery={searchQuery}
            setIsSidebarOpen={setIsSidebarOpen}
            setRouteCount={setRouteCount}
            setSearchQuery={setSearchQuery}
            setSearchResult={setSearchResult}
            setSelectedRoute={setSelectedRoute}
          />
          <SearchSideBar
            curPage={curPage}
            isSidebarOpen={isSidebarOpen}
            routeCount={routeCount}
            searchQuery={searchQuery}
            searchResult={searchResult}
            selectedRoute={selectedRoute}
            setCurPage={setCurPage}
            setIsSidebarOpen={setIsSidebarOpen}
            setRouteCount={setRouteCount}
            setSearchQuery={setSearchQuery}
            setSearchResult={setSearchResult}
            setSelectedRoute={setSelectedRoute}
          />
        </div>
        <div id="map"></div>
      </div>
    </>
  );
}
export default SearchRoutes;
