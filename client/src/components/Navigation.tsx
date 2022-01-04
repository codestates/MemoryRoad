import React from "react";
import "./Navigation.css";
import { useState } from "react";
import OpenedMenu from "./openedmenu";
import Login from "./../modals/login/Login";
import SignUp from "./../modals/signup/Signup";
import { useNavigate } from "react-router-dom";

interface Props {
  LoginModal: boolean;
  SignupModal: boolean;
  SetLoginModal: Function;
  SetSignupModal: Function;
}

function Nav({
  LoginModal,
  SetLoginModal,
  SignupModal,
  SetSignupModal,
}: Props) {
  const [isOpen, SetOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div
          className={
            LoginModal || SignupModal
              ? " barmist gridContainer"
              : "gridContainer"
          }
        >
          <div
            className="item"
            id={LoginModal || SignupModal ? "logomist" : undefined}
          >
            <img className="logo" src="http://127.0.0.1:5500/client/public/img/MeMoryRoadLogo.png" onClick={() => navigate("/")} />
          </div>
          <div></div>

          <div className="loginfont" onClick={() => navigate("/Mypage")}>
            마이페이지
          </div>

          <div className="loginfont" onClick={() => SetLoginModal(!LoginModal)}>
            로그인
          </div>
          {/* 메뉴창 */}
          <div className="mobile">
            <div>
              {" "}
              {isOpen ? (
                <OpenedMenu
                  SetOpen={SetOpen}
                  LoginModal={LoginModal}
                  SetLoginModal={SetLoginModal}
                />
              ) : null}
            </div>
            <i
              className="fas fa-bars"
              onClick={() => {
                SetOpen(!isOpen);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
