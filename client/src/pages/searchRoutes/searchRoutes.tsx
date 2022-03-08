import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../../components/navigation/Navigation';
import SearchRoutesBar from '../../components/searchBar/searchBar_route/searchBar_route';
import SearchSideBar from '../../components/sidebar/sidebar_search/sidebar_search';
import { RootState } from '../../redux/reducer';
import './searchRoutes.css';
import { Route } from './../../types/searchRoutesTypes';
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수
import geojson from './memoryRoad.json';
import axios from 'axios';
import _ from 'lodash';

//declare : 변수 상수, 함수 또는 클래스가 어딘가에 선언되어 있음을 알린다.
// declare global : 전역 참조가 가능
declare global {
  interface Window {
    kakao: any;
  }
}
const kakao = window.kakao;

//지도 인스턴스를 담을 변수
// let map: any = [];

function SearchRoutes() {
  // const dispatch = useDispatch();
  // /* redux 전역 상태관리 */ // 왜 type 할당 : RootState는 되고 RootPersistState는 안되나요 ?
  // const routeState: any = useSelector(
  //   (state: RootState) => state.createRouteReducer,
  // );

  //state들
  //지도의 확대 정도
  const [currLevel, setCurrLevel] = useState(9);
  //검색 버튼을 눌러 가져온 루트의 정보들. null인 경우, 현재 보고있는 화면을 기준으로 루트들을 검색한다.
  const [searchResult, setSearchResult] = useState<Route[] | null>(null);
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
  // 카카오 맵 객체를 담는다
  const [kakaoMap, setKakaoMap] = useState<any | null>(null);
  //핀들
  const [pins, setPins] = useState<any[]>([]);
  //선들
  const [lines, setLines] = useState<any[]>([]);
  //구의 모양을 그리는 폴리곤(마우스 이벤트까지 추가되어 있다.)
  const [wardPolygons, setWardPolygons] = useState<Promise<any>[]>([]);
  //지도 폴리곤 위의 커스텀 오버레이
  const [wardOverlay, setWardOverlay] = useState<any[]>([]);
  //핀위에 마우스를 올렸을 때 나타나는 인포윈도우. 윈도우를 추적해 제거하는데 사용한다.
  const [_, setInfoWindows] = useState<any[]>([]);

  // 카카오 맵이 담기는 DOM을 가리킨다.
  const mapContainer = useRef<HTMLDivElement | null>(null);

  //회색 핀 이미지 생성
  const pinImgObj = new kakao.maps.MarkerImage(
    'https://server.memory-road.net/upload/gray_dot.png',
    new kakao.maps.Size(13, 13),
    {
      offset: new kakao.maps.Point(7, 6),
    },
  );

  //파랑 핀 이미지 생성
  const selectedPinImgSrc = 'https://server.memory-road.net/upload/red_pin.png';
  const selectedPinImgSize = new kakao.maps.Size(55, 55);
  const selectedOpt = { offset: new kakao.maps.Point(28, 55) };
  const selectedPinImgObj = new kakao.maps.MarkerImage(
    selectedPinImgSrc,
    selectedPinImgSize,
    selectedOpt,
  );

  // *infoWindow 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }

  //루트를 받아 핀 객체들을 만들고, 랜더링 한다.
  function generatePins(routeInfo: Route, map: any) {
    const pinAry = [];
    const infoWindowAry: any[] = [];
    for (const pin of routeInfo.Pins) {
      const pinObj = new kakao.maps.Marker({
        image:
          selectedRoute?.id === routeInfo.id ? selectedPinImgObj : pinImgObj,
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
      pinObj.setMap(map);
      pinAry.push(pinObj);
      infoWindowAry.push(infoWindow);
    }
    setInfoWindows((prev) => [...prev, ...infoWindowAry]);
    return pinAry;
  }

  //루트의 핀 정보를 이용해 루트의 중심 좌표를 구한다
  function getRouteCenter(routeInfo: Route | null) {
    //선택된 핀의 정보가 없는 경우 기본값 반환
    if (routeInfo === null || routeInfo.Pins.length === 0) {
      // setCurrLevel(9);
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
    // setCurrLevel(4);
    //소수 계산 문제를 해결하기 위해 toFixed함수를 사용해 16자리에서 반올림 해 평균을 계산한다
    return new kakao.maps.LatLng(
      Number(((minLat + maxLat) / 2).toFixed(15)),
      Number(((minLng + maxLng) / 2).toFixed(15)),
    );
  }

  async function getWardCount() {
    const controller = new AbortController();
    const wardCount = await axios.get('https://server.memory-road.net/wards');
    controller.abort();
    // console.log(wardCount.data.result);
    return wardCount.data.result;
  }

  const displayArea = async (coordinates: any, name: any, kakaoMap: any) => {
    //루트의 개수를 엔드포인트에 요청해서 받아와야 한다.

    const customOverlay = new kakao.maps.CustomOverlay({});

    let PoligonColor = ''; //폴리곤 색상
    let routeCount = 0; // 지역별 루트 개수
    const path: any = [];
    const points = [];
    // console.log(coordinates[0].length);
    coordinates[0].forEach((coordinate: any) => {
      const point: any = {};
      point.x = coordinate[1];
      point.y = coordinate[0];

      points.push(point);
      path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
    });

    const newPol = await getWardCount() //루트 리스트
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
          PoligonColor = '#D5EDE0';
        } else if (routeCount >= 31 && routeCount <= 80) {
          PoligonColor = '#9FC9B3';
        } else if (routeCount >= 81 && routeCount <= 100) {
          PoligonColor = '#6E9C82';
        } else if (routeCount >= 101) {
          PoligonColor = '#3A7855';
        }

        const polygon = new kakao.maps.Polygon({
          map: kakaoMap,
          path: path, // 그려질 다각형의 좌표 배열입니다
          strokeWeight: 1, // 선의 두께입니다
          strokeColor: '#FFFFFF', // 선의 색깔입니다
          strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일입니다
          fillColor: PoligonColor, // 채우기 색깔입니다
          fillOpacity: 0.7, // 채우기 불투명도 입니다
        });

        // polygons.push(polygon);

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
        // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
        kakao.maps.event.addListener(
          polygon,
          'mouseover',
          function (mouseEvent: any) {
            polygon.setOptions({ fillColor: '#1E90FF' });

            customOverlay.setContent(
              '<div id="overlay-area" >' + name + '</div>',
            );

            const latLngObj = mouseEvent.latLng;
            const newLat = latLngObj.getLat() + 0.02;
            const newLng = latLngObj.getLng();

            customOverlay.setPosition(new kakao.maps.LatLng(newLat, newLng));
            customOverlay.setMap(kakaoMap);
          },
        );

        // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
        kakao.maps.event.addListener(
          polygon,
          'mousemove',
          function (mouseEvent: any) {
            polygon.setOptions({ fillColor: '#1E90FF' });
            const latLngObj = mouseEvent.latLng;
            const newLat = latLngObj.getLat() + 0.02;
            const newLng = latLngObj.getLng();

            customOverlay.setPosition(new kakao.maps.LatLng(newLat, newLng));
          },
        );

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
        // 커스텀 오버레이를 지도에서 제거합니다
        kakao.maps.event.addListener(polygon, 'mouseout', function () {
          polygon.setOptions({ fillColor: PoligonColor });
          customOverlay.setMap(null);
        });

        return polygon;
      });
    setWardOverlay((prev) => [...prev, customOverlay]);
    return newPol;
  };

  //지도 객체 생성. 초기 랜더링
  useEffect(() => {
    const data = geojson.features;
    let coordinates = []; //좌표 저장 배열
    let name = ''; //행정구 이름

    const mapOptions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: currLevel,
      draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOptions);
    kakao.maps.event.addListener(map, 'idle', function () {
      // 지도의 현재 레벨, 중심 좌표를 state로 관리한다.
      setCurrLevel(map.getLevel());
      const latLngObj = map.getCenter();
      setCenterLatLng([latLngObj.getLat(), latLngObj.getLng()]);
    });

    //폴리곤 객체 저장
    const polygons: any = [];

    data.forEach((val) => {
      coordinates = val.geometry.coordinates;
      name = val.properties.SIG_KOR_NM;

      polygons.push(displayArea(coordinates, name, map));
    });

    setWardPolygons(polygons);

    setKakaoMap(map);
  }, []);

  //선택한 루트가 바뀔 경우, 맵의 중심과 레벨 변경
  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }

    kakaoMap.setCenter(getRouteCenter(selectedRoute));
    kakaoMap.setLevel(4);
  }, [selectedRoute]);

  useEffect(() => {
    if (kakaoMap === null) return;

    if (searchResult !== null) {
      //검색버튼을 누련 경우(검색 결과가 없어도 배열이 state가 된다.), 폴리곤을 없애고 검색 결과들을 보여준다.

      //폴리곤 삭제
      wardPolygons.forEach((promise) => {
        promise.then((pol) => pol.setMap(null));
      });

      //폴리곤 위 오버레이 삭제
      wardOverlay.forEach((e) => {
        e.setMap(null);
      });

      //기존 핀의 인포윈도우 제거
      setInfoWindows((prev) => {
        prev.forEach((e) => {
          e.setMap(null);
        });
        return [];
      });

      const newLines: any[] = [];
      let newPins: any[] = [];
      //검색 후 핀과 선 랜더링
      for (const route of searchResult) {
        newPins = [...generatePins(route, kakaoMap), ...newPins];
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
            strokeColor: route.id === selectedRoute?.id ? '#DC4B40' : '#636363',
            strokeOpacity: 0.5,
            strokeStyle: 'solid',
          });
          polyline.setMap(kakaoMap);
          newLines.push(polyline);
        }
      }
      //기존 선과 핀들 초기화
      setPins((prev) => {
        prev.forEach((pin) => pin.setMap(null));

        return newPins;
      });

      setLines((prev) => {
        prev.forEach((line) => line.setMap(null));

        return newLines;
      });
    }
  }, [selectedRoute, searchResult]);

  // //검색 결과가 없으면서(검색 버튼을 누르지 않은 경우), 지도가 일정 레벨 이하이면, 꼭지점의 위도, 경도를 이용해 루트들을 조회한다.
  useEffect(() => {
    if (kakaoMap === null) return;
    if (searchResult === null && currLevel <= 6) {
      //폴리곤 삭제
      wardPolygons.forEach((promise) => {
        promise.then((pol) => pol.setMap(null));
      });

      //폴리곤 위 오버레이 삭제
      wardOverlay.forEach((e) => {
        e.setMap(null);
      });

      //지도 영역정보
      const bounds = kakaoMap.getBounds();
      //지도의 북동쪽 위도, 경도
      const neLatLng = bounds.getNorthEast();
      //지도의 남서쪽 위도, 경도
      const swLatLng = bounds.getSouthWest();

      const controller = new AbortController();
      //북서, 남동쪽 정보를 보내야 한다.
      axios
        .get(
          `https://server.memory-road.net/routes?search=true&nwLat=${swLatLng.getLat()}&nwLng=${neLatLng.getLng()}&seLat=${neLatLng.getLat()}&seLng=${swLatLng.getLng()}`,
        )
        .then((result) => {
          //기존 핀의 인포윈도우 제거
          setInfoWindows((prev) => {
            prev.forEach((e) => {
              e.setMap(null);
            });
            return [];
          });

          const newLines: any[] = [];
          let newPins: any[] = [];
          //검색 후 핀과 선 랜더링
          for (const route of result.data.routes) {
            newPins = [...generatePins(route, kakaoMap), ...newPins];

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
                strokeWeight: 3,
                strokeColor: '#636363',
                strokeOpacity: 0.5,
                strokeStyle: 'solid',
              });
              polyline.setMap(kakaoMap);
              newLines.push(polyline);
            }
          }
          //기존 선과 핀들 초기화
          setPins((prev) => {
            prev.forEach((pin) => pin.setMap(null));

            return newPins;
          });

          setLines((prev) => {
            prev.forEach((line) => line.setMap(null));

            return newLines;
          });
        })
        .catch((err) => {
          //abort 에러는 경고창에 표시하지 않는다
          if (err.name === 'AbortError') {
            throw 'AbortError';
          }
        });

      //state hook같은 경우는 아래 방법이 의도한 대로 동작해, 한 변의 요청이 가지만, 지도 이동 같은 경우는 slow3g로 요청을 보내면 계속 요청이 간다. lodash의 throttle 사용해 보기
      //응답을 받기 전에 요청이 가면 이전 요청을 취소한다
      //https://axios-http.com/docs/cancellation
      controller.abort();
    } else if (searchResult === null) {
      //검색 결과가 없으면서 지도 레벨이 높아진 경우

      //기존 핀의 인포윈도우 제거
      setInfoWindows((prev) => {
        prev.forEach((e) => {
          e.setMap(null);
        });
        return [];
      });

      //폴리곤을 그린다
      //폴리곤 위 오버레이는 폴리곤에 저장되어 있기 때문에 그리지 않아도 된다.
      wardPolygons.forEach((promise) => {
        promise.then((pol) => {
          pol.setMap(kakaoMap);
        });
      });

      //기존 선과 핀들 초기화
      setPins((prev) => {
        prev.forEach((pin) => pin.setMap(null));
        return [];
      });
      setLines((prev) => {
        prev.forEach((line) => line.setMap(null));
        return [];
      });
    }
  }, [currLevel, centerLatLng]);

  return (
    <>
      <div id="map-whole-container">
        <div id="map-navigator-top">
          <Navigation />
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
        <div id="mapContainer" ref={mapContainer}></div>
      </div>
    </>
  );
}
export default SearchRoutes;
