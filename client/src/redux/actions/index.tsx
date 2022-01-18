/* [ action 예시 ]
 *
 * // 액션 타입을 선언합니다
 * const GET_USER_INFO = 'get/user/userInfo' as const;
 *
 * // 액션 생성함수를 선언합니다
 * export const getUserInfo = (id: number) => ({
 *   type: GET_USER_INFO,
 *   payload: id
 * });

 * // 모든 액션 객체에 대한 타입을 내보냅니다
 * // reducer의 인자(초기상태, 액션) 중 액션 인자의 타입을 정의할 때 쓰입니다 :)
 * export type Action = 
 *   | ReturnType<typeof getUserInfo>;
 */

// 학민
export const LOGIN_MODAL = 'LOGIN_MODAL' as const;
export const SIGNUP_MODAL = 'SIGNUP_MODAL' as const;
export const CHECKING_PASSWORD_MODAL = 'CHECKING_PASSWORD_MODAL' as const;
export const EDIT_USER_INFO_MODAL = 'EDIT_USER_INFO_MODAL' as const;
export const WITHDRAWAL_MODAL = 'WITHDRAWAL_MODAL' as const;
export const SET_USERINFO = 'SET_USERINFO' as const;

export const loginModal = (boolean: boolean) => ({
  type: LOGIN_MODAL,
  payload: boolean,
});
export const signupModal = (boolean: boolean) => ({
  type: SIGNUP_MODAL,
  payload: boolean,
});
export const checkingPasswordModal = (boolean: boolean) => ({
  type: CHECKING_PASSWORD_MODAL,
  payload: boolean,
});
export const editUserInfoModal = (boolean: boolean) => ({
  type: EDIT_USER_INFO_MODAL,
  payload: boolean,
});
export const withdrawalModal = (boolean: boolean) => ({
  type: WITHDRAWAL_MODAL,
  payload: boolean,
});
export const setUserInfo = (
  isLogin: boolean,
  id: number | null,
  email: string | null,
  username: string | null,
  profile: string | null,
  OAuthLogin: string | null,
) => ({
  type: SET_USERINFO,
  payload: {
    isLogin,
    id,
    email,
    username,
    profile,
    OAuthLogin,
  },
});

// 승연
export const SAVE_PIN_INFO = 'SAVE_PIN_INFO' as const;
export const SAVE_PIN_IMAGE_FILES = 'SAVE_PIN_IMAGE_FILES' as const;
export const SAVE_PIN_POSITION = 'SAVE_PIN_POSITION' as const;
export const UPDATE_PIN_TIME = 'UPDATE_PIN_TIME' as const;
export const UPDATE_PIN_RANK = 'UPDATE_PIN_RANK' as const;
export const UPDATE_FILE_RANK = 'UPDATE_FILE_RANK' as const;
export const UPDATE_PIN_POSITION = 'UPDATE_PIN_POSITION' as const;
export const DELETE_PIN = 'DELETE_PIN' as const;
export const UPDATE_ALL_PINS_TIME = 'UPDATE_ALL_PINS_TIME' as const;
/* pin 수정창 */
export const SET_PINS_INFO_FOR_MODIFY = 'SET_PINS_INFO_FOR_MODIFY' as const;
export const SET_PINS_IMAGE_FILES_FOR_MODIFY =
  'SET_PINS_IMAGE_FILES_FOR_MODIFY' as const;
export const SET_PINS_POSITION_FOR_MODIFY =
  'SET_PINS_POSITION_FOR_MODIFY' as const;
export const MODIFY_PIN_TIME = 'MODIFY_PIN_TIME' as const;
export const MODIFY_PIN_RANK = 'MODIFY_PIN_RANK' as const;
export const MODIFY_FILE_RANK = 'MODIFY_FILE_RANK' as const;
export const MODIFY_PIN_POSITION = 'MODIFY_PIN_POSITION' as const;
export const MODIFY_DELETE_PIN = 'MODIFY_DELETE_PIN' as const;
export const MODIFY_ALL_PINS_TIME = 'MODIFY_ALL_PINS_TIME' as const;
export const ADD_PIN_INFO = 'ADD_PIN_INFO' as const;
export const ADD_PIN_IMAGE_FILES = 'ADD_PIN_IMAGE_FILES' as const;
export const ADD_PIN_POSITION = 'ADD_PIN_POSITION' as const;

// 핀 정보 저장 (First)
// 핀 사진 저장 (First)
// 핀 순서 저장 (First)
export const savePinInfo = (
  pinID: string,
  ranking: number,
  locationName: string,
  addresses: any,
) => {
  const { latitude, longitude, lotAddress, roadAddress, ward } = addresses;
  return {
    type: SAVE_PIN_INFO,
    payload: {
      pinID,
      ranking,
      locationName,
      latitude,
      longitude,
      lotAddress,
      roadAddress,
      ward,
      startTime: `0${pinID.slice(3)}:00`,
      endTime: `0${Number(pinID.slice(3)) + 1}:00`, // 첫 생성때만 시간 고정.
    },
  };
};
export const savePinImageFiles = (
  pinID: string,
  ranking: number,
  images: any,
) => ({
  type: SAVE_PIN_IMAGE_FILES,
  payload: {
    pinID,
    ranking,
    images: images,
  },
});
export const savePinPosition = (
  pinID: string,
  locationName: string,
  latlng: Array<number>,
) => ({
  type: SAVE_PIN_POSITION,
  payload: {
    pinID,
    locationName,
    latlng,
  },
});

