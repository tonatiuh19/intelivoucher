import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Custom typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook for getting the loading state from multiple slices
export const useAppLoading = () => {
  const tripsLoading = useAppSelector((state) => state.trips.loading);
  const userLoading = useAppSelector((state) => state.user.loading);
  const checkoutLoading = useAppSelector((state) => state.checkout.loading);

  return tripsLoading || userLoading || checkoutLoading;
};

// Hook for getting errors from all slices
export const useAppErrors = () => {
  const tripsError = useAppSelector((state) => state.trips.error);
  const userError = useAppSelector((state) => state.user.error);
  const checkoutError = useAppSelector((state) => state.checkout.error);

  return {
    trips: tripsError,
    user: userError,
    checkout: checkoutError,
    hasErrors: !!(tripsError || userError || checkoutError),
  };
};
