import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCard.css';
import StoryCardRoute from './storyCardRouteForStore';

function StoryCard({ handleCardModalOpen, pin }: any) {
  const colorNames: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );
  const colorIndex = colorNames.indexOf(pin.color);
  return (
    <>
      <div
        className="myRouteStore-card-container"
        id={pin.id}
        onClick={() => handleCardModalOpen(pin.id - 1)} // 일단 여기때문에 오류생김 ok
        onKeyPress={() => handleCardModalOpen(pin.id - 1)} // 일단 여기때문에 오류생김 ok
        role="button"
        tabIndex={0}
      >
        <div className="myRouteStore-card-top">
          <img
            alt="testImg"
            className="myRouteStore-card-image"
            src={`http://127.0.0.1:5500/client/public/img/${pin.thumbnail}`}
          ></img>
        </div>
        <div className="myRouteStore-card-bottom">
          <div className="myRouteStore-card-title">
            <p className="myRouteStore-card-text">{pin.routeName}</p>
            <div className="myRouteStore-card-time-container">
              <div className="myRouteStore-card-time">{pin.time}</div>
              시간
            </div>
          </div>
          <div className="myRouteStore-card-date">{pin.createdAt}</div>
          <div className="myRouteStore-card-route">
            <StoryCardRoute colorIndex={colorIndex} pins={pin.Pins} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCard;
