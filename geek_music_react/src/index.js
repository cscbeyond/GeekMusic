import React from "react";
import ReactDOM from "react-dom";
import "./App.less";
import App from "./App";
import { BrowserRouter, HashRouter,historyRouter } from "react-router-dom";
import httpRequest from "./utils/HttpRequest";
import store, { persistor } from "./store/index";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Route } from "react-router-dom";
// import createHistory from "history/createHashHistory";
// const history = createHistory();
window.httpRequest = httpRequest;

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <App /> */}
        <Route path="/" component={App}></Route>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
