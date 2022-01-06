import React, { useState, useEffect } from 'react';
import './createPinMap.css';
import createPinModal from '../../modals/createPinModal/createPinModal'; // 핀 생성 모달창
import SearchPinBar from '../../components/searchPinBar/searchPinBar'; // 핀 검색창
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수
import FakeHeader from '../../components/map-test/fakeHeader'; // 가짜 헤더입니다 착각 조심 ^ㅁ^

const { kakao }: any = window;

/* [ 마커 여러개 가져올 때 지도 범위 재설정하는 메서드, setBounds() ]
 * [위도, 경도]세트들이 들어있는 배열을 받아 보관함 카드 모달창에서 지도 보여줄때 써먹기
 */

// 지도 핀 직접 찍는 메서드랑 검색 메서드 나누기 가능 ...? 루트 연결 가능 ??? 하 ..

function CreatePinMap() {
  // const ratioHorizontal: Array<number> = [
  //   0, 0.0005, 0.001, 0.002, 0.004, 0.008, 0.016, 0.032, 0.064,
  // ];
  // const ratioVertical: Array<number> = [
  //   0, 0.000562, 0.001125, 0.00225, 0.0045, 0.009, 0.017, 0.035, 0.07,
  // ];
  const [currLevel, setCurrLevel] = useState(8); // 지도의 레벨
  const [currMarkerLocation, setCurrMarkerLocation] = useState([
    37.566826, 126.9786567,
  ]); // 지도에 표시된 마커의 위도, 경도
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 오픈 여부
  const [searchText, setSearchText] = useState(''); // 검색창 단어
  const handleIsModalOpen = (boolean: boolean): void => {
    // 모달창 HTMLElement가 남아있다면 제거해준다
    const modalTag = document.getElementById('createPinModal-background');
    if (modalTag) modalTag.remove();
    setIsModalOpen(boolean);
  };
  const getSearchText = (text: string): void => {
    setSearchText(text);
  };

  /* 지도 위 동작 - 이미지or함수 ----------------------------------------------------------------------------- */

  const [lat, lng] = currMarkerLocation;

  // center (가공된)위도 경도 얻는 함수
  const sliceLatLng = (num: number): number => {
    const str = String(num);
    const [head, tail] = str.split('.');
    let slicedTail;
    if (head.length === 2) {
      slicedTail = tail.substring(0, 6);
    } else {
      slicedTail = tail.substring(0, 7);
    }
    const combineHeadTail = head + '.' + slicedTail;
    return Number(combineHeadTail);
  };

  // 주소-좌표 변환 객체 생성 : services 라이브러리 추가해야함 ^-^ API 문서 똑띠 읽어라
  const geocoder: any = new kakao.maps.services.Geocoder();

  // 지도 주소 얻어오는 함수
  function searchDetailAddrFromCoords(coords: any, callback: any): any {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  // *마커 이미지 생성
  const imageSrc = 'http://127.0.0.1:5500/client/public/img/blue_marker.png';
  const imageSize = new kakao.maps.Size(33, 54);
  const imageOption = { offset: new kakao.maps.Point(16, 55) };
  const markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption,
  );
  // *마커
  const marker = new kakao.maps.Marker({
    image: markerImage,
    position: new kakao.maps.LatLng(lat, lng), // 현재 위치 상태 업데이트
    clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
  });
  // *마커 이미지 생성 - 검색용 마커
  const imageSrcForSearch =
    'http://127.0.0.1:5500/client/public/img/gray_marker.png';
  const imageSizeForSearch = new kakao.maps.Size(33, 54);
  const imageOptionForSearch = { offset: new kakao.maps.Point(16, 55) };
  const markerImageForSearch = new kakao.maps.MarkerImage(
    imageSrcForSearch,
    imageSizeForSearch,
    imageOptionForSearch,
  );
  // 장소명 인포윈도우
  const infoWindow = new kakao.maps.InfoWindow({ zIndex: 0.9 });
  const infoWindowModal = new kakao.maps.InfoWindow({ zIndex: 1 });

  // *infoWindow 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }
  function removeInfoWindowMoalStyleAndAddStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }

  /* 삭제할지 말지 고민 ---------------------------------------------------------------------------------  */
  // 핀 생성 모달창 html 문자열 코드
  // const createPin: string = createPinModal;
  // // *핀 생성 모달창 커스텀 오버레이
  // const customCreatePinModal = new kakao.maps.CustomOverlay({
  //   // 현재 위치 상태 (비울에 따라) 업데이트
  //   // 왼쪽 수평 정렬 : lat + 0.00008, lng - ratioHorizontal[currLevel]
  //   // 위쪽 수직 정렬 : lat + ratioVertical[currLevel], lng - 0.0003
  //   position: new kakao.maps.LatLng(
  //     lat + 0.00008,
  //     lng - ratioHorizontal[currLevel],
  //   ),
  //   content: createPin,
  //   clickable: true, // 핀 저장 모달창을 편집하고 있을 때지도의 클릭 이벤트가 발생하지 않도록 설정
  //   xaNCHOR: 0.99,
  //   YaNCHOR: 0.99,
  // });
  /* 삭제할지 말지 고민 ---------------------------------------------------------------------------------  */

  /* 지도 위 동작 useEffect ----------------------------------------------------------------------------- */
  console.log(isModalOpen);

  useEffect(() => {
    const modalTag = document.getElementById('createPinModal-background');
    if (modalTag) {
      const closeBtnTag = document.getElementById(
        'createPinModal-not-save-btn',
      );
      console.log(closeBtnTag);
      closeBtnTag?.addEventListener('click', () => {
        handleIsModalOpen(false);
      });
    }
  }, [isModalOpen]);

  useEffect(() => {
    // 지도를 표시할 div
    const mapContainer = document.getElementById('map');
    // 지도의 option들
    const mapOptions = {
      center: new kakao.maps.LatLng(lat, lng), // 지도의 중심 좌표 : 일단 서울로 고정하고 테스트 중.(센터는 고정이 답인가 ..?)
      level: currLevel, // 지도의 확대 레벨 (분포도가 잘 보이는 레벨: 8) (지역이 잘 보이는 레벨: 3)
      draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
    };
    // 지도를 생성합니다
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    // map.setMaxLevel(8); // 지도의 최고 레벨값. -> 서울 지역을 벗어나면 검색이 안되게끔 해야 이걸 적용할 수 있음 .. 지금은 검색 기능 & bound 기능때문에 제한 걸지 못함.

    // 지도 이벤트 모음
    // *지도에 변화가 일어났을 때 실행되는 이벤트 핸들러 -> 시시각각 변하는 지도의 센터를 추적할 수 있음.
    kakao.maps.event.addListener(map, 'idle', function () {
      const level = map.getLevel();
      setCurrLevel(level); // 지도 레벨 상태 저장
    });

    /* map API test -------------------------------------------------------------------------------------------------------- */
    // kakao.maps.event.addListener(map, 'tilesloaded', function () {
    //   console.log('loading tile is complete! do something');
    //   // idle과 거의 동시에, 횟수도 비슷하게 일어나지만 화면이 깨지지 않으면 반영하지 못하는 단점이 있음. (원치 않게 동작할 수도)
    // });
    // kakao.maps.event.addListener(map, 'zoom_changed', function () {
    //   console.log('zoom changed!'); // 지도에서 휠을 이용해 줌을 댕기고 줄일때만 반응함 .
    // });
    // kakao.maps.event.addListener(map, 'center_changed', function () {
    //   console.log('center changed!'); // 지도를 잡고 흔드는 상태에서도 센터는 변화하니까 ... 진짜 말 그대로 모든 변화를 감지함... 하
    // });
    /* map API test -------------------------------------------------------------------------------------------------------- */

    // 내가 생성한 마커 이벤트 모음
    // *마커 생성
    marker.setMap(map);
    kakao.maps.event.addListener(marker, 'click', function () {
      // customCreatePinModal.setMap(map);
      // -> 게속 커스텀 오버레이로 갈건지 고민.
      // -> infoWindow를 개조해서 가는 걸로 결정.
      handleIsModalOpen(true); // 모달창 오픈 여부 상태 저장
      infoWindowModal.setContent(createPinModal);
      infoWindowModal.open(map, marker);
      // infoWindow 기본 css 없애기
      const infoWindowModalHTMLTag = document.querySelector(
        '#createPinModal-background',
      );
      removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);
    });
    // *모달창이 열려있을 때는 지도 클릭 이벤트가 실행되지 않는다.
    if (!isModalOpen) {
      kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
        searchDetailAddrFromCoords(
          mouseEvent.latLng,
          function (result: any, status: any): void {
            if (status === kakao.maps.services.Status.OK) {
              const latlng = mouseEvent.latLng; // 클릭한 위도, 경도 정보를 가져옴
              const level = map.getLevel();
              marker.setMap(null);
              infoWindowModal.close();
              // customCreatePinModal.setMap(null);
              // 다른 장소 클릭할 때마다 customOverlay를 해제시켜주지 않아서 엉뚱한 곳에 이미지를 업로드 하고있었다 ㅠㅜㅜ
              // 지금은 필요없어졌습니다.
              marker.setPosition(latlng); // 마커 위치를 클릭한 위치로 옮김 - setPosition

              const latlngMarker: Array<number> = [
                sliceLatLng(latlng.Ma),
                sliceLatLng(latlng.La),
              ];
              setCurrMarkerLocation(latlngMarker); // [latlng.Ma, latlng.La] 위도와 경도 배열로 뽑아낼 수 있음.
              setCurrLevel(level);

              // bound test
              const bounds = new kakao.maps.LatLngBounds(); // test
              bounds.extend(
                new kakao.maps.LatLng(
                  sliceLatLng(latlng.Ma),
                  sliceLatLng(latlng.La),
                ),
              );
              map.setBounds(bounds);

              // 도로명 주소 / 지번 주소 / 구 DB에 테이블 모두 넣어주기
              console.log(`위도: ${latlng.getLat()}, 경도: ${latlng.getLng()}`);
              console.log(
                `도로명 주소: ${
                  !!result[0].road_address
                    ? result[0].road_address.address_name
                    : ''
                }`,
              );
              console.log(`지번 주소: ${result[0].address.address_name}`);
              console.log(`구: ${result[0].address.region_2depth_name}`);
              console.log('------------------------------------------');
            }
          },
        );
      });
    }
    // 장소 검색 이벤트 모음
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchText, placesSearchCB);

    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        // const bounds = new kakao.maps.LatLngBounds();
        if (isModalOpen) infoWindowModal.close();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          // bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정 과연 필수인가
        // map.setBounds(bounds);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }
    function displayMarker(place: any) {
      // 검색용 마커를 생성하고 지도에 표시합니다
      const markerForSearch = new kakao.maps.Marker({
        image: markerImageForSearch,
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
      // 검색용 마커 클릭했을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'click', function () {
        infoWindowModal.setContent(createPinModal);
        infoWindowModal.open(map, markerForSearch);
        // infoWindow 기본 css 없애기
        const infoWindowModalHTMLTag = document.querySelector(
          '#createPinModal-background',
        );
        removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);
      });
      // 검색용 마커 위에 마우스를 올렸을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'mouseover', function () {
        const content = InfoWindowContent(
          place.place_name,
          place.address_name,
          place.road_address_name,
        );
        infoWindow.setContent(content);
        infoWindow.open(map, markerForSearch);
        // infoWindow 기본 css 없애기
        const infoWindowHTMLTags = document.querySelectorAll(
          '.windowInfo-content-container',
        );
        removeInfoWindowStyle(infoWindowHTMLTags[0]);
      });
      // 검색용 마커 위에서 마우스를 뗐을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'mouseout', function () {
        infoWindow.close();
      });
    }
  }, [currMarkerLocation, searchText]);
  // currLevel은 지도가 버벅거리는 근본적인 원인은 아닙니다.
  // 지도의 크기를 늘이고 줄일 때마다 엄청난 버벅임이 생김 -> 해결해야함
  // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출된다고 나와있습니다.. -> 이걸 해치는 코드가 내꺼에 있는건가 싶다.
  // -> 해결 완료 useEffect 인자를 최소한으로 줄였고, 지도의 center 변환 추적을 끔.
  return (
    <>
      <div id="map-whole-container">
        <div id="map-navigator-top">
          <FakeHeader />
          <SearchPinBar
            getSearchText={getSearchText}
            handleIsModalOpen={handleIsModalOpen}
          />
        </div>
        <div id="map"></div>
      </div>
    </>
  );
}

export default CreatePinMap;
