import React, { useState } from 'react';
import './searchRoutesBar.css';
import { Route } from './../../types/searchRoutesTypes';
import axios from 'axios';

type Props = {
  setSearchResult: React.Dispatch<React.SetStateAction<Route[]>>;
  setRouteCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchRoutesBar({
  setSearchResult,
  setRouteCount,
  setSearchKeyword,
  setIsSidebarOpen,
}: Props) {
  //state들
  //검색창에 입력된 텍스트
  const [searchBarText, setSearchBarText] = useState('');

  //검색 요청
  const postSearch = () => {
    axios
      .get(
        `https://server.memory-road.tk/routes?search=true&page=1&rq=${searchBarText}`,
      )
      .then((result) => {
        setRouteCount(result.data.count);
        setSearchResult(result.data.routes);
        setSearchKeyword(searchBarText);
        setIsSidebarOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div id="searchPin-static-location">
        <div id="searchPin-background">
          <div id="searchPin-container">
            <select className="route-location-select">
              <option value="route">루트</option>
              <option value="location">장소</option>
            </select>
            <input
              className="searchPin-input"
              onChange={(event) => setSearchBarText(event.target.value)}
              placeholder="원하는 장소를 검색해보세요 !"
              type="text"
            />
            <button className="searchPin-search-btn" onClick={postSearch}>
              검색
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchRoutesBar;
