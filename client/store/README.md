# Redux Store Management System

This project now includes a comprehensive Redux store management system similar to Angular's NgRx pattern, featuring actions, effects (async thunks), reducers, selectors, and strongly-typed state management.

## Architecture Overview

### 🏗️ Store Structure

```
client/store/
├── index.ts              # Store configuration and types
├── rootReducer.ts        # Combines all feature reducers
├── hooks.ts              # Typed hooks for React components
├── slices/               # Feature slices (actions + reducers)
│   ├── tripsSlice.ts     # Trips management
│   ├── userSlice.ts      # User authentication & profile
│   └── checkoutSlice.ts  # Shopping cart & payments
└── selectors/            # Memoized state selectors
    ├── index.ts          # Export all selectors
    ├── tripsSelectors.ts # Trip-related computations
    ├── userSelectors.ts  # User-related computations
    └── checkoutSelectors.ts # Checkout-related computations
```

## 🚀 Quick Start

### 1. Using the Store in Components

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTrips, setSearchQuery } from '@/store/slices/tripsSlice';
import { selectFilteredTrips, selectTripsLoading } from '@/store/selectors';

function TripsComponent() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectFilteredTrips);
  const loading = useAppSelector(selectTripsLoading);

  // Dispatch async action (effect)
  const loadTrips = () => {
    dispatch(fetchTrips({ category: 'Football' }));
  };

  // Dispatch synchronous action
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {trips.map(trip => (
        <div key={trip.id}>{trip.title}</div>
      ))}
    </div>
  );
}
```

### 2. Store Features

## 📊 State Slices

### Trips Slice

**State**: Trip listings, filters, search, selected trip
**Actions**:

- `setSearchQuery(query)` - Update search query
- `setFilters(filters)` - Apply filtering options
- `selectTrip(trip)` - Set selected trip
- `clearFilters()` - Reset all filters

**Effects (Async Thunks)**:

- `fetchTrips(params?)` - Load trips from API
- `fetchTripById(tripId)` - Load specific trip details

**Key Selectors**:

- `selectFilteredTrips` - Trips matching current filters
- `selectTrendingTrips` - Trending trips only
- `selectTripsByCategory` - Trips grouped by category

### User Slice

**State**: Authentication, profile, purchases, favorites
**Actions**:

- `logout()` - Clear user session
- `addToFavorites(tripId)` - Add trip to favorites
- `updatePreferences(prefs)` - Update user preferences

**Effects**:

- `loginUser(credentials)` - Authenticate user
- `fetchUserPurchases(userId)` - Load purchase history
- `updateUserProfile(data)` - Update profile information

**Key Selectors**:

- `selectIsAuthenticated` - Check if user is logged in
- `selectUpcomingTrips` - Future confirmed trips
- `selectTotalSpent` - Total money spent

### Checkout Slice

**State**: Cart items, payment details, customer info, totals
**Actions**:

- `addToCart(item)` - Add trip to cart
- `updateQuantity({tripId, quantity})` - Change item quantity
- `setPaymentMethod(method)` - Select payment option
- `updateCustomerDetails(details)` - Set customer info

**Effects**:

- `validatePromoCode(code)` - Check promo code validity
- `processPayment(data)` - Handle payment processing

**Key Selectors**:

- `selectCartItemCount` - Total items in cart
- `selectCanProceedToPayment` - Validation check
- `selectCartTotal` - Final cart total

## 🎯 Usage Patterns

### Handling Loading States

```typescript
import { useAppLoading, useAppErrors } from '@/store/hooks';

function AppWrapper() {
  const isLoading = useAppLoading(); // Global loading state
  const errors = useAppErrors(); // All error states

  if (errors.hasErrors) {
    return <ErrorBoundary errors={errors} />;
  }

  return isLoading ? <LoadingSpinner /> : <App />;
}
```

### Complex State Selection

```typescript
import { selectTripById, selectIsTripFavorited } from "@/store/selectors";

function TripDetails({ tripId }: { tripId: string }) {
  // Memoized selectors with parameters
  const trip = useAppSelector((state) => selectTripById(tripId)(state));
  const isFavorited = useAppSelector((state) =>
    selectIsTripFavorited(tripId)(state),
  );

  // Rest of component...
}
```

### Handling Side Effects

```typescript
import { useEffect } from "react";
import { fetchTrips } from "@/store/slices/tripsSlice";

function TripsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Async thunk automatically handles loading/error states
    dispatch(fetchTrips())
      .unwrap() // Get the resolved value
      .then((trips) => {
        console.log("Trips loaded:", trips);
      })
      .catch((error) => {
        console.error("Failed to load trips:", error);
      });
  }, [dispatch]);
}
```

## 🔧 Advanced Features

### Persistence

The store automatically persists trips, user, and checkout state to localStorage. State is restored on app reload.

### Type Safety

- All actions, state, and selectors are fully typed
- Custom hooks provide type-safe access to store
- Async thunks include proper error handling types

### Performance

- Selectors use `createSelector` for memoization
- Only components using changed state will re-render
- Redux DevTools integration for debugging

### Middleware

- Redux Persist for state persistence
- Redux DevTools (development only)
- Serializable check with persist action exceptions

## 🎨 Extending the Store

### Adding a New Feature Slice

1. **Create the slice file**:

```typescript
// store/slices/newFeatureSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const newFeatureSlice = createSlice({
  name: "newFeature",
  initialState: {
    /* ... */
  },
  reducers: {
    /* synchronous actions */
  },
  extraReducers: (builder) => {
    /* async thunk handlers */
  },
});
```

2. **Add to root reducer**:

```typescript
// store/rootReducer.ts
import { newFeatureSlice } from "./slices/newFeatureSlice";

export const rootReducer = combineReducers({
  // existing slices...
  newFeature: newFeatureSlice.reducer,
});
```

3. **Create selectors**:

```typescript
// store/selectors/newFeatureSelectors.ts
export const selectNewFeatureState = (state: RootState) => state.newFeature;
```

4. **Export everything**:

```typescript
// store/selectors/index.ts
export * from "./newFeatureSelectors";
```

This store management system provides a scalable, type-safe, and performant foundation for managing application state, similar to Angular's NgRx but optimized for React.
