import React from 'react';
import './storyCard.css';
import StoryCardRoute from './storyCardRouteForStore';

function StoryCard() {
  const imageUrl =
    'http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg'; /* 카드 대표 이미지 url (서버에서 받아온 것)*/
  const colorsName = [
    'red',
    'orange',
    'yellow',
    'yellowGreen',
    'green',
    'sky',
    'blue',
    'purple',
    'pink',
  ]; /* 컬러 이름 서버에서 온 컬러이름과 비교해서 인덱스값 추출해낼 것 */
  return (
    <>
      <div className="myRouteStore-card-container">
        <div className="myRouteStore-card-top">
          <img alt="testImg" className="myRouteStore-card-image" src={imageUrl}>
            {/* image */}
          </img>
        </div>
        <div className="myRouteStore-card-bottom">
          <div className="myRouteStore-card-title">
            <p className="myRouteStore-card-text">
              친구랑 북촌 투어{/* card-title */}
            </p>
            <div className="myRouteStore-card-time-container">
              <div className="myRouteStore-card-time">7{/* time */}</div>
              시간
            </div>
          </div>
          <div className="myRouteStore-card-date">2022.04.05{/* date */}</div>
          <div className="myRouteStore-card-route">
            <StoryCardRoute /> {/* colorName에서 인덱스값 뽑아서 내려주기 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCard;
