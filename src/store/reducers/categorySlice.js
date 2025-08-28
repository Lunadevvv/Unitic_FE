import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchCategoryById,
  fetchDisableCategories,
  addCategory,
  updateCategory,
  switchCategoryStatus,
  deleteCategory,
} from '../actions/categoryActions';

// Initial state
const initialState = {
  categories: [],
  disabledCategories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// Category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch disabled categories
      .addCase(fetchDisableCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisableCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.disabledCategories = action.payload;
        state.error = null;
      })
      .addCase(fetchDisableCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload);
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Switch category status
      .addCase(switchCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchCategoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        state.error = null;
      })
      .addCase(switchCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentCategory,
  clearCurrentCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
