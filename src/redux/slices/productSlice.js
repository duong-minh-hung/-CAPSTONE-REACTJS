
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://apistore.cybersoft.edu.vn";

// Lấy danh sách sản phẩm
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${API_URL}/api/Product`);
      return result.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Lấy chi tiết sản phẩm theo ID
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${API_URL}/api/Product/getbyid?id=${id}`
      );

      return result.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    productDetail: null,
    loading: false,
    error: null,
    detailLoading: false,
    detailError: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi tải sản phẩm";
      })

      .addCase(getProductById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.productDetail = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.productDetail = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError =
          action.payload || "Lỗi tải chi tiết sản phẩm";
      });
  },
});

export default productSlice.reducer;
