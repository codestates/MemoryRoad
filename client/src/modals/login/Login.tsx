import React from 'react';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';

interface Props {
  SetLoginModal: Function;
  SetSignupModal: Function;
}

function Login({ SetLoginModal, SetSignupModal }: Props) {
  const [Email, SetEmail] = useState('');
  const [Password, SetPassword] = useState('');
  const InputEmail = (e: any) => {
    SetEmail(e.target.value);
    console.log(Email);
  };
  const InputPassword = (e: any) => {
    SetPassword(e.target.value);
    console.log(Password);
  };
  // Login API
  const Login = () => {
    // 로그인 성공시 마이페이지로 간다
    axios.post(`url/users/auth/local`, { email: Email, password: Password });
  };
  return (
    <div>
      <div className="LoginBorder">
        <div className="center titleLogin">로그인</div>
        <input
          className="input"
          onChange={InputEmail}
          placeholder="이메일"
          type="text"
        ></input>
        <br />
        <input
          className="input"
          onChange={InputPassword}
          placeholder="비밀번호"
          type="password"
        ></input>
        <div className="ErrorMessage">에러 메시지</div>
        <div className="center">
          <button className="LoginButton pointer">로그인</button>
        </div>
        <div className="center">
          <hr className="linebottom"></hr>
        </div>
        <div className="OauthButton">
          <img
            className="GoogleButton pointer"
            src="http://127.0.0.1:5500/client/public/img/google_btn.png"
          />
          <img
            className="NaverButton pointer"
            src="http://127.0.0.1:5500/client/public/img/naver_btn.png"
          />
          <img
            className="kakaoButton pointer"
            src="http://127.0.0.1:5500/client/public/img/kakao_btn.png"
          />
        </div>
        <div className="center TotheSignup">
          혹시 회원이 아니신가요?{' '}
          <b
            className="pointer"
            onClick={() => {
              SetLoginModal(false);
              SetSignupModal(true);
            }}
          >
            회원가입
          </b>
        </div>
      </div>
    </div>
  );
}

export default Login;
