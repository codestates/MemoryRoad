import { AnyAction, combineReducers, Reducer } from 'redux';
/* redux-persist 관련 설정 */
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
/* reducer들 불러오기 */
import modalReducer from './modalReducer/ModalReducer';
import type { ModalReducerType } from './modalReducer/ModalReducer';
import createRouteReducer from './createRouteReducer/createRouteReducer';
import type { CreateRouteReducerType } from './createRouteReducer/createRouteReducer';
import { PersistPartial } from 'redux-persist/lib/persistReducer';
import { PersistConfig } from 'redux-persist/lib/types';

export interface CombineReducers {
  modalReducer: ModalReducerType;
  createRouteReducer: PersistPartial & CreateRouteReducerType;
}

/* redux-persist config 객체 */
const persistConfig: any = {
  key: 'root',
  storage, // localStorage에 저장합니다 (sessionStorage아닙니다)
  whitelist: ['createRouteReducer'], // localStorage에 담고싶은 reducer들을 담아주세요 아 설마 문자열 때문에 ...?
  blacklist: ['modalReducer', 'createRouteReducer'], // localStorage에 담고싶지 않은 reducer들을 담아주세요 (참고사항)
  stateReconciler: autoMergeLevel2,
};
/* redux-persist createRoute config 객체 */
// const createRoutePersistConfig: any = {
//   key: 'createRoute',
//   storage,
//   blacklist: [
//     'isLoginModal',
//     'isSigninModal',
//     'isCheckingPasswordModal',
//     'isEditUserInfoModal',
//     'iswithdrawalModal',
//   ],
//   stateReconciler: autoMergeLevel2,
// };
// const createRoutePersistReducer = persistReducer(
//   createRoutePersistConfig,
//   createRouteReducer,
// );

export const rootReducer: any = combineReducers({
  // 학민
  modalReducer,
  // 승연
  createRouteReducer,
  // createRoutePersistReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

/* redux-persist 환경설정을 변수에 담아 root reducer를 완성합니다 */
const persistRootReeucer = persistReducer(persistConfig, rootReducer);
export default persistRootReeucer;
export type PersistRootState = ReturnType<typeof persistRootReeucer>;

/* [ ReturnType 예시 ] - 부가 설명 (지워도 됩니다!)

    declare function f1(): { a: number; b: string; };

    type T1 = ReturnType<typeof f1>;
    --------------------------------
    type T1 = { a: number; b: string; };

    -> rootReducer가 반환하는 값의 타입을 추후에 사용하기 위해 리턴타입을 export 해줍니다
*/
