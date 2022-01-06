import React from 'react';
import './Signup.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducer/index';
import Mist from '../../components/mist';

function SignUp() {
  const dispatch = useDispatch();

  // 회원가입시 이메일
  const [Email, setEmail] = useState('');
  const InputEmail = (e: any) => {
    setEmail(e.target.value);
    console.log(Email);
  };
  // 회원가입시 닉네임
  const [username, setUsername] = useState('');
  const InputUsername = (e: any) => {
    setUsername(e.target.value);
    console.log(username);
  };
  // 회원가입시 비밀번호
  const [Password, setPassword] = useState('');
  const InputPassword = (e: any) => {
    setPassword(e.target.value);
    console.log(Password);
  };
  // 회원가입시 비밀번호 확인
  const [checkingPassword, setCheckingPassword] = useState('');
  const InputCheckingPassword = (e: any) => {
    setCheckingPassword(e.target.value);
    console.log(checkingPassword);
  };

  return (
    <div>
      <Mist />
      <div className="SignUpBorder">
        <div className="center titleLogin">회원가입</div>
        <div className="textOninput">이메일</div>
        <input
          className="input2"
          onChange={InputEmail}
          placeholder="이메일을 입력해주세요."
          type="text"
        ></input>
        <button className="Emailcheck">이메일 중복확인</button>
        <div className="ErrorMessage2" style={{ marginBottom: '30px' }}>
          에러 메시지
        </div>
        <div className="textOninput">닉네임</div>
        <input
          className="input2"
          onChange={InputUsername}
          placeholder="닉네임을 입력해주세요."
          type="text"
        ></input>
        <div className="ErrorMessage2" style={{ marginBottom: '30px' }}>
          {username === '' ? '닉네임을 입력해주세요' : null}
        </div>
        <div className="textOninput">비밀번호</div>
        <input
          className="input2"
          onChange={InputPassword}
          placeholder="비밀번호를 입력해주세요."
          type="password"
        ></input>
        <div className="ErrorMessage2">
          {Password !== '' ? null : '비밀번호를 입력해주세요'}
        </div>
        <input
          className="input2"
          onChange={InputCheckingPassword}
          placeholder="비밀번호을 다시 한번 입력해주세요."
          type="password"
        ></input>
        <div className="ErrorMessage2" style={{ marginBottom: '15px' }}>
          {Password === checkingPassword ? null : '비밀번호가 맞지 않습니다'}
        </div>

        <div className="center">
          <button className="SignUpButton pointer">회원가입</button>
        </div>
        <div className="center ToLogin">
          혹시 회원이신가요?{' '}
          <b
            className="pointer"
            onClick={() => {
              dispatch({ type: 'closeSignupModal' }); // 회원가입 모달창을 닫고
              dispatch({ type: 'openLoginModal' }); // 로그인 모달창을 연다
            }}
            onKeyDown={() => {
              dispatch({ type: 'closeSignupModal' });
              dispatch({ type: 'openLoginModal' });
            }}
            role="menu"
            tabIndex={0}
          >
            로그인
          </b>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
