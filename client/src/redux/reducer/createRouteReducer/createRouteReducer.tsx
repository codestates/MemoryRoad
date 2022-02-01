/* [ reducer 예시 ]
 *
 * const reducer = (state: State = initialState, action: Action): State => {
 *   switch(action.type){
 *     case GET_USER_INFO:
 *       return { ... };
 *      default:
 *       return state;
 *   }
 * }
 *
 */

import initialState from '../initialState';
import { UPDATE_PIN_ID_NUM } from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

const createRouteReducer = (
  state: State = initialState,
  action: Action,
): State => {
  const copiedState = Object.assign({}, state);
  switch (action.type) {
    // count 업데이트
    case UPDATE_PIN_ID_NUM:
      copiedState.pinCount = action.payload;
      return copiedState; // 1 더해준 숫자 걍 업데이트만 해주기
    default:
      return state;
  }
};

export default createRouteReducer;
export type CreateRouteReducerType = ReturnType<typeof createRouteReducer>;
