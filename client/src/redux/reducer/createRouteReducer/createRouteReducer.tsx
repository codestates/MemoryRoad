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
import {
  SAVE_PIN_INFO,
  SAVE_PIN_IMAGE_FILES,
  SAVE_PIN_POSITION,
} from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

const createRouteReducer = (
  state: State = initialState,
  action: Action,
): State => {
  const copiedState = Object.assign({}, state);
  switch (action.type) {
    case SAVE_PIN_INFO:
      // 배열 복사
      const pinsArr = state?.pins?.slice();
      pinsArr?.push(action.payload);
      copiedState.pins = pinsArr;
      return copiedState;

    case SAVE_PIN_IMAGE_FILES:
      // 배열 복사
      const filesArr = state?.files?.slice();
      filesArr?.push(action.payload);
      copiedState.files = filesArr;
      return copiedState;

    case SAVE_PIN_POSITION:
      // 배열 복사
      const positionArr = state?.pinPosition?.slice();
      positionArr?.push(action.payload);
      copiedState.pinPosition = positionArr;
      return copiedState;
    default:
      return state;
  }
};

export default createRouteReducer;
export type CreateRouteReducerType = ReturnType<typeof createRouteReducer>;