export const updatePinTime = (arr: any) => ({
  type: UPDATE_PIN_TIME,
  payload: arr,
});
export const updatePinRank = (arr: any) => ({
  type: UPDATE_PIN_RANK,
  payload: arr,
});
export const updateFileRank = (arr: any) => ({
  type: UPDATE_FILE_RANK,
  payload: arr,
});
export const updatePinPosition = (arr: any) => ({
  type: UPDATE_PIN_POSITION,
  payload: arr,
});
export const deletePin = (pinID: string) => ({
  type: DELETE_PIN,
  payload: pinID,
});
export const updateAllpinsTime = (time: number) => ({
  type: UPDATE_ALL_PINS_TIME,
  payload: time,
});
/* pin 수정창 */
export const setPinsInfoForModify = (arr: any) => {
  const copiedData = arr.slice();
  const newData = copiedData.map((pin: any) => {
    const copiedObj = Object.assign({}, pin);
    delete copiedObj.Pictures; // 사진 분리
    return copiedObj;
  });
  // console.log(newData);
  return {
    type: SET_PINS_INFO_FOR_MODIFY,
    payload: newData,
  };
};
export const setPinsImageFilesForModify = (arr: any) => {
  const copiedData = arr.slice();
  const newData = copiedData.map((pin: any) => {
    const { id, ranking, Pictures } = pin;
    return { id, ranking, Pictures, images: null };
  });
  // console.log(newData);
  return {
    type: SET_PINS_IMAGE_FILES_FOR_MODIFY,
    payload: newData,
  };
};
export const setPinsPositionForModify = (arr: any) => {
  const copiedData = arr.slice();
  const newData = copiedData.map((pin: any) => {
    const { id, locationName, latitude, longitude } = pin;
    return { id, locationName, latlng: [latitude, longitude] };
  });
  // console.log(newData);
  return {
    type: SET_PINS_POSITION_FOR_MODIFY,
    payload: newData,
  };
};
/* 각종 수정 이벤트 모음 */
export const modifyPinTime = (arr: any) => ({
  type: MODIFY_PIN_TIME,
  payload: arr,
});
export const modifyPinRank = (arr: any) => ({
  type: MODIFY_PIN_RANK,
  payload: arr,
});
export const modifyFileRank = (arr: any) => ({
  type: MODIFY_FILE_RANK,
  payload: arr,
});
export const modifyPinPosition = (arr: any) => ({
  type: MODIFY_PIN_POSITION,
  paylaod: arr,
});
export const modifyDeletePin = (id: number) => ({
  type: MODIFY_DELETE_PIN,
  payload: id,
});
export const modifyAllPinsTime = (time: number) => ({
  type: MODIFY_ALL_PINS_TIME,
  payload: time,
});
/* 아오 죽겠다 [수정 중 새로 추가] */
export const addPinInfo = (
  id: number,
  ranking: number,
  locationName: string,
  addresses: any,
) => {
  const { latitude, longitude, lotAddress, roadAddress, ward } = addresses;
  return {
    type: ADD_PIN_INFO,
    payload: {
      id,
      ranking,
      locationName,
      latitude,
      longitude,
      lotAddress,
      roadAddress,
      ward,
      startTime: '00:00',
      endTime: '01:00',
    },
  };
};
export const addPinImageFiles = (id: number, ranking: number, images: any) => ({
  type: ADD_PIN_IMAGE_FILES,
  payload: {
    id,
    ranking,
    images,
    Pictures: null, // 어짜피 새로 추가라 기존 데이터 없음.
  },
});
export const addPinPosition = (
  id: number,
  locationName: string,
  latlng: Array<number>,
) => ({
  type: ADD_PIN_POSITION,
  payload: {
    id,
    locationName,
    latlng,
  },
});

//Action type 꼭 명시 부탁드립니다.
export type Action =
  | ReturnType<typeof savePinInfo>
  | ReturnType<typeof savePinImageFiles>
  | ReturnType<typeof savePinPosition>
  | ReturnType<typeof loginModal>
  | ReturnType<typeof signupModal>
  | ReturnType<typeof checkingPasswordModal>
  | ReturnType<typeof editUserInfoModal>
  | ReturnType<typeof withdrawalModal>
  | ReturnType<typeof setUserInfo>
  | ReturnType<typeof updatePinTime>
  | ReturnType<typeof updatePinRank>
  | ReturnType<typeof updateFileRank>
  | ReturnType<typeof updatePinPosition>
  | ReturnType<typeof deletePin>
  | ReturnType<typeof updateAllpinsTime>
  | ReturnType<typeof setPinsInfoForModify>
  | ReturnType<typeof setPinsImageFilesForModify>
  | ReturnType<typeof setPinsPositionForModify>
  | ReturnType<typeof modifyPinTime>
  | ReturnType<typeof modifyPinRank>
  | ReturnType<typeof modifyFileRank>
  | ReturnType<typeof modifyPinPosition>
  | ReturnType<typeof modifyDeletePin>
  | ReturnType<typeof modifyAllPinsTime>
  | ReturnType<typeof addPinInfo>
  | ReturnType<typeof addPinImageFiles>
  | ReturnType<typeof addPinPosition>;
