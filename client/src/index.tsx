import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import MapTest from './pages/map-test/map-test';
import MemoryRoad from "./pages/MemoryRoad";

// redux
import { Provider } from "react-redux";
import store from "./redux/store/index";

ReactDOM.render(
  <Provider store={store}>
    <MemoryRoad />
  </Provider>,
  document.getElementById("root")
);
