# Redux Store Documentation

## 📁 **Cấu trúc Store (Updated)**

```
src/store/
├── index.js              # Main store configuration
├── hooks.js              # Custom Redux hooks
├── actions/              # API Actions (Separated)
│   ├── index.js          # Export all actions
│   ├── authActions.js    # Authentication API calls
│   ├── eventsActions.js  # Events API calls
│   ├── cartActions.js    # Cart & Payment API calls
│   ├── userActions.js    # User profile & data API calls
│   └── adminActions.js   # Admin functionality API calls
└── reducers/
    ├── authSlice.js      # Authentication & Authorization
    ├── eventsSlice.js    # Events management
    ├── cartSlice.js      # Shopping cart
    ├── uiSlice.js        # UI state management
    ├── userSlice.js      # User profile & data
    └── adminSlice.js     # Admin functionality
```

## 🔗 **API Actions (Separate Layer)**

### 1. **Auth Actions** (`authActions.js`)
```javascript
// Available Actions
- loginUser(credentials)
- registerUser(userData)
- logoutUser()
- refreshToken()
- verifyEmail(verificationCode)
- forgotPassword(email)
- resetPassword({ token, password })
- changePassword({ currentPassword, newPassword })
```

### 2. **Events Actions** (`eventsActions.js`)
```javascript
// Available Actions
- fetchEvents(params)
- fetchEventById(eventId)
- createEvent(eventData)
- updateEvent({ eventId, eventData })
- deleteEvent(eventId)
- fetchEventsByCategory(category)
- fetchFeaturedEvents()
- fetchEventCategories()
- searchEvents(searchQuery)
- checkInEvent({ eventId, ticketId })
- fetchEventStatistics(eventId)
```

### 3. **Cart Actions** (`cartActions.js`)
```javascript
// Available Actions
- applyPromoCode(promoCode)
- processCheckout(checkoutData)
- processPayment(paymentData)
- verifyPayment(paymentId)
- fetchPaymentMethods()
- calculateShipping(address)
- syncCartWithServer()
- fetchCartFromServer()
```

### 4. **User Actions** (`userActions.js`)
```javascript
// Available Actions
- fetchUserProfile()
- updateUserProfile(profileData)
- uploadAvatar(file)
- fetchUserTickets(params)
- fetchUserEvents(params)
- fetchWalletData()
- topUpWallet(topUpData)
- withdrawFromWallet(withdrawData)
- fetchWalletTransactions(params)
- fetchNotifications(params)
- markNotificationAsRead(notificationId)
- markAllNotificationsAsRead()
- deleteNotification(notificationId)
- updateUserPreferences(preferences)
```

### 5. **Admin Actions** (`adminActions.js`)
```javascript
// Available Actions
- fetchDashboardData()
- fetchAllUsers(params)
- updateUserStatus({ userId, status })
- updateUserRole({ userId, role })
- deleteUser(userId)
- fetchAllOrders(params)
- updateOrderStatus({ orderId, status })
- cancelOrder({ orderId, reason })
- fetchSurveys(params)
- createSurvey(surveyData)
- updateSurvey({ surveyId, surveyData })
- deleteSurvey(surveyId)
- sendSurvey(surveyId)
- fetchSurveyResponses(surveyId)
- fetchSystemSettings()
- updateSystemSettings(settings)
- generateReport(reportConfig)
```

## 🏪 **Store Slices**

### 1. **Auth Slice** (`authSlice.js`)
Quản lý authentication và authorization:

```javascript
// State
{
  user: Object | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null,
  role: 'admin' | 'btc' | 'user' | 'guest'
}

// Actions
- loginUser(credentials)
- registerUser(userData)  
- logoutUser()
- updateProfile(profileData)
- setCredentials({ user, token })
- clearError()
```

### 2. **Events Slice** (`eventsSlice.js`)
Quản lý sự kiện:

```javascript
// State
{
  events: Array,
  currentEvent: Object | null,
  featuredEvents: Array,
  categories: Array,
  loading: boolean,
  error: string | null,
  filters: Object,
  pagination: Object
}

// Actions
- fetchEvents(params)
- fetchEventById(eventId)
- createEvent(eventData)
- updateEvent({ eventId, eventData })
- deleteEvent(eventId)
- fetchEventsByCategory(category)
- updateFilters(filters)
- clearFilters()
```

### 3. **Cart Slice** (`cartSlice.js`)
Quản lý giỏ hàng:

```javascript
// State
{
  items: Array,
  totalAmount: number,
  subtotal: number,
  discount: number,
  discountAmount: number,
  promoCode: string | null,
  loading: boolean,
  error: string | null,
  checkoutStatus: 'idle' | 'processing' | 'success' | 'failed'
}

// Actions
- addToCart(item)
- removeFromCart(itemId)
- updateQuantity({ itemId, quantity })
- updateCartItem({ itemId, updates })
- applyPromoCode(promoCode)
- processCheckout(checkoutData)
- clearCart()
```

