import React, { useState } from 'react';
import PageBtn from '../pageBtn/pageBtn';
import RouteCard from '../routeCard/routeCard';
import './searchSideBar.css';
import { Route } from './../../types/searchRoutesTypes';

type Props = {
  searchResult: Route[];
  routeCount: number;
  searchKeyword: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchSideBar({
  searchResult,
  routeCount,
  searchKeyword,
  isSidebarOpen,
  setIsSidebarOpen,
}: Props) {
  const wardsStr = [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
  ];

  //state들
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //현재 페이지
  const [curPage, setCurPage] = useState(1);

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // setCurPage(1);
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
                src="http://127.0.0.1:5500/client/public/img/triangle_icon.png"
              ></img>
            </button>
            <div
              className={isSidebarOpen ? 'active-bar' : ''}
              id="pinControllTower-sidebar"
            >
              <div className="pinControllTower-filter-container">
                <div className="ward-location-container">
                  <select className="ward-location-select">
                    {wardsStr.map((ward, idx) => (
                      <option key={idx} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="time-select-container">
                  <select className="time-select left">
                    {new Array(25).fill(null).map((_, idx) => (
                      <option key={idx} value={idx}>
                        {`${idx}시`}
                      </option>
                    ))}
                  </select>
                  <div className="wave-container">~</div>
                  <select className="time-select right">
                    {new Array(25).fill(null).map((_, idx) => (
                      <option key={idx} value={idx}>
                        {`${idx}시`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pinControllTower-content">
                {searchResult.map((routeInfo) => (
                  <RouteCard key={routeInfo.id} routeInfo={routeInfo} />
                ))}
                {routeCount > 5 ? (
                  <PageBtn
                    cardCount={routeCount}
                    curPage={curPage}
                    limit={5}
                    setCurPage={setCurPage}
                  />
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
