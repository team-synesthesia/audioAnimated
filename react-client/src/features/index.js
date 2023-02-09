export {
  default as authReducer,
  me,
  authenticate,
  logout,
} from "./auth/authSlice";

export {
  default as singleProjectReducer,
  createSectionAsync,
  deleteSectionAsync,
  getFilesAsync,
  fetchSingleProjectAsync,
  addFileAsync,
  deleteFileAsync,
  writeFileAsync,
  updateProjectAsync
} from "./projects/SingleProjectSlice";

export {
  default as allProjectsReducer,
  createProjectAsync,
  fetchAllProjectsByUserIdAsync,
  deleteProjectAsync,
} from "./projects/AllProjectsSlice";

export {
  default as playAllReducer,
  setSectionToPlay,
  setTryToStart,
  setPlayAllStarted,
  alreadyPlaying,
  setFinished,
  setGraphicFN
} from "./projects/playAllSlice";
