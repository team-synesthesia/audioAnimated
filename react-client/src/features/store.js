import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { authReducer, singleProjectReducer } from "./";

const store = configureStore({
  reducer: { auth: authReducer, singleProject: singleProjectReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
