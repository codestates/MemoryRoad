import React from 'react';
import './noRouteInMap.css';

function NoRouteInMap() {
  return (
    <>
      <div className="confirmPin-background" role="button" tabIndex={0}>
        <div
          className="confirmPin-container"
          onClick={(event) => event.stopPropagation()} // 클릭 이벤트를 막긴막았으나 찝찝.
          onKeyPress={(event) => event.stopPropagation()}
          role="button"
          tabIndex={0}
        >
          <div className="confirmPin-content">
            <p className="confirmPin-text-mypage">
              아직 저장한 루트가 없습니다 <br />
              루트 생성 창으로 이동하시겠습니까?
            </p>
            <button
              className="confirmPin-btn-mypage"
              onClick={() =>
                (location.href = 'https://memory-road.net/createRoute')
              }
              type="button"
            >
              나만의 루트 만들러 가기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoRouteInMap;
