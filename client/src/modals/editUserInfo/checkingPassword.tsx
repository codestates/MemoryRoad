import React from 'react';
import Mist from '../../components/mist';
import './checkingPassword.css';
import { useDispatch } from 'react-redux';
import { checkingPasswordModal } from '../../redux/actions/index';
function CheckingPassword() {
  const dispatch = useDispatch();
  return (
    <div>
      <Mist />
      <div className="LoginBorder" id="checingPasswordBorder">
        <div className="checkingPasswordTitle">
          <div className="center2">회원 정보 수정을 위해서는</div>
          <div className="center2">기존 비밀번호 확인이 필요합니다.</div>
        </div>
        <input
          className="inputPasswordforChecking"
          placeholder="비밀번호"
          type="password"
        ></input>
        <div className="ErrorMessage">에러 메시지</div>
        <div className="center">
          <button
            className="LoginButton pointer greenButtonCheck"
            onClick={() => {
              dispatch(checkingPasswordModal(false));
              dispatch(checkingPasswordModal(true));
            }}
          >
            비밀번호 확인
          </button>
          <button
            className="LoginButton pointer grayButtonNext"
            onClick={() => {
              dispatch(checkingPasswordModal(false));
            }}
          >
            다음에 할게요
          </button>
          <div className="Font_MemoryRoad">MeMoryRoad</div>
        </div>
      </div>
    </div>
  );
}

export default CheckingPassword;
