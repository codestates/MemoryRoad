import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCard.css';
import StoryCardRoute from './storyCardRouteForStore';

function StoryCard({ handleCardModalOpen, route }: any) {
  const colorNames: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );
  const colorIndex = colorNames.indexOf(route.color);
  return (
    <>
      <div
        className="myRouteStore-card-container"
        id={route.id}
        onClick={() => handleCardModalOpen(route.id)} // 일단 여기때문에 오류생김 ok
        onKeyPress={() => handleCardModalOpen(route.id)} // 일단 여기때문에 오류생김 ok
        role="button"
        tabIndex={0}
      >
        <div className="myRouteStore-card-top">
          <img
            alt="testImg"
            className="myRouteStore-card-image"
            src={`https://server.memory-road.net/upload/${route.thumbnail}`}
          ></img>
        </div>
        <div className="myRouteStore-card-bottom">
          <div className="myRouteStore-card-title">
            <p className="myRouteStore-card-text">{route.routeName}</p>
            <div className="myRouteStore-card-time-container">
              <div className="myRouteStore-card-time">{route.time}</div>
              시간
            </div>
          </div>
          <div className="myRouteStore-card-date">{route.createdAt}</div>
          <div className="myRouteStore-card-route">
            <StoryCardRoute colorIndex={colorIndex} pins={route.Pins} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCard;
