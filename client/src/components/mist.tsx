import React from 'react';
import { useDispatch } from 'react-redux';
import './mist.css';
function Mist() {
  const dispatch = useDispatch();
  return (
    <div
      className="mist"
      onClick={() => {
        dispatch({ type: 'closeLoginModal' });
        dispatch({ type: 'closeSignupModal' });
        dispatch({ type: 'closeCheckingPasswordModal' });
        dispatch({ type: 'closeEditUserInfoModal' });
        dispatch({ type: 'closeWithdrawalModal' });
      }}
      onKeyDown={() => {
        dispatch({ type: 'closeLoginModal' });
        dispatch({ type: 'closeSignupModal' });
        dispatch({ type: 'closeCheckingPasswordModal' });
        dispatch({ type: 'closeWithdrawalModal' });
      }}
      role="menu"
      tabIndex={0}
    >
      <div></div>
    </div>
  );
}

export default Mist;
