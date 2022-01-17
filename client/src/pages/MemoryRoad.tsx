import * as React from 'react';
import Nav from '../components/Navigation';
import Home from './home';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Mypage from './mypage/mypage';
import AllRoutesInMap from './mypage/allRoutesInMap';
import SignUp from '../modals/signup/Signup';
import CheckingPassword from '../modals/editUserInfo/checkingPassword';
import EditUserInfo from '../modals/editUserInfo/editUserInfo';
import Withdrawal from '../modals/editUserInfo/withdrawal';
import './memoryRoad.css';
import { RootState } from '../redux/reducer';
import { setUserInfo } from '../redux/actions/index';
import axios from 'axios';
import LoginModal from '../modals/login/Login';

// Home 화면입니다
const MemoryRoad = () => {
  const state = useSelector((state: RootState) => state.modalReducer);
  const modalLogin = state.isLoginModal; // 로그인 모달창
  const modalSignup = state.isSigninModal; // 회원가입 모달창
  const modalCheckPassword = state.isCheckingPasswordModal; // 회원정보 수정하기 전 비밀번호 확인 모달창
  const modalEditUserInfo = state.isEditUserInfoModal; // 회원정보 수정 모달창
  const modalWithdrawal = state.iswithdrawalModal; // 회원탈퇴 모달창
  const url = 'http://localhost';
  const dispatch = useDispatch();

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

  // const url = new URL(window.location.href);
  // const [authorizationCode, setAuthorizationCode] = useState('');
  // OAuth2.0
  const socialLogin = window.localStorage.getItem('socialLogin');
  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');

    if (authorizationCode) {
      if (socialLogin === 'kakao') {
        axios
          .post(`http://localhost/users/auth/oauth/kakao`, {
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
          .post(`http://localhost/users/auth/oauth/naver`, {
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
          .post(`http://localhost/users/auth/oauth/google`, {
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
  return (
    <div>
      <BrowserRouter>
        <div>
          {modalLogin ? <LoginModal url={url} /> : null}
          {modalSignup ? <SignUp isvalid={isvalid} url={url} /> : null}
          {modalCheckPassword ? <CheckingPassword url={url} /> : null}
          {modalEditUserInfo ? (
            <EditUserInfo isvalid={isvalid} url={url} />
          ) : null}
          {modalWithdrawal ? <Withdrawal url={url} /> : null}
          <Nav url={url} />

          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Mypage />} path="/Mypage" />
            <Route element={<AllRoutesInMap />} path="/Mypage/AllRoutesInMap" />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default MemoryRoad;
