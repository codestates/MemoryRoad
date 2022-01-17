import React, { useEffect } from 'react';
import { useState } from 'react';
import ColorSelectBox from '../../components/colorSelectBox/colorSelectBoxForMap';
import './allRoutesInMap.css';
import axios from 'axios';

// 루트를 받고, 루트의 핀 값을 받을 것 같음
// 각 루트별로 핀 객체를 받고, 받은 핀 객체값을 For문, 혹은 ForEach를 통해 핀의 위치값을 받아서 핀을 그리고 선을 이어줘야 할 것 같음
// 그렇게 다 뿌리고 나면, 각 핀을 클릭했을 경우에 이벤트가 발생해서 핀의 정보를 보여줘야 할 듯
// 엔드포인트에 요청할 때, 루트 정보엔 이미 칼라가 있릍테니 그걸 받아서 쓰면 될 것 같음

const { kakao }: any = window;
async function AllRoutesInMap() {
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

  const data = await axios.get('https://server.memory-road.tk/routes');
  console.log(data);
  // await Promise.all(
  //   insertPinsResult.map(async (pin) => {
  //     mapPinIdRanking[pin.ranking] = pin.id;

  //키위드 테이블과 조인 테이블을 갱신한다.
  //     const keywords = [];
  //구의 정보를 기본 키워드로 넣는다.
  //     keywords.push({ keyword: pin.ward });
  //     for (let i = 0; i < pin.keywords.length; i++) {
  //       keywords.push({ keyword: pin.keywords[i] });
  //     }

  //키위드 업데이트의 결과
  //     const newKeywords = await this.placeKeywordsRepository.save(keywords);
  //     for (const obj of newKeywords) {
  //       obj['pinId'] = pin.id;
  //     }
  //jointable을 갱신한다.
  //     await this.pinsPlaceKeywordsRepository.save(newKeywords);
  //   }),
  // );
  useEffect(() => {
    // 지도 생성
    const mapContainer = document.getElementById('map');

    const mapOtions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      lever: 3,
    };
    const map = new kakao.maps.Map(mapContainer, mapOtions);

    // blue_dot 생성
    const DotSize = new kakao.maps.Size(40, 40); // 마커 크기
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
      position: new kakao.maps.LatLng(37.566826, 126.9886557), // 마커가 표시될 위치
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
      position: new kakao.maps.LatLng(37.566826, 126.9986567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerOrangeDot.setMap(map);

    // pink_dot 생성
    const pinkDot = new kakao.maps.MarkerImage(pinkDotSrc, DotSize, DotOption);
    const markerPinkDot = new kakao.maps.Marker({
      image: pinkDot,
      position: new kakao.maps.LatLng(37.566826, 127.0086567), // 현재 위치 상태 업데이트 반영
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
      position: new kakao.maps.LatLng(37.566826, 127.0186567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerPurpleDot.setMap(map);

    // red_dot 생성

    const redDot = new kakao.maps.MarkerImage(redDotSrc, DotSize, DotOption);
    const markerRedDot = new kakao.maps.Marker({
      image: redDot,
      position: new kakao.maps.LatLng(37.566826, 127.0286567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerRedDot.setMap(map);

    // sky_dot 생성

    const skyDot = new kakao.maps.MarkerImage(skyDotSrc, DotSize, DotOption);
    const markerSkyDot = new kakao.maps.Marker({
      image: skyDot,
      position: new kakao.maps.LatLng(37.566826, 127.0386567), // 현재 위치 상태 업데이트 반영
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
      position: new kakao.maps.LatLng(37.566826, 127.0486567), // 현재 위치 상태 업데이트 반영
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
      position: new kakao.maps.LatLng(37.566826, 127.0586567), // 현재 위치 상태 업데이트 반영
      clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
    });
    markerYellowGreenDot.setMap(map);

    const linePath = [
      new kakao.maps.LatLng(37.566826, 126.9786567),
      new kakao.maps.LatLng(37.566826, 126.9886567),
      new kakao.maps.LatLng(37.566826, 126.9986567),
    ];

    // 지도에 표시할 선을 생성합니다
    const polyline = new kakao.maps.Polyline({
      path: linePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: '#FFAE00', // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: 'solid', // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다
    polyline.setMap(map);
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
      <div className="jyang-allRoutesInMap">
        <ColorSelectBox />
      </div>
      <div id="map" style={{ width: '100%', height: '100vh' }}>
        <div className="allRoutesInMap-menu"></div>
      </div>
    </div>
  );
}

export default AllRoutesInMap;
