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

  // OAuth2.0
  const socialLogin = window.localStorage.getItem('socialLogin');
  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');

    if (authorizationCode) {
      if (socialLogin === 'kakao') {
        axios
          .post(`https://server.memory-road.net/users/auth/oauth/kakao`, {
            authorizationCode: authorizationCode,
          })
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
          .post(`https://server.memory-road.net/users/auth/oauth/naver`, {
            authorizationCode: authorizationCode,
          })
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
          .post(`https://server.memory-road.net/users/auth/oauth/google`, {
            authorizationCode: authorizationCode,
          })
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
  const url = 'https://server.memory-road.net';
  return (
    <div className="memoryRoad-scroll">
      <Nav url={url} />
      <Home />
    </div>
  );
};

export default MemoryRoad;
