import React from 'react';
import Mist from '../../components/mist';
import './withdrawal.css';
import { useDispatch } from 'react-redux';
import { withdrawalModal } from '../../redux/actions/index';
function Widthdrawal() {
  const dispatch = useDispatch();
  return (
    <div>
      <Mist />
      <div className="LoginBorder" id="checingPasswordBorder">
        <div className="center">
          <div className="withdrawalTitle">정말로 탈퇴하시겠습니까?</div>
          <button
            className="LoginButton pointer greenButtonCheck"
            onClick={() => {
              dispatch(withdrawalModal(false));
            }}
          >
            조금 더 생각해 볼께요
          </button>
          <button
            className="LoginButton pointer withdrawalButton"
            onClick={() => {
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

export default Widthdrawal;
