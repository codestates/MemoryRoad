import { createStore } from 'redux';
import initialState from '../reducer/initialState';
import persistedReducer from './../reducer/index';
// 아직 logger나 thunk 같은 미들웨어는 필요없나요 ..?
// 일단은 redux devTools 로 만족합니다 .. (https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ko)

const store: any = createStore(
  persistedReducer,
  initialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
