import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProjectsByUserIdAsync = createAsyncThunk(
  "allProjectsByUserId",
  async (userId) => {
    try {
      const { data } = await axios.get("/api/projects/", {
        params: { userId },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const createProjectAsync = createAsyncThunk(
  "createProject",
  async (payload) => {
    try {
      const { data } = await axios.post("/api/projects/", payload);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "deleteProject",
  async (projectId) => {
    try {
      const { data } = await axios.delete(`/api/projects/${projectId}`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const allProjectsSlice = createSlice({
  name: "allProjects",
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectsByUserIdAsync.fulfilled, (state, action) => {
        const stateCopy = [...state];
        const projects = action.payload;
        for (let project of projects) {
          stateCopy.push(project);
        }
        return stateCopy;
      })
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        const stateCopy = [...state];
        stateCopy.push(action.payload);
        return stateCopy;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        const stateCopy = [...state];
        const projectToDeleteId = action.payload;
        for (let [i, project] of stateCopy.entries()) {
          project.id === projectToDeleteId && stateCopy.splice(i, 1);
        }
        return stateCopy;
      });
  },
});
export default allProjectsSlice.reducer;