### 4. **UI Slice** (`uiSlice.js`)
Quản lý UI state:

```javascript
// State
{
  loading: { global: boolean, page: boolean, component: Object },
  modals: { login: boolean, register: boolean, ... },
  sidebar: { collapsed: boolean, mobileOpen: boolean },
  theme: { mode: string, primaryColor: string },
  notifications: Object,
  search: Object,
  filters: Object,
  breadcrumbs: Array,
  toasts: Array,
  device: Object,
  page: Object
}

// Actions
- setGlobalLoading(boolean)
- openModal(modalName) / closeModal(modalName)
- toggleSidebar() / setSidebarCollapsed(boolean)
- setThemeMode(mode) / setPrimaryColor(color)
- setSearchQuery(query) / addToSearchHistory(query)
- addToast(toast) / removeToast(toastId)
- updateDeviceInfo(width)
```

### 5. **User Slice** (`userSlice.js`)
Quản lý thông tin user:

```javascript
// State
{
  profile: Object | null,
  tickets: Array,
  events: Array,
  wallet: { balance: number, transactions: Array },
  notifications: Array,
  preferences: Object,
  statistics: Object,
  loading: Object,
  error: string | null
}

// Actions
- fetchUserProfile()
- updateUserProfile(profileData)
- fetchUserTickets(params)
- fetchUserEvents(params)
- fetchWalletData()
- topUpWallet(topUpData)
- fetchNotifications(params)
- markNotificationAsRead(notificationId)
```

### 6. **Admin Slice** (`adminSlice.js`)
Quản lý chức năng admin:

```javascript
// State
{
  dashboard: { stats: Object, recentActivities: Array, chartData: Object },
  users: { list: Array, total: number, filters: Object, pagination: Object },
  orders: { list: Array, total: number, filters: Object, pagination: Object },
  surveys: { list: Array, total: number, currentSurvey: Object | null },
  loading: Object,
  error: string | null
}

// Actions
- fetchDashboardData()
- fetchAllUsers(params)
- updateUserStatus({ userId, status })
- deleteUser(userId)
- fetchAllOrders(params)
- updateOrderStatus({ orderId, status })
- fetchSurveys(params)
- createSurvey(surveyData)
- sendSurvey(surveyId)
```

## 🎣 **Custom Hooks** (`hooks.js`)

### Basic Hooks
```javascript
// Basic Redux hooks
const dispatch = useAppDispatch()
const selector = useAppSelector(state => state.slice)

// Slice-specific hooks
const auth = useAuth()
const events = useEvents()
const cart = useCart()
const ui = useUI()
const user = useUser()
```

### Specialized Hooks
```javascript
// Loading states
const isLoading = useIsLoading('events')
const globalLoading = useGlobalLoading()
const pageLoading = usePageLoading()

// Modal management
const { isOpen, openModal, closeModal } = useModal('login')

// Theme management
const { mode, primaryColor, setThemeMode, setPrimaryColor } = useTheme()

// Search functionality
const { query, setQuery, addToHistory } = useSearch()

// User roles
const { role, isAdmin, isBTC, isUser, isGuest } = useUserRole()

// Cart summary
const { itemCount, totalAmount, hasItems } = useCartSummary()

// Device info
const { isMobile, isTablet, isDesktop } = useDevice()

// Error handling
const { hasErrors, authError, eventsError } = useErrors()
```

## 🔧 **Usage Examples (Updated)**

### Import Actions
```javascript
// Import actions from separate files
import { loginUser, logoutUser } from '../store/actions/authActions'
import { fetchEvents, createEvent } from '../store/actions/eventsActions'
import { addToCart, processCheckout } from '../store/actions/cartActions'

// Or import all at once
import * as authActions from '../store/actions/authActions'
import * as eventsActions from '../store/actions/eventsActions'

// Or from index file
import { 
  loginUser, 
  fetchEvents, 
  addToCart 
} from '../store/actions'
```

### Authentication
```javascript
import { useAppDispatch, useAuth } from '../store/hooks'
import { loginUser, logoutUser } from '../store/actions/authActions'

function LoginComponent() {
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAuth()
  
  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials))
  }
  
  const handleLogout = () => {
    dispatch(logoutUser())
  }
}
```

### Events Management
```javascript
import { useAppDispatch, useEvents } from '../store/hooks'
import { fetchEvents, createEvent } from '../store/actions/eventsActions'

function EventsList() {
  const dispatch = useAppDispatch()
  const { events, loading, filters } = useEvents()
  
  useEffect(() => {
    dispatch(fetchEvents(filters))
  }, [filters])
  
  const handleCreateEvent = (eventData) => {
    dispatch(createEvent(eventData))
  }
}
```

