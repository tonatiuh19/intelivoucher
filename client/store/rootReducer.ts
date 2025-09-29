import { combineReducers } from "@reduxjs/toolkit";
import { tripsSlice } from "./slices/tripsSlice";
import { userSlice } from "./slices/userSlice";
import { checkoutSlice } from "./slices/checkoutSlice";

// Combine all feature reducers
export const rootReducer = combineReducers({
  trips: tripsSlice.reducer,
  user: userSlice.reducer,
  checkout: checkoutSlice.reducer,
});
