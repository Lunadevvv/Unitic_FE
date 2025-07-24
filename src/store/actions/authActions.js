// Auth API Actions
import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services/api";
import Cookies from "js-cookie";

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("UniTic/auth/login", {
        Email: credentials.Email,
        Password: credentials.Password,
      });
      const data = response.data;
      // Store token in cookies and localStorage
      Cookies.set("ACCESS_TOKEN", data.token);
      localStorage.setItem("token", data.token);
      
      // Fetch user profile after successful login
      try {
        const profileResponse = await BASE_URL.get("api/profile");
        const userProfile = profileResponse.data;
        localStorage.setItem("user", JSON.stringify(userProfile));
        return { token: data.token, message: data.message, user: userProfile };
      } catch {
        // If profile fetch fails, still return success with token
        return { token: data.token, message: data.message };
      }
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("Unitic/Auth/register", {
        mssv: userData.mssv,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        universityName: userData.universityName,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Register role (e.g., for admin, student, teacher)
export const registerRole = createAsyncThunk(
  "auth/registerRole",
  async ({ role, userData }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post(`Unitic/auth/register/${role}`, {
        mssv: userData.mssv,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        universityName: userData.universityName,
        phoneNumber: userData.phoneNumber,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    try {
      // Always try to call the logout API
      await BASE_URL.post("UniTic/auth/logout");
    } catch {
      // Ignore API errors, proceed to clear local data
    }
    // Remove token from cookies and user from localStorage
    Cookies.remove("ACCESS_TOKEN");
    localStorage.removeItem("user");
    return true;
  }
);

// Refresh token (not used)
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Update token in localStorage
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Verify email (not used)
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Email verification failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("unitic/auth/forgot-password", {
        Email: email,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Password reset request failed";
      return rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ newPassword }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("unitic/auth/reset-password", {
        NewPassword: newPassword,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      return rejectWithValue(message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.post("UniTic/auth/change-password", {
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });
      const data = response.data;
      return data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Password change failed";
      return rejectWithValue(message);
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("api/profile");
      const userProfile = response.data;
      localStorage.setItem("user", JSON.stringify(userProfile));
      return userProfile;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user profile";
      return rejectWithValue(message);
    }
  }
);

// Fetch universities
export const fetchUniversities = createAsyncThunk(
  "auth/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("Unitic/University");
      return response.data;
    } catch (error) {
      let message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch universities";
      return rejectWithValue(message);
    }
  }
);
