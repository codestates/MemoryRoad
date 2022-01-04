import React, { useState, useEffect } from 'react';
import './map-test.css';
import createPinModal from '../../modals/createPinModal';   // 핀 생성 모달창

const { kakao }:any = window;

/* [ 마커 여러개 가져올 때 지도 범위 재설정하는 메서드, setBounds() ]
 * [위도, 경도]세트들이 들어있는 배열을 받아 보관함 카드 모달창에서 지도 보여줄때 써먹기
 */

function MapTest () {
  const ratioHorizontal:Array<number> = [0, 0.0005, 0.001, 0.002, 0.004, 0.008, 0.016, 0.032, 0.064];
  const ratioVertical:Array<number> = [0, 0.000562 ,0.001125, 0.00225, 0.0045, 0.009, 0.017, 0.035, 0.07];
  const [mapMove, setMapMove] = useState(null);
  const [currLevel, setCurrLevel] = useState(8);
  const [currMarkerLocation, setCurrMarkerLocation] = useState([37.566826, 126.9786567]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // center (가공된)위도 경도 얻는 함수
  const sliceLatLng = (num:number):number => {
    const str = String(num);
    const [head, tail] = str.split('.');
    let slicedTail;
    if(head.length === 2){
      slicedTail = tail.substring(0, 6);
    }
    else{
      slicedTail = tail.substring(0, 7);
    };
    const combineHeadTail = head + '.' + slicedTail;
    return Number(combineHeadTail);
  }

  useEffect(() => {
    // 모달창 닫았을 때
    const modalState = document.getElementById('createPinModal-background');
    if(modalState === null){
      setIsModalOpen(false);
    }
  }, [mapMove]);

  useEffect(() => {
    // 지도를 표시할 div
    const mapContainer = document.getElementById('map');
    // 지도의 option들
    const [lat, lng] = currMarkerLocation;
    const mapOptions = {
      center: new kakao.maps.LatLng(lat, lng),               // 지도의 중심 좌표 -> 이것이 문제로다.
      level: currLevel,                                      // 지도의 확대 레벨 (분포도가 잘 보이는 레벨: 8) (지역이 잘 보이는 레벨: 3)
      draggable: true,                                       // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true,                                     // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      disableDoubleClickZoom: true                           // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
    };
    // 지도를 생성합니다
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    map.setMaxLevel(8);                                      // 지도의 최고 레벨값. 이 이상으로 축소 안됌.

    // 지도뷰, 스카이뷰 컨트롤 버튼 설치
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    // 지도의 중심 좌표가 변경될 때 실행되는 이벤트 핸들러 (스무스한 움직임)
    kakao.maps.event.addListener(map, 'idle', function(){
      const level = map.getLevel();                          // 현재 지도의 레벨을 얻어오는 메서드 getLevel();
      const center = map.getCenter();                        // 현재 중심 좌표를 얻어오는 메서드 getCenter();
      const lat = center.getLat();                           // 현재 중심 좌표의 위도
      const lng = center.getLng();                           // 현재 중심 좌표의 경도
      if(!isModalOpen) map.setZoomable(true);
      map.panTo(new kakao.maps.LatLng(lat, lng));            // 현재 중심 좌표가 변경될 때마다 지도의 movement를 훨씬 부드럽게 만들어줌 ! -> 효과 있음
      setCurrLevel(level);
      setMapMove(center);
    });

    // 마커 이미지 생성
    const imageSrc = "http://127.0.0.1:5500/client/public/img/blue_marker.png"; 
    const imageSize = new kakao.maps.Size(33, 54);
    const imageOption = { offset: new kakao.maps.Point(16, 55) };
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 핀 생성 모달창 html 문자열 코드
    const content = createPinModal;
    // 핀 생성 모달창 커스텀 오버레이
    const customOverlay = new kakao.maps.CustomOverlay({
      // 현재 위치 상태 (비울에 따라) 업데이트
      // 왼쪽 수평 정렬 : lat + 0.00008, lng - ratioHorizontal[currLevel]
      // 위쪽 수직 정렬 : lat + ratioVertical[currLevel], lng - 0.0003
      position: new kakao.maps.LatLng(lat + 0.00008, lng - ratioHorizontal[currLevel]),
      content: content,
      clickable: true,                                       // 핀 저장 모달창을 편집하고 있을 때지도의 클릭 이벤트가 발생하지 않도록 설정
      xaNCHOR: 0.99,
      YaNCHOR: 0.99
    });

    // 주소-좌표 변환 객체 생성 : services 라이브러리 추가해야함 ^-^ API 문서 똑띠 읽어라
    const geocoder:any = new kakao.maps.services.Geocoder();
    // 마커
    const marker = new kakao.maps.Marker({
      image: markerImage,
      position: new kakao.maps.LatLng(lat, lng),             // 현재 위치 상태 업데이트
      clickable: true,                                       // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    marker.setMap(map);

    // 지도 어느곳에 클릭해도 마커 1개만 띄워지도록 하는 메서드
    // -> 마커를 여러개 띄우려면 배열을 사용해야 한다
    // -> 저장하기를 누르면 positions 배열에 들어가도록 설계하기

    // 모달창이 열려있을 때는 지도 클릭 이벤트가 실행되지 않는다.
    if(!isModalOpen){
      kakao.maps.event.addListener(map, 'click', function(mouseEvent:any) {
        searchDetailAddrFromCoords(mouseEvent.latLng, function(result:any, status:any):void {
          if(status === kakao.maps.services.Status.OK){
  
            marker.setMap(null);
            const latlng = mouseEvent.latLng;                  // 클릭한 위도, 경도 정보를 가져옴
            marker.setPosition(latlng);                        // 마커 위치를 클릭한 위치로 옮김 - setPosition
            customOverlay.setMap(null);                        // 다른 장소 클릭할 때마다 customOverlay를 해제시켜주지 않아서 엉뚱한 곳에 이미지를 업로드 하고있었다 ㅠㅜㅜ
  
            const latlngMarker:Array<number> = [sliceLatLng(latlng.Ma), sliceLatLng(latlng.La)];
            setCurrMarkerLocation(latlngMarker);               // [latlng.Ma, latlng.La] 위도와 경도 배열로 뽑아낼 수 있음.      
  
            // 도로명 주소 / 지번 주소 / 구 DB에 테이블 모두 넣어주기
            // console.log(result);
            console.log(`위도: ${latlng.getLat()}, 경도: ${latlng.getLng()}`);
            console.log(`도로명 주소: ${!!result[0].road_address ? result[0].road_address.address_name : ''}`);
            console.log(`지번 주소: ${result[0].address.address_name}`);
            console.log(`구: ${result[0].address.region_2depth_name}`);
            console.log('------------------------------------------');
          }
        });
      });
    }
    function searchDetailAddrFromCoords(coords:any, callback:any):any{
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    };
    // 마커를 클릭했을 때 핀 생성 모달창 등장
    kakao.maps.event.addListener(marker, 'click', function(){
      // console.log('marker clicked!');
      customOverlay.setMap(map);
      map.setZoomable(false);                                   // 사진 스크롤바를 위해 지도 줌 스크롤 금지
      setIsModalOpen(true);                                     // 모달창 오픈 여부 상태 저장
    });
  }, [currMarkerLocation]);
  return (
    <>
      <div id="map"></div>
    </>
  );
};

export default MapTest;