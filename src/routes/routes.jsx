import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/signIn/SignIn";
import SignUp from "../pages/signUp/SignUp";
import HomePage from "../pages/HomePage";
import AdminPage from "../pages/Admin/AdminPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import EventManagementPage from "../pages/Admin/EventManagementPage";
import OrderManagementPage from "../pages/Admin/OrderManagementPage";
import TicketManagementPage from "../pages/Admin/TicketManagementPage";
import ReportsPage from "../pages/Admin/ReportsPage";
import SurveyManagementPage from "../pages/Admin/SurveyManagementPage";
import EventCategoryPage from "../pages/Event/EventCategoryPage";
import EventDetailsPage from "../pages/Event/EventDetailsPage";
import CheckoutPage from "../pages/Event/CheckoutPage";
import EventCheckInPage from "../pages/Event/EventCheckInPage";
import MyTicketsPage from "../pages/User/MyTicketsPage";
import MyEventsPage from "../pages/User/MyEventsPage";
import UserProfilePage from "../pages/User/UserProfilePage";
import UserWalletPage from "../pages/User/UserWalletPage";
import TicketPassPage from "../pages/User/TicketPassPage";
import PaymentSuccessPage from "../pages/Payment/PaymentSuccessPage";
import PaymentFailPage from "../pages/Payment/PaymentFailPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import SettingsPage from "../pages/SettingsPage";
import HelpPage from "../pages/HelpPage";
import TestCartPage from "../pages/TestCartPage";
import TestAPIPage from "../pages/TestAPIPage";
import OrganizationRegisterEventPage from "../pages/Organization/OrganizationRegisterEventPage";
import OrganizationEventList from "../pages/Organization/OrganizationEventList";
import BTCEventManagementPage from "../pages/BTC/BTCEventManagementPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { ROLES } from "../utils/rolePermissions";
import BookingSuccessPage from "../pages/Payment/BookingSuccessPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/test-cart",
    element: <TestCartPage />,
  },
  {
    path: "/test-api",
    element: <TestAPIPage />,
  },
  {
    path: "/organization/events",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}>
        <OrganizationEventList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/organization/events/register",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
        <OrganizationRegisterEventPage />
      </ProtectedRoute>
    ),
  },  
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.STAFF]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR, ROLES.STAFF]}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
        <UserManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/events",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
        <EventManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <OrderManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/tickets",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
        <TicketManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/surveys",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <SurveyManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events",
    element: <EventCategoryPage />
  },
  {
    path: "/events/:detailid",
    element: <EventDetailsPage />
  },
  {
    path: "/events/:eventId/checkin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
        <EventCheckInPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout/:detailid",
    element: <CheckoutPage />
  },
  {
    path: "/my-tickets",
    element: <MyTicketsPage />
  },
  {
    path: "/my-events", 
    element: <MyEventsPage />
  },
  {
    path: "/profile",
    element: <UserProfilePage />
  },
  {
    path: "/wallet",
    element: <UserWalletPage />
  },
  {
    path: "/tickets/:ticketId",
    element: <TicketPassPage />
  },
  {
    path: "/btc/events/:eventId",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}>
        <BTCEventManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/btc/events/:eventId/checkin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
        <EventCheckInPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/settings",
    element: <SettingsPage />
  },
  {
    path: "/help",
    element: <HelpPage />
  },
  {
    path: "/payment/success",
    element: <BookingSuccessPage  />
  },
  {
    path: "/payment/failure",
    element: <PaymentFailPage />
  },
  {
    path: "/wallet/payment/success",
    element: <PaymentSuccessPage />
  },
  {
    path: "/wallet/payment/failure",
    element: <PaymentFailPage />
  },
  {
    path: "/user/wallet",
    element: <UserWalletPage />
  },
  {
    path: "/user/ticket-pass",
    element: <TicketPassPage />
  }
]);

