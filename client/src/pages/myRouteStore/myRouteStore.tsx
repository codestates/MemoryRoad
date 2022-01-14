import React from 'react';
import Navigation from '../../components/Navigation';
import ColorSelectBox from '../../components/colorSelectBox/colorSelectBoxForStore';
import SeoulSelectBox from '../../components/seoulSelectBox/seoulSelectBoxForStore';
import WardSelectBox from '../../components/wardSelectBox/wardSelectBoxForStore';
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
            <div className="myRouteStore-contentBox">
              <div className="myRouteStore-contents">
                <button className="myRouteStore-createRouteBox-btn">
                  <img
                    alt="addButton"
                    className="myRouteStore-createRouteBox-add-image"
                    src={addImageUrl}
                  ></img>
                </button>
                {/* map 돌려서 pagination 구현하는 곳 : 카드 컴포넌트 8개 최대 (카드 내의 장소는 최대 4개만 보여주기.)*/}
                <div className="myRouteStore-card-container">
                  <div className="myRouteStore-card-top">
                    <img
                      alt="testImg"
                      className="myRouteStore-card-image"
                      src={imageUrl}
                    >
                      {/* image */}
                    </img>
                  </div>
                  <div className="myRouteStore-card-bottom">
                    <div className="myRouteStore-card-title">
                      <p className="myRouteStore-card-text">
                        친구랑 북촌 투어{/* card-title */}
                      </p>
                      <div className="myRouteStore-card-time-container">
                        <div className="myRouteStore-card-time">
                          7{/* time */}
                        </div>
                        시간
                      </div>
                    </div>
                    <div className="myRouteStore-card-date">
                      2022.04.05{/* date */}
                    </div>
                    <div className="myRouteStore-card-route">
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          한옥 마을 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          분식집 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          돌담길 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          찻집 {/* Pin-title */}
                        </p>
                      </div>
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div
                        className="myRouteStore-card-dot-line"
                        style={{
                          backgroundColor: `${colorNumber[5]}`,
                        }} /* 줄 색깔 배열에서 뽑아 넣기 */
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="myRouteStore-card-container">
                  <div className="myRouteStore-card-top">
                    <img
                      alt="testImg"
                      className="myRouteStore-card-image"
                      src={imageUrl}
                    >
                      {/* image */}
                    </img>
                  </div>
                  <div className="myRouteStore-card-bottom">
                    <div className="myRouteStore-card-title">
                      <p className="myRouteStore-card-text">
                        친구랑 북촌 투어{/* card-title */}
                      </p>
                      <div className="myRouteStore-card-time-container">
                        <div className="myRouteStore-card-time">
                          7{/* time */}
                        </div>
                        시간
                      </div>
                    </div>
                    <div className="myRouteStore-card-date">
                      2022.04.05{/* date */}
                    </div>
                    <div className="myRouteStore-card-route">
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          한옥 마을 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          분식집 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          돌담길 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          찻집 {/* Pin-title */}
                        </p>
                      </div>
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div
                        className="myRouteStore-card-dot-line"
                        style={{
                          backgroundColor: `${colorNumber[5]}`,
                        }} /* 줄 색깔 배열에서 뽑아 넣기 */
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="myRouteStore-card-container">
                  <div className="myRouteStore-card-top">
                    <img
                      alt="testImg"
                      className="myRouteStore-card-image"
                      src={imageUrl}
                    >
                      {/* image */}
                    </img>
                  </div>
                  <div className="myRouteStore-card-bottom">
                    <div className="myRouteStore-card-title">
                      <p className="myRouteStore-card-text">
                        친구랑 북촌 투어{/* card-title */}
                      </p>
                      <div className="myRouteStore-card-time-container">
                        <div className="myRouteStore-card-time">
                          7{/* time */}
                        </div>
                        시간
                      </div>
                    </div>
                    <div className="myRouteStore-card-date">
                      2022.04.05{/* date */}
                    </div>
                    <div className="myRouteStore-card-route">
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          한옥 마을 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          분식집 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          돌담길 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          찻집 {/* Pin-title */}
                        </p>
                      </div>
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div
                        className="myRouteStore-card-dot-line"
                        style={{
                          backgroundColor: `${colorNumber[5]}`,
                        }} /* 줄 색깔 배열에서 뽑아 넣기 */
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="myRouteStore-card-container">
                  <div className="myRouteStore-card-top">
                    <img
                      alt="testImg"
                      className="myRouteStore-card-image"
                      src={imageUrl}
                    >
                      {/* image */}
                    </img>
                  </div>
                  <div className="myRouteStore-card-bottom">
                    <div className="myRouteStore-card-title">
                      <p className="myRouteStore-card-text">
                        친구랑 북촌 투어{/* card-title */}
                      </p>
                      <div className="myRouteStore-card-time-container">
                        <div className="myRouteStore-card-time">
                          7{/* time */}
                        </div>
                        시간
                      </div>
                    </div>
                    <div className="myRouteStore-card-date">
                      2022.04.05{/* date */}
                    </div>
                    <div className="myRouteStore-card-route">
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          한옥 마을 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          분식집 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          돌담길 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          찻집 {/* Pin-title */}
                        </p>
                      </div>
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div
                        className="myRouteStore-card-dot-line"
                        style={{
                          backgroundColor: `${colorNumber[5]}`,
                        }} /* 줄 색깔 배열에서 뽑아 넣기 */
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="myRouteStore-card-container">
                  <div className="myRouteStore-card-top">
                    <img
                      alt="testImg"
                      className="myRouteStore-card-image"
                      src={imageUrl}
                    >
                      {/* image */}
                    </img>
                  </div>
                  <div className="myRouteStore-card-bottom">
                    <div className="myRouteStore-card-title">
                      <p className="myRouteStore-card-text">
                        친구랑 북촌 투어{/* card-title */}
                      </p>
                      <div className="myRouteStore-card-time-container">
                        <div className="myRouteStore-card-time">
                          7{/* time */}
                        </div>
                        시간
                      </div>
                    </div>
                    <div className="myRouteStore-card-date">
                      2022.04.05{/* date */}
                    </div>
                    <div className="myRouteStore-card-route">
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          한옥 마을 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          분식집 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          돌담길 {/* Pin-title */}
                        </p>
                      </div>
                      <div className="myRouteStore-card-pin">
                        <img
                          alt="tt"
                          className="myRouteStore-card-dot"
                          src={dotImageUrl}
                        ></img>
                        <p className="myRouteStore-card-dot-title">
                          찻집 {/* Pin-title */}
                        </p>
                      </div>
                      {/* 여기도 map돌려서 pin 정렬 */}
                      <div
                        className="myRouteStore-card-dot-line"
                        style={{
                          backgroundColor: `${colorNumber[5]}`,
                        }} /* 줄 색깔 배열에서 뽑아 넣기 */
                      ></div>
                    </div>
                  </div>
                </div>
                {/* map 돌려서 pagination 구현하는 곳 : 카드 컴포넌트 8개 최대 */}
                <div className="myRouteStore-paginations">
                  {/* 받아온 핀 카드를 나눠 페이지 네이션 구현. 최대 5장, 이상은 버튼을 눌러 다음 페이지로 이동하게해야한다. */}
                  {/* server에서 받아온 숫자가 5를 넘어가면 버튼 활성화시키고, 버튼이 클릭되었을 때를 상태로 저장해놓고
                눌림다면, 이 페이지 네이션이 변경되도록 로직을 짜야한다. -> 페이지를 기억하고 있는 상태가 필요하겠는걸 ? ^-^ */}
                  {/* 이전 버튼은 page가 1일때 숨긴다. page가 1이면 1/2/3/4/5 앞 순을 출력한다. 이후 버튼을 누르면 page를 2로 바꾸고(+1)
                아래 6/7/8/9/10 그 뒷 순을 출력한다. 이때 이전 버튼을 누르면 page를 1로바꾸는작업(-1) 상태를 변경해주면 또 그에 맞춰서
                1/2/3/4/5 가 렌더링된다 okok 페이지를 추적하는 상태가 있어야한다. 앞 버튼을 누르면 page-1 하고 뒷 버튼 누르면 page+1 음수는 배제하시구요. */}
                  {/* 버튼을 클릭하면 그 id 에 해당하는 값으로 axios 요청을 보내 card 를 받아온다. 전체 카드 수는 언제나 요청에 담겨져 온다. */}
                  <div className="myRouteStore-paginations-prev-btn">
                    <img
                      alt="prevButton"
                      className="myRouteStore-paginations-prev-img"
                      src={prevBtnImageUrl}
                    ></img>
                  </div>
                  {/* 숫자만큼 렌더링해야하는 곳 */}
                  <button className="myRouteStore-paginations-page-btn">
                    1
                  </button>
                  <button className="myRouteStore-paginations-page-btn">
                    2
                  </button>
                  <button className="myRouteStore-paginations-page-btn">
                    3
                  </button>
                  <button className="myRouteStore-paginations-page-btn">
                    4
                  </button>
                  <button className="myRouteStore-paginations-page-btn">
                    5
                  </button>
                  {/* 숫자만큼 렌더링해야하는 곳 */}
                  <div className="myRouteStore-paginations-next-btn">
                    <img
                      alt="nextButton"
                      className="myRouteStore-paginations-next-img"
                      src={nextBtnImageUrl}
                    ></img>
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
