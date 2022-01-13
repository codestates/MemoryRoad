import React from 'react';
import Mist from '../../components/mist';
import './withdrawal.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
// import { Logout } from '../../redux/actions/isLoginaction';
import { useNavigate } from 'react-router-dom';
import {
  withdrawalModal,
  editUserInfoModal,
  setUserInfo,
} from '../../redux/actions/index';

function Withdrawal({ url }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const withdraw = () => {
    axios.delete(`${url}/users`).then((res) => {
      if (res.status === 200) {
        alert('회원에서 탈퇴하셨습니다.');
        dispatch(setUserInfo(false, null, null, null, null, null)); // 회원탈퇴에 성공하면 유저상태를 로그아웃 상태로 만듬
        navigate('/'); // 홈으로 이동
      }
    });
  };
  return (
    <div>
      <Mist />
      <div
        className="withdrawal-withdrawalBorder"
        id="withdrawal-withdrawaldBorderOnly"
      >
        <div className="withdrawal-center2">
          <div className="withdrawalTitle">정말로 탈퇴하시겠습니까?</div>
          <button
            className="withdrawal-Button userModalPointer "
            onClick={() => {
              dispatch(withdrawalModal(false)); // 회원탈퇴 모달창을 닫고
              dispatch(editUserInfoModal(true)); // 회원정보 수정창을 연다
            }}
          >
            조금 더 생각해 볼께요
          </button>
          <button
            className="withdrawal-Button2 userModalPointer "
            onClick={() => {
              withdraw();
              dispatch(withdrawalModal(false));
            }}
          >
            탈퇴할게요
          </button>
          <div className="Font_MemoryRoad">MeMoryRoad</div>
        </div>
      </div>
    </div>
  );
}

export default Withdrawal;