### Cart Operations with API
```javascript
import { useAppDispatch, useCart } from '../store/hooks'
import { processCheckout, applyPromoCode } from '../store/actions/cartActions'
import { addToCart } from '../store/reducers/cartSlice' // Local action

function CartPage() {
  const dispatch = useAppDispatch()
  const { items, loading, totalAmount } = useCart()
  
  const handleApplyPromo = (code) => {
    dispatch(applyPromoCode(code)) // API call
  }
  
  const handleCheckout = (paymentData) => {
    dispatch(processCheckout(paymentData)) // API call
  }
  
  const handleAddItem = (item) => {
    dispatch(addToCart(item)) // Local action
  }
}
```

### UI State Management
```javascript
import { useModal, useTheme } from '../store/hooks'

function Header() {
  const { isOpen, openModal, closeModal } = useModal('login')
  const { mode, setThemeMode } = useTheme()
  
  const toggleTheme = () => {
    setThemeMode(mode === 'light' ? 'dark' : 'light')
  }
}
```

## 🔄 **Persistence**

Redux store sử dụng **Redux Persist** để lưu trữ state:

### Persisted Slices:
- ✅ **auth**: user, token, isAuthenticated, role
- ✅ **cart**: items, totalAmount, subtotal, discount, promoCode  
- ✅ **ui**: theme, notifications, sidebar settings

### Non-persisted Slices:
- ❌ **events**: Fetch mới mỗi lần load
- ❌ **user**: Profile data sẽ fetch từ API
- ❌ **admin**: Admin data luôn fresh

## 📱 **Integration với Components**

### Provider Setup (main.jsx):
```javascript
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

<Provider store={store}>
  <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

### Component Usage:
```javascript
// Simple selector
const user = useAppSelector(state => state.auth.user)

// Custom hook
const { isAuthenticated, role } = useAuth()

// Dispatch action
const dispatch = useAppDispatch()
dispatch(loginUser(credentials))
```

## 🏗️ **Architecture Benefits**

### 🎯 **Separation of Concerns**
- ✅ **Actions**: Pure API calls và business logic
- ✅ **Reducers**: State management và data transformation  
- ✅ **Hooks**: Component interface và reusable logic

### 📦 **Modular Structure**
- ✅ **Easy to maintain**: Mỗi file có responsibility rõ ràng
- ✅ **Easy to test**: Actions có thể test riêng biệt
- ✅ **Easy to scale**: Thêm actions mới không ảnh hưởng reducers

### 🔄 **Reusability**
- ✅ **Actions**: Có thể reuse trong nhiều components
- ✅ **Centralized API**: Tất cả API calls ở một nơi
- ✅ **Type safety**: Easy để thêm TypeScript sau này

### 🚀 **Developer Experience**
- ✅ **Clear imports**: Biết exactly import từ đâu
- ✅ **Better IntelliSense**: IDE có thể suggest tốt hơn
- ✅ **Easier debugging**: Actions và reducers tách biệt

## 🔍 **Migration Guide**

### Trước (Old Way):
```javascript
// Import từ slice
import { loginUser } from '../store/reducers/authSlice'

// Slice chứa cả API calls và state management
const authSlice = createSlice({
  // ... có cả async thunks và reducers
})
```

### Sau (New Way):
```javascript
// Import actions từ file riêng
import { loginUser } from '../store/actions/authActions'

// Hoặc import tất cả
import * as authActions from '../store/actions/authActions'

// Slice chỉ focus vào state management
const authSlice = createSlice({
  // ... chỉ có reducers và sync actions
})
```

## 🔍 **Debugging**

- **Redux DevTools** enabled trong development
- **Persistence debugging** qua browser localStorage
- **Error tracking** qua error states trong slices
- **Loading tracking** qua loading states

## 🚀 **Best Practices (Updated)**

### 📁 **File Organization**
1. **Actions**: Pure API calls - no state mutation
2. **Reducers**: State management - no API calls  
3. **Hooks**: Component interface - reusable selectors
4. **Always use custom hooks** thay vì direct useSelector

### 🔄 **State Management**
5. **Handle loading states** properly trong UI components
6. **Normalize data** trong reducers khi cần
7. **Clear errors** sau khi handle
8. **Persist only necessary data** để tối ưu performance

### 📞 **API Calls**
9. **Use actions for all API calls** - không gọi trực tiếp trong components
10. **Handle errors consistently** trong actions
11. **Return meaningful data** từ API actions
12. **Use proper HTTP status codes** checking

### 🎯 **Development**
13. **Import from specific files** thay vì barrel imports khi có thể
14. **Use TypeScript** nếu project chuyển sang TS trong tương lai
15. **Test actions separately** từ reducers
16. **Keep components pure** - no business logic

---

**🎉 Redux Store với separated Actions architecture đã hoàn thành!**
