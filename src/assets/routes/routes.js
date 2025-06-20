import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
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
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
]);
