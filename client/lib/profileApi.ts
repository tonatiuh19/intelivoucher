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

// Types for profile API responses based on PHP structure
export interface ApiUserProfile {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  country: string;
  is_under_age: boolean;
  is_authenticated: boolean;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserInfoResponse {
  success: boolean;
  user: ApiUserProfile;
}

export interface UpdateUserRequest {
  user_id: number;
  email: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  country: string;
  language_preference?: string;
  is_authenticated?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  user: ApiUserProfile;
}

/**
 * Get user information by user ID
 */
export const getUserInfoById = async (
  userId: number,
): Promise<ApiUserProfile> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.GET_USER_INFO_BY_ID, {
      user_id: userId,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to get user information");
    }

    return response.data.user as ApiUserProfile;
  } catch (error) {
    console.error("Error getting user info by ID:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Failed to retrieve user information");
  }
};

/**
 * Update user information
 */
export const updateUser = async (
  userData: UpdateUserRequest,
): Promise<ApiUserProfile> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_USER, userData);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update user");
    }

    return response.data.user as ApiUserProfile;
  } catch (error) {
    console.error("Error updating user:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Failed to update user information");
  }
};

/**
 * Transform API user profile to application user format
 */
export const transformApiUserProfileToAppUser = (apiUser: ApiUserProfile) => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name,
    phone: apiUser.phone,
    birthdate: apiUser.date_of_birth,
    country: apiUser.country,
    isUnderAge: apiUser.is_under_age,
    isAuthenticated: apiUser.is_authenticated,
    languagePreference: apiUser.language_preference as SupportedLanguage,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
};

/**
 * Transform application user to API update request format
 */
export const transformAppUserToApiUpdateRequest = (user: {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  birthdate: string;
  country: string;
  languagePreference?: SupportedLanguage;
}): UpdateUserRequest => {
  return {
    user_id: user.id,
    email: user.email,
    full_name: user.fullName,
    phone: user.phone,
    date_of_birth: user.birthdate,
    country: user.country,
    language_preference: user.languagePreference,
  };
};
