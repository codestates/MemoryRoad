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

import { initialState } from '../initialState';
import { SAVE_PIN_INFO } from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

const createRouteReducer = (
  state: State = initialState,
  action: Action,
): State => {
  switch (action.type) {
    case SAVE_PIN_INFO:
      console.log(action.payload);
      return state;
    default:
      return state;
  }
};

export default createRouteReducer;
