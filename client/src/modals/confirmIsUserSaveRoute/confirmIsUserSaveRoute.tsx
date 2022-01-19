import React from 'react';
import './confirmIsUserSaveRoute.css';

function ConfirmIsUserSaveRoute({ setIsNotUserSave }: any) {
  return (
    <>
      <div
        className="confirmPin-background"
        onClick={() => {
          setIsNotUserSave(false);
        }}
        onKeyPress={() => setIsNotUserSave(false)}
        role="button"
        tabIndex={0}
      >
        <div
          className="confirmPin-container"
          onClick={(event) => event.stopPropagation()} // 클릭 이벤트를 막긴막았으나 찝찝.
          onKeyPress={(event) => event.stopPropagation()}
          role="button"
          tabIndex={0}
        >
          <div className="confirmPin-content">
            <p className="confirmPin-text-sy">
              로그인 후 이용가능한 서비스입니다
            </p>
            <button
              className="confirmPin-btn"
              onClick={() => {
                setIsNotUserSave(false);
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmIsUserSaveRoute;
