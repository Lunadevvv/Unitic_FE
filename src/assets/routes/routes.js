import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/signIn/SignIn";
import SignUp from "../pages/signUp/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
]);
