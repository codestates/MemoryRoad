import React from 'react';
import Navigation from '../../components/Navigation';
import ColorSelectBox from '../../components/colorSelectBox/colorSelectBoxForStore';
import SeoulSelectBox from '../../components/seoulSelectBox/seoulSelectBoxForStore';
import WardSelectBox from '../../components/wardSelectBox/wardSelectBoxForStore';
import StoryCard from '../../components/storyCard/storyCardForStore';
import Pagination from '../../components/pagination/paginationForStore';
import './myRouteStore.css';

function MyRouteStore() {
  const imageUrl = 'http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg';
  const dotImageUrl = 'http://127.0.0.1:5500/client/public/img/sky_dot.png';
  const addImageUrl = 'http://127.0.0.1:5500/client/public/img/plus_button.png';
  const nextBtnImageUrl =
    'http://127.0.0.1:5500/client/public/img/next_button.png';
  const prevBtnImageUrl =
    'http://127.0.0.1:5500/client/public/img/prev_button .png';
  const colorNumber = [
    '#DC4B40' /* red */,
    '#EE8343' /* orange */,
    '#F8F862' /* yellow */,
    '#ADE672' /* yellowGreen */,
    '#8DAF69' /* green */,
    '#91C1C7' /* sky */,
    '#6B91E3' /* blue */,
    '#9E7FCB' /* purple */,
    '#EE9FE5' /* pink */,
  ];
  // 페이지 네이션 구현 잊지말자.
  const cardCounts = 8;
  return (
    <>
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
                  {/* map 돌려서 pagination 구현하는 곳 : 카드 컴포넌트 8개 최대 (카드 내의 점은 최대 4개만 보여주기.)*/}
                  {new Array(cardCounts).fill(0).map((el, idx) => (
                    <StoryCard key={idx} />
                  ))}
                </div>
                {/* map 돌려서 pagination 구현하는 곳 : 카드 컴포넌트 8개 최대 */}
                <div className="myRouteStore-paginations">
                  <Pagination />
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
