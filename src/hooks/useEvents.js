import { useState, useEffect, useMemo } from 'react';
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Mock data for development - would be replaced by API call
  const mockEvents = useMemo(() => [
    {
      id: 1,
      title: "Đêm nhạc Techno Galaxy",
      image: mainEventImage,
      date: "2023-12-15T19:00:00",
      endDate: "2023-12-15T23:00:00",
      time: "19:00",
      location: "Nhà hát Hòa Bình",
      address: "30 Đường Hoà Bình, Phường 5, Quận 11, TP HCM",
      description: "Đắm chìm trong không gian âm nhạc điện tử đỉnh cao với các DJ hàng đầu Việt Nam.",
      longDescription: "Đêm nhạc Techno Galaxy là sự kiện âm nhạc điện tử quy tụ những tên tuổi DJ hàng đầu Việt Nam và quốc tế. Khán giả sẽ được đắm chìm trong không gian âm nhạc sôi động với hệ thống âm thanh, ánh sáng hiện đại bậc nhất hiện nay.",
      price: 450000,
      category: "Âm nhạc",
      organizer: "Galaxy Entertainment",
      capacity: 2000,
      soldCount: 1500,
      isFeatured: true,
      rating: 4.8,
      tickets: [
        { id: 1, name: "Vé thường", price: 450000, available: true, description: "Vé vào cửa thường" },
        { id: 2, name: "Vé VIP", price: 850000, available: true, description: "Khu vực VIP với view tốt nhất" },
        { id: 3, name: "Vé VVIP", price: 1200000, available: false, description: "Khu vực VVIP với dịch vụ đồ uống" },
      ]
    },
    {
      id: 2,
      title: "Workshop Thiết kế UX/UI cho người mới bắt đầu",
      image: mainEventImage,
      date: "2023-12-20T09:00:00",
      endDate: "2023-12-20T16:00:00",
      time: "09:00",
      location: "Dreamplex Coworking Space",
      address: "195 Điện Biên Phủ, Phường 15, Bình Thạnh, TP HCM",
      description: "Workshop thực hành dành cho người mới bắt đầu học thiết kế UX/UI với các chuyên gia hàng đầu.",
      longDescription: "Workshop Thiết kế UX/UI cho người mới bắt đầu là chương trình đào tạo thực hành dành cho những ai muốn tìm hiểu và phát triển kỹ năng thiết kế trải nghiệm người dùng. Khóa học được hướng dẫn bởi các chuyên gia UX/UI với nhiều năm kinh nghiệm trong ngành.",
      price: 1200000,
      category: "Giáo dục",
      organizer: "UX Vietnam",
      capacity: 50,
      soldCount: 35,
      isFeatured: false,
      rating: 4.7,
      tickets: [
        { id: 4, name: "Vé cá nhân", price: 1200000, available: true, description: "Vé tham dự workshop cho 1 người" },
        { id: 5, name: "Vé nhóm (3 người)", price: 3000000, available: true, description: "Giảm giá khi đăng ký nhóm 3 người" },
      ]
    },
    {
      id: 3,
      title: "Triển lãm Nghệ thuật Đương đại Việt Nam",
      image: mainEventImage,
      date: "2023-12-10T10:00:00",
      endDate: "2023-12-25T19:00:00",
      time: "10:00 - 19:00",
      location: "Bảo tàng Mỹ thuật TP.HCM",
      address: "97A Phó Đức Chính, Phường Nguyễn Thái Bình, Quận 1, TP HCM",
      description: "Triển lãm quy tụ các tác phẩm nghệ thuật đương đại nổi bật của các nghệ sĩ trẻ Việt Nam.",
      longDescription: "Triển lãm Nghệ thuật Đương đại Việt Nam là sự kiện thường niên quy tụ những tác phẩm nghệ thuật tiêu biểu của các nghệ sĩ trẻ tài năng trong nước. Triển lãm năm nay có chủ đề 'Nhịp đập Đô thị' khám phá cuộc sống đô thị hiện đại qua góc nhìn nghệ thuật.",
      price: 120000,
      category: "Nghệ thuật",
      organizer: "Hội Mỹ thuật Việt Nam",
      capacity: 1000,
      soldCount: 450,
      isFeatured: true,
      rating: 4.6,
      tickets: [
        { id: 6, name: "Vé người lớn", price: 120000, available: true, description: "Vé vào cửa cho người lớn" },
        { id: 7, name: "Vé sinh viên", price: 60000, available: true, description: "Dành cho sinh viên có thẻ sinh viên" },
        { id: 8, name: "Vé trẻ em", price: 40000, available: true, description: "Dành cho trẻ em dưới 12 tuổi" },
      ]
    },
    {
      id: 4,
      title: "Hội chợ Công nghệ TechFest 2023",
      image: mainEventImage,
      date: "2023-11-30T08:00:00",
      endDate: "2023-12-02T17:00:00",
      time: "08:00 - 17:00",
      location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC)",
      address: "799 Nguyễn Văn Linh, Tân Phú, Quận 7, TP HCM",
      description: "Sự kiện công nghệ lớn nhất năm với sự tham gia của các doanh nghiệp công nghệ hàng đầu.",
      longDescription: "Hội chợ Công nghệ TechFest 2023 là sự kiện thường niên lớn nhất trong lĩnh vực công nghệ tại Việt Nam. Sự kiện quy tụ hàng trăm doanh nghiệp công nghệ trong và ngoài nước, giới thiệu những sản phẩm, giải pháp công nghệ mới nhất. Đây cũng là cơ hội để các startup gặp gỡ nhà đầu tư tiềm năng.",
      price: 200000,
      category: "Công nghệ",
      organizer: "Hiệp hội Phần mềm Việt Nam (VINASA)",
      capacity: 5000,
      soldCount: 4200,
      isFeatured: true,
      rating: 4.5,
      tickets: [
        { id: 9, name: "Vé 1 ngày", price: 200000, available: true, description: "Vé tham dự 1 ngày bất kỳ" },
        { id: 10, name: "Vé trọn gói", price: 500000, available: true, description: "Vé tham dự tất cả các ngày" },
        { id: 11, name: "Vé VIP", price: 1000000, available: false, description: "Vé tham dự tất cả các ngày kèm quyền lợi VIP" },
      ]
    },
    {
      id: 5,
      title: "Cuộc thi Marathon TP.HCM 2023",
      image: mainEventImage,
      date: "2023-12-10T04:30:00",
      endDate: "2023-12-10T11:00:00",
      time: "04:30",
      location: "Công viên Bến Nhà Rồng",
      address: "Đường Tôn Đức Thắng, Quận 1, TP HCM",
      description: "Giải chạy marathon thường niên với nhiều cự ly phù hợp cho mọi đối tượng tham gia.",
      longDescription: "Cuộc thi Marathon TP.HCM 2023 là sự kiện thể thao thường niên thu hút hàng nghìn vận động viên chuyên nghiệp và không chuyên. Giải đấu có các cự ly 5km, 10km, bán marathon 21km và marathon 42km, phù hợp với mọi đối tượng và thể lực.",
      price: 850000,
      category: "Thể thao",
      organizer: "Sở Văn hóa và Thể thao TP.HCM",
      capacity: 10000,
      soldCount: 8500,
      isFeatured: false,
      rating: 4.9,
      tickets: [
        { id: 12, name: "Cự ly 5km", price: 350000, available: true, description: "Vé tham gia chạy cự ly 5km" },
        { id: 13, name: "Cự ly 10km", price: 550000, available: true, description: "Vé tham gia chạy cự ly 10km" },
        { id: 14, name: "Cự ly 21km", price: 850000, available: true, description: "Vé tham gia chạy bán marathon 21km" },
        { id: 15, name: "Cự ly 42km", price: 1200000, available: false, description: "Vé tham gia chạy marathon 42km" },
      ]
    },
    {
      id: 6,
      title: "Festival Ẩm thực Đường phố Việt Nam",
      image: mainEventImage,
      date: "2023-12-22T15:00:00",
      endDate: "2023-12-24T22:00:00",
      time: "15:00 - 22:00",
      location: "Công viên Lê Văn Tám",
      address: "Công viên Lê Văn Tám, Quận 1, TP HCM",
      description: "Khám phá nền ẩm thực đường phố đa dạng của Việt Nam với hơn 100 gian hàng từ khắp các vùng miền.",
      longDescription: "Festival Ẩm thực Đường phố Việt Nam là sự kiện văn hóa ẩm thực quy mô lớn, giới thiệu những món ăn đặc sản đường phố từ ba miền Bắc - Trung - Nam. Sự kiện có hơn 100 gian hàng ẩm thực, cùng các hoạt động biểu diễn văn nghệ dân gian, workshop nấu ăn cùng đầu bếp nổi tiếng.",
      price: 100000,
      category: "Ẩm thực",
      organizer: "Hiệp hội Văn hóa Ẩm thực Việt Nam",
      capacity: 5000,
      soldCount: 2800,
      isFeatured: true,
      rating: 4.7,
      tickets: [
        { id: 16, name: "Vé vào cửa", price: 100000, available: true, description: "Vé vào cửa tham quan" },
        { id: 17, name: "Combo vé + voucher", price: 300000, available: true, description: "Vé vào cửa + voucher ăn uống trị giá 200.000đ" },
      ]
    }
  ], []);

  // Get unique categories from events
  useEffect(() => {
    if (events.length > 0) {
      const uniqueCategories = ['all', ...new Set(events.map(event => event.category))];
      setCategories(uniqueCategories);
    }
  }, [events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/events');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          let filteredEvents = [...mockEvents];
          
          // Apply filters from options
          if (options.category && options.category !== 'all') {
            filteredEvents = filteredEvents.filter(
              event => event.category === options.category
            );
          }
          
          if (options.query) {
            const query = options.query.toLowerCase();
            filteredEvents = filteredEvents.filter(
              event => 
                event.title.toLowerCase().includes(query) || 
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query)
            );
          }
          
          if (options.featured) {
            filteredEvents = filteredEvents.filter(event => event.isFeatured);
          }
          
          // Apply sorting
          if (options.sortBy) {
            switch (options.sortBy) {
              case 'newest':
                filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
              case 'price-low':
                filteredEvents.sort((a, b) => a.price - b.price);
                break;
              case 'price-high':
                filteredEvents.sort((a, b) => b.price - a.price);
                break;
              case 'popularity':
                filteredEvents.sort((a, b) => b.soldCount - a.soldCount);
                break;
              default:
                break;
            }
          }
          
          setEvents(filteredEvents);
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu sự kiện');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, [options.category, options.query, options.featured, options.sortBy, mockEvents]);

  /**
   * Get a single event by ID
   * @param {number|string} id - The event ID
   * @returns {Object|null} The event object or null if not found
   */
  const getEventById = (id) => {
    return mockEvents.find(event => event.id === Number(id)) || null;
  };

  /**
   * Get related events for a given event
   * @param {number|string} eventId - The current event ID
   * @param {number} limit - Maximum number of related events to return
   * @returns {Array} Array of related event objects
   */
  const getRelatedEvents = (eventId, limit = 3) => {
    const currentEvent = getEventById(eventId);
    if (!currentEvent) return [];
    
    return mockEvents
      .filter(event => 
        event.id !== Number(eventId) && 
        event.category === currentEvent.category
      )
      .slice(0, limit);
  };

  return { 
    events, 
    loading, 
    error, 
    categories,
    getEventById,
    getRelatedEvents
  };
};