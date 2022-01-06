import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import './Mypage.css';
import Login from '../modals/login/Login';

function Mypage() {
  const modalCheckPassword = useSelector(
    (state: RootState) => state.checkingPasswordModalReducer,
  );
  const dispatch = useDispatch();
  return (
    <div>
      <div className="gridMypage">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className="checking">
          <i className="fas fa-user-circle Profile"></i>
        </div>
        <div className="checking">
          <div className="greeting">
            <div className="greetingTouser">[닉네임]님, 안녕하세요! </div>
            <button
              className="changeUserInfo"
              onClick={() => {
                if (modalCheckPassword) {
                  dispatch({ type: 'closeCheckingPasswordModal' });
                }
                if (!modalCheckPassword) {
                  // modalCheckPassword가 false일 때
                  dispatch({ type: 'openCheckingPasswordModal' });
                }
              }}
            >
              회원정보 수정 <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
        <div></div>
        <div></div>
        <div className="checking map">
          <hr></hr>
          <div>
            <div>map</div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Mypage;
