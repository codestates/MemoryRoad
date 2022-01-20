import React from 'react';
import { useNavigate } from 'react-router-dom';
import './confirmMoveToMypage.css';

function ConfirmMoveToMypage({ setIsMoveToMypage }: any) {
  const navigate = useNavigate();
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
              루트가 저장되었습니다. <br />
              마이페이지로 이동합니다.
            </p>
            <button
              className="confirmPin-btn-mypage"
              onClick={() => {
                setIsMoveToMypage(false);
                navigate('/myRouteStore');
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

export default ConfirmMoveToMypage;
