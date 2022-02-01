import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import MyRouteStore from './pages/myRouteStore/myRouteStore';
import Mypage from './pages/mypage/mypage';

import ModifyPinMap from './pages/modifyPinMap/modifyPinMap';
import MemoryRoad from './pages/memoryRoad/memoryRoad';

import AllRoutesInMap from './pages/mypage/allRoutesInMap';
import CreatePinMap from './pages/createPinMap/createPinMap';
import SearchRoutes from './pages/searchRoutes/searchRoutes';

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
      {/* <BrowserRouter>
        <Routes>
          <Route element={<MemoryRoad />} path="/"></Route>
          <Route element={<Mypage />} path="/Mypage" />
          <Route element={<AllRoutesInMap />} path="/AllRoutesInMap" />
          <Route element={<CreatePinMap />} path="createRoute"></Route>
          <Route element={<MyRouteStore />} path="myRouteStore"></Route>
          <Route
            element={<ModifyPinMap />}
            path="myRouteStore/route/:id"
          ></Route>
          <Route element={<AllRoutesInMap />} path="allRoutesInMap"></Route>
          <Route element={<SearchRoutes />} path="searchRoutes"></Route>
        </Routes>
      </BrowserRouter> */}
      <CreatePinMap />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
