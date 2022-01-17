import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './mypage.css';
import Login from '../../modals/login/Login';
import {
  checkingPasswordModal,
  editUserInfoModal,
} from '../../redux/actions/index';
import '../../modals/userModalPointer.css';
import { useNavigate } from 'react-router-dom';

function Mypage() {
  const modalCheckPassword = useSelector(
    (state: RootState) => state.modalReducer.isCheckingPasswordModal,
  );
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      {userinfo.isLogin ? (
        <div className="mypage-gridMypage">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div className="mypage-checking">
            {userinfo.profile ? (
              <img
                alt="profileimg"
                className="mypage-userProfile"
                src={userinfo.profile}
              />
            ) : (
              <i className="fas fa-user-circle mypage-Profile"></i>
            )}
            {/* <img
              alt="profileimg"
              className="mypage-userProfile"
              src="http://127.0.0.1:5500/client/public/img/notice-board.jpg"
            /> */}
          </div>
          <div className="mypage-checking">
            <div className="mypage-greeting">
              <div className="mypage-greetingTouser">
                {userinfo.username}님, 안녕하세요!
              </div>
              <div>
                <button
                  className="mypage-changeuserinfo"
                  onClick={() => {
                    if (userinfo.OAuthLogin) {
                      dispatch(editUserInfoModal(true)); // OAuth로 로그인한 유저는 바로 회원정보 수정 모달창이 나오고
                    } else {
                      dispatch(checkingPasswordModal(true)); // 로컬 로그인한 유저는 비밀번호 확인 모달창이 나온다
                    }
                  }}
                >
                  회원정보 수정 <i className="fas fa-user"></i>
                </button>
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
          <div className="mypage-checking mypage-map">
            <hr></hr>
            <div className="mypage-scroll">
              <div className="mypage-contents">
                <div className="mypage-content userModalPointer">
                  <img
                    alt="storeRoute"
                    className="mypage-image"
                    src="http://127.0.0.1:5500/client/public/img/notice-board.jpg"
                  />
                  <div className="mypage-imageExplain ">루트 보관함</div>
                </div>
                <div
                  className="mypage-content userModalPointer"
                  onClick={() => navigate('/mypage/AllRoutesInMap')}
                  onKeyDown={() => navigate('/mypage/AllRoutesInMap')}
                  role="menu"
                  tabIndex={0}
                >
                  <img
                    alt="storeRoute"
                    className="mypage-image"
                    src="http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg"
                  />
                  <div className="mypage-imageExplain ">루트 한눈에 보기</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Mypage;
