import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import GridLayout from 'react-grid-layout';
import _ from 'lodash';
import './gridLayout.css';
import './sidebar_timeline.css';

function TimeLineSideBarForModify({
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
                    layout={itemState}
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

export default TimeLineSideBarForModify;
