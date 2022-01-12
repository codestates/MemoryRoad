import React, { useEffect, useState } from 'react';
import TimeBack from './timeBack';
import './grid-test.css';

const { kakao }: any = window;

function GridTest() {
  // 사이드바 열고 닫기
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const container = document.getElementById('map-test');
    const mapOptions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 5,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
    };
    const map = new kakao.maps.Map(container, mapOptions);
  });
  return (
    <>
      <div id="test-container">
        <div id="pinControllTower-background">
          <div id="pinControllTower-container">
            <button
              className={isSidebarOpen ? 'active-btn' : ''}
              id="pinControllTower-close-open-btn"
              onClick={handleSidebar}
            >
              <img
                alt="button"
                id="pinControllTower-close-open-btn-img"
                src="http://127.0.0.1:5500/client/public/img/triangle_icon.png"
              ></img>
            </button>
            <div
              className={isSidebarOpen ? 'active-bar' : ''}
              id="pinControllTower-sidebar"
            >
              {/* 드래그이벤트 테스트중입니다 */}
              <div id="pinControllTower-fixed-content">
                {/* 하나의 div안에 모든 박스들을 넣는걸로 일단 고정.  */}
                {/* 배열을 만들건데, 그 배열안에 있는 애들을 map으로 돌려서 여기에 렌더랑 시킬거다.
                박스의 첫 높이는 100px이다. 늘이고 줄일때마다 이 값이 변한다. -> 각 박스의 높이를 추적하게 하자 
                각 박스의 translate시작점은 항상 0이다. 위로 올리면 음수값(-)이 되고 아래로 내리면 양수값(+)이 된다.
                이때, 앞으로 뒤로 박스들의 크기를 비교해서 판단하는 작업이 필요하다.*/}
                <div className="pinControllTower-content">
                  <TimeBack />
                </div>
                <div className="pinControllTower-btn-container">
                  <button id="pinControllTower-save-btn">루트 저장하기</button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={isSidebarOpen ? 'show-layer' : ''}
            id="pinControllTower-overlay"
            onClick={handleSidebar}
            onKeyPress={handleSidebar}
            role="button"
            tabIndex={0}
          ></div>
        </div>
        <div id="map-test"></div>
      </div>
    </>
  );
}

export default GridTest;

// div 태그처럼 태생부터 이벤트 핸들러가 등록되지 않는 아이들은 초기 설정 해주듯이
// div 태그의 role과 마우스 클릭헸을 때, 키가 눌렸을 때, 탭을 쳤을 때 모든 상황들을 설정해줘야한다 ..
