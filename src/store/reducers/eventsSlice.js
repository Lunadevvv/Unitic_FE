import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventsByCategory,
  fetchFeaturedEvents,
  fetchEventCategories,
  searchEvents,
  checkInEvent,
  fetchEventStatistics,
} from '../actions/eventsActions';

// Initial state
const initialState = {
  events: [],
  currentEvent: null,
  featuredEvents: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    dateRange: null,
    priceRange: [0, 10000000],
    location: '',
  },
  pagination: {
    currentPage: 1,
    pageSize: 12,
    total: 0,
  },
};

// Events slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        dateRange: null,
        priceRange: [0, 10000000],
        location: '',
      };
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFeaturedEvents: (state, action) => {
      state.featuredEvents = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
        state.pagination.total = action.payload.total || action.payload.length;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentEvent = null;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
      })
      // Fetch events by category
      .addCase(fetchEventsByCategory.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      // Fetch featured events
      .addCase(fetchFeaturedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredEvents = action.payload;
      })
      .addCase(fetchFeaturedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Search events
      .addCase(searchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check-in event
      .addCase(checkInEvent.fulfilled, (state, action) => {
        // Update event check-in data if needed
        const event = state.events.find(e => e.id === action.payload.eventId);
        if (event) {
          event.checkedIn = true;
        }
      })
      // Fetch event statistics
      .addCase(fetchEventStatistics.fulfilled, (state, action) => {
        if (state.currentEvent) {
          state.currentEvent.statistics = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setCurrentEvent,
  updateFilters,
  clearFilters,
  updatePagination,
  setFeaturedEvents,
  setCategories,
} = eventsSlice.actions;

export default eventsSlice.reducer;
