import * as React from 'react';
import Nav from '../../components/navigation/Navigation';
import Home from '../memoryRoad/home';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './memoryRoad.css';
import { setUserInfo } from '../../redux/actions/index';
import axios from 'axios';

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
  const url = 'https://server.memory-road.net';
  // const url = 'http://localhost';

  return (
    <div className="memoryRoad-scroll">
      <Nav />
      <Home url={url} />
    </div>
  );
};

export default MemoryRoad;
