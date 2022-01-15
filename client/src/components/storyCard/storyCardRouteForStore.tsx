import React from 'react';
import './storyCardRoute.css';

function StoryCardRoute() {
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
  const pinTitles = [
    '한옥 마을',
    '분식집',
    '돌담길',
    '찻집',
  ]; /* 서버에서 받아온 pin 점 title들 */
  return (
    <>
      {/* 서버에서 받아온 pins 데이터 map돌려서 pin '점' 정렬 */}
      {pinTitles.slice(0, 4).map((el, idx) => (
        <div className="myRouteStore-card-pin" key={idx}>
          <img alt="tt" className="myRouteStore-card-dot" src={colors[5]}></img>
          <p className="myRouteStore-card-dot-title">
            {el} {/* Pin-title */}
          </p>
        </div>
      ))}
      <div
        className="myRouteStore-card-dot-line"
        style={{
          backgroundColor: `${colorNumber[5]}`,
        }}
      ></div>
    </>
  );
}

export default StoryCardRoute;
