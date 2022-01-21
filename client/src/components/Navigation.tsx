import React from 'react';
import './Navigation.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OpenedMenu from './openedmenu';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/reducer';
import { loginModal, setUserInfo } from '../redux/actions/index';
import LoginModal from '../modals/login/Login';
import SignUp from '../modals/signup/Signup';
import axios from 'axios';
import { persistor } from '../index';

function Nav({ url, isvalid }: any) {
  const [isOpen, SetOpen] = useState(false);
  const navigate = useNavigate();
  const modalLogin = useSelector(
    (state: RootState) => state.modalReducer.isLoginModal, // test중입니다.
  ); // 로그인 모달창
  const modalSignup = useSelector(
    (state: RootState) => state.modalReducer.isSigninModal,
  ); // 회원가입 모달창
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보
  const dispatch = useDispatch();

  // 로그인,로그아웃 버튼 클릭시 작동하는 함수
  const loginButtonHandler = () => {
    if (userinfo.isLogin) {
      // 로그아웃 API
      axios.get(`${url}/users/auth`, { withCredentials: true }).then((res) => {
        if (res.status === 200) {
          // window.localStorage.clear(); // 로컬 스토리지를 비우고
          persistor.purge();
          window.location.reload(); // 새로고침

          // dispatch(setUserInfo(false, null, null, null, null, null)); // 유저의 정보를 모두 null 값으로 바꾸고 유저의 로그인 상태를 false로 바꿈
          // window.location.assign(`${url}:3000/`); // home으로 이동
          navigate('/');
        }
      });
    } else {
      dispatch(loginModal(true)); // 로그인 버튼을 누르면 로그인 모달창이 나옴
    }
  };

  // 스크롤 이벤트
  let beforeScrollBar = document.documentElement.scrollTop;
  let isScrollDown = true;
  window.onwheel = function (e) {
    const currentScrollBar = document.documentElement.scrollTop;
    const nav = document.querySelector('.nav-gridContainer');
    // console.log(nav);
    if (currentScrollBar > 70) {
      if (beforeScrollBar < currentScrollBar) {
        // 스크롤 아래로
        isScrollDown = true;
      } else {
        // 스크롤 위로
        isScrollDown = false;
      }
    } else {
    }
    beforeScrollBar = currentScrollBar;

    if (isScrollDown && currentScrollBar > 50) {
      nav?.classList.add('nav-RemoveGridContainer'); // nav바 지움
    }
    if (currentScrollBar <= 50) {
      nav?.classList.remove('nav-RemoveGridContainer'); // nav바가 나옴
    }
    if (!isScrollDown) {
      nav?.classList.remove('nav-RemoveGridContainer'); // nav바가 나옴
    }
  };

  return (
    <div>
      {modalLogin ? <LoginModal url={url} /> : null}
      {modalSignup ? <SignUp isvalid={isvalid} url={url} /> : null}
      <div className="nav-gridContainer-fix-fix">
        <div className="nav-gridContainer">
          <div
            className="nav-item"
            onClick={() => navigate('/')}
            onKeyDown={() => navigate('/')}
            role="menu"
            tabIndex={0}
          >
            <img
              alt="Logo"
              className="nav-logo"
              src="https://server.memory-road.net/upload/LOGO.png"
            />
          </div>
          <div></div>

          <div
            className={userinfo.isLogin ? 'nav-loginfont' : ''}
            onClick={() => {
              if (userinfo.isLogin) {
                navigate('/Mypage');
              }
            }}
            onKeyDown={() => navigate('/Mypage')}
            role="menu"
            tabIndex={0}
          >
            {userinfo.isLogin ? '마이페이지' : null}
          </div>

          <div
            className="nav-loginfont"
            onClick={() => {
              if (userinfo.isLogin) {
                // navigate('/');
                // window.localStorage.clear(); // 로컬 스토리지를 비우고
                // window.location.reload(); // 새로고침
                // persistor.purge(); // 로그아웃 누르면 상태가 안바뀜 , 다시 새로고침 하면 상태가 로그아웃 상태가됨
                // dispatch(setUserInfo(false, null, null, null, null, null));
                // persist purge를 이용?
                loginButtonHandler();
              } else {
                dispatch(loginModal(true));
              }
              // loginButtonHandler();
            }}
            onKeyDown={() => {
              dispatch(loginModal(true));
              console.log(modalLogin);
            }}
            role="menu"
            tabIndex={0}
          >
            {userinfo.isLogin ? '로그아웃' : '로그인'}
          </div>
          {/* 메뉴창 */}
          <div className="nav-mobile">
            <div> {isOpen ? <OpenedMenu SetOpen={SetOpen} /> : null}</div>
            <i
              className="fas fa-bars"
              onClick={() => {
                SetOpen(!isOpen);
              }}
              onKeyDown={() => {
                SetOpen(!isOpen);
              }}
              role="menu"
              tabIndex={0}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
