import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import GridLayout from 'react-grid-layout';
import './gridLayout.css';
import './timeLineSideBar.css';
import {
  updatePinTime,
  updatePinRank,
  updateFileRank,
  updatePinPosition,
  deletePin,
  updateAllpinsTime,
} from '../../redux/actions/index';
import { RootState } from '../../redux/reducer/index';
import SetTime from './setTime';

function TimeLineSideBar({
  pinCards,
  layoutState,
  setLayoutState,
  handleSidebarSaveBtn,
}: any) {
  // 사이드바 열고 닫기
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isMouseOnCard, setIsMouseOnCard] = useState(false);
  const [currCardTitle, setCurrCardTitle] = useState(null);
  const dispatch = useDispatch();
  const routeState: any = useSelector(
    (state: RootState) => state.createRouteReducer,
  );

  const handleDeletePin = (pinID: string) => dispatch(deletePin(pinID));
  // localStorage에서 pinPosition 가져오기. -> 위도,경도,장소의 이름
  // layout 상태 추적해서 상태가 변경되면
  //    * 순서 변경
  //    1. pinPosition 배열의 위치 이동시키기
  //    2. reducer로 [pinID, pinPosition내 인덱스값] 묶어서 다 보내기 -> pins의 랭킹 업데이트 & 파일의 랭킹 업데이트
  //    * 시간 변경
  //    1. reducer로 [pinID, startTime, endTime] 묶어서 다 보내기 -> pins의 시작시작,끝시간 업데이트
  //    ==>  순서와 시간 모두 한꺼번에 batch 로 해야함.

  const generateLayout: any = () => {
    // 상태에 핀이 있을 때만 렌더링해줘야지.
    pinCards?.map((pinCard: any, idx: number) => {
      const { pinID, locationName, latlng, startTime, endTime } = pinCard;
      // startHour map으로 배열 생성했는데 안된다 중간에 undefined 뜨는 게 있음 ㅠ.ㅠ
      const startHour = Number(startTime?.split(':')[0]);
      const startMin = Number(startTime?.split(':')[1]);
      const endHour = Number(endTime?.split(':')[0]);
      const endMin = Number(endTime?.split(':')[1]);
      const height =
        (endHour - startHour) * 2 + (endMin - startMin < 0 ? -1 : 0);
      return {
        x: 1,
        y: startHour * 2 + startMin / 30, // y랑 h적용안되고있어 .. 무슨일이냐..!
        w: 1,
        h: height,
        maxH: 24,
        i: String(idx + 1),
        move: true,
        static: false,
      };
    });
  };
  const onLayoutChange = (layout: any) => {
    console.log('레이아웃이 변경되고있습니다.');
    // 시간 변경 로직
    const newTimePinCards = pinCards?.slice(1).map((pinCard: any, idx: any) => {
      const sh = parseInt(layout[idx].y) * 0.5;
      const eh = parseInt(layout[idx].y + layout[idx].h) * 0.5;
      const getHour = (hour: any) =>
        Math.floor((hour * 60) / 60).toString().length === 1
          ? '0' + Math.floor((hour * 60) / 60)
          : Math.floor((hour * 60) / 60);
      const getMinute = (hour: any) =>
        ((hour * 60) % 60).toString() === '0'
          ? '0' + ((hour * 60) % 60)
          : (hour * 60) % 60;
      const newTimeCard = Object.assign(
        {},
        {
          pinID: pinCard.pinID,
          startTime: getHour(sh) + ':' + getMinute(sh),
          endTime: getHour(eh) + ':' + getMinute(eh),
        },
      );
      return newTimeCard;
    });
    /* 시간 변경 상태변화 요청 보내기 --> 업데이트 잘 됩니다 !! */
    dispatch(updatePinTime(newTimePinCards));
    /* 총 시간 구하기 */
    const totalTime = pinCards
      ?.slice(1)
      .reduce((prev: any, curr: any, currIdx: number) => {
        const currSH = parseInt(layout[currIdx].y) * 0.5;
        const currEH = parseInt(layout[currIdx].y + layout[currIdx].h) * 0.5;
        const currTimes = currEH - currSH;
        return prev + currTimes;
      }, 0);
    console.log(totalTime); // 굳굳
    dispatch(updateAllpinsTime(totalTime));
    // 순서 변경 로직
    const reRankedPins = layout
      .map((el: any) => {
        const pinID = `pin${Number(el.i) + 1}`;
        const y = el.y;
        return [pinID, y];
      })
      .sort((a: any, b: any) => a[1] - b[1])
      .map((el: any, idx: number) => {
        el[1] = idx + 1;
        return el;
      });
    console.log(reRankedPins); // re-rank된 핀 추적 !! olleh !!
    batch(() => {
      dispatch(updatePinRank(reRankedPins));
      dispatch(updateFileRank(reRankedPins));
      dispatch(updatePinPosition(reRankedPins));
    });
    /* 레이아웃 상태 업데이트 */
    setLayoutState(layout);
  };
  /* onMouseEnter -> 이벤트 버블링이 발생하지 않습니다. */
  const onMouseEnter = (event: any) => {
    /* 하나의 레이어가 얹혀진다고 생각하자. */
    const locationName = event.target.childNodes[0].textContent;
    setCurrCardTitle(locationName);
    setIsMouseOnCard(true);
  };
  /* onMouseLeave -> 이벤트 버블링이 발생하지 않습니다. */
  const onMouseLeave = () => {
    setIsMouseOnCard(false);
  };
  /* -------------------------------- useEffect */
  useEffect(() => {
    // 초기 레이아웃 1번만
    const layout = generateLayout();
    setLayoutState(layout);
  }, []);
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
                    layout={layoutState}
                    onLayoutChange={(layout) => onLayoutChange(layout)} // grid의 레이아웃이 변했을 때 동작.
                    style={{ zIndex: '9999', left: '35px' }} // 이거없으면 사라집니다.
                    {...{
                      isDraggable: true,
                      isResizable: true,
                      items: pinCards ? pinCards.length + 1 : 1,
                      cols: 1,
                      rows: 48,
                      rowHeight: 37,
                      compactType: null,
                      preventCollision: false, // 열어놨다.
                      transformScale: 1,
                      width: 210,
                    }}
                  >
                    {/* 카드 목업데이터 */}
                    {pinCards?.slice(1).map((pinCard: any, idx: number) => {
                      const {
                        pinID,
                        locationName,
                        latlng,
                        startTime,
                        endTime,
                      } = pinCard;
                      const sh = Number(startTime?.split(':')[0]);
                      const eh = Number(endTime?.split(':')[0]);
                      const sm = Number(startTime?.split(':')[1]);
                      const em = Number(endTime?.split(':')[1]);
                      const getTime = (
                        sh: number,
                        eh: number,
                        sm: number,
                        em: number,
                      ) => {
                        if (em - sm < 0) return eh - sh - 1 + 0.5;
                        else {
                          if (em - sm !== 0) return eh - sh + 0.5;
                          if (em - sm === 0) return eh - sh;
                        }
                      };
                      const time = getTime(sh, eh, sm, em);
                      return (
                        <div
                          className="pinCard-container"
                          key={idx}
                          // onBlur={() => console.log('onBlur')}
                          // onFocus={() => console.log('onFocus')}
                          onMouseEnter={onMouseEnter}
                          onMouseLeave={onMouseLeave}
                        >
                          <div className="pinCard-title">{locationName}</div>
                          {isMouseOnCard && currCardTitle === locationName ? (
                            <div className="pinCard-btn-container">
                              <button
                                className="pinCard-delete-btn"
                                onClick={() => handleDeletePin(pinID)}
                              >
                                삭제
                              </button>
                              <button className="pinCard-modify-btn">
                                수정
                              </button>
                            </div>
                          ) : (
                            <div className="pinCard-time-container">
                              <div className="pinCard-time-calculate">
                                {time}
                              </div>
                              시간
                            </div>
                          )}
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
