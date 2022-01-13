import React from 'react';
import './Navigation.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OpenedMenu from './openedmenu';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/reducer';
import { loginModal, setUserInfo } from '../redux/actions/index';
import axios from 'axios';
import { persistor } from '..';

function Nav() {
  const [isOpen, SetOpen] = useState(false);
  const navigate = useNavigate();
  const modalLogin = useSelector(
    (state: RootState) => state.modalReducer.isLoginModal, // test중입니다.
  ); // 로그인 모달창
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보
  const dispatch = useDispatch();

  // 로그인,로그아웃 버튼 클릭시 작동하는 함수
  const loginButtonHandler = () => {
    if (userinfo.isLogin) {
      // 로그아웃 API
      axios.get(`url/users/auth`).then((res) => {
        if (res.status === 200) {
          dispatch(setUserInfo(false, null, null, null, null, null)); // 유저의 정보를 모두 null 값으로 바꾸고 유저의 로그인 상태를 false로 바꿈
          navigate('/'); // home으로 이동
        }
      });
    } else {
      dispatch(loginModal(true)); // 로그인 버튼을 누르면 로그인 모달창이 나옴
    }
  };
  return (
    <div>
      <div>
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
              src="http://127.0.0.1:5500/client/public/img/MeMoryRoadLogo.png"
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
                navigate('/');
                dispatch(setUserInfo(false, null, null, null, null, null));
                // persist purge를 이용?
                console.log(userinfo);
                // const userData = window.localStorage.getItem(userinfo);
                // console.log(userData);
              } else {
                dispatch(loginModal(true));
              }
              console.log(modalLogin);
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
