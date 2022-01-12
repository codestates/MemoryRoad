import React from 'react';
import './Navigation.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OpenedMenu from './openedmenu';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/reducer';
import { loginModal } from '../redux/actions/index';

function Nav() {
  const [isOpen, SetOpen] = useState(false);
  const navigate = useNavigate();
  const modalLogin = useSelector(
    (state: RootState) => state.modal.isLoginModal, // test중입니다.
  ); // 로그인 모달창
  const dispatch = useDispatch();
  return (
    <div>
      <div>
        <div className="gridContainer">
          <div
            className="item"
            onClick={() => navigate('/')}
            onKeyDown={() => navigate('/')}
            role="menu"
            tabIndex={0}
          >
            <img
              alt="Logo"
              className="logo"
              src="http://127.0.0.1:5500/client/public/img/MeMoryRoadLogo.png"
            />
          </div>
          <div></div>

          <div
            className="loginfont"
            onClick={() => navigate('/Mypage')}
            onKeyDown={() => navigate('/')}
            role="menu"
            tabIndex={0}
          >
            마이페이지
          </div>

          <div
            className="loginfont"
            // onClick={() => SetLoginModal(!LoginModal)}

            onClick={() => {
              dispatch(loginModal(true));
              console.log(modalLogin);
            }}
            onKeyDown={() => {
              dispatch(loginModal(true));
              console.log(modalLogin);
            }}
            role="menu"
            tabIndex={0}
          >
            로그인
          </div>
          {/* 메뉴창 */}
          <div className="mobile">
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
