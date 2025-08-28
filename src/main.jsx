import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/index.js'
import { ConfigProvider } from 'antd'
import locale from 'antd/locale/vi_VN'
import 'dayjs/locale/vi'
import App from './App.jsx'
import { CartProvider } from './hooks/useCart.jsx'
import './index.css'

import './assets/scss/HomePage.scss'
import './assets/scss/DashboardPage.scss'
import './assets/scss/UserManagementPage.scss'
import './assets/scss/EventManagementPage.scss'
import './assets/scss/OrderManagementPage.scss'
import './assets/scss/TicketManagementPage.scss'
import './assets/scss/ReportsPage.scss'
import './assets/scss/AdminLayout.scss'
import './assets/scss/CheckoutPage.scss'
import './assets/scss/OrganizationRegisterEventPage.scss'
import './assets/scss/OrganizationEventList.scss'
import './assets/scss/OrganizationEventForm.scss'
import './assets/scss/EventPreview.scss'
import './assets/scss/AppHeader.scss'
import './assets/scss/AppFooter.scss'
import './assets/scss/MainLayout.scss'
import './assets/scss/SurveyManagementPage.scss'
import './assets/scss/EventCheckInPage.scss'
import './assets/scss/UserWalletPage.scss'
import './assets/scss/TicketPassPage.scss'
import './assets/scss/BTCEventManagementPage.scss'
import './assets/scss/PublicLayout.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ConfigProvider locale={locale}>
          <CartProvider>
            <App />
          </CartProvider>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
