import React from 'react';
import './Signup.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducer/index';
interface Props {
  SetLoginModal: Function;
  SetSignupModal: Function;
}

function SignUp({ SetLoginModal, SetSignupModal }: Props) {
  const [Email, SetEmail] = useState(null);
  const [Username, SetUsername] = useState(null);
  const [Password, SetPassword] = useState(null);
  const [CheckPassword, SetCheckPassword] = useState(null);

  const InputEmail = (event: any) => {
    SetEmail(event.target.value);
    console.log(Email);
  };
  // redux
  // const state = useSelector((state: RootState) => state.SignUpReducer);
  // const { userInfo } = state;
  // const dispatch = useDispatch();
  return (
    <div>
      <div className="SignUpBorder">
        <div className="center titleLogin">회원가입</div>
        <div className="textOninput">이메일</div>
        <input
          className="input2"
          name="Email"
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
          placeholder="닉네임을 입력해주세요."
          type="text"
        ></input>
        <div className="ErrorMessage2" style={{ marginBottom: '30px' }}>
          에러 메시지
        </div>
        <div className="textOninput">비밀번호</div>
        <input
          className="input2"
          placeholder="비밀번호를 입력해주세요."
          type="password"
        ></input>
        <div className="ErrorMessage2">에러 메시지</div>
        <input
          className="input2"
          placeholder="비밀번호을 다시 한번 입력해주세요."
          type="password"
        ></input>
        <div className="ErrorMessage2" style={{ marginBottom: '15px' }}>
          에러 메시지
        </div>

        <div className="center">
          <button className="SignUpButton pointer">회원가입</button>
        </div>
        <div className="center ToLogin">
          혹시 회원이신가요?{' '}
          <b
            className="pointer"
            onClick={() => {
              SetSignupModal(false);
              SetLoginModal(true);
            }}
          >
            로그인
          </b>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
