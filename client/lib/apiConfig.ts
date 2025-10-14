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
  GET_ACTIVE_EVENTS: `${API_CONFIG.BASE_URL}/getActiveEvents.php`,
  GET_ACTIVE_EVENTS_BY_ID: `${API_CONFIG.BASE_URL}/getActiveEventsById.php`,
  GET_INFO: `${API_CONFIG.BASE_URL}/getInfo.php`,
  CREATE_RESERVATION: `${API_CONFIG.BASE_URL}/createReservation.php`,
  FETCH_USER_RESERVATIONS: `${API_CONFIG.BASE_URL}/getReservationsByUser.php`,
} as const;
