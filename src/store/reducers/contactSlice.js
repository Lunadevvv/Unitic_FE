import { createSlice } from '@reduxjs/toolkit';
import {
  sendContactMessage,
  subscribeNewsletter,
  getContactInfo,
  getFAQ,
  reportIssue,
} from '../actions/contactActions';

// Initial state
const initialState = {
  contactInfo: null,
  faq: [],
  loading: false,
  error: null,
  messageSuccess: false,
  subscriptionSuccess: false,
  reportSuccess: false,
};

// Contact slice
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.messageSuccess = false;
      state.subscriptionSuccess = false;
      state.reportSuccess = false;
    },
    resetContactState: (state) => {
      state.error = null;
      state.messageSuccess = false;
      state.subscriptionSuccess = false;
      state.reportSuccess = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send contact message
      .addCase(sendContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messageSuccess = false;
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.loading = false;
        state.messageSuccess = true;
        state.error = null;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messageSuccess = false;
      })
      // Subscribe newsletter
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscriptionSuccess = false;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.subscriptionSuccess = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.subscriptionSuccess = false;
      })
      // Get contact info
      .addCase(getContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
        state.error = null;
      })
      .addCase(getContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get FAQ
      .addCase(getFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faq = action.payload;
        state.error = null;
      })
      .addCase(getFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Report issue
      .addCase(reportIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reportSuccess = false;
      })
      .addCase(reportIssue.fulfilled, (state) => {
        state.loading = false;
        state.reportSuccess = true;
        state.error = null;
      })
      .addCase(reportIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reportSuccess = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetContactState,
} = contactSlice.actions;

export default contactSlice.reducer;