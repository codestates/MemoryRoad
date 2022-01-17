import React from 'react';
import './storyCardForSearch.css';
import StoryCardRoute from './storyCardRoute';
import { Route } from './../../types/searchRoutesTypes';

type Props = {
  routeInfo: Route;
  setSelectedRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  selectedRoute: Route | null;
};

function StoryCard({ routeInfo, setSelectedRoute, selectedRoute }: Props) {
  const imageUrl = `https://server.memory-road.tk/${routeInfo.thumbnail}`; /* 카드 대표 이미지 url (서버에서 받아온 것)*/
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
  const colorIdx = colorsName.indexOf(routeInfo.color);
  const pinTitles = routeInfo.Pins.map((pin) => pin.locationName);

  function formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('.');
  }

  return (
    <>
      <div
        className={
          selectedRoute?.id === routeInfo.id
            ? 'myRouteStore-card-container-search active'
            : 'myRouteStore-card-container-search'
        }
        onClick={() => {
          //객체를 복사해 전달해, 같은 카드를 선택하더라도 state를 업데이트 한다.
          setSelectedRoute({ ...routeInfo });
        }}
        onKeyUp={() => null}
        role="button"
        tabIndex={routeInfo.id}
      >
        <div className="myRouteStore-card-top-search">
          <img
            alt="testImg"
            className="myRouteStore-card-image-search"
            src={imageUrl}
          >
            {/* image */}
          </img>
        </div>
        <div className="myRouteStore-card-bottom-search">
          <div className="myRouteStore-card-title-search">
            <p className="myRouteStore-card-text-search">
              {routeInfo.routeName.length < 12
                ? routeInfo.routeName
                : `${routeInfo.routeName.substr(0, 12)}...`}
            </p>
            <div className="myRouteStore-card-time-container-search">
              <div className="myRouteStore-card-time-search">
                {routeInfo.time}
              </div>
              시간
            </div>
          </div>
          <div className="myRouteStore-card-date-search">
            {formatDate(routeInfo.createdAt)}
          </div>
          <div className="myRouteStore-card-route-search">
            <StoryCardRoute colorIdx={colorIdx} pinTitles={pinTitles} />
            {/* colorName에서 인덱스값 뽑아서 내려주기 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCard;
