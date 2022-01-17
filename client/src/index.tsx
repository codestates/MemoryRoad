import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MemoryRoad from './pages/memoryRoad';
import CreatePinMap from './pages/createPinMap/createPinMap';
// import SaveRouteModal from './modals/saveRouteModal/saveRouteModal';

// redux
import { Provider } from 'react-redux';
import store from './redux/store/index';
// reudx-persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
export const persistor = persistStore(store); // { manualPersist: true } -> redux-persist를 바로 시작하지 않을 수도 있습니다.

// redux-persist 사용하면 로딩이 꽤 걸리기때문에 loading중에 띄울 창을 필요로 한다 ... 하

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MemoryRoad />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
