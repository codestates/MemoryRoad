import { createStore } from 'redux';
import rootReducer from './../reducer/index';
// 아직 logger나 thunk 같은 미들웨어는 필요없나요 ..?
// 일단은 redux devTools 로 만족합니다 .. (https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ko)

const store = createStore(rootReducer);

export default store;
