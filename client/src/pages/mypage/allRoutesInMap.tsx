import React, { useEffect } from 'react';
import { useState } from 'react';
import './allRoutesInMap.css';
const { kakao }: any = window;
function AllRoutesInMap() {
  const blueDotSrc = 'http://127.0.0.1:5500/client/public/img/blue_dot.png';
  const greenDotSrc = 'http://127.0.0.1:5500/client/public/img/green_dot.png';
  const orangeDotSrc = 'http://127.0.0.1:5500/client/public/img/orange_dot.png';
  const pinkDotSrc = 'http://127.0.0.1:5500/client/public/img/pink_dot.png';
  const purpleDotSrc = 'http://127.0.0.1:5500/client/public/img/purple_dot.png';
  const redDotSrc = 'http://127.0.0.1:5500/client/public/img/red_dot.png';
  const skyDotSrc = 'http://127.0.0.1:5500/client/public/img/sky_dot.png';
  const yellowDotSrc = 'http://127.0.0.1:5500/client/public/img/yellow_dot.png';
  const yellowGreenDotSrc =
    'http://127.0.0.1:5500/client/public/img/yellowGreen_dot.png';

  useEffect(() => {
    // 지도 생성
    const mapContainer = document.getElementById('map');

    const mapOtions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      lever: 3,
    };
    const map = new kakao.maps.Map(mapContainer, mapOtions);

    // blue_dot 생성
    const DotSize = new kakao.maps.Size(20, 20); // 마커 크기
    const DotOption = { offset: new kakao.maps.Point(16, 55) };
    const blueDot = new kakao.maps.MarkerImage(blueDotSrc, DotSize, DotOption);
    const markerBlueDot = new kakao.maps.Marker({
      image: blueDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 마커가 표시될 위치
    });
    markerBlueDot.setMap(map);

    // green_dot 생성
    const greenDot = new kakao.maps.MarkerImage(
      greenDotSrc,
      DotSize,
      DotOption,
    );
    const markerGreenDot = new kakao.maps.Marker({
      image: greenDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 마커가 표시될 위치
    });
    markerGreenDot.setMap(map);

    // orange_dot 생성

    const orangeDot = new kakao.maps.MarkerImage(
      orangeDotSrc,
      DotSize,
      DotOption,
    );
    const markerOrangeDot = new kakao.maps.Marker({
      image: orangeDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerOrangeDot.setMap(map);

    // pink_dot 생성
    const pinkDot = new kakao.maps.MarkerImage(pinkDotSrc, DotSize, DotOption);
    const markerPinkDot = new kakao.maps.Marker({
      image: pinkDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerPinkDot.setMap(map);

    // purple_dot 생성

    const purpleDot = new kakao.maps.MarkerImage(
      purpleDotSrc,
      DotSize,
      DotOption,
    );
    const markerPurpleDot = new kakao.maps.Marker({
      image: purpleDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerPurpleDot.setMap(map);

    // red_dot 생성

    const redDot = new kakao.maps.MarkerImage(redDotSrc, DotSize, DotOption);
    const markerRedDot = new kakao.maps.Marker({
      image: redDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerRedDot.setMap(map);

    // sky_dot 생성

    const skyDot = new kakao.maps.MarkerImage(skyDotSrc, DotSize, DotOption);
    const markerSkyDot = new kakao.maps.Marker({
      image: skyDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerSkyDot.setMap(map);

    // yellow_dot 생성

    const yellowDot = new kakao.maps.MarkerImage(
      yellowDotSrc,
      DotSize,
      DotOption,
    );
    const markerYellowDot = new kakao.maps.Marker({
      image: yellowDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerYellowDot.setMap(map);

    // yellowGreen_dot 생성

    const yellowGreenDot = new kakao.maps.MarkerImage(
      yellowGreenDotSrc,
      DotSize,
      DotOption,
    );
    const markerYellowGreenDot = new kakao.maps.Marker({
      image: yellowGreenDot,
      position: new kakao.maps.LatLng(37.566826, 126.9786567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerYellowGreenDot.setMap(map);
  });
  const Dots = [
    blueDotSrc,
    greenDotSrc,
    orangeDotSrc,
    pinkDotSrc,
    purpleDotSrc,
    redDotSrc,
    skyDotSrc,
    yellowDotSrc,
    yellowGreenDotSrc,
  ];
  const dotsImage = Dots.map((el, index) => (
    <img alt="dotimage" key={index} src={el}></img>
  ));
  return (
    <div>
      <div id="map" style={{ width: '100%', height: '100vh' }}>
        <div className="allRoutesInMap-menu">
          <select className="allRoutesInMap-select">
            <option>원</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AllRoutesInMap;
