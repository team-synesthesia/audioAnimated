import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { authReducer } from "./";
import singleProjectReducer from "./projects/SingleProjectSlice";

const store = configureStore({
  reducer: { auth: authReducer, singleProject: singleProjectReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
