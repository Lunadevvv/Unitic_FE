import { useState, useCallback } from 'react';

/**
 * Custom hook for managing organization events
 */
export const useOrganizationEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate API - Create new event
  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEvent = {
        ...eventData,
        id: Date.now(),
        status: 'pending',
        attendees: 0,
        createdAt: new Date().toISOString()
      };
      
      setEvents(prev => [newEvent, ...prev]);
      return { success: true, data: newEvent };
    } catch (err) {
      setError('Không thể tạo sự kiện. Vui lòng thử lại!');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulate API - Update event
  const updateEvent = useCallback(async (eventId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, ...updateData, updatedAt: new Date().toISOString() }
          : event
      ));
      
      return { success: true };
    } catch (err) {
      setError('Không thể cập nhật sự kiện. Vui lòng thử lại!');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulate API - Delete event
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => prev.filter(event => event.id !== eventId));
      return { success: true };
    } catch (err) {
      setError('Không thể xóa sự kiện. Vui lòng thử lại!');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get event by ID
  const getEventById = useCallback((eventId) => {
    return events.find(event => event.id === parseInt(eventId));
  }, [events]);

  // Get events by status
  const getEventsByStatus = useCallback((status) => {
    return events.filter(event => event.status === status);
  }, [events]);

  // Get event statistics
  const getEventStats = useCallback(() => {
    const total = events.length;
    const approved = events.filter(e => e.status === 'approved').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const rejected = events.filter(e => e.status === 'rejected').length;
    const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);
    
    return {
      total,
      approved,
      pending,
      rejected,
      totalAttendees
    };
  }, [events]);

  // Load events (simulate API call)
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - would be replaced with actual API call
      const mockEvents = [
        {
          id: 1,
          title: 'Workshop UX/UI Design 2024',
          type: 'seminar',
          category: 'Thiết kế',
          startDate: '2024-01-15T09:00:00',
          endDate: '2024-01-15T17:00:00',
          location: 'Tòa nhà FPT, TP.HCM',
          status: 'approved',
          attendees: 45,
          maxAttendees: 50,
          createdAt: '2023-12-20T10:00:00',
          hasTickets: true,
          isPublic: true,
          organizer: 'FPT Software',
          description: 'Workshop thiết kế UX/UI cho người mới bắt đầu',
          imageUrl: '/src/assets/img/demo.jpg'
        },
        {
          id: 2,
          title: 'Meeting Quý 4 - Báo cáo KPI',
          type: 'meeting',
          category: 'Kinh doanh',
          startDate: '2024-01-20T14:00:00',
          endDate: '2024-01-20T16:00:00',
          location: 'Phòng họp A, Tầng 5',
          status: 'pending',
          attendees: 0,
          maxAttendees: 20,
          createdAt: '2023-12-25T15:30:00',
          hasTickets: false,
          isPublic: false,
          organizer: 'ABC Corporation',
          description: 'Họp báo cáo KPI quý 4 và kế hoạch năm mới'
        }
      ];
      
      setEvents(mockEvents);
      return { success: true, data: mockEvents };
    } catch (err) {
      setError('Không thể tải danh sách sự kiện!');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByStatus,
    getEventStats,
    loadEvents,
    setError
  };
};
