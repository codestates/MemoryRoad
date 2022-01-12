import React from 'react';
import { useDispatch, batch } from 'react-redux';
import {
  loginModal,
  signupModal,
  checkingPasswordModal,
  editUserInfoModal,
  withdrawalModal,
} from '../redux/actions/index';
import './mist.css';
function Mist() {
  const dispatch = useDispatch();
  return (
    <div
      className="mist"
      onClick={() => {
        batch(() => {
          dispatch(loginModal(false));
          dispatch(signupModal(false));
          dispatch(checkingPasswordModal(false));
          dispatch(editUserInfoModal(false));
          dispatch(withdrawalModal(false));
        });
      }}
      onKeyDown={() => {
        batch(() => {
          dispatch(loginModal(false));
          dispatch(signupModal(false));
          dispatch(checkingPasswordModal(false));
          dispatch(withdrawalModal(false));
        });
      }}
      role="menu"
      tabIndex={0}
    >
      <div></div>
    </div>
  );
}

export default Mist;
