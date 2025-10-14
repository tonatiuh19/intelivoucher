import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selectors
export const selectEventsState = (state: RootState) => state.events;

// Events selectors
export const selectEvents = createSelector(
  selectEventsState,
  (state) => state.events,
);

export const selectFilteredEvents = createSelector(
  selectEventsState,
  (state) => state.filteredEvents,
);

export const selectSelectedEvent = createSelector(
  selectEventsState,
  (state) => state.selectedEvent,
);

export const selectEventsLoading = createSelector(
  selectEventsState,
  (state) => state.loading,
);

export const selectEventsError = createSelector(
  selectEventsState,
  (state) => state.error,
);

export const selectEventsFilters = createSelector(
  selectEventsState,
  (state) => state.filters,
);

export const selectEventsTotalCount = createSelector(
  selectEventsState,
  (state) => state.totalCount,
);

export const selectEventsCurrentPage = createSelector(
  selectEventsState,
  (state) => state.currentPage,
);

export const selectEventsItemsPerPage = createSelector(
  selectEventsState,
  (state) => state.itemsPerPage,
);

// Paginated events selector
export const selectPaginatedEvents = createSelector(
  [selectFilteredEvents, selectEventsCurrentPage, selectEventsItemsPerPage],
  (filteredEvents, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  },
);

// Total pages selector
export const selectEventsTotalPages = createSelector(
  [selectEventsTotalCount, selectEventsItemsPerPage],
  (totalCount, itemsPerPage) => Math.ceil(totalCount / itemsPerPage),
);

// Categories selector (unique categories from events)
export const selectEventCategories = createSelector(selectEvents, (events) => {
  const categories = events.map((event) => event.category);
  // Remove duplicates based on category id
  return categories.filter(
    (category, index, self) =>
      index === self.findIndex((c) => c.id === category.id),
  );
});

// Trending events selector
export const selectTrendingEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.is_trending === "1"),
);

// Presale events selector
export const selectPresaleEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.is_presale === "1"),
);

// Available events selector (not sold out)
export const selectAvailableEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.is_sold_out !== "1"),
);

// Upcoming events selector (events from today onwards)
export const selectUpcomingEvents = createSelector(selectEvents, (events) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events.filter((event) => new Date(event.event_date) >= today);
});

// Events statistics selector
export const selectEventsStats = createSelector(selectEvents, (events) => ({
  total: events.length,
  trending: events.filter((event) => event.is_trending === "1").length,
  presale: events.filter((event) => event.is_presale === "1").length,
  soldOut: events.filter((event) => event.is_sold_out === "1").length,
  available: events.filter((event) => event.is_sold_out !== "1").length,
  withTransportation: events.filter(
    (event) => event.includes_transportation === "1",
  ).length,
  withJersey: events.filter((event) => event.jersey_addon_available === "1")
    .length,
}));

// Search results count selector
export const selectSearchResultsCount = createSelector(
  [selectFilteredEvents, selectEventsFilters],
  (filteredEvents, filters) => ({
    total: filteredEvents.length,
    hasActiveFilters: !!(
      filters.search ||
      filters.category ||
      filters.trending ||
      filters.presale
    ),
  }),
);
