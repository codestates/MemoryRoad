import initialState from '../initialState';
import {
  SET_PINS_INFO_FOR_MODIFY,
  SET_PINS_IMAGE_FILES_FOR_MODIFY,
  SET_PINS_POSITION_FOR_MODIFY,
  /* */
  MODIFY_PIN_TIME,
  MODIFY_PIN_RANK,
  MODIFY_FILE_RANK,
  MODIFY_PIN_POSITION,
  MODIFY_DELETE_PIN,
  MODIFY_ALL_PINS_TIME,
  ADD_PIN_INFO,
  ADD_PIN_IMAGE_FILES,
  ADD_PIN_POSITION,
} from '../../actions/index';
import type { State } from '../initialState';
import type { Action } from '../../actions/index';

function deletePinID(arr: any, targetID: number) {
  arr?.forEach((el: any, idx: number) => {
    if (el['id'] === targetID) {
      arr.splice(idx, 1);
      return;
    }
  });
}

function updatePinRanking(updateList: any, updateTarget: any) {
  updateList?.forEach((list: any) => {
    updateTarget?.forEach((target: any) => {
      if (list['id'] === target['id']) {
        target['ranking'] = target['ranking'] - 1;
        target['id'] = target['id'] - 1;
      }
    });
  });
}

function updatePositionName(updateList: any, updateTarget: any) {
  updateList?.forEach((list: any) => {
    updateTarget?.forEach((target: any) => {
      if (list['id'] === target['id']) {
        target['id'] = target['id'] - 1;
      }
    });
  });
}
/* 일단 모르겠고. 테스트 하면서 보자고. */

const modifyRouteReducer = (state: State = initialState, action: Action) => {
  const copiedState = Object.assign({}, state);
  switch (action.type) {
    // 수정창 in 기존 데이터 저장
    case SET_PINS_INFO_FOR_MODIFY:
      action.payload.forEach((pinInfo: any) => {
        copiedState.modifiedPins?.push(pinInfo);
      });
      return copiedState;
    case SET_PINS_IMAGE_FILES_FOR_MODIFY:
      action.payload.forEach((pin: any) => {
        copiedState.modifiedFiles?.push(pin);
      });
      return copiedState;
    case SET_PINS_POSITION_FOR_MODIFY:
      action.payload.forEach((pin: any) => {
        copiedState.modifiedPinPosition?.push(pin);
        copiedState.modifiedMapPinPosition?.push(pin);
      });
      return copiedState;
    // 기존 데이터 변경(수정) 이벤트
    case MODIFY_PIN_TIME:
      const pinsArr = state?.modifiedPins?.slice();
      const newTimePinsArr = pinsArr?.map((el) => {
        action.payload?.forEach((pin: any) => {
          if (el['id'] === pin['id']) {
            el['startTime'] = pin['startTime'];
            el['endTime'] = pin['endTime'];
          }
        });
        return el;
      });
      copiedState.modifiedPins = newTimePinsArr;
      return copiedState;
    case MODIFY_PIN_RANK:
      const pinsArr2 = state?.modifiedPins?.slice();
      const newRankPinsArr = pinsArr2?.map((el) => {
        action.payload.forEach((info: any) => {
          if (info[0] === el.id) {
            el.ranking = info[1];
          }
        });
        return el;
      });
      copiedState.modifiedPins = newRankPinsArr;
      return copiedState;
    case MODIFY_FILE_RANK: // 업데이트 문제없습니다.
      const filesArr = state?.modifiedFiles?.slice();
      const newRankFiles = filesArr?.map((el: any) => {
        action.payload.forEach((info: any) => {
          if (info[0] === el.id) {
            el.ranking = info[1];
          }
        });
        return el;
      });
      copiedState.modifiedFiles = newRankFiles;
      return copiedState;
    case MODIFY_PIN_POSITION:
      const positionArr = state?.modifiedPinPosition?.slice();
      const positionsLength = positionArr?.length;
      const newPositionedPins = new Array(positionsLength).fill({});
      console.log(positionArr, action.paylaod); // test
      positionArr?.forEach((el: any) => {
        action.paylaod.forEach((info: any) => {
          if (info[0] === el.id) {
            const idx = info[1]; // 변경
            newPositionedPins[idx] = el;
          }
        });
      });
      console.log(newPositionedPins); // test
      copiedState.modifiedMapPinPosition = newPositionedPins;
      return copiedState;
    case MODIFY_DELETE_PIN:
      const pinsArr3 = state?.modifiedPins?.slice();
      const filesArr2 = state?.modifiedFiles?.slice();
      const positionArr2 = state?.modifiedPinPosition?.slice();
      const mapPosition = state?.modifiedMapPinPosition?.slice();
      // deletePinID(mapPosition, action.payload);
      console.log(mapPosition);
      // deletePinID(mapPosition, action.payload);
      let idxForUpdate = 0;
      mapPosition?.forEach((el: any, idx: number) => {
        if (el['id'] === action.payload) {
          idxForUpdate = idx;
        }
      });
      const pinNamesForUpdate = mapPosition?.filter((el: any, idx: number) => {
        if (idx >= idxForUpdate) return true;
        else return false;
      });
      console.log(pinNamesForUpdate); // check

      deletePinID(pinsArr3, action.payload);
      deletePinID(filesArr2, action.payload);
      deletePinID(positionArr2, action.payload);
      updatePinRanking(pinNamesForUpdate, pinsArr3);
      updatePinRanking(pinNamesForUpdate, filesArr2);
      updatePositionName(
        pinNamesForUpdate,
        positionArr2,
      ); /* pinPosition은 업데이트 방식이 조금 독특함 */

      copiedState.modifiedPins = pinsArr3;
      copiedState.modifiedFiles = filesArr2;
      copiedState.modifiedPinPosition = positionArr2;

      return copiedState;
    // case MODIFY_ALL_PINS_TIME:
    //   copiedState. -> 아 미춌다 전체 시간쫓는애가 없다 . 아 없오도 되나 ??
    // return copiedState;
    case ADD_PIN_INFO:
      const pinsArr4 = state?.modifiedPins?.slice();
      pinsArr4?.push(action.payload);
      copiedState.modifiedPins = pinsArr4;
      return copiedState;
    case ADD_PIN_IMAGE_FILES:
      const filesArr3 = state?.modifiedFiles?.slice();
      filesArr3?.push(action.payload);
      copiedState.modifiedFiles = filesArr3;
      return copiedState;
    case ADD_PIN_POSITION:
      const positionArr3 = state?.modifiedPinPosition?.slice();
      positionArr3?.push(action.payload);
      copiedState.modifiedPinPosition = positionArr3;
      return copiedState;
    default:
      return state;
  }
};

export default modifyRouteReducer;
export type ModifyRouteReducerType = ReturnType<typeof modifyRouteReducer>;
