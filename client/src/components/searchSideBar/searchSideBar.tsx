import React, { useEffect, useState, useRef } from 'react';
import StoryCard from '../storyCard/storyCard';
// import './searchSideBar.css';
import { Route } from './../../types/searchRoutesTypes';
import Pagination from '../pagination/pagination';
import axios from 'axios';
import WardSelectBox from '../wardSelectBox/wardSelectBoxForMap';
import SeoulSelectBox from '../seoulSelectBox/seoulSelectBoxForMap';
import TimeSelectBox from '../timeSelectBox/timeSelectBox';

type Props = {
  searchResult: Route[];
  routeCount: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  selectedRoute: Route | null;
  setRouteCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchResult: React.Dispatch<React.SetStateAction<Route[]>>;
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
        .catch((err) => null);
    } else {
      didMount.current = true;
    }
  }, [searchQuery]);

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
                {searchResult.map((routeInfo) => (
                  <StoryCard
                    key={routeInfo.id}
                    routeInfo={routeInfo}
                    selectedRoute={selectedRoute}
                    setSelectedRoute={setSelectedRoute}
                  />
                ))}
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
