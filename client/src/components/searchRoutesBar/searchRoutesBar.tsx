import React, { useEffect, useState } from 'react';
import './searchRoutesBar.css';
import { Route } from './../../types/searchRoutesTypes';
import axios from 'axios';

type Props = {
  setSearchResult: React.Dispatch<React.SetStateAction<Route[] | null>>;
  setRouteCount: React.Dispatch<React.SetStateAction<number>>;
  setSearchQuery: React.Dispatch<
    React.SetStateAction<{
      rq?: string | undefined;
      lq?: string | undefined;
      location?: string | undefined;
      time?: number | undefined;
      page: number;
    }>
  >;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  searchQuery: {
    rq?: string | undefined;
    lq?: string | undefined;
    location?: string | undefined;
    time?: number | undefined;
    page: number;
  };
};

function SearchRoutesBar({
  setSearchResult,
  setRouteCount,
  setSearchQuery,
  setIsSidebarOpen,
  setSelectedRoute,
  searchQuery,
}: Props) {
  //state들
  //검색창에 입력된 텍스트
  const [searchBarText, setSearchBarText] = useState('');
  //루트, 장소 선택 상태
  const [routeorLocation, setRouteorLocation] = useState('rq');

  //쿼리 객체를 쿼리 스트링으로 변환하는 메소드
  //두 번째, 세 번째 매개변수로 검색 키워드를 받는다
  const getQueryStr = (
    searchQuery: {
      rq?: string | undefined;
      lq?: string | undefined;
      location?: string | undefined;
      time?: number | undefined;
      page?: number | undefined;
    },
    routeorLocation: string,
    searchBarText: string,
  ) => {
    const keyWordObj: {
      page: number;
      rq?: string;
      lq?: string;
    } = { page: 1 };
    if (routeorLocation === 'rq') {
      keyWordObj['rq'] = searchBarText;
    } else {
      keyWordObj['lq'] = searchBarText;
    }
    //state에 검색어를 업데이트 하고, 쿼리 스트링을 반환한다.
    setSearchQuery(() => ({ ...keyWordObj }));
    return Object.entries({ ...keyWordObj })
      .map((e) => e.join('='))
      .join('&');
  };

  //검색 요청
  const postSearch = () => {
    if (searchBarText === '') return alert('검색어를 입력해 주세요!');

    axios
      .get(
        `https://server.memory-road.net/routes?search=true&${getQueryStr(
          searchQuery,
          routeorLocation,
          searchBarText,
        )}`,
      )
      .then((result) => {
        setRouteCount(result.data.count);
        setSearchResult(result.data.routes);
        setSearchQuery((prev) => {
          delete prev.location;
          delete prev.time;
          prev.page = 1;
          return { ...prev };
        });
        setIsSidebarOpen(true);
        setSelectedRoute(null);

        if (result.data.count === 0) return alert('검색결과가 없습니다.');
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    setSearchBarText('');
  }, [routeorLocation]);

  return (
    <>
      <div id="searchPin-static-location">
        <div id="searchPin-background-dy">
          <div id="searchPin-container">
            <button
              className="all-route-button"
              onClick={() => window.location.reload()}
            >
              전체 루트 보기
            </button>
            <select
              className="route-location-select"
              onChange={(e) => setRouteorLocation(e.target.value)}
            >
              <option value="rq">루트</option>
              <option value="lq">장소</option>
            </select>
            <input
              className="searchPin-input"
              onChange={(event) => {
                setSearchBarText(event.target.value);
                // setSearchQuery((prevObj) => {
                //   delete prevObj.lq;
                //   delete prevObj.rq;
                //   routeorLocation === 'rq'
                //     ? (prevObj.rq = event.target.value)
                //     : (prevObj.lq = event.target.value);
                //   return { ...prevObj };
                // });
              }}
              placeholder="원하는 장소를 검색해보세요 !"
              type="text"
              value={searchBarText}
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
