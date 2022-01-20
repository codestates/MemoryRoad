import * as React from 'react';
import Nav from '../components/Navigation';
import Home from './home';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignUp from '../modals/signup/Signup';
import './memoryRoad.css';
import { RootState } from '../redux/reducer';
import { setUserInfo } from '../redux/actions/index';
import axios from 'axios';
import LoginModal from '../modals/login/Login';

// Home 화면입니다
const MemoryRoad = () => {
  const dispatch = useDispatch();

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

  // OAuth2.0
  const socialLogin = window.localStorage.getItem('socialLogin');
  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');

    if (authorizationCode) {
      if (socialLogin === 'kakao') {
        axios
          .post(
            `https://server.memory-road.net/users/auth/oauth/kakao`,
            {
              authorizationCode: authorizationCode,
            },
            { withCredentials: true },
          )
          .then((res) => {
            dispatch(
              setUserInfo(
                true,
                res.data.id,
                res.data.email,
                res.data.userName,
                res.data.profile,
                res.data.oauthLogin,
              ),
            );
          });
      }
      if (socialLogin === 'naver') {
        console.log(authorizationCode);
        axios
          .post(
            `https://server.memory-road.net/users/auth/oauth/naver`,
            {
              authorizationCode: authorizationCode,
            },
            { withCredentials: true },
          )
          .then((res) => {
            dispatch(
              setUserInfo(
                true,
                res.data.id,
                res.data.email,
                res.data.userName,
                res.data.profile,
                res.data.oauthLogin,
              ),
            );
          });
      }
      if (socialLogin === 'google') {
        console.log(authorizationCode);
        axios
          .post(
            `https://server.memory-road.net/users/auth/oauth/google`,
            {
              authorizationCode: authorizationCode,
            },
            { withCredentials: true },
          )
          .then((res) => {
            dispatch(
              setUserInfo(
                true,
                res.data.id,
                res.data.email,
                res.data.userName,
                res.data.profile,
                res.data.oauthLogin,
              ),
            );
          });
      }
    }
  }, [socialLogin]);
  // const url = 'https://server.memory-road.net';
  const url = 'http://localhost';
  return (
    <div className="memoryRoad-scroll">
      <Nav isvalid={isvalid} url={url} />
      <Home />
    </div>
  );
};

export default MemoryRoad;
