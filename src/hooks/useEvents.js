import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/actions/eventsActions';
import mainEventImage from '../assets/img/main_event.jpeg';
/**
 * Custom hook to fetch and manage events data
 * @param {Object} options - Optional parameters
 * @param {String} options.category - Filter events by category
 * @param {String} options.query - Search query
 * @param {Boolean} options.featured - Filter only featured events
 * @param {String} options.sortBy - Sort events by field
 * @returns {Object} Events data, loading state, and error
 */
export const useEvents = (options = {}) => {
  const dispatch = useDispatch();
  const { events: storeEvents, loading: storeLoading, error: storeError } = useSelector(state => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  // Transform API events to match frontend format
  const transformEvent = useCallback((apiEvent) => ({
    id: apiEvent.eventID,
    eventID: apiEvent.eventID,
    title: apiEvent.name,
    name: apiEvent.name,
    image: mainEventImage, // Use default image for now
    date: apiEvent.date_Start,
    startDate: apiEvent.date_Start,
    endDate: apiEvent.date_End,
    time: new Date(apiEvent.date_Start).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    description: apiEvent.description,
    longDescription: apiEvent.description,
    price: apiEvent.price || 0,
    category: apiEvent.cateID,
    cateID: apiEvent.cateID,
    status: apiEvent.status,
    slot: apiEvent.slot,
    capacity: apiEvent.slot || 0,
    soldCount: 0, // Not provided by API
    isFeatured: false, // Not provided by API
    rating: 4.5, // Default rating
    location: "Chưa cập nhật", // Not provided by API
    address: "Chưa cập nhật", // Not provided by API
    organizer: "Chưa cập nhật", // Not provided by API
    tickets: [
      { 
        id: 1, 
        name: "Vé thường", 
        price: apiEvent.price || 0, 
        available: true, 
        description: "Vé tham gia sự kiện" 
      }
    ]
  }), []);

  // Get unique categories from events
  useEffect(() => {
    if (storeEvents && storeEvents.length > 0) {
      const transformedEvents = storeEvents.map(transformEvent);
      const uniqueCategories = ['all', ...new Set(transformedEvents.map(event => event.category))];
      setCategories(uniqueCategories);
    }
  }, [storeEvents, transformEvent]);

  // Transform and filter events based on options
  useEffect(() => {
    if (storeEvents && storeEvents.length > 0) {
      let transformedEvents = storeEvents.map(transformEvent);
      
      // Apply filters from options
      if (options.category && options.category !== 'all') {
        transformedEvents = transformedEvents.filter(
          event => event.category === options.category || event.cateID === options.category
        );
      }
      
      if (options.query) {
        const query = options.query.toLowerCase();
        transformedEvents = transformedEvents.filter(
          event => 
            event.title.toLowerCase().includes(query) || 
            event.description.toLowerCase().includes(query) ||
            event.name.toLowerCase().includes(query)
        );
      }
      
      if (options.featured) {
        transformedEvents = transformedEvents.filter(event => event.isFeatured);
      }
      
      // Apply sorting
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'newest':
            transformedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
          case 'price-low':
            transformedEvents.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            transformedEvents.sort((a, b) => b.price - a.price);
            break;
          case 'popularity':
            transformedEvents.sort((a, b) => b.soldCount - a.soldCount);
            break;
          default:
            break;
        }
      }
      
      setFilteredEvents(transformedEvents);
    } else {
      setFilteredEvents([]);
    }
  }, [storeEvents, options.category, options.query, options.featured, options.sortBy, transformEvent]);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  /**
   * Get a single event by ID
   * @param {number|string} id - The event ID
   * @returns {Object|null} The event object or null if not found
   */
  const getEventById = useCallback((id) => {
    if (!storeEvents || storeEvents.length === 0) return null;
    const apiEvent = storeEvents.find(event => event.eventID === String(id) || event.eventID === Number(id));
    return apiEvent ? transformEvent(apiEvent) : null;
  }, [storeEvents, transformEvent]);

  /**
   * Get related events for a given event
   * @param {number|string} eventId - The current event ID
   * @param {number} limit - Maximum number of related events to return
   * @returns {Array} Array of related event objects
   */
  const getRelatedEvents = (eventId, limit = 3) => {
    const currentEvent = getEventById(eventId);
    if (!currentEvent || !storeEvents) return [];
    
    return storeEvents
      .filter(event => 
        event.eventID !== String(eventId) && 
        event.eventID !== Number(eventId) &&
        event.cateID === currentEvent.cateID
      )
      .map(transformEvent)
      .slice(0, limit);
  };

  return { 
    events: filteredEvents, 
    loading: storeLoading, 
    error: storeError, 
    categories,
    getEventById,
    getRelatedEvents
  };
};