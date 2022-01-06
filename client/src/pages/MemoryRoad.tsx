import * as React from 'react';
import Nav from '../components/Navigation';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Mypage from './Mypage';
import Login from '../modals/login/Login';
import SignUp from '../modals/signup/Signup';
import CheckingPassword from '../modals/editUserInfo/checkingPassword';
import EditUserInfo from '../modals/editUserInfo/editUserInfo';
import Widthdrawal from '../modals/editUserInfo/withdrawal';
import './MemoryRoad.css';
import { RootState } from '../redux/reducer';

// Home 화면입니다
const MemoryRoad = () => {
  const modalLogin = useSelector((state: RootState) => state.loginModalReducer); // 로그인 모달창
  const modalSignup = useSelector(
    (state: RootState) => state.signupModalReducer,
  ); // 회원가입 모달창
  const modalCheckPassword = useSelector(
    (state: RootState) => state.checkingPasswordModalReducer,
  ); // 회원정보 수정하기 전 비밀번호 확인 모달창
  const modalEditUserInfo = useSelector(
    (state: RootState) => state.editUserInfoModalReducer,
  ); // 회원정보 수정 모달창
  const modalWithdrawal = useSelector(
    (state: RootState) => state.withdrawalModalReducer,
  ); // 회원탈퇴 모달창
  const dispatch = useDispatch();

  const [isLogin, setLogin] = useState(false); // 로그인 여부
  const [accessToken, setAccessToken] = useState(''); // accessToken
  // 로그인 핸들러
  const loginHandler = (token: string) => {
    setLogin(true);
    setAccessToken(token);
  };
  // 로그아웃 핸들러
  const logoutHandler = () => {
    setLogin(false);
    setAccessToken('');
  };

  return (
    <div>
      <BrowserRouter>
        <div>
          {modalLogin ? <Login loginHandler={loginHandler} /> : null}
          {modalSignup ? <SignUp /> : null}
          {modalCheckPassword ? <CheckingPassword /> : null}
          {modalEditUserInfo ? <EditUserInfo /> : null}
          {modalWithdrawal ? <Widthdrawal /> : null}
          <Nav />
          <div>
            <Routes>
              <Route element={<Mypage />} path="/Mypage" />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

// className={
//   modalLogin || modalSignup || modalCheckPassword
//     ? ' mist'
//     : undefined
// }
export default MemoryRoad;
