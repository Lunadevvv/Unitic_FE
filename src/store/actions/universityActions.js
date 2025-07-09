import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Fetch all universities
export const fetchUniversities = createAsyncThunk(
  "university/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("Unitic/University");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch universities";
      return rejectWithValue(message);
    }
  }
);

// Fetch university by ID
export const fetchUniversityById = createAsyncThunk(
  "university/fetchUniversityById",
  async (universityId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get(`Unitic/University/${universityId}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch university";
      return rejectWithValue(message);
    }
  }
);

// Add new university
export const addUniversity = createAsyncThunk(
  "university/addUniversity",
  async (universityData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("Unitic/University", {
        Name: universityData.name,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add university";
      return rejectWithValue(message);
    }
  }
);

// Update university
export const updateUniversity = createAsyncThunk(
  "university/updateUniversity",
  async (universityData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.put(`Unitic/University/${universityData.id}`, {
        Name: universityData.name,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update university";
      return rejectWithValue(message);
    }
  }
);

// Delete university
export const deleteUniversity = createAsyncThunk(
  "university/deleteUniversity",
  async (universityId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.delete(`Unitic/University/${universityId}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete university";
      return rejectWithValue(message);
    }
  }
);