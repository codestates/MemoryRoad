import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCardRouteForSearch.css';

type Props = {
  colorIdx: number;
  pinTitles: string[];
};

function StoryCardRoute({ colorIdx, pinTitles }: Props) {
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  const colorChips: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorChip,
  );

  return (
    <>
      {/* 서버에서 받아온 pins 데이터 map돌려서 pin '점' 정렬 */}
      {pinTitles.map((el, idx) => (
        <div className="myRouteStore-card-pin-search" key={idx}>
          <img
            alt="tt"
            className="myRouteStore-card-dot-search"
            src={colorUrls[colorIdx]}
          ></img>
          <p className="myRouteStore-card-dot-title-search">
            {el} {/* Pin-title */}
          </p>
        </div>
      ))}
      <div
        className="myRouteStore-card-dot-line-search"
        style={{
          backgroundColor: `${colorChips[colorIdx]}`,
        }}
      ></div>
    </>
  );
}

export default StoryCardRoute;
