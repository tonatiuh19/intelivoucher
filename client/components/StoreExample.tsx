import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTrips, setSearchQuery } from "../store/slices/tripsSlice";
import { addToCart } from "../store/slices/checkoutSlice";
import {
  selectFilteredTrips,
  selectTripsLoading,
  selectCartItemCount,
} from "../store/selectors";

/**
 * Example component demonstrating Redux store usage
 * This shows the Angular-like pattern with actions, effects, and selectors
 */
export function StoreExample() {
  const dispatch = useAppDispatch();

  // Using selectors to get state (like Angular services)
  const trips = useAppSelector(selectFilteredTrips);
  const loading = useAppSelector(selectTripsLoading);
  const cartCount = useAppSelector(selectCartItemCount);

  // Effect to load data on mount (like Angular ngOnInit)
  useEffect(() => {
    dispatch(fetchTrips({ category: "Football" }));
  }, [dispatch]);

  // Action handlers (like Angular component methods)
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleAddToCart = (trip: any) => {
    dispatch(
      addToCart({
        trip,
        quantity: 1,
        zone: "General",
        transportation: "none",
        jerseySelections: [],
      }),
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Store Management Example</h2>

      {/* Cart indicator */}
      <div className="mb-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Cart Items: {cartCount}
        </span>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trips..."
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading trips...</p>
        </div>
      )}

      {/* Trips list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
            <p className="text-gray-600 mb-1">{trip.location}</p>
            <p className="text-gray-600 mb-1">{trip.date}</p>
            <p className="font-bold text-xl mb-3">${trip.price}</p>

            <button
              onClick={() => handleAddToCart(trip)}
              disabled={trip.soldOut}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                trip.soldOut
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {trip.soldOut ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && trips.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No trips found matching your search.</p>
        </div>
      )}
    </div>
  );
}
