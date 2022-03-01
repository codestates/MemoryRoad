import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCard_search.css';
import StoryCardRoute from './route_mypage';

function StoryCard({ handleCardModalOpen, route }: any) {
  const colorNames: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );
  const colorIndex = colorNames.indexOf(route.color);
  const createdAt = route.createdAt.slice(0, 10);
  return (
    <>
      <div
        className="myRouteStore-card-container"
        id={route.id}
        onClick={() => handleCardModalOpen(route.id)}
        onKeyPress={() => handleCardModalOpen(route.id)}
        role="button"
        tabIndex={0}
      >
        <div className="myRouteStore-card-top">
          <img
            alt="testImg"
            className="myRouteStore-card-image"
            src={`https://server.memory-road.net/${route.thumbnail}`}
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
          <div className="myRouteStore-card-date">{createdAt}</div>
          <div className="myRouteStore-card-route">
            <StoryCardRoute colorIndex={colorIndex} pins={route.Pins} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCard;
