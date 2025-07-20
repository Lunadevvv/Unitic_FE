import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("Unitic/Category");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories";
      return rejectWithValue(message);
    }
  }
);

// Fetch category by ID
export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get(`Unitic/Category/${categoryId}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch category";
      return rejectWithValue(message);
    }
  }
);

// fetch disable categories
export const fetchDisableCategories = createAsyncThunk(
  "category/fetchDisableCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("Unitic/Category/Disabled");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch disable categories";
      return rejectWithValue(message);
    }
  }
);

// Add new category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("Unitic/Category", {
        Name: categoryData.name,
        IsDisabled: categoryData.isDisabled,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add category";
      return rejectWithValue(message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.put(`Unitic/Category/${categoryData.id}`, {
        Name: categoryData.name,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update category";
      return rejectWithValue(message);
    }
  }
);

// Switch category status
export const switchCategoryStatus = createAsyncThunk(
  "category/switchCategoryStatus",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.delete(`Unitic/Category/${categoryId}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to switch category status";
      return rejectWithValue(message);
    }
  }
);

// Delete category permanently (if needed)
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      // Note: This might be a different endpoint for permanent deletion
      await BASE_URL.delete(`Unitic/Category/permanent/${categoryId}`);
      return categoryId; // Return the ID for removal from state
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete category";
      return rejectWithValue(message);
    }
  }
);