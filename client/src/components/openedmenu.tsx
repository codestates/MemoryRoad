import React from 'react';
import './openedmenu.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  SetOpen: Function;
  LoginModal: boolean;
  SetLoginModal: Function;
}

function OpenedMenu({ SetOpen, LoginModal, SetLoginModal }: Props) {
  const navigate = useNavigate();
  return (
    <div className="gridContainer2">
      <div className="item2"></div>
      <div className="item2" id="background">
        <span
          id="X"
          onClick={() => {
            SetOpen(false);
          }}
        >
          &times;
        </span>
        <div className="Menutext">
          <div
            onClick={() => {
              SetLoginModal(!LoginModal);
              SetOpen(false);
            }}
          >
            로그인
          </div>
          <div
            onClick={() => {
              navigate('/Mypage');
              SetOpen(false);
            }}
          >
            마이 페이지
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenedMenu;
