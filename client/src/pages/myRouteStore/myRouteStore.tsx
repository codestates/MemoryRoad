import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer/index';
import Navigation from '../../components/Navigation';
import ColorSelectBox from '../../components/colorSelectBox/colorSelectBoxForStore';
import SeoulSelectBox from '../../components/seoulSelectBox/seoulSelectBoxForStore';
import WardSelectBox from '../../components/wardSelectBox/wardSelectBoxForStore';
import StoryCard from '../../components/storyCard/storyCardForStore';
import Pagination from '../../components/pagination/paginationForStore';
import StoryCardMainModal from '../../modals/storyCardMainModal/storyCardMainModal';
import './myRouteStore.css';
import { testData } from './textData';
import _ from 'lodash';
import axios from 'axios';

function MyRouteStore() {
  const navigate = useNavigate();
  const colorNames = useSelector(
    (state: RootState): Array<string> => state.createRouteReducer.colorName,
  );
  const wardNames = useSelector(
    (state: RootState): Array<string> => state.createRouteReducer.wards,
  );
  const [clickedColorSelect, setClickedColorSelect] = useState(false);
  const [clickedSeoulSelect, setClickedSeoulSelect] = useState(false);
  const [clickedWardSelect, setClickedWardSelect] = useState(false);
  const [selectedColorId, setSelectedCorlorId] = useState(0);
  const [selectedSeoul, setSelectedSeoul] = useState(0);
  const [selectedWard, setSelectedWard] = useState(0);

  const [paginationNum, setPaginationNum] = useState(0); // <, > 버튼 컨트롤
  const [currPageNum, setCurrPageNum] = useState(0); // 페이지 넘버(1,2,3) 컨트롤
  const [dataCount, setdataCount] = useState(0); // 전체 루트 개수
  const [routeCards, setRouteCards] = useState([]); // server에서 받아온 데이터 모음
  const [originRouteCards, setOriginRouteCards] = useState([]); // 변경되지않는 기존값.

  if (clickedColorSelect || clickedWardSelect) {
    if (selectedColorId !== 0 && selectedWard !== 0) {
      const filteredRouteCards = originRouteCards
        .filter((el: any) =>
          el.color === colorNames[selectedColorId] ? true : false,
        )
        .filter((el: any) => {
          const pinsWards = el.Pins.map((pin: any) => pin.ward);
          return pinsWards.indexOf(selectedWard) !== -1 ? true : false;
        });
      setRouteCards(filteredRouteCards);
      setClickedColorSelect(false);
      setClickedWardSelect(false);
    } else if (selectedColorId !== 0) {
      const filteredRouteCards = originRouteCards.filter((el: any) =>
        el.color === colorNames[selectedColorId] ? true : false,
      );
      setRouteCards(filteredRouteCards); // 색상이 선택되었을 때 상태 업데이트
      setClickedColorSelect(false);
      setClickedWardSelect(false);
    } else if (selectedWard !== 0) {
      const filteredRouteCards = originRouteCards.filter((el: any) => {
        const pinsWards = el.Pins.map((pin: any) => pin.ward);
        return pinsWards.indexOf(selectedWard) !== -1 ? true : false;
      });
      setRouteCards(filteredRouteCards); // 구 이름이 선택되었을 때 상태 업데이트
      setClickedColorSelect(false);
      setClickedWardSelect(false);
    } else {
      setRouteCards(originRouteCards);
    }
  }

  if (currPageNum === 0 && dataCount === 0 && routeCards.length === 0) {
    axios({
      url: 'https://server.memory-road.net/routes',
      method: 'get',
      withCredentials: true,
      params: {
        page: 1,
      },
    })
      .then((res: any) => {
        console.log(res);
        setdataCount(res.count);
        setCurrPageNum(1);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    axios({
      url: 'https://server.memory-road.net/routes',
      method: 'get',
      withCredentials: true,
      params: {
        page: currPageNum,
      },
    })
      .then((res: any) => {
        console.log(res);
        setRouteCards(res.routes); // 배열값
        setOriginRouteCards(res.routes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleColorSelect = () => {
    setClickedColorSelect(!clickedColorSelect);
    setClickedSeoulSelect(false);
    setClickedWardSelect(false);
  };
  const handleSeoulSelect = () => {
    setClickedSeoulSelect(!clickedSeoulSelect);
    setClickedColorSelect(false);
    setClickedWardSelect(false);
  };
  const handleWardSelect = () => {
    setClickedWardSelect(!clickedWardSelect);
    setClickedColorSelect(false);
    setClickedSeoulSelect(false);
  };
  const selectColor = (event: any) => {
    setSelectedCorlorId(event.target.id);
  };
  const selectSeoul = (event: any) => {
    setSelectedSeoul(event.target.id);
  };
  const selectWard = (event: any) => {
    setSelectedWard(event.target.id);
  };

  /* pagination */
  const count8 =
    Math.floor(dataCount / 8) + (Math.floor(dataCount % 8) > 0 ? 1 : 0);
  const pages = [];
  for (let i = 1; i <= count8; i++) {
    pages.push(i);
  }
  const dividedPages = _.chunk(pages, 5); // 예쁘게 5개로 묶기.
  const handleClickedPageNum = (pageNum: number): void => {
    setCurrPageNum(pageNum); /* 페이지네이션 업데이트 */
  };
  const handlePrevPaginationNum = () => {
    setPaginationNum(paginationNum - 1);
    setCurrPageNum((paginationNum - 1) * 5 + 1); // 이전페이지 맨 첫 장
  };
  const handleNextPaginationNum = () => {
    setPaginationNum(paginationNum + 1);
    setCurrPageNum((paginationNum + 1) * 5 + 1); // 이후페이지 맨 첫 장
  };
  /* card modal */
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalId, setCardModalId] = useState(1);
  const handleCardModalOpen = (pinId: number) => {
    setCardModalId(Number(pinId));
    setIsCardModalOpen(true);
  };
  const handleCardModalClose = () => {
    setIsCardModalOpen(false);
  };
  const addImageUrl = 'https://server.memory-road.net/upload/plus_button.png';
  return (
    <>
      {isCardModalOpen ? (
        <StoryCardMainModal
          handleCardModalClose={handleCardModalClose}
          routeInfo={routeCards[cardModalId]}
        />
      ) : null}
      <div className="myRouteStore-wrapper">
        <Navigation />
        <div className="myRouteStore-background">
          <div className="myRouteStore-container">
            <p className="myRouteStore-title">내 루트 보관함</p>
            <hr className="myRouteStore-divide-line"></hr>
            <div className="myRouteStore-selectZone">
              <div className="myRouteStore-selectBoxZone">
                <ColorSelectBox
                  clickedColorSelect={clickedColorSelect}
                  handleColorSelect={handleColorSelect}
                  selectColor={selectColor}
                  selectedColorId={selectedColorId}
                />
                <SeoulSelectBox
                  clickedSeoulSelect={clickedSeoulSelect}
                  handleSeoulSelect={handleSeoulSelect}
                  selectSeoul={selectSeoul}
                />
                <WardSelectBox
                  clickedWardSelect={clickedWardSelect}
                  handleWardSelect={handleWardSelect}
                  selectWard={selectWard}
                  selectedWard={selectedWard}
                />
              </div>
              <div className="myRouteStore-searchBoxZone">
                <input
                  className="myRouteStore-search-input"
                  placeholder="검색어를 입력해주세요"
                ></input>
                <button className="myRouteStore-search-btn">검색</button>
              </div>
            </div>
            <hr className="myRouteStore-divide-line"></hr>
            <div className="myRouteStore-createRouteBox-align">
              <div className="myRouteStore-contentBox">
                {/* 여기서 중앙정렬 ?~! */}
                <div className="myRouteStore-contents">
                  <button
                    className="myRouteStore-createRouteBox-btn"
                    onClick={() => {
                      navigate('/createRoute');
                    }}
                  >
                    <img
                      alt="addButton"
                      className="myRouteStore-createRouteBox-add-image"
                      src={addImageUrl}
                    ></img>
                  </button>
                  {/* 카드 나열 */}
                  {routeCards?.map((el, idx) => (
                    <StoryCard
                      handleCardModalOpen={handleCardModalOpen}
                      key={idx}
                      route={el}
                    />
                  ))}
                </div>
                <div className="myRouteStore-paginations-wrapper">
                  <div className="myRouteStore-paginations">
                    <Pagination
                      dividedPages={dividedPages}
                      handleClickedPageNum={handleClickedPageNum}
                      handleNextPaginationNum={handleNextPaginationNum}
                      handlePrevPaginationNum={handlePrevPaginationNum}
                      paginationNum={paginationNum}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyRouteStore;
