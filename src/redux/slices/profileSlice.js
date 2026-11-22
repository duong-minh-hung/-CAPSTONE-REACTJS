
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://apistore.cybersoft.edu.vn";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// Lấy thông tin Profile
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${API_URL}/api/Users/getProfileV2`,
        {},
        { headers: getHeaders() }
      );

      return result.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Không thể tải Profile"
      );
    }
  }
);

// Cập nhật Profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${API_URL}/api/Users/updateProfile`,
        formData,
        { headers: getHeaders() }
      );

      return result.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật thất bại"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",

  initialState: {
    user: null,
    loading: false,
    updating: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
