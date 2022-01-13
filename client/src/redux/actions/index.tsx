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
      startTime: '00:00',
      endTime: '02:00', // 첫 생성때만 시간 고정.
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
  | ReturnType<typeof setUserInfo>;
