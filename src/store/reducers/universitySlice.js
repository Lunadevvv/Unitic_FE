import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUniversities,
  fetchUniversityById,
  addUniversity,
  updateUniversity,
  deleteUniversity,
} from '../actions/universityActions';

// Initial state
const initialState = {
  universities: [],
  currentUniversity: null,
  loading: false,
  error: null,
};

// University slice
const universitySlice = createSlice({
  name: 'university',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUniversity: (state, action) => {
      state.currentUniversity = action.payload;
    },
    clearCurrentUniversity: (state) => {
      state.currentUniversity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch universities
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = action.payload;
        state.error = null;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch university by ID
      .addCase(fetchUniversityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUniversity = action.payload;
        state.error = null;
      })
      .addCase(fetchUniversityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add university
      .addCase(addUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.universities.push(action.payload);
        state.error = null;
      })
      .addCase(addUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update university
      .addCase(updateUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUniversity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.universities.findIndex(
          (uni) => uni.id === action.payload.id
        );
        if (index !== -1) {
          state.universities[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete university
      .addCase(deleteUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.universities = state.universities.filter(
          (uni) => uni.id !== action.meta.arg
        );
        state.error = null;
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentUniversity, clearCurrentUniversity } = universitySlice.actions;
export default universitySlice.reducer;
