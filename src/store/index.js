import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import all reducers
import authReducer from './reducers/authSlice';
import eventsReducer from './reducers/eventsSlice';
import cartReducer from './reducers/cartSlice';
import uiReducer from './reducers/uiSlice';
import userReducer from './reducers/userSlice';
import adminReducer from './reducers/adminSlice';

// Persist configurations
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'ui'], // Only persist these slices
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'role'],
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalAmount', 'subtotal', 'discount', 'promoCode'],
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'notifications', 'sidebar'],
};

// Combine reducers with persistence
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  events: eventsReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  user: userReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export default store;
