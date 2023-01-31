import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getFilesAsync = createAsyncThunk(
  "getFiles",
  async ({ projectId, availableFiles }) => {
    try {
      const rawData = {};
      for (const name in availableFiles) {
        const file = availableFiles[name];
        const filePath = file.filePath;
        const { data } = await axios.get("/api/audiofiles/", {
          params: { projectId, filePath },
        });
        rawData[name] = data;
      }
      return rawData;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFileAsync = createAsyncThunk(
  "getFile",
  async ({ projectId, filePath }) => {
    try {
      const { data } = await axios.get("/api/audiofiles/", {
        params: { projectId, filePath },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addFileAsync = createAsyncThunk("addFile", async (formData) => {
  try {
    const { data } = await axios.post("/api/audiofiles/", formData);
    return data;
  } catch (error) {
    console.error(error);
  }
});

export const deleteFileAsync = createAsyncThunk("deleteFile", async (id) => {
  try {
    await axios.delete(`/api/audiofiles/${id}`);
  } catch (error) {
    console.error(error);
  }
});

export const fetchSingleProjectAsync = createAsyncThunk(
  "singleProject",
  async ({ projectId }) => {
    try {
      const { data } = await axios.get(`/api/projects/${projectId}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createSectionAsync = createAsyncThunk(
  "createSection",
  async (payload) => {
    try {
      const { data } = await axios.post("/api/sections/", payload);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const singleProjectSlice = createSlice({
  name: "singleProject",
  initialState: {
    id: null,
    name: null,
    type: null,
    sectionDuration: null,
    sections: [],
    availableFiles: {}, // de-duped, key is file.name
    audioRawFiles: {}, // de-duped, key is file.name
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleProjectAsync.fulfilled, (state, action) => {
      const { id, name, type, sections, sectionDuration } = action.payload;

      const availableFiles = {};
      sections.forEach((section) => {
        section.files.forEach((file) => {
          if (!Object.keys(availableFiles).includes(file.name)) {
            availableFiles[file.name] = file;
          }
        });
      });

      state.id = id;
      state.name = name;
      state.type = type;
      state.sections = sections.sort(
        (a, b) => a.sectionNumber - b.sectionNumber
      );
      state.sectionDuration = sectionDuration;
      state.availableFiles = availableFiles;
    });
    builder.addCase(getFilesAsync.fulfilled, (state, action) => {
      state.audioRawFiles = action.payload;
    });
    builder.addCase(createSectionAsync.fulfilled, (state, action) => {
      state.sections.push(action.payload);
    });
  },
});

export default singleProjectSlice.reducer;
