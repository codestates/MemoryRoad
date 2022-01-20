import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './mypage.css';
import {
  checkingPasswordModal,
  editUserInfoModal,
} from '../../redux/actions/index';
import '../../modals/userModalPointer.css';
import { useNavigate } from 'react-router-dom';
import CheckingPassword from '../../modals/editUserInfo/checkingPassword';
import EditUserInfo from '../../modals/editUserInfo/editUserInfo';
import Withdrawal from '../../modals/editUserInfo/withdrawal';

function Mypage() {
  // const modalCheckPassword = useSelector(
  //   (state: RootState) => state.modalReducer.isCheckingPasswordModal,
  // );
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보
  const state = useSelector((state: RootState) => state.modalReducer);
  const modalCheckPassword = state.isCheckingPasswordModal; // 회원정보 수정하기 전 비밀번호 확인 모달창
  const modalEditUserInfo = state.isEditUserInfoModal; // 회원정보 수정 모달창
  const modalWithdrawal = state.iswithdrawalModal; // 회원탈퇴 모달창
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = 'https://server.memory-road.net';

  // 유효성 검사
  const isvalid = (email: string, username: string, password: string) => {
    const character = /^[ A-Za-z0-9_@./#&+-]*$/; // 영문,숫자,특정 특수문자만 허용
    const regexpassword = /[0-9a-zA-Z.;\-]/;
    if (
      character.test(email) &&
      5 <= email.length &&
      !email.includes(' ') &&
      email.includes('@')
    ) {
      return 'Email'; // 이메일은 영문,숫자,특정 특수문자만 허용, 5글자 이상, 공백이 있으면 안되고, @를 포함해야함
    }
    if (!username.includes(' ') && username.length >= 2) {
      return 'Username'; // 닉네임은 공백을 포함해서는 안되고 2글자 이상
    }
    if (8 <= password.length && regexpassword.test(password)) {
      return 'Password'; // 비밀번호는 8자 이상이어야하고 영문,숫자,특수문자를 포함
    } else {
      return false;
    }
  };

  return (
    <div>
      {modalCheckPassword ? <CheckingPassword url={url} /> : null}
      {modalEditUserInfo ? <EditUserInfo isvalid={isvalid} url={url} /> : null}
      {modalWithdrawal ? <Withdrawal url={url} /> : null}
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
                <div
                  className="mypage-content userModalPointer"
                  onClick={() => {
                    navigate('/myRouteStore');
                  }}
                  onKeyDown={() => {
                    navigate('/myRouteStore');
                  }}
                  role="menu"
                  tabIndex={0}
                >
                  <img
                    alt="storeRoute"
                    className="mypage-image"
                    src="https://server.memory-road.net/client/public/img/notice-board.jpg"
                  />
                  <div className="mypage-imageExplain ">루트 보관함</div>
                </div>
                <div
                  className="mypage-content userModalPointer"
                  onClick={() => navigate('/allRoutesInMap')}
                  onKeyDown={() => navigate('/allRoutesInMap')}
                  role="menu"
                  tabIndex={0}
                >
                  <img
                    alt="storeRoute"
                    className="mypage-image"
                    src="https://server.memory-road.net/client/public/img/AllRouteMap.jpg"
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
