import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { authReducer, singleProjectReducer, allProjectsReducer } from "./";

const store = configureStore({
  reducer: {
    auth: authReducer,
    singleProject: singleProjectReducer,
    allProjects: allProjectsReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
