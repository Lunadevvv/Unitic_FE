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
import PaymentFailurePage from "../pages/Payment/PaymentFailurePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import SettingsPage from "../pages/SettingsPage";
import HelpPage from "../pages/HelpPage";
import TestCartPage from "../pages/TestCartPage";
import OrganizationRegisterEventPage from "../pages/Organization/OrganizationRegisterEventPage";
import OrganizationEventList from "../pages/Organization/OrganizationEventList";
import BTCEventManagementPage from "../pages/BTC/BTCEventManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/test-cart",
    Component: TestCartPage,
  },
  {
    path: "/organization/events",
    Component: OrganizationEventList,
  },
  {
    path: "/organization/events/register",
    Component: OrganizationRegisterEventPage,
  },  
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/admin",
    Component: AdminPage
  },
  {
    path: "/admin/dashboard",
    Component: DashboardPage
  },
  {
    path: "/admin/users",
    Component: UserManagementPage
  },
  {
    path: "/admin/events",
    Component: EventManagementPage
  },
  {
    path: "/admin/orders",
    Component: OrderManagementPage
  },
  {
    path: "/admin/tickets",
    Component: TicketManagementPage
  },
  {
    path: "/admin/reports",
    Component: ReportsPage
  },
  {
    path: "/admin/surveys",
    Component: SurveyManagementPage
  },
  {
    path: "/events",
    Component: EventCategoryPage
  },
  {
    path: "/events/:detailid",
    Component: EventDetailsPage
  },
  {
    path: "/events/:eventId/checkin",
    Component: EventCheckInPage
  },
  {
    path: "/checkout/:detailid",
    Component: CheckoutPage
  },
  {
    path: "/my-tickets",
    Component: MyTicketsPage
  },
  {
    path: "/my-events", 
    Component: MyEventsPage
  },
  {
    path: "/profile",
    Component: UserProfilePage
  },
  {
    path: "/wallet",
    Component: UserWalletPage
  },
  {
    path: "/tickets/:ticketId",
    Component: TicketPassPage
  },
  {
    path: "/btc/events/:eventId",
    Component: BTCEventManagementPage
  },
  {
    path: "/btc/events/:eventId/checkin",
    Component: EventCheckInPage
  },
  {
    path: "/about",
    Component: AboutPage
  },
  {
    path: "/contact",
    Component: ContactPage
  },
  {
    path: "/settings",
    Component: SettingsPage
  },
  {
    path: "/help",
    Component: HelpPage
  },
  {
    path: "/payment/success",
    Component: PaymentSuccessPage
  },
  {
    path: "/payment/failure",
    Component: PaymentFailurePage
  },
  {
    path: "/user/wallet",
    Component: UserWalletPage
  },
  {
    path: "/user/ticket-pass",
    Component: TicketPassPage
  }
]);