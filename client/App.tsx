import "./global.css";
import "./i18n";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { store, persistor } from "./store";
import { LanguageSync } from "./components/LanguageSync";

// Lazy load admin and user pages
const AdminTrips = lazy(() => import("./pages/admin/Trips"));
const UserTrips = lazy(() => import("./pages/user/Trips"));
const LoadingDemo = lazy(() => import("./pages/LoadingDemo"));

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageSync />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/admin/trips"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <AdminTrips />
                  </Suspense>
                }
              />
              <Route
                path="/user/trips"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <UserTrips />
                  </Suspense>
                }
              />
              <Route
                path="/loading-demo"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <LoadingDemo />
                  </Suspense>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
