import * as React from "react";
import Nav from "../components/Navigation";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Mypage from "./Mypage";
import Login from "../modals/login/Login";
import SignUp from "../modals/signup/Signup";
import "./MemoryRoad.css";
// Home 화면입니다
const MemoryRoad = () => {
  const [LoginModal, SetLoginModal] = useState(false); // 로그인창을 띄움
  const [SignupModal, SetSignupModal] = useState(false); // 회원가입창을 띄움
  const [UserInfoModal, SetUserInfoModal] = useState(false); // 회원정보 수정창을 띄움
  return (
    <div>
      <BrowserRouter>
        <div
          onClick={() => {
            if (LoginModal) {
              SetLoginModal(false);
            }
            if (SignupModal) {
              SetSignupModal(false);
            }
          }}
        >
          <Nav
            LoginModal={LoginModal}
            SetLoginModal={SetLoginModal}
            SignupModal={SignupModal}
            SetSignupModal={SetSignupModal}
          />
          <div
            className={
              LoginModal || SignupModal || UserInfoModal ? " mist" : undefined
            }
          >
            <Routes>
              <Route path="/Mypage" element={<Mypage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      {LoginModal ? (
        <Login SetLoginModal={SetLoginModal} SetSignupModal={SetSignupModal} />
      ) : null}
      {SignupModal ? (
        <SignUp SetLoginModal={SetLoginModal} SetSignupModal={SetSignupModal} />
      ) : null}
    </div>
  );
};

export default MemoryRoad;
