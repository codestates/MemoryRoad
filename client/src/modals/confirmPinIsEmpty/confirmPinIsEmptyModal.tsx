import React from 'react';
import './confirmPinIsEmptyModal.css';

function ConfirmPinIsEmptyModal({ setIsEmptyInfo }: any) {
  return (
    <>
      <div
        className="confirmPin-background"
        onClick={() => {
          setIsEmptyInfo(false);
        }}
        onKeyPress={() => setIsEmptyInfo(false)}
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
            <p className="confirmPin-text">
              핀의 정보를 충분히 채운 후<br />
              저장 버튼을 눌러주세요
            </p>
            <button
              className="confirmPin-btn"
              onClick={() => {
                setIsEmptyInfo(false);
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

export default ConfirmPinIsEmptyModal;
