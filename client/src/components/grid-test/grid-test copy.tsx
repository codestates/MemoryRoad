import React, { useEffect, useState } from 'react';
import './grid-test copy.css';

const { kakao }: any = window;

function GridTestCaseB() {
  // 사이드바 열고 닫기
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // 드래그 이벤트 (test)
  const [currDragged, setCurrDragged] = useState({
    parentNode: {
      removeChild: (e: any): void => {
        e;
      },
    },
  });
  console.log(currDragged);
  type Drop = (e: React.DragEvent<HTMLElement>) => void;
  const onDrag: Drop = (e) => {
    // console.log('모든 드래그이벤트를 감지하는 드래그 컨테이너입니다.');
    // console.log(e.target);
  };
  const onDragOver: Drop = (e) => {
    e.preventDefault();
  };
  const onDragStart: Drop = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    const target: any = e.target;
    setCurrDragged(target);
  };
  const onDragEnter: Drop = (e) => {
    e.preventDefault();
  };
  const onDrop = (e: any): void => {
    e.preventDefault();
    if (e.target.className === 'pinControllTower-select-section') {
      currDragged.parentNode.removeChild(currDragged);
      e.target.appendChild(currDragged);
    }
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
              <div
                className="pinControllTower-content"
                onDrag={onDrag}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
              >
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:00</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                {/* 드래그이벤트 테스트중입니다 */}
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                >
                  <div
                    className="pinControllTower-pinCard"
                    draggable="true"
                    id="test-draggable1"
                    onDragStart={onDragStart}
                  >
                    This div is draggable
                  </div>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:01</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:02</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                >
                  <div
                    className="pinControllTower-pinCard"
                    draggable="true"
                    id="test-draggable2"
                    onDragStart={onDragStart}
                  >
                    This div is draggable
                  </div>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:03</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:04</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                >
                  <div
                    className="pinControllTower-pinCard"
                    draggable="true"
                    id="test-draggable3"
                    onDragStart={onDragStart}
                  >
                    This div is draggable
                  </div>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:05</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:06</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                >
                  <div
                    className="pinControllTower-pinCard"
                    draggable="true"
                    id="test-draggable4"
                    onDragStart={onDragStart}
                  >
                    This div is draggable
                  </div>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:07</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:08</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:09</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:10</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:11</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:12</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:13</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:14</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:15</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:16</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:17</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:18</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:19</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:20</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:21</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:22</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div className="pinControllTower-time-section">
                  <div className="pinControllTower-time-txt">00:23</div>
                  <hr className="pinControllTower-divide-line"></hr>
                </div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
                <div
                  className="pinControllTower-select-section"
                  onDrop={onDrop}
                ></div>
              </div>
              <div className="pinControllTower-btn-container">
                <button id="pinControllTower-save-btn">루트 저장하기</button>
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

export default GridTestCaseB;

// div 태그처럼 태생부터 이벤트 핸들러가 등록되지 않는 아이들은 초기 설정 해주듯이
// div 태그의 role과 마우스 클릭헸을 때, 키가 눌렸을 때, 탭을 쳤을 때 모든 상황들을 설정해줘야한다 ..
