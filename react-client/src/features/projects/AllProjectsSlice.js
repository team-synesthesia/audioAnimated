import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProjectsByUserIdAsync = createAsyncThunk(
  "allProjectsByUserId",
  async (userId) => {
    try {
      const { data } = await axios.get("/api/projects/", {
        params: { userId },
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const allProjectsSlice = createSlice({
  name: "allProjects",
  initialState: [],
  extraReducers: (builder) => [
    builder.addCase(
      fetchAllProjectsByUserIdAsync.fulfilled,
      (state, action) => {
        return action.payload;
      }
    ),
  ],
});

export default allProjectsSlice.reducer;
