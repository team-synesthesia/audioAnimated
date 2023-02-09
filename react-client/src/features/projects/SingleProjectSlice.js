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

export const writeFileAsync = createAsyncThunk(
  "writeFile",
  async ({ projectId, filePath, file }) => {
    try {
      const formData = new FormData();
      formData.append("audiofile", file);
      const { data } = await axios.post("/api/audiofiles/", formData, {
        params: { projectId, filePath },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const addFileAsync = createAsyncThunk("addFile", async (formData) => {
  try {
    const { data } = await axios.post("/api/files/", formData);
    return data;
  } catch (error) {
    console.error(error);
  }
});

export const deleteFileAsync = createAsyncThunk(
  "deleteFile",
  async ({ deleteParam, type }) => {
    try {
      await axios.delete("/api/files/", { params: { deleteParam, type } });
      return { deleteParam, type };
    } catch (error) {
      console.error(error);
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

export const updateProjectAsync = createAsyncThunk(
  "updateProject",
  async ({ projectId, updateData }) => {
    try {
      const { data } = await axios.put(
        `/api/projects/${projectId}`,
        updateData
      );
      return data;
    } catch (error) {
      console.error(error);
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

export const deleteSectionAsync = createAsyncThunk(
  "deleteSection",
  async (id) => {
    try {
      await axios.delete(`/api/sections/${id}`);
      return id;
    } catch (error) {
      console.error(error);
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
    graphicsFn: null,
    sections: [],
    availableFiles: {}, // de-duped, key is file.name
    audioRawFiles: {}, // de-duped, key is file.name
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleProjectAsync.fulfilled, (state, action) => {
      const { id, name, type, sections, sectionDuration, graphicsFn } =
        action.payload;

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
      state.sections = sections
        .filter((x) => x.sectionNumber !== 0)
        .sort((a, b) => a.sectionNumber - b.sectionNumber);
      state.sectionDuration = sectionDuration;
      state.availableFiles = availableFiles;
      state.graphicsFn = graphicsFn;
    });
    builder.addCase(getFilesAsync.fulfilled, (state, action) => {
      state.audioRawFiles = action.payload;
    });
    builder.addCase(createSectionAsync.fulfilled, (state, action) => {
      state.sections.push(action.payload);
    });
    builder.addCase(addFileAsync.fulfilled, (state, action) => {
      const newFile = action.payload;
      if (!state.availableFiles[newFile.name])
        state.availableFiles[newFile.name] = newFile;
      for (let section of state.sections) {
        if (section.id === newFile.sectionId) {
          if (!section.files) section.files = [];
          section.files.push(newFile);
          break;
        }
      }
    });
    builder.addCase(deleteFileAsync.fulfilled, (state, action) => {
      const { deleteParam, type } = action.payload;
      if (type === "byName") {
        const fileName = deleteParam;
        delete state.availableFiles[fileName];
        delete state.audioRawFiles[fileName];
        for (let section of state.sections) {
          for (let [i, file] of section.files.entries()) {
            if (file.name === fileName) {
              section.files.splice(i, 1);
            }
          }
        }
      } else if (type === "byId") {
        const fileId = deleteParam;
        for (let section of state.sections) {
          for (let [i, file] of section.files.entries()) {
            if (file.id === fileId) {
              section.files.splice(i, 1);
            }
          }
        }
      }
    });
    builder.addCase(deleteSectionAsync.fulfilled, (state, action) => {
      const sectionId = action.payload;
      for (let [i, section] of state.sections.entries()) {
        if (section.id === sectionId) {
          state.sections.splice(i, 1);
          break;
        }
      }
    });
    builder.addCase(updateProjectAsync.fulfilled, (state, action) => {
      const { name, graphicsFn } = action.payload;
      if (name !== state.name) {
        state.name = name;
      }
      if (graphicsFn !== state.graphicsFn) {
        state.graphicsFn = graphicsFn;
      }
    });
  },
});

export default singleProjectSlice.reducer;
