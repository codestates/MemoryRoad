import React, { useState, useEffect } from 'react';
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
  const [paginationNum, setPaginationNum] = useState(0); // <, > 버튼 컨트롤
  const [currPageNum, setCurrPageNum] = useState(1); // 페이지 넘버(1,2,3) 컨트롤
  const [dataCount, setdataCount] = useState(50); // 전체 루트 개수
  const [routeCards, setRouteCards] = useState([]);
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
  console.log(paginationNum);
  console.log(currPageNum);
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
  const addImageUrl = 'http://127.0.0.1:5500/client/public/img/plus_button.png';
  useEffect(() => {
    if (currPageNum === 0) {
      axios({
        url: 'https://server.memory-road.tk/routes',
        method: 'get',
        withCredentials: true,
        params: {
          page: 1,
        },
      })
        .then((data) => {
          console.log(data);
          // 여기서 count 값이 갱신됌.
          // setdataCount(data.count)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios({
        url: 'https://server.memory-road.tk/routes',
        method: 'get',
        withCredentials: true,
        params: {
          page: currPageNum,
        },
      })
        .then((data) => {
          console.log(data);
          // 여기서 전체 루트 정보들을 받아옴. (최대 8개)
          // setRouteCards(data,route);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currPageNum]);
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
                <ColorSelectBox />
                <SeoulSelectBox />
                <WardSelectBox />
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
                  <button className="myRouteStore-createRouteBox-btn">
                    <img
                      alt="addButton"
                      className="myRouteStore-createRouteBox-add-image"
                      src={addImageUrl}
                    ></img>
                  </button>
                  {/* 카드 나열 */}
                  {routeCards.map((el, idx) => (
                    <StoryCard
                      handleCardModalOpen={handleCardModalOpen}
                      key={idx}
                      pin={el}
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
