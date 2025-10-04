import axios from "axios";
import { SupportedLanguage } from "@/types";
import { API_CONFIG, API_ENDPOINTS } from "./apiConfig";

// Configure axios instance
const apiClient = axios.create({
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for API responses based on PHP structure
export interface ApiUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth: string;
  is_under_age: number;
  is_authenticated: number;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface ValidateUserResponse {
  exists: boolean;
  user?: ApiUser;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth: string;
  language_preference: string;
  is_under_age?: number;
}

export interface SendCodeRequest {
  user_id: number;
  email: string;
}

export interface ValidateCodeRequest {
  user_id: number;
  code: string;
}

/**
 * Validate if a user exists by email
 */
export const validateUserByEmail = async (
  email: string,
): Promise<ValidateUserResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.VALIDATE_USER, {
      email,
    });

    // PHP returns false if user doesn't exist, user object if exists
    if (response.data === false) {
      return { exists: false };
    }

    return {
      exists: true,
      user: response.data as ApiUser,
    };
  } catch (error) {
    console.error("Error validating user by email:", error);
    throw new Error("Failed to validate user email");
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  userData: CreateUserRequest,
): Promise<ApiUser> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.INSERT_USER, userData);

    if (response.data === false) {
      throw new Error("Failed to create user");
    }

    return response.data as ApiUser;
  } catch (error) {
    console.error("Error creating user:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Failed to create user account");
  }
};

/**
 * Send verification code by email
 */
export const sendVerificationCode = async (
  userId: number,
  email: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.SEND_CODE, {
      user_id: userId,
      email,
    });

    return response.data === true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to send verification code");
  }
};

/**
 * Validate verification code
 */
export const validateVerificationCode = async (
  userId: number,
  code: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.VALIDATE_CODE, {
      user_id: userId,
      code,
    });

    return response.data === true;
  } catch (error) {
    console.error("Error validating verification code:", error);
    throw new Error("Invalid verification code");
  }
};

/**
 * Helper function to transform API user data to app format
 */
export const transformApiUserToAppUser = (apiUser: ApiUser) => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name,
    phone: apiUser.phone || "",
    birthdate: apiUser.date_of_birth,
    isUnderAge: Boolean(apiUser.is_under_age),
    isAuthenticated: Boolean(apiUser.is_authenticated),
    languagePreference: apiUser.language_preference as SupportedLanguage,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
};

/**
 * Helper function to calculate if user is under age based on birthdate
 */
export const calculateIsUnderAge = (birthdate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthdate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 < 18;
  }

  return age < 18;
};
