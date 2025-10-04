// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
};

// API endpoints
export const API_ENDPOINTS = {
  VALIDATE_USER: `${API_CONFIG.BASE_URL}/validateUserByEmail.php`,
  INSERT_USER: `${API_CONFIG.BASE_URL}/insertUser.php`,
  SEND_CODE: `${API_CONFIG.BASE_URL}/sendCodeByMail.php`,
  VALIDATE_CODE: `${API_CONFIG.BASE_URL}/validateSessionCode.php`,
} as const;
