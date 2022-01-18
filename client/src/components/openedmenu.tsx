import React from 'react';
import './openedmenu.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { loginModal, setUserInfo } from '../redux/actions/index';
interface Props {
  SetOpen: any;
}

function OpenedMenu({ SetOpen }: Props) {
  const navigate = useNavigate();
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보
  const dispatch = useDispatch();
  return (
    <div className="opendmenu-gridContainer2">
      <div className="opendmenu-item2"></div>
      <div className="opendmenu-item2" id="opendmenu-background">
        <span
          id="opendmenu-X"
          onClick={() => {
            SetOpen(false);
          }}
          onKeyDown={() => {
            SetOpen(false);
          }}
          role="menu"
          tabIndex={0}
        >
          &times;
        </span>
        <div className="opendmenu-Menutext">
          {userinfo.isLogin ? (
            <div
              onClick={() => {
                navigate('/');
                dispatch(setUserInfo(false, null, null, null, null, null));
              }}
              onKeyDown={() => {
                navigate('/');
                dispatch(setUserInfo(false, null, null, null, null, null));
              }}
              role="menu"
              tabIndex={0}
            >
              로그아웃
            </div>
          ) : (
            <div
              onClick={() => {
                dispatch(loginModal(true));
                SetOpen(false);
              }}
              onKeyDown={() => {
                SetOpen(false);
              }}
              role="menu"
              tabIndex={0}
            >
              로그인
            </div>
          )}
          {userinfo.isLogin ? (
            <div
              onClick={() => {
                navigate('/Mypage');
                SetOpen(false);
              }}
              onKeyDown={() => {
                navigate('/Mypage');
                SetOpen(false);
              }}
              role="menu"
              tabIndex={0}
            >
              마이 페이지
            </div>
          ) : null}
          <br />
          <div>루트 검색하기</div>
        </div>
      </div>
    </div>
  );
}

export default OpenedMenu;
