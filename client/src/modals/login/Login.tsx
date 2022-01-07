import React from 'react';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducer';
import Mist from '../../components/mist';

interface Props {
  loginHandler: any;
}

function Login({ loginHandler }: Props) {
  const dispatch = useDispatch();

  // 로그인할 때 Email 입력값
  const [Email, setEmail] = useState('');
  const InputEmail = (e: any) => {
    setEmail(e.target.value);
    console.log(Email);
  };
  // 로그인할 때 Password 입력값
  const [Password, setPassword] = useState('');
  const InputPassword = (e: any) => {
    setPassword(e.target.value);
    console.log(Password);
  };
  return (
    <div>
      <div>
        <Mist />
      </div>
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
        <div className="ErrorMessage">
          {Email === '' || Password === ''
            ? '이메일과 비밀번호를 입력해주세요'
            : null}
        </div>
        <div className="center">
          <button className="LoginButton pointer">로그인</button>
        </div>
        <div className="center">
          <hr className="linebottom"></hr>
        </div>
        <div className="OauthButton">
          <img
            alt="googleLoginButton"
            className="GoogleButton pointer"
            src="http://127.0.0.1:5500/client/public/img/google_btn.png"
          />
          <img
            alt="naverLoginButton"
            className="NaverButton pointer"
            src="http://127.0.0.1:5500/client/public/img/naver_btn.png"
          />
          <img
            alt="kakoLoginButton"
            className="kakaoButton pointer"
            src="http://127.0.0.1:5500/client/public/img/kakao_btn.png"
          />
        </div>
        <div className="center TotheSignup">
          혹시 회원이 아니신가요?{' '}
          <b
            className="pointer"
            onClick={() => {
              dispatch({ type: 'closeLoginModal' });
              dispatch({ type: 'openSignupModal' });
            }}
            onKeyDown={() => {
              dispatch({ type: 'closeLoginModal' });
              dispatch({ type: 'openSignupModal' });
            }}
            role="menu"
            tabIndex={0}
          >
            회원가입
          </b>
        </div>
      </div>
    </div>
  );
}

export default Login;
