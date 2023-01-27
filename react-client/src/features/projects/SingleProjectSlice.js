import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getFilesAsync = createAsyncThunk(
  "getFiles",
  async ({ filenames }) => {
    try {
      const dataArray = [];
      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const { data } = await axios.get(`/api/audiofiles/${filename}`);
        dataArray.push(data);
      }
      return dataArray;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFileAsync = createAsyncThunk(
  "getFile",
  async ({ filename }) => {
    try {
      const { data } = await axios.get(`/api/audiofiles/${filename}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

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

export const singleProjectSlice = createSlice({
  name: "singleProject",
  initialState: {
    id: null,
    name: null,
    type: null,
    sections: [],
    availableFiles: [],
    audioRawFiles: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleProjectAsync.fulfilled, (state, action) => {
      const { id, name, type, sections } = action.payload;
      const availableFiles = sections.reduce((a, section) => {
        section.files.forEach((file) => {
          if (!a.map((x) => x.name).includes(file.name)) {
            a.push(file);
          }
        });
        return a;
      }, []);
      state.id = id;
      state.name = name;
      state.type = type;
      state.sections = sections;
      state.availableFiles = availableFiles;
    });
    builder.addCase(getFilesAsync.fulfilled, (state, action) => {
      state.audioRawFiles = action.payload;
    });
  },
});

export default singleProjectSlice.reducer;
