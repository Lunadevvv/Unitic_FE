import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, fetchEvents, updateEvent, deleteEvent } from '../store/actions/eventsActions';

/**
 * Custom hook for managing organization events
 */
export const useOrganizationEvents = () => {
  const dispatch = useDispatch();
  const { events: storeEvents, loading: storeLoading, error: storeError } = useSelector(state => state.events);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new event using real API
  const createOrganizationEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(createEvent(eventData));
      if (createEvent.fulfilled.match(result)) {
        // Refresh events list after successful creation
        dispatch(fetchEvents());
        return { success: true, data: result.payload };
      } else {
        setError(result.payload || 'Failed to create event');
        return { success: false, error: result.payload || 'Failed to create event' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Không thể tạo sự kiện. Vui lòng thử lại!';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Update event using real API
  const updateOrganizationEvent = useCallback(async (eventId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(updateEvent({ eventId, eventData: updateData }));
      if (updateEvent.fulfilled.match(result)) {
        // Refresh events list after successful update
        dispatch(fetchEvents());
        return { success: true, data: result.payload };
      } else {
        setError(result.payload || 'Failed to update event');
        return { success: false, error: result.payload || 'Failed to update event' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Không thể cập nhật sự kiện. Vui lòng thử lại!';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Delete event using real API
  const deleteOrganizationEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(deleteEvent(eventId));
      if (deleteEvent.fulfilled.match(result)) {
        // Refresh events list after successful deletion
        dispatch(fetchEvents());
        return { success: true };
      } else {
        setError(result.payload || 'Failed to delete event');
        return { success: false, error: result.payload || 'Failed to delete event' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Không thể xóa sự kiện. Vui lòng thử lại!';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Load organization events
  const loadEvents = useCallback(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Get events filtered for organization (you might want to add organization-specific filtering)
  const getOrganizationEvents = useCallback(() => {
    return storeEvents || [];
  }, [storeEvents]);

  // Get event by ID from store
  const getEventById = useCallback((eventId) => {
    if (!storeEvents) return null;
    return storeEvents.find(event => event.eventID === String(eventId) || event.eventID === Number(eventId));
  }, [storeEvents]);

  // Get events by status
  const getEventsByStatus = useCallback((status) => {
    if (!storeEvents) return [];
    return storeEvents.filter(event => event.status === status);
  }, [storeEvents]);

  // Get event statistics
  const getEventStats = useCallback(() => {
    const events = storeEvents || [];
    const total = events.length;
    const approved = events.filter(e => e.status === 'approved').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const rejected = events.filter(e => e.status === 'rejected').length;
    const totalSlots = events.reduce((sum, e) => sum + (e.slot || 0), 0);
    
    return {
      total,
      approved,
      pending,
      rejected,
      totalSlots
    };
  }, [storeEvents]);

  return {
    events: getOrganizationEvents(),
    loading: storeLoading || loading,
    error: storeError || error,
    createEvent: createOrganizationEvent,
    updateEvent: updateOrganizationEvent,
    deleteEvent: deleteOrganizationEvent,
    getEventById,
    getEventsByStatus,
    getEventStats,
    loadEvents,
    clearError: () => setError(null)
  };
};
