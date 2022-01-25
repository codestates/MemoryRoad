import initialState from '../initialState';
import {
  LOGIN_MODAL,
  SIGNUP_MODAL,
  CHECKING_PASSWORD_MODAL,
  EDIT_USER_INFO_MODAL,
  WITHDRAWAL_MODAL,
} from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

const modalReducer = (state: State = initialState, action: Action): State => {
  const copiedState = Object.assign({}, state); // 상태 복사본입니다.
  switch (action.type) {
    case LOGIN_MODAL:
      copiedState.isLoginModal = action.payload; // 복사한 상태의 키값을 action.payload 값으로 변경하는 로직입니다.
      return copiedState;
    case SIGNUP_MODAL:
      copiedState.isSigninModal = action.payload;
      return copiedState;
    case CHECKING_PASSWORD_MODAL:
      copiedState.isCheckingPasswordModal = action.payload;
      return copiedState;
    case EDIT_USER_INFO_MODAL:
      copiedState.isEditUserInfoModal = action.payload;
      return copiedState;
    case WITHDRAWAL_MODAL:
      copiedState.iswithdrawalModal = action.payload;
      return copiedState;
    default:
      return state;
  }
};

export default modalReducer;
export type ModalReducerType = ReturnType<typeof modalReducer>;
