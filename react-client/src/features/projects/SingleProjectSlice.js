import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSingleProjectAsync.fulfilled, (state, action) => {
      const { id, name, type, sections } = action.payload;
      const availableFiles = sections.reduce((a, section) => {
        section.files.forEach((file) => {
          if (!a.map((x) => x.id).includes(file.id)) {
            a.push(file);
          }
        });
        return a;
      }, []);

      return { id, name, type, sections, availableFiles };
    });
  },
});

export default singleProjectSlice.reducer;
