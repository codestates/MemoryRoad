import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import './gridLayout.css';
import './timeLineSideBar.css';
import SetTime from './setTime';

function TimeLineSideBar() {
  /* react-grid-layout */
  const cards = [
    // cards -> 얘 redux에서 상태로 들고와야되는애다 -> 아직 미완
    { startTime: '00:00', endTime: '02:00' },
    { startTime: '00:00', endTime: '02:00' },
    { startTime: '00:00', endTime: '02:00' },
    { startTime: '00:00', endTime: '02:00' },
    { startTime: '00:00', endTime: '02:00' }, // 오 영향을 끼치지않음.
  ];
  const [layoutState, setLayoutState] = useState([]);
  const generateLayout: any = () => {
    // 아니 이것도 any처리해줘야되냐
    if (cards && cards.length) {
      // 상태에 핀이 있을 때만 렌더링해줘야지.
      cards.map((card, idx) => {
        const { startTime, endTime } = card;
        const startHour = Number(startTime.split(':')[0]);
        const startMin = Number(startTime.split(':')[1]);
        const endHour = Number(endTime.split(':')[0]);
        const endMin = Number(endTime.split(':')[1]);
        return {
          x: 1,
          y: startHour * 4 + startMin / 15, // 15분 단위로 나눴으니 시간/4, 분/15 ok
          w: 1,
          h: endHour * 4 + endMin / 15 - (startHour * 4 + endMin / 15),
          maxH: 48,
          i: idx.toString(),
          move: false,
          static: false,
        };
      });
    }
  };
  const onLayoutChange = (layout: any) => {
    // if (
    //   layoutState &&
    //   !layoutState.length &&
    //   cards &&
    //   cards.length &&
    //   layout &&
    //   layout.length
    // ) {
    //   const newTimeList = cards.map((card, idx) => {
    //     /* 일단은 */
    //     const startHour = Math.floor(layout[idx].y / 4);
    //     const startMin =
    //       (layout[idx].y % 4) * 15 === 0 ? '00' : (layout[idx].y % 4) * 15;
    //     const endHour = Math.floor((layout[idx].y + layout[idx].h) / 4);
    //     const endMin =
    //       ((layout[idx].y + layout[idx].h) % 4) * 15 === 0
    //         ? '00'
    //         : ((layout[idx].y + layout[idx].h) % 4) * 15;
    //     const newTime = Object.assign({}, card, {
    //       startTime: startHour + ':' + startMin,
    //       endTime: endHour + ':' + endMin,
    //     });
    //     return newTime;
    //   });
    //   /* 레이아웃이 바뀌면 여기서 상태변경 action 전달하기. (시간변경, 순서변경)*/
    // }
    console.log(layout);
  };
  // 사이드바 열고 닫기
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  /* -------------------------------- useEffect */
  useEffect(() => {
    setLayoutState(generateLayout()); // 초기 레이아웃 생성
  });
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
                src="http://127.0.0.1:5500/client/public/img/triangle_icon.png"
              ></img>
            </button>
            <div
              className={isSidebarOpen ? 'active-bar' : ''}
              id="pinControllTower-sidebar"
            >
              <div className="pinControllTower-content">
                <div className="pinControllTower-content-structure">
                  <GridLayout
                    // id="timeLine-real"
                    layout={generateLayout() || layoutState}
                    onLayoutChange={(layout) => onLayoutChange(layout)}
                    style={{ zIndex: '9999', left: '35px' }} // 이거없으면 사라집니다.
                    {...{
                      isDraggable: true,
                      isResizable: true,
                      items: cards.length ? cards.length : 1,
                      cols: 1,
                      rows: 96,
                      rowHeight: 37,
                      compactType: null,
                      preventCollision: false, // 열어놨다.
                      transformScale: 1,
                      width: 210,
                    }}
                  >
                    {/* 카드 목업데이터 */}
                    {cards.map((card, idx) => {
                      const { startTime, endTime } = card;
                      return (
                        <div className="pinCard-container" key={idx}>
                          <div className="pinCard-title">나만의 맛집기록</div>
                          {/* <SetTime
                            endTime={endTime}
                            readonly
                            startTime={startTime}
                          /> */}
                          <div className="pinCard-time-container">
                            <div className="pinCard-time-calculate">14.5</div>
                            시간
                          </div>
                          <div className="pinCard-description">
                            여긴 내가 진짜 맛있게 먹은곳 ! 아무도 몰랐으면
                            좋겠다 ㅠ 사장님 너무 친절하심 ㅎㅎ 굳굳 지금이건
                            오버플로우 테스트지롱
                          </div>
                          {/* <button className="plancard__delete-btn">삭제</button> */}
                        </div>
                      );
                    })}
                    {/* 카드 목업데이터 */}
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
                <button id="pinControllTower-save-btn">루트 저장하기</button>
              </div>
            </div>
          </div>
          {/* <div
            className={isSidebarOpen ? 'show-layer' : ''}
            id="pinControllTower-overlay"
            onClick={handleSidebar}
            onKeyPress={handleSidebar}
            role="button"
            tabIndex={0}
          ></div> */}
        </div>
      </div>
    </>
  );
}

export default TimeLineSideBar;

// div 태그처럼 태생부터 이벤트 핸들러가 등록되지 않는 아이들은 초기 설정 해주듯이
// div 태그의 role과 마우스 클릭헸을 때, 키가 눌렸을 때, 탭을 쳤을 때 모든 상황들을 설정해줘야한다 ..
