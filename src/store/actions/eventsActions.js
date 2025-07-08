// Events API Actions
import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";

// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("Unitic/Event");
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch events";
      return rejectWithValue(message);
    }
  }
);

// Fetch event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get(`Unitic/Event/${eventId}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Event not found";
      return rejectWithValue(message);
    }
  }
);

// Fetch events by status
export const fetchEventsByStatus = createAsyncThunk(
  "events/fetchEventsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get(`Unitic/event/status/${status}`);
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch events by status";
      return rejectWithValue(message);
    }
  }
);

// Add new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("Unitic/Event", {
        name: eventData.name,
        description: eventData.description,
        date_Start: eventData.date_Start,
        date_End: eventData.date_End,
        price: eventData.price,
        categoryName: eventData.categoryName,
        slot: eventData.slot,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create event";
      return rejectWithValue(message);
    }
  }
);

// Update event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.put(`Unitic/Event/${eventId}`, {
        name: eventData.name,
        description: eventData.description,
        date_Start: eventData.date_Start,
        date_End: eventData.date_End,
        price: eventData.price,
        categoryName: eventData.categoryName,
        slot: eventData.slot
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message = error.response?.data?.message || error.message || 'Failed to update event';
      return rejectWithValue(message);
    }
  }
);

// Update event status
export const updateEventStatus = createAsyncThunk(
  "events/updateEventStatus",
  async ({ eventId, eventData, status }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.put(`Unitic/event/status/${eventId}/${eventData.status}`, {
        Status: status
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message = error.response?.data?.message || error.message || 'Failed to update event';
      return rejectWithValue(message);
    }
  }
);

// Delete event (not used)
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete event");
      }

      return eventId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch events by category (not used)
export const fetchEventsByCategory = createAsyncThunk(
  "events/fetchEventsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/category/${category}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch events by category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch featured events (not used)
export const fetchFeaturedEvents = createAsyncThunk(
  "events/fetchFeaturedEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/events/featured");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch featured events");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch event categories (not used)
export const fetchEventCategories = createAsyncThunk(
  "events/fetchEventCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/events/categories");

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch categories");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search events (not used)
export const searchEvents = createAsyncThunk(
  "events/searchEvents",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/events/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Search failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check-in to event (not used)
export const checkInEvent = createAsyncThunk(
  "events/checkInEvent",
  async ({ eventId, ticketId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ ticketId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Check-in failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch event statistics (not used)
export const fetchEventStatistics = createAsyncThunk(
  "events/fetchEventStatistics",
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/events/${eventId}/statistics`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch event statistics");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
