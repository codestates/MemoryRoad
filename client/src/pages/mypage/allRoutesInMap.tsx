import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import ColorSelectBox from '../../components/selectBox/selectBox_color/selectBox_color_map';
import './allRoutesInMap.css';
import axios from 'axios';
import { Picture, Route } from '../../types/searchRoutesTypes';
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수
import ClickImage from '../../modals/clickImage/clickImage';
import NoRouteInMap from '../../modals/noRouteInMap/noRouteInMap';
import Navigation from '../../components/navigation/Navigation';

// 루트를 받고, 루트의 핀 값을 받을 것 같음
// 각 루트별로 핀 객체를 받고, 받은 핀 객체값을 For문, 혹은 ForEach를 통해 핀의 위치값을 받아서 핀을 그리고 선을 이어줘야 할 것 같음
// 그렇게 다 뿌리고 나면, 각 핀을 클릭했을 경우에 이벤트가 발생해서 핀의 정보를 보여줘야 할 듯
// 엔드포인트에 요청할 때, 루트 정보엔 이미 칼라가 있릍테니 그걸 받아서 쓰면 될 것 같음
declare global {
  interface Window {
    kakao: any;
  }
}
const kakao = window.kakao;

function AllRoutesInMap() {
  const dispatch = useDispatch();
  /* redux 전역 상태관리 */ // 왜 type 할당 : RootState는 되고 RootPersistState는 안되나요 ?

  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.whiteColorUrl,
  ); // 색깔의 주소
  const colorChips: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorChip,
  ); // 색깔 css
  const colorsName: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  ); // 색깔 이름

  //state
  //지도의 확대 정도
  const [currLevel, setCurrLevel] = useState<number>(7);
  //전체 루트의 정보
  const [findAllRoute, setFindAllRoute] = useState<Route[] | null>(null);
  const [allRoutes, setAllRoutes] = useState<Route[] | null>(null);

  // 루트 색상 정보
  const [colorIdx, setColorIdx] = useState<number>(9);
  // 선택된 핀의 사진 정보
  const [pickPinsPictures, setPickPinsPictures] = useState<Picture[]>();

  // 루트가 없을 경우 on/off
  const [noRoute, setNoRoute] = useState<boolean>(false);

  //사진 클릭시 사진 인덱스 정보
  const [pictureIdx, setPictureIdx] = useState<number>(0);
  //사진 드래그
  // onMouseMove는 왼쪽 버튼을 떼도 발생합니다. 드래그 효과를 주기 위해 isDrag변수가 true 일 때 발생하도록 설정했습니다
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const [startX, setStartX] = useState<number>(0);

  //사진 클릭시 모달창 on/off
  const [bigImage, setBigImage] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // startX는 현재 클릭한 pageX와 움직인 스크롤의 길이 scrollLeft를 합친 값입니다.
  // 스크롤이 이동하지 않았을 때는 문제가 없지만 스크롤이 이동된 상태에서 클릭을 한다면,
  // 브라우저의 width의 pageX값이 설정이 돼 순간적으로 앞쪽으로 스크롤이 됩니다.
  // 이를 막기 위해 scrollLeft를 더해 현재 x의 위치를 계산했습니다.
  const onDragStart = (e: any) => {
    const { current } = scrollRef;
    if (current !== null) {
      e.preventDefault();
      setIsDrag(true);
      setStartX(e.pageX + current.scrollLeft);
    }
  };
  // onMouseUp, onMouseLeave 이벤트가 발생했을 때 isDrag를 false로 설정했습니다.
  const onDragEnd = () => {
    setIsDrag(false);
  };
  // 스크롤을 실질적으로 움직이게 하는 부분. 처음 클릭한 x의 좌표 startX와 움직이면서 변하는 e.pageX로 scrollLeft의 값을 설정했습니다.
  const onDragMove = (e: any) => {
    const { current } = scrollRef;
    if (current !== null) {
      if (isDrag) {
        current.scrollLeft = startX - e.pageX;
      }
    }
  };

  //핀 이미지 생성
  const pinImgSize = new kakao.maps.Size(25, 25);
  const pinImgOpt = { offset: new kakao.maps.Point(14, 14) };

  // *infoWindow 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }

  //루트를 받아 핀 객체들을 만들고, 랜더링 한다.
  function generatePins(routeInfo: Route, map: any) {
    let pinColorUrl = '';
    for (let i = 0; i < colorsName.length; i++) {
      if (routeInfo.color === colorsName[i]) {
        pinColorUrl = colorUrls[i];
      }
    }
    const pinImgSrc = pinColorUrl;
    const pinImgObj = new kakao.maps.MarkerImage(
      pinImgSrc,
      pinImgSize,
      pinImgOpt,
    );
    for (const pin of routeInfo.Pins) {
      //루트의 색깔에 따라 핀의 이미지가 바뀌어야 한다.
      const pinObj = new kakao.maps.Marker({
        image: pinImgObj,
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
      kakao.maps.event.addListener(pinObj, 'click', function () {
        // 지도 아래에 핀이 가진 사진들이 나열되는 이벤트
        setPickPinsPictures(pin.Pictures);
      });
    }
  }

  function getRouteCenter(routeInfo: Route | null) {
    //선택된 핀의 정보가 없는 경우 기본값 반환
    if (routeInfo === null || routeInfo.Pins.length === 0) {
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
    return { minLat, maxLat, minLng, maxLng };
  }

  useEffect(() => {
    if (findAllRoute === null) {
      axios
        .get('https://server.memory-road.net/routes', { withCredentials: true })
        .then((res) => {
          const routeArray: Route[] = res.data['routes'];
          setFindAllRoute(routeArray);
          setAllRoutes(routeArray);
          if (res.data['count'] === 0) {
            setNoRoute(true);
          }
        });
    }

    // 지도 생성
    const mapContainer = document.getElementById('map');

    //전체 루트 중의 전체 센터값을 가져와야할 듯.
    const center = (routes: Route[] | null) => {
      let minLat = 90,
        maxLat = -90,
        minLng = 180,
        maxLng = -180;
      if (routes === null || routes.length === 0) {
        return new kakao.maps.LatLng(37.566826, 126.9786567);
      }
      for (const route of routes) {
        const corner = getRouteCenter(route);
        if (minLat > corner['minLat']) {
          minLat = corner['minLat'];
        }
        if (maxLat < corner['maxLat']) {
          maxLat = corner['maxLat'];
        }
        if (minLng > corner['minLng']) {
          minLng = corner['minLng'];
        }
        if (maxLng < corner['maxLng']) {
          maxLng = corner['maxLng'];
        }
      }
      return new kakao.maps.LatLng(
        Number(((minLat + maxLat) / 2).toFixed(15)),
        Number(((minLng + maxLng) / 2).toFixed(15)),
      );
    };
    const mapOptions = {
      center: center(allRoutes),
      level: currLevel,
    };

    const map = new kakao.maps.Map(mapContainer, mapOptions);

    //검색 후 핀과 선 랜더링
    if (allRoutes === null || allRoutes.length === 0) {
      //루트가 제대로 불러와지지 않았다면 제대로 된 루트가 불러와지지 않았다는 창을 띄워줘야 할 것 같음
      return;
    }
    for (const route of allRoutes) {
      //핀 생성
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
        let polyColor = ''; // 루트선 색깔
        for (let i = 0; i < colorsName.length; i++) {
          if (route.color === colorsName[i]) {
            polyColor = colorChips[i];
          }
        }

        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: polyColor,
          strokeOpacity: 0.7,
          strokeStyle: 'solid',
        });
        polyline.setMap(map);
      }
    }
  }, [findAllRoute, allRoutes]);

  // useEffect(() => {}, [pickPinsPictures]);

  return (
    <div>
      {bigImage ? (
        <ClickImage
          pickPinsPictures={pickPinsPictures}
          pictureIdx={pictureIdx}
          setBigImage={setBigImage}
          setPictureIdx={setPictureIdx}
        />
      ) : null}
      {noRoute ? <NoRouteInMap /> : null}
      <div className="allRoutesInMap-whole">
        <div className="jyang-allRoutesInMap">
          <Navigation />
          <ColorSelectBox
            findAllRoute={findAllRoute}
            setAllRoutes={setAllRoutes}
            setColorIdx={setColorIdx}
          />
        </div>
        <div
          id="allRoutesInMap-images"
          onMouseDown={onDragStart}
          onMouseLeave={onDragEnd}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          ref={scrollRef}
          role="button"
          tabIndex={0}
        >
          {pickPinsPictures ? (
            pickPinsPictures.map((el, index) => (
              <div
                id="el-img-div"
                key={index}
                onClick={() => {
                  setBigImage(true);
                  setPictureIdx(index);
                }}
                onKeyPress={() => setBigImage(true)}
                role="button"
                tabIndex={0}
              >
                <img
                  alt="loadFail"
                  id="allRoutesInMap-el-img-img"
                  src={`https://server.memory-road.net/${el.fileName}`}
                ></img>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div id="map" style={{ width: '100%', height: '100vh' }}>
        <div className="allRoutesInMap-menu"></div>
      </div>
    </div>
  );
}

export default AllRoutesInMap;
