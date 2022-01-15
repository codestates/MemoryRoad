import React, { useState } from 'react';
import './routeCard.css';
import { Route } from './../../types/searchRoutesTypes';

type Props = {
  routeInfo: Route;
};

//-----------이미지 없는 경우 대체 사진 구하기--------------

function RouteCard({ routeInfo }: Props) {
  console.log(routeInfo);
  return (
    <>
      <div className="route-card-container">
        <div className="route-thumbnail-container">
          <img
            alt="thumbnail"
            className="route-thumbnail"
            src={`https://server.memory-road.tk/${routeInfo.thumbnail}`}
          ></img>
        </div>
        <div className="route-content-container">
          <div>{routeInfo.routeName}</div>
          <div>{routeInfo.color}</div>
          <div>{routeInfo.public}</div>
          <div>{routeInfo.description}</div>
          <div>{routeInfo.time}</div>
          <div>{routeInfo.createdAt}</div>
        </div>
      </div>
    </>
  );
}
export default RouteCard;
