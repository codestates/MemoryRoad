import React, { useState } from 'react';
import Mist from '../../components/mist';
import './checkingPassword.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  checkingPasswordModal,
  editUserInfoModal,
} from '../../redux/actions/index';
function CheckingPassword({ url }: any) {
  const dispatch = useDispatch();
  const [password, setpassword] = useState(''); // 회원이 입력한 비밀번호
  const [errorMessage, setErrorMessage] = useState(''); // 잘못 입력했을 때 나오는 에러메시지

  const checkingPassword = () => {
    if (password.length === 0) {
      setErrorMessage('기존 비밀번호를 입력해주세요');
    } else {
      axios
        .post(
          `${url}/users/auth/local/password`,
          { password: password },
          {
            headers: {
              'Content-Type': `application/json`,
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            dispatch(checkingPasswordModal(false)); // 비밀번호 확인 모달창을 닫고
            dispatch(editUserInfoModal(true)); // 회원정보 수정창을 연다
          }
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage('비밀번호가 다릅니다.');
        });
    }
  };
  return (
    <div
      className="checkingpassword-mist"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;

        dispatch(checkingPasswordModal(false));
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;

        dispatch(checkingPasswordModal(false));
      }}
      role="menu"
      tabIndex={0}
    >
      <div
        className="checkingpassword-checkingPasswordBorder"
        id="checingPasswordBorder"
      >
        <div className="checkingpassword-checkingPasswordTitle">
          <div className="checkingpassword-center2">
            회원 정보 수정을 위해서는
          </div>
          <div className="checkingpassword-center2">
            기존 비밀번호 확인이 필요합니다.
          </div>
        </div>
        <input
          className="checkingpassword-inputPasswordforChecking"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          placeholder="비밀번호"
          type="password"
        ></input>
        <div className="checkingpassword-ErrorMessage">{errorMessage}</div>
        <div className="checkingpassword-center2">
          <button
            className="checkingpassword-Button userModalPointer checkingpassword-greenButtonCheck"
            onClick={() => {
              // dispatch(checkingPasswordModal(false)); // 주석 처리
              // dispatch(editUserInfoModal(true)); // 주석 처리
              checkingPassword();
            }}
          >
            비밀번호 확인
          </button>
          <button
            className="checkingpassword-Button userModalPointer checkingpassword-grayButtonNext"
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
