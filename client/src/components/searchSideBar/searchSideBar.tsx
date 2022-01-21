import React, { useEffect, useState, useRef } from 'react';
import StoryCard from '../storyCard/storyCard';
import './searchSideBar.css';
import { Route } from './../../types/searchRoutesTypes';
import Pagination from '../pagination/pagination';
import axios from 'axios';
import WardSelectBox from '../wardSelectBox/wardSelectBoxForMap';
import SeoulSelectBox from '../seoulSelectBox/seoulSelectBoxForMap';
import TimeSelectBox from '../timeSelectBox/timeSelectBox';

type Props = {
  searchResult: Route[] | null;
  routeCount: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  selectedRoute: Route | null;
  setRouteCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchResult: React.Dispatch<React.SetStateAction<Route[] | null>>;
  setSearchQuery: React.Dispatch<
    React.SetStateAction<{
      rq?: string | undefined;
      lq?: string | undefined;
      location?: string | undefined;
      time?: number | undefined;
      page: number;
    }>
  >;
  searchQuery: {
    rq?: string | undefined;
    lq?: string | undefined;
    location?: string | undefined;
    time?: number | undefined;
    page: number;
  };
  curPage: number;
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
};

function SearchSideBar({
  searchResult,
  routeCount,
  isSidebarOpen,
  setIsSidebarOpen,
  setSelectedRoute,
  selectedRoute,
  setRouteCount,
  setSearchResult,
  setSearchQuery,
  searchQuery,
}: Props) {
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // setCurPage(1);
  };

  //쿼리 객체를 쿼리 스트링으로 변환하는 메소드
  const getQueryStr = (searchQuery: {
    rq?: string | undefined;
    lq?: string | undefined;
    location?: string | undefined;
    time?: number | undefined;
    page?: number | undefined;
  }) =>
    Object.entries(searchQuery)
      .map((e) => e.join('='))
      .join('&');

  //첫 랜더링 시 useEffect실행을 막기 위한 변수
  const didMount = useRef(false);

  //현재 페이지가 바뀌면, 페이지에 해당하는 루트들을 요청한다.
  useEffect(() => {
    if (didMount.current) {
      const controller = new AbortController();
      axios
        .get(
          `https://server.memory-road.net/routes?search=true&${getQueryStr(
            searchQuery,
          )}`,
          { withCredentials: true },
        )
        .then((result) => {
          setRouteCount(result.data.count);
          setSearchResult(result.data.routes);
          setIsSidebarOpen(true);
        })
        .catch((err) => {
          //abort 에러는 경고창에 표시하지 않는다
          if (err.name === 'AbortError') {
            throw 'AbortError';
          }
        });

      //응답을 받기 전에 요청이 가면 이전 요청을 취소한다
      //https://axios-http.com/docs/cancellation
      controller.abort();
    } else {
      didMount.current = true;
    }
  }, [searchQuery]);

  //검색 결과에 따라 카드 랜더링
  function renderCards(searchResult: Route[] | null) {
    if (searchResult === null) return null;
    return searchResult.map((routeInfo: Route) => (
      <StoryCard
        key={routeInfo.id}
        routeInfo={routeInfo}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
      />
    ));
  }

  return (
    <>
      <div id="pinControllTower-fix-search">
        <div id="pinControllTower-background-search">
          <div id="pinControllTower-container-search">
            <button
              className={isSidebarOpen ? 'active-btn-search' : ''}
              id="pinControllTower-close-open-btn-search"
              onClick={handleSidebar}
            >
              <img
                alt="button"
                id="pinControllTower-close-open-btn-img-search"
                src="https://server.memory-road.net/upload/triangle_icon.png"
              ></img>
            </button>
            <div
              className={isSidebarOpen ? 'active-bar-search' : ''}
              id="pinControllTower-sidebar-search"
            >
              <div className="pinControllTower-filter-container-search">
                <div className="seoul-select-container">
                  <SeoulSelectBox />
                </div>
                <div className="ward-select-container">
                  <WardSelectBox setSearchQuery={setSearchQuery} />
                </div>

                <div className="time-select-container">
                  <TimeSelectBox setSearchQuery={setSearchQuery} />
                </div>
              </div>
              <div className="pinControllTower-content-search">
                {renderCards(searchResult)}
                {routeCount > 5 ? (
                  <div className="pagination-button">
                    <Pagination
                      cardCount={routeCount}
                      limit={5}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SearchSideBar;
