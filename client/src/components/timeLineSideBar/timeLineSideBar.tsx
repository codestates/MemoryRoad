import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import GridLayout from 'react-grid-layout';
import './gridLayout.css';
import './timeLineSideBar.css';
import { RootState } from '../../redux/reducer/index';
import _ from 'lodash';

function TimeLineSideBar({
  pinCards,
  handleSidebarSaveBtn,
  onLayoutChange,
  itemState,
  createElement,
}: any) {
  // 사이드바 열고 닫기
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // localStorage에서 pinPosition 가져오기. -> 위도,경도,장소의 이름
  // layout 상태 추적해서 상태가 변경되면
  //    * 순서 변경
  //    1. pinPosition 배열의 위치 이동시키기
  //    2. reducer로 [pinID, pinPosition내 인덱스값] 묶어서 다 보내기 -> pins의 랭킹 업데이트 & 파일의 랭킹 업데이트
  //    * 시간 변경
  //    1. reducer로 [pinID, startTime, endTime] 묶어서 다 보내기 -> pins의 시작시작,끝시간 업데이트
  //    ==>  순서와 시간 모두 한꺼번에 batch 로 해야함.
  return (
    <>
      <div id="pinControllTower-fix">
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
                src="https://server.memory-road.net/upload/triangle_icon.png"
              ></img>
            </button>
            <div
              className={isSidebarOpen ? 'active-bar' : ''}
              id="pinControllTower-sidebar"
            >
              <div className="pinControllTower-content">
                <div className="pinControllTower-content-structure">
                  <GridLayout
                    onLayoutChange={(layout) => onLayoutChange(layout)} // grid의 레이아웃이 변했을 때 동작.
                    style={{ zIndex: '9999', left: '35px' }} // 이거없으면 사라집니다.
                    {...{
                      isDraggable: true,
                      isResizable: true,
                      items: pinCards ? pinCards.length - 1 : 1,
                      cols: 1,
                      rows: 48,
                      rowHeight: 37,
                      compactType: null,
                      preventCollision: false, // 열어놨다.
                      transformScale: 1,
                      width: 210,
                    }}
                  >
                    {_.map(itemState, (el) => createElement(el))}
                  </GridLayout>
                  <div id="pinControllTower-timeLine-fix">
                    {new Array(48).fill(true).map((grid, idx) => (
                      <>
                        <div className="ct-timeLine-container" key={idx}>
                          <div className="ct-timeLine-structure">
                            <span className="ct-timeLine-time">
                              {`${
                                String(Math.floor(idx / 2)).length === 1
                                  ? `0${Math.floor(idx / 2)}`
                                  : `${Math.floor(idx / 2)}`
                              }:${(idx * 30) % 60 !== 0 ? '30' : '00'}`}
                            </span>
                            <div className="ct-timeLine-line" />
                          </div>
                          <div id="ct-timeLine-dropzone"></div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pinControllTower-btn-container">
                <button
                  id="pinControllTower-save-btn"
                  onClick={() => {
                    handleSidebarSaveBtn(true);
                  }}
                >
                  루트 저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeLineSideBar;

// div 태그처럼 태생부터 이벤트 핸들러가 등록되지 않는 아이들은 초기 설정 해주듯이
// div 태그의 role과 마우스 클릭헸을 때, 키가 눌렸을 때, 탭을 쳤을 때 모든 상황들을 설정해줘야한다 ..
