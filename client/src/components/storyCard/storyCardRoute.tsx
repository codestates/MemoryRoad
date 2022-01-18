import React from 'react';
import './storyCardRouteForSearch.css';

type Props = {
  colorIdx: number;
  pinTitles: string[];
};

function StoryCardRoute({ colorIdx, pinTitles }: Props) {
  const colors = [
    'http://127.0.0.1:5500/client/public/img/red_dot.png',
    'http://127.0.0.1:5500/client/public/img/orange_dot.png',
    'http://127.0.0.1:5500/client/public/img/yellow_dot.png',
    'http://127.0.0.1:5500/client/public/img/yellowGreen_dot.png',
    'http://127.0.0.1:5500/client/public/img/green_dot.png',
    'http://127.0.0.1:5500/client/public/img/sky_dot.png',
    'http://127.0.0.1:5500/client/public/img/blue_dot.png',
    'http://127.0.0.1:5500/client/public/img/purple_dot.png',
    'http://127.0.0.1:5500/client/public/img/pink_dot.png',
  ]; /* dot 이미지들 => 상태 저장해놓고 써도 될듯. */
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
  ]; /* 라인 표현할 때 쓰는 색깔 컬러 */

  return (
    <>
      {/* 서버에서 받아온 pins 데이터 map돌려서 pin '점' 정렬 */}
      {pinTitles.map((el, idx) => (
        <div className="myRouteStore-card-pin-search" key={idx}>
          <img
            alt="tt"
            className="myRouteStore-card-dot-search"
            src={colors[colorIdx]}
          ></img>
          <p className="myRouteStore-card-dot-title-search">
            {el} {/* Pin-title */}
          </p>
        </div>
      ))}
      <div
        className="myRouteStore-card-dot-line-search"
        style={{
          backgroundColor: `${colorNumber[colorIdx]}`,
        }}
      ></div>
    </>
  );
}

export default StoryCardRoute;
