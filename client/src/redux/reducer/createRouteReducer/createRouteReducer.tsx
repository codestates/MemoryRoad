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
  DELETE_PIN,
  UPDATE_ALL_PINS_TIME,

} from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

function deletePinID(arr: any, targetID: string) {
  arr?.forEach((el: any, idx: number) => {
    if (el['pinID'] === targetID) {
      arr.splice(idx, 1);
      return;
    }
  });
}

function updatePinRanking(updateList: any, updateTarget: any) {
  updateList?.forEach((list: any) => {
    updateTarget?.forEach((target: any) => {
      if (list['pinID'] === target['pinID']) {
        // target['ranking'] = target['ranking'] - 1;
        target['pinID'] = `pin${target['ranking'] - 1}`;
      }
    });
  });
}

function updatePositionName(updateList: any, updateTarget: any) {
  updateList?.forEach((list: any) => {
    updateTarget?.forEach((target: any) => {
      if (list['pinID'] === target['pinID']) {
        const str = target['pinID'];
        const lastStr = str.charAt(str.length - 1);
        target['pinID'] = 'pin' + String(Number(lastStr) - 1);
      }
    });
  });
}

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
      copiedState.mapPinPosition = newPositionedPins;
      return copiedState;
    // 핀 삭제 -> 제일 번거로움. pinID와 ranking 모두 업데이트 해줘야함.
    case DELETE_PIN:
      const pinsArr4 = state?.pins?.slice();
      const filesArr3 = state?.files?.slice();
      const positionArr3 = state?.pinPosition?.slice();
      const mapPosition1 = state?.mapPinPosition?.slice();
      let idxForUpdate = 0;
      mapPosition1?.forEach((el: any, idx: number) => {
        if (el['pinID'] === action.payload) {
          idxForUpdate = idx;
        }
      });
      const pinNamesForUpdate = mapPosition1?.filter((el: any, idx: number) => {
        if (idx >= idxForUpdate) return true;
      });
      console.log(pinNamesForUpdate); // check

      deletePinID(pinsArr4, action.payload);
      deletePinID(filesArr3, action.payload);
      deletePinID(positionArr3, action.payload);
      updatePinRanking(pinNamesForUpdate, pinsArr4);
      updatePinRanking(pinNamesForUpdate, filesArr3);
      updatePositionName(
        pinNamesForUpdate,
        positionArr3,
      ); /* pinPosition은 업데이트 방식이 조금 독특함 */

      copiedState.pins = pinsArr4;
      copiedState.files = filesArr3;
      copiedState.pinPosition = positionArr3;

      return copiedState;
    // 핀 전체 시간 업데이트
    case UPDATE_ALL_PINS_TIME:
      copiedState.route.time = action.payload;
      return copiedState;
    default:
      return state;
  }
};

export default createRouteReducer;
export type CreateRouteReducerType = ReturnType<typeof createRouteReducer>;
