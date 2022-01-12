import React from 'react';
import './openedmenu.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginModal } from '../redux/actions/index';
interface Props {
  SetOpen: any;
}

function OpenedMenu({ SetOpen }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="gridContainer2">
      <div className="item2"></div>
      <div className="item2" id="background">
        <span
          id="X"
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
        <div className="Menutext">
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
        </div>
      </div>
    </div>
  );
}

export default OpenedMenu;
