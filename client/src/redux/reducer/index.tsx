import { combineReducers } from "redux";
// import reducer1 from 'reducer';

const rootReducer = combineReducers({
    /* reducer1, */
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

/* [ ReturnType 예시 ] - 부가 설명 (지워도 됩니다!)

    declare function f1(): { a: number; b: string; };

    type T1 = ReturnType<typeof f1>;
    --------------------------------
    type T1 = { a: number; b: string; };

    -> rootReducer가 반환하는 값의 타입을 추후에 사용하기 위해 리턴타입을 export 해줍니다
*/