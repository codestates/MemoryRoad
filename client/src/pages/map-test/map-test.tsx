import React, { useState, useEffect } from 'react';
import './map-test.css';

const { kakao }:any = window;

/* [ 마커 여러개 가져올 때 지도 범위 재설정하는 메서드, setBounds() ]
 * [위도, 경도]세트들이 들어있는 배열을 받아 보관함 카드 모달창에서 지도 보여줄때 써먹기
 */

function MapTest () {
  // const [ latitude, setLatitude ] = useState(37.566689049201976);
  // const [ longitude, setLongitude ] = useState(126.97862965932048);
  useEffect(() => {
    // 지도를 표시할 div
    const mapContainer = document.getElementById('map');
    // 지도의 option들
    const mapOptions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심 좌표
      level: 8,                                              // 지도의 확대 레벨 (분포도가 잘 보이는 레벨: 8) (지역이 잘 보이는 레벨: 3)
      draggable: true,                                       // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true                                      // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
    };
    // 지도를 생성합니
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    map.setMaxLevel(8);                                      // 지도의 최고 레벨값. 이 이상으로 축소 안됌.
    
    // 지도뷰, 스카이뷰 컨트롤 버튼 설치
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    // 지도의 중심 좌표가 변경될 때 실행되는 이벤트 핸들러
    kakao.maps.event.addListener(map, 'center_changed', function(){
      const center = map.getCenter();                        // 현재 중심 좌표를 얻어오는 메서드 getCenter();
      const lat = center.getLat();                           // 현재 중심 좌표의 위도
      const lng = center.getLng();                           // 현재 중심 좌표의 경도
      map.panTo(new kakao.maps.LatLng(lat, lng));            // 현재 중심 좌표가 변경될 때마다 지도의 movement를 훨씬 부드럽게 만들어줌 ! -> 효과 있음
    });

    // 마커 이미지 생성
    const imageSrc = "http://127.0.0.1:5500/client/public/img/blue_marker.png"; 
    const imageSize = new kakao.maps.Size(33, 54);
    const imageOption = { offset: new kakao.maps.Point(16, 55) };
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 주소-좌표 변환 객체 생성 : services 라이브러리 추가해야함 ^-^ API 문서 똑띠 읽어라
    const geocoder:any = new kakao.maps.services.Geocoder();
    // 마커
    const marker = new kakao.maps.Marker({
      position: map.getCenter(),
      clickable: true,         
      image: markerImage
    });
    marker.setMap(map);
    // 지도 어느곳에 클릭해도 마커 1개만 띄워지도록 하는 메서드
    // -> 마커를 여러개 띄우려면 배열을 사용해야 한다
    // -> 저장하기를 누르면 positions 배열에 들어가도록 설계하기
    kakao.maps.event.addListener(map, 'click', function(mouseEvent:any) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function(result:any, status:any):void {
        if(status === kakao.maps.services.Status.OK){

          const latlng = mouseEvent.latLng;                  // 클릭한 위도, 경도 정보를 가져옴
          marker.setPosition(latlng);                        // 마커 위치를 클릭한 위치로 옮김 - setPosition
          
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
    function searchDetailAddrFromCoords(coords:any, callback:any):any{
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    };
    kakao.maps.event.addListener(marker, 'click', function(){
      console.log('marker clicked!');
    });
  });
  return (
    <>
      <div id="map"></div>
    </>
  );
};

export default MapTest;