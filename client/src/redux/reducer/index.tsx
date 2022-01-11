import { combineReducers } from 'redux';
/* redux-persist 관련 설정 */
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
/* reducer들 불러오기 */
import {
  loginModalReducer,
  signupModalReducer,
  checkingPasswordModalReducer,
  editUserInfoModalReducer,
  withdrawalModalReducer,
} from './modalReducer/ModalReducer';
import createRouteReducer from './createRouteReducer/createRouteReducer';
/* redux-persist config 객체 */
const persistConfig: any = {
  key: 'root',
  storage, // localStorage에 저장합니다 (sessionStorage아닙니다)
  whitelist: [createRouteReducer], // localStorage에 담고싶은 reducer들을 담아주세요
  // blacklist: [] // localStorage에 담고싶지 않은 reducer들을 담아주세요 (참고사항)
  stateReconciler: autoMergeLevel2,
};

/* root reducer */ // any 적용하면 절대 안될것같음 ..
const rootReducer: any = combineReducers({
  loginModalReducer,
  signupModalReducer,
  checkingPasswordModalReducer,
  editUserInfoModalReducer,
  withdrawalModalReducer,
  /* 승연 */
  createRouteReducer,
});

/* redux-persist 환경설정을 변수에 담아 root reducer를 완성합니다 */
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;

export type RootPersistState = ReturnType<typeof persistedReducer>;
export type RootState = {
  loginModalReducer: boolean;
  signupModalReducer: boolean;
  checkingPasswordModalReducer: boolean;
  editUserInfoModalReducer: boolean;
  withdrawalModalReducer: boolean;
  createRouteReducer: object | undefined;
};

/* [ ReturnType 예시 ] - 부가 설명 (지워도 됩니다!)

    declare function f1(): { a: number; b: string; };

    type T1 = ReturnType<typeof f1>;
    --------------------------------
    type T1 = { a: number; b: string; };

    -> rootReducer가 반환하는 값의 타입을 추후에 사용하기 위해 리턴타입을 export 해줍니다
*/
