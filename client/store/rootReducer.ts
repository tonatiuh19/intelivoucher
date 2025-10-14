import { combineReducers } from "@reduxjs/toolkit";
import { tripsSlice } from "./slices/tripsSlice";
import { userSlice } from "./slices/userSlice";
import { checkoutSlice } from "./slices/checkoutSlice";
import { languageSlice } from "./slices/languageSlice";
import authReducer from "./slices/authSlice";
import paymentKeysReducer from "./slices/paymentKeysSlice";
import reservationReducer from "./slices/reservationSlice";
import profileReducer from "./slices/profileSlice";
import eventsReducer from "./slices/eventsSlice";

// Combine all feature reducers
export const rootReducer = combineReducers({
  trips: tripsSlice.reducer,
  user: userSlice.reducer,
  checkout: checkoutSlice.reducer,
  language: languageSlice.reducer,
  auth: authReducer,
  paymentKeys: paymentKeysReducer,
  reservation: reservationReducer,
  profile: profileReducer,
  events: eventsReducer,
});
