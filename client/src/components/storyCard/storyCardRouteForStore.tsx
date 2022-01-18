import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCardRoute.css';

function StoryCardRoute({ colorIndex, pins }: any) {
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  const colorChips: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorChip,
  );
  return (
    <>
      {/* 서버에서 받아온 pins 데이터 map돌려서 pin '점' 정렬 */}
      {pins.slice(0, 4).map((el: any, idx: any) => (
        <div className="myRouteStore-card-pin" key={idx}>
          <img
            alt="tt"
            className="myRouteStore-card-dot"
            src={colorUrls[colorIndex]}
          ></img>
          <p className="myRouteStore-card-dot-title">{el.locationName}</p>
        </div>
      ))}
      <div
        className="myRouteStore-card-dot-line"
        style={{
          backgroundColor: `${colorChips[colorIndex]}`,
        }}
      ></div>
    </>
  );
}

export default StoryCardRoute;
