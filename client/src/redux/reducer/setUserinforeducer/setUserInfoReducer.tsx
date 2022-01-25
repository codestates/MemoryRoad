import initialState from '../initialState';
import { SET_USERINFO } from '../../actions';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';
import { PURGE } from 'redux-persist';
const setUserInfoReducer = (
  state: State = initialState,
  action: Action,
): State => {
  const copiedState = Object.assign({}, state);
  switch (action.type) {
    case SET_USERINFO:
      copiedState.userInfo = action.payload;
      return copiedState;
      break;

    default:
      return state;
      break;
  }
};

export default setUserInfoReducer;
export type SetUserInfoReducerType = ReturnType<typeof setUserInfoReducer>;
