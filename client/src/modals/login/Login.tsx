import React from 'react';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch, batch } from 'react-redux';
import Mist from '../../components/mist/mist';
import { RootState } from '../../redux/reducer';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  loginModal,
  signupModal,
  setUserInfo,
} from '../../redux/actions/index';
import '../userModalPointer.css';
import QueryString from 'qs';
import SignUp from '../signup/Signup';
import e from 'express';

function LoginModal({ url }: any) {
  const dispatch = useDispatch();
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저 정보

  const navigate = useNavigate();
  const location = useLocation();
  const [Email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const InputEmail = (e: any) => {
    setEmail(e.target.value);
  };
  // 로그인할 때 Password 입력값
  const [Password, setPassword] = useState('');
  const InputPassword = (e: any) => {
    setPassword(e.target.value);
  };
  // 유효성 검사
  const isvalid = (email: string, username: string, password: string) => {
    const character = /^[ A-Za-z0-9_@./#&+-]*$/; // 영문,숫자,특정 특수문자만 허용
    const regexpassword = /[0-9a-zA-Z.;\-]/;
    if (
      character.test(email) &&
      5 <= email.length &&
      !email.includes(' ') &&
      email.includes('@')
    ) {
      return 'Email'; // 이메일은 영문,숫자,특정 특수문자만 허용, 5글자 이상, 공백이 있으면 안되고, @를 포함해야함
    }
    if (!username.includes(' ') && username.length >= 2) {
      return 'Username'; // 닉네임은 공백을 포함해서는 안되고 2글자 이상
    }
    if (8 <= password.length && regexpassword.test(password)) {
      return 'Password'; // 비밀번호는 8자 이상이어야하고 영문,숫자,특수문자를 포함
    } else {
      return false;
    }
  };
  // 로그인 요청 API
  const LoginHandler = () => {
    if (Email === '' || Password === '') {
      setErrorMessage('이메일과 비밀번호를 입력해주세요');
    } else {
      // // ---주석 처리---
      // // dispatch(Login(Email, Email, null));
      // dispatch(setUserInfo(true, 1, Email, Email, null, null));
      // // isLogin, id , email, username, profile,OAuthLogin
      // // window.localStorage.getItem()
      // dispatch(loginModal(false)); // 로그인 모달창을 닫는다
      // navigate('/Mypage');
      // // 서버와 통신 가능 하면 else부터 여기까지 주석 처리
      // --- 주석 처리 ---

      axios
        .post(
          `${url}/users/auth/local`,
          { email: Email, password: Password },
          {
            headers: { 'Content-Type': `application/json` },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setUserInfo(
                true,
                res.data.id, // id값
                res.data.email, // 이메일
                res.data.userName, // 닉네임
                res.data.profile, // 프로필 사진
                null, // OAuthLogin
              ),
            ); // 로그인 성공시 유저상태 바꿈
            dispatch(loginModal(false)); // 로그인 성공시 로그인 모달창 닫음
            navigate(`${location.pathname}`); // 로그인 성공시 머물렀던 페이지 유지
          }
        })
        .catch((error) =>
          setErrorMessage('이메일또는 비밀번호를 잘못 입력했습니다.'),
        );
    }
  };

  const redirect_uri = 'https://memory-road.net';
  // const redirect_uri = 'http://localhost';
  // 카카오 로그인 API
  const KakaoLoginHandler = () => {
    //  카카오에서 Authorization code를 받아오고
    // 카카오 서버에 Authorization code를 보여주고 access Token을 받아옴
    // access Token을 서버에 주면 사용자는 웹사이트 이용 가능
    window.localStorage.setItem('socialLogin', 'kakao');
    const kakao_Login_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=6e1927a3fa6b237cefcfcee8cafd9ce6&redirect_uri=${redirect_uri}`;
    window.location.assign(kakao_Login_url);

    // console.log(window.location.href); // http://localhost:3000/
  };

  // 네이버 로그인 API
  const NaverLoginHandler = () => {
    window.localStorage.setItem('socialLogin', 'naver');
    const naver_Login_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=8izF9e9K1PRGrQ_nEUGi&redirect_uri=${redirect_uri}`;
    window.location.assign(naver_Login_url);
  };

  // Google 로그인 API
  const GoogleLoginHandler = () => {
    window.localStorage.setItem('socialLogin', 'google');
    // const google_Login_url = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${redirect_uri}&client_id=721113525638-iqgb0cig5l1vd2gvndncagbpq161sdde.apps.googleusercontent.com`;
    // window.location.assign(google_Login_url);
    const AUTHORIZE_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
    console.log(AUTHORIZE_URI);
    const queryStr = QueryString.stringify({
      client_id:
        '721113525638-iqgb0cig5l1vd2gvndncagbpq161sdde.apps.googleusercontent.com',
      redirect_uri: 'https://memory-road.net',
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
    });
    const GOOGLE_LOGIN_URL = AUTHORIZE_URI + '?' + queryStr;
    window.location.assign(GOOGLE_LOGIN_URL);
  };

  return (
    <div>
      <div
        className="login-modal-align-center-fix"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          batch(() => {
            dispatch(loginModal(false));
          });
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          batch(() => {
            dispatch(loginModal(false));
          });
        }}
        role="menu"
        tabIndex={0}
      >
        <div
          className="login-LoginBorder"
          onClick={() => null}
          onKeyDown={() => null}
          role="menu"
          tabIndex={0}
        >
          <div className="login-center login-titleLogin">로그인</div>
          <input
            className="login-input"
            maxLength={24}
            onChange={InputEmail}
            placeholder="이메일"
            type="text"
          ></input>
          <br />
          <input
            className="login-input"
            maxLength={16}
            onChange={InputPassword}
            placeholder="비밀번호"
            type="password"
          ></input>
          <div className="login-ErrorMessage">{errorMessage}</div>
          <div className="login-center">
            <button
              className="login-Button userModalPointer"
              onClick={LoginHandler}
            >
              로그인
            </button>
          </div>
          <div className="login-center">
            <hr className="login-linebottom"></hr>
          </div>
          <div className="login-OauthButton">
            <div
              onClick={GoogleLoginHandler}
              onKeyDown={GoogleLoginHandler}
              role="button"
              tabIndex={0}
            >
              <img
                alt="googleLoginButton"
                className="login-GoogleButton login-pointer"
                src="https://server.memory-road.net/upload/google_btn.png"
              />
            </div>
            <div
              onClick={NaverLoginHandler}
              onKeyDown={NaverLoginHandler}
              role="button"
              tabIndex={0}
            >
              <img
                alt="naverLoginButton"
                className="login-NaverButton login-pointer"
                src="https://server.memory-road.net/upload/naver_btn.png"
              />
            </div>
            <div
              onClick={KakaoLoginHandler}
              onKeyDown={KakaoLoginHandler}
              role="button"
              tabIndex={0}
            >
              <img
                alt="kakoLoginButton"
                className="login-kakaoButton login-pointer"
                src="https://server.memory-road.net/upload/kakao_btn.png"
              />
            </div>
          </div>
          <div className="login-center login-TotheSignup">
            혹시 회원이 아니신가요?{' '}
            <b
              className="login-pointer"
              onClick={() => {
                dispatch(loginModal(false)); // 로그인 모달창을 닫고
                dispatch(signupModal(true)); // 회원가입 모달창을 연다
              }}
              onKeyDown={() => {
                dispatch(loginModal(false));
                dispatch(signupModal(true));
              }}
              role="menu"
              tabIndex={0}
            >
              회원가입
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
