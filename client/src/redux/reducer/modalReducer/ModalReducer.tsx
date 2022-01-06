const LoginModal = false;
const signupModal = false;
const checkingPasswordModal = false;
const editUserInfoModal = false;
const withdrawalModal = false;

export const loginModalReducer = (
  state: boolean = LoginModal,
  action: any,
): boolean => {
  if (action.type === 'openLoginModal') {
    return true;
  }
  if (action.type === 'closeLoginModal') {
    return false;
  }
  return state;
};

export const signupModalReducer = (
  state: boolean = signupModal,
  action: any,
) => {
  if (action.type === 'openSignupModal') {
    return true;
  }
  if (action.type === 'closeSignupModal') {
    return false;
  }
  return state;
};

export const checkingPasswordModalReducer = (
  state: boolean = checkingPasswordModal,
  action: any,
) => {
  if (action.type === 'openCheckingPasswordModal') {
    return true;
  }
  if (action.type === 'closeCheckingPasswordModal') {
    return false;
  }
  return state;
};

export const editUserInfoModalReducer = (
  state: boolean = editUserInfoModal,
  action: any,
) => {
  if (action.type === 'openEditUserInfoModal') {
    return true;
  }
  if (action.type === 'closeEditUserInfoModal') {
    return false;
  }
  return state;
};

export const withdrawalModalReducer = (
  state: boolean = withdrawalModal,
  action: any,
) => {
  if (action.type === 'openWithdrawalModal') {
    return true;
  }
  if (action.type === 'closeWithdrawalModal') {
    return false;
  }
  return state;
};
