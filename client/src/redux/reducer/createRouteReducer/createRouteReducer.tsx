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
  UPDATE_PIN_TIME,
  UPDATE_PIN_RANK,
  UPDATE_FILE_RANK,
  UPDATE_PIN_POSITION,
} from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

const createRouteReducer = (
  state: State = initialState,
  action: Action,
): State => {
  const copiedState = Object.assign({}, state);
  switch (action.type) {
    // 핀 정보 저장
    case SAVE_PIN_INFO:
      const pinsArr1 = state?.pins?.slice();
      pinsArr1?.push(action.payload);
      copiedState.pins = pinsArr1;
      return copiedState;
    // 친 이미지 저장
    case SAVE_PIN_IMAGE_FILES:
      const filesArr1 = state?.files?.slice();
      filesArr1?.push(action.payload);
      copiedState.files = filesArr1;
      return copiedState;
    // 핀 순서 저장
    case SAVE_PIN_POSITION:
      const positionArr1 = state?.pinPosition?.slice();
      positionArr1?.push(action.payload);
      copiedState.pinPosition = positionArr1;
      return copiedState;
    // 핀 시간 변경 업데이트
    case UPDATE_PIN_TIME:
      const pinsArr2 = state?.pins?.slice();
      const newTimePinsArr = pinsArr2?.map((el) => {
        action.payload?.forEach((pin: any) => {
          if (el['pinID'] === pin['pinID']) {
            el['startTime'] = pin['startTime'];
            el['endTime'] = pin['endTime'];
          }
        });
        return el;
      });
      copiedState.pins = newTimePinsArr;
      return copiedState;
    // 핀 순서 변경 업데이트
    case UPDATE_PIN_RANK:
      const pinsArr3 = state?.pins?.slice();
      const newRankPinsArr = pinsArr3?.map((el) => {
        action.payload.forEach((info: any) => {
          if (info[0] === el.pinID) {
            el.ranking = info[1];
          }
        });
        return el;
      });
      copiedState.pins = newRankPinsArr;
      return copiedState;
    // 파일 순서 변경 업데이트
    case UPDATE_FILE_RANK:
      const filesArr2 = state?.files?.slice();
      const newRankFiles = filesArr2?.map((el: any) => {
        action.payload.forEach((info: any) => {
          if (info[0] === el.pinID) {
            el.ranking = info[1];
          }
        });
        return el;
      });
      copiedState.files = newRankFiles;
      return copiedState;
    // 핀 순서 변경 (지도상) 업데이트 -> 진짜 배열 변경하는겁니다.
    case UPDATE_PIN_POSITION:
      const positionArr2 = state?.pinPosition?.slice();
      const positionsLength = positionArr2?.length;
      const newPositionedPins = new Array(positionsLength).fill({});
      positionArr2?.forEach((el: any) => {
        action.paylaod.forEach((info: any) => {
          if (info[0] === el.pinID) {
            const idx = info[1];
            newPositionedPins[idx] = el;
          }
        });
      });
      console.log(newPositionedPins);
      copiedState.mapPinPosition = newPositionedPins;
      return copiedState;
    default:
      return state;
  }
};

export default createRouteReducer;
export type CreateRouteReducerType = ReturnType<typeof createRouteReducer>;
