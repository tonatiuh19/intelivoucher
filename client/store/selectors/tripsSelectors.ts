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
    return trips.filter((trip) => {
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
      const price = parseFloat(trip.price);
      const matchesPrice =
        price >= filters.priceRange[0] && price <= filters.priceRange[1];

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

  trips.forEach((trip) => {
    if (!categories[trip.category]) {
      categories[trip.category] = [];
    }
    categories[trip.category].push(trip);
  });

  return categories;
});

export const selectTrendingTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip.trending),
);

export const selectAvailableTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => !trip.soldOut),
);

export const selectPresaleTrips = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip.isPresale),
);

export const selectTripById = (tripId: string) =>
  createSelector([selectTrips], (trips) =>
    trips.find((trip) => trip.id === tripId),
  );

export const selectTripsWithTransportation = createSelector(
  [selectTrips],
  (trips) => trips.filter((trip) => trip.includesTransportation),
);

export const selectTripsAcceptingUnderAge = createSelector(
  [selectTrips],
  (trips) => trips.filter((trip) => trip.acceptsUnderAge),
);

export const selectTripsWithJerseys = createSelector([selectTrips], (trips) =>
  trips.filter((trip) => trip.jerseyAddonAvailable),
);
