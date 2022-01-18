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

function MyRouteStore() {
  /* pagination */
  const routes = testData.routes;
  const len = routes.length;
  const count8 = Math.floor(len / 8) + (Math.floor(len % 8) > 0 ? 1 : 0);
  const count40 = Math.floor(len / 40) + Math.floor(len % 40 > 0 ? 1 : 0);
  const dividedRoutes = [];
  const dividedPages = [];
  for (let i = 0; i < count8; i++) {
    dividedRoutes.push(routes.slice(i * 8, (i + 1) * 8));
  }
  for (let i = 0; i < count40; i++) {
    dividedPages.push(dividedRoutes.slice(i * 5, (i + 1) * 5));
  }
  const pageArr = dividedPages.map((el, idx) => {
    const page: any = [];
    el.forEach((el) => page.push(el.length));
    return page;
  });
  console.log(pageArr);
  /* pageNumber는 갱신되고있습니다 */
  const [paginationNum, setPaginationNum] = useState(0);
  const [clickedPageNum, setClickedPageNum] = useState(0);
  const handleClickedPageNum = (pageNum: number): void => {
    setClickedPageNum(pageNum - 1); /* 페이지네이션 업데이트 */
  };
  const handlePrevPaginationNum = () => {
    setPaginationNum(paginationNum - 1);
    setClickedPageNum(0); /* 다음버튼 누름과 동시에 페이지 상태 초기화 */
  };
  const handleNextPaginationNum = () => {
    setPaginationNum(paginationNum + 1);
    setClickedPageNum(0); /* 다음버튼 누름과 동시에 페이지 상태 초기화 */
  };
  console.log(paginationNum);
  console.log(clickedPageNum);
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
  return (
    <>
      {isCardModalOpen ? (
        <StoryCardMainModal
          handleCardModalClose={handleCardModalClose}
          routeInfo={dividedPages[paginationNum][clickedPageNum][cardModalId]}
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
                  {dividedPages[paginationNum][clickedPageNum].map(
                    (el, idx) => (
                      <StoryCard
                        handleCardModalOpen={handleCardModalOpen}
                        key={idx}
                        pin={el}
                      />
                    ),
                  )}
                </div>
                <div className="myRouteStore-paginations-wrapper">
                  <div className="myRouteStore-paginations">
                    <Pagination
                      handleClickedPageNum={handleClickedPageNum}
                      handleNextPaginationNum={handleNextPaginationNum}
                      handlePrevPaginationNum={handlePrevPaginationNum}
                      pageArr={pageArr}
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
