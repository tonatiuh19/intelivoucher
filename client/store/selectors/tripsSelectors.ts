import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selectors
export const selectTripsState = (state: RootState) => state.trips;
export const selectTrips = (state: RootState) => state.trips.trips;
export const selectSelectedTrip = (state: RootState) =>
  state.trips.selectedTrip;
export const selectTripsLoading = (state: RootState) => state.trips.loading;
export const selectTripsError = (state: RootState) => state.trips.error;
export const selectSearchQuery = (state: RootState) => state.trips.searchQuery;
export const selectFilters = (state: RootState) => state.trips.filters;

// Memoized selectors with business logic
export const selectFilteredTrips = createSelector(
  [selectTrips, selectSearchQuery, selectFilters],
  (trips, searchQuery, filters) => {
    // First, filter out any null or undefined trips
    const validTrips = trips.filter((trip) => trip != null);

    return validTrips.filter((trip) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        !filters.category || trip.category === filters.category;

      // Location filter
      const matchesLocation =
        !filters.location || trip.location.includes(filters.location);

      // Price range filter
      const priceValue = trip.price
        ? parseFloat(trip.price.replace(/[^0-9.-]+/g, ""))
        : 0;
      const matchesPrice =
        !isNaN(priceValue) &&
        priceValue >= filters.priceRange[0] &&
        priceValue <= filters.priceRange[1];

      // Date range filter
      const matchesDate =
        !filters.dateRange[0] ||
        !filters.dateRange[1] ||
        (new Date(trip.date) >= new Date(filters.dateRange[0]) &&
          new Date(trip.date) <= new Date(filters.dateRange[1]));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice &&
        matchesDate
      );
    });
  },
);

export const selectTripsByCategory = createSelector([selectTrips], (trips) => {
  const categories: Record<string, typeof trips> = {};

  // Filter out null trips first
  const validTrips = trips.filter((trip) => trip != null);

  validTrips.forEach((trip) => {
    if (!categories[trip.category]) {
      categories[trip.category] = [];
    }
    categories[trip.category].push(trip);
  });

  return categories;
});

export const selectTrendingTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip != null && trip.trending),
);

export const selectAvailableTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip != null && !trip.soldOut),
);

export const selectPresaleTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip != null && trip.isPresale),
);

export const selectTripById = (tripId: string) =>
  createSelector([selectTrips], (trips) =>
    trips.find((trip) => trip != null && trip.id === tripId),
  );

export const selectTripsWithTransportation = createSelector(
  [selectTrips],
  (trips) =>
    trips.filter((trip) => trip != null && trip.includesTransportation),
);

export const selectTripsAcceptingUnderAge = createSelector(
  [selectTrips],
  (trips) => trips.filter((trip) => trip != null && trip.acceptsUnderAge),
);

export const selectTripsWithJerseys = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip != null && trip.jerseyAddonAvailable),
);
