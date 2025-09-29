import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selectors
export const selectUserState = (state: RootState) => state.user;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserPurchases = (state: RootState) => state.user.purchases;
export const selectUserFavorites = (state: RootState) => state.user.favorites;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Memoized selectors with business logic
export const selectUserPreferences = createSelector(
  [selectUser],
  (user) =>
    user?.preferences || {
      favoriteCategories: [],
      notifications: true,
      language: "en" as const,
    },
);

export const selectPurchasesByStatus = createSelector(
  [selectUserPurchases],
  (purchases) => {
    const byStatus: Record<string, typeof purchases> = {};

    purchases.forEach((purchase) => {
      if (!byStatus[purchase.status]) {
        byStatus[purchase.status] = [];
      }
      byStatus[purchase.status].push(purchase);
    });

    return byStatus;
  },
);

export const selectConfirmedPurchases = createSelector(
  [selectUserPurchases],
  (purchases) =>
    purchases.filter((purchase) => purchase.status === "confirmed"),
);

export const selectRecentPurchases = createSelector(
  [selectUserPurchases],
  (purchases) => {
    const sortedPurchases = [...purchases].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sortedPurchases.slice(0, 5); // Last 5 purchases
  },
);

export const selectTotalSpent = createSelector(
  [selectConfirmedPurchases],
  (confirmedPurchases) =>
    confirmedPurchases.reduce((total, purchase) => total + purchase.total, 0),
);

export const selectPurchaseById = (purchaseId: string) =>
  createSelector([selectUserPurchases], (purchases) =>
    purchases.find((purchase) => purchase.id === purchaseId),
  );

export const selectPurchasesByTrip = (tripId: string) =>
  createSelector([selectUserPurchases], (purchases) =>
    purchases.filter((purchase) => purchase.tripId === tripId),
  );

export const selectIsTripFavorited = (tripId: string) =>
  createSelector([selectUserFavorites], (favorites) =>
    favorites.includes(tripId),
  );

export const selectUpcomingTrips = createSelector(
  [selectConfirmedPurchases],
  (confirmedPurchases) => {
    const now = new Date();
    return confirmedPurchases
      .filter((purchase) => new Date(purchase.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
);

export const selectPastTrips = createSelector(
  [selectConfirmedPurchases],
  (confirmedPurchases) => {
    const now = new Date();
    return confirmedPurchases
      .filter((purchase) => new Date(purchase.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
);
