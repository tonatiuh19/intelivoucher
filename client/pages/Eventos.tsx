import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Filter,
  Search,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Ticket,
  Music,
  Trophy,
  Camera,
  Users,
  Zap,
  Sparkles,
  Eye,
  Car,
  Shirt,
  AlertCircle,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { debounce } from "lodash";

// Components
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { LoadingMask } from "@/components/ui/loading-mask";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Store
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchActiveEventsAsync,
  updateFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
} from "@/store/slices/eventsSlice";
import { addToCart } from "@/store/slices/checkoutSlice";
import {
  selectPaginatedEvents,
  selectEventsLoading,
  selectEventsError,
  selectEventsFilters,
  selectEventsTotalPages,
  selectEventsCurrentPage,
  selectEventCategories,
  selectEventsStats,
  selectTrendingEvents,
  selectPresaleEvents,
} from "@/store/selectors/eventsSelectors";
import { selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { selectCurrentLanguage } from "@/store/selectors/languageSelectors";
import { openSignInModal } from "@/store/slices/authSlice";

// Types
import type { ApiEvent } from "@/types";

const Eventos: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Local state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<ApiEvent[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Selectors
  const events = useAppSelector(selectPaginatedEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const filters = useAppSelector(selectEventsFilters);
  const totalPages = useAppSelector(selectEventsTotalPages);
  const currentPage = useAppSelector(selectEventsCurrentPage);
  const categories = useAppSelector(selectEventCategories);
  const stats = useAppSelector(selectEventsStats);
  const trendingEvents = useAppSelector(selectTrendingEvents);
  const presaleEvents = useAppSelector(selectPresaleEvents);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentLanguage = useAppSelector(selectCurrentLanguage);

  // Effects
  useEffect(() => {
    // Only fetch all events on initial load if no search input
    if (!searchInput) {
      dispatch(
        fetchActiveEventsAsync({ ...filters, language: currentLanguage }),
      );
    }
  }, [dispatch, currentLanguage]);

  // Debounced search for suggestions
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 2) {
          setSearchResults([]);
          setSearchLoading(false);
          return;
        }

        setSearchLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/getActiveEvents.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: searchTerm,
                language: currentLanguage,
              }),
            },
          );

          const data = await response.json();
          const events = Array.isArray(data)
            ? data
            : data.success && Array.isArray(data.events)
              ? data.events
              : [];

          setSearchResults(events.slice(0, 5)); // Limit to 5 suggestions
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [currentLanguage],
  );

  // Handle search input change
  useEffect(() => {
    if (searchInput) {
      setSearchOpen(true);
      debouncedSearch(searchInput);
    } else {
      setSearchOpen(false);
      setSearchResults([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  // Debounced function to re-fetch all events when filters change (NOT search)
  const debouncedFetchEvents = React.useMemo(
    () =>
      debounce(() => {
        if (!searchInput) {
          // Only fetch all events if not actively searching
          dispatch(
            fetchActiveEventsAsync({ ...filters, language: currentLanguage }),
          );
        }
      }, 500),
    [dispatch, filters, currentLanguage, searchInput],
  );

  // Re-fetch events when filters change (but not search)
  useEffect(() => {
    if (!searchInput) {
      debouncedFetchEvents();
    }
    return () => {
      debouncedFetchEvents.cancel();
    };
  }, [filters, debouncedFetchEvents, searchInput]);

  // Force dark mode like MyProfile component
  useEffect(() => {
    const ensureDarkMode = () => {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {
        console.warn("localStorage not available");
      }
    };

    // Set dark mode immediately
    ensureDarkMode();

    // Set up interval to periodically check and maintain dark mode
    const interval = setInterval(ensureDarkMode, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSelect = (eventId: string, action: "view" | "checkout") => {
    const event = searchResults.find((e) => e.id.toString() === eventId);
    if (!event) return;

    setSearchOpen(false);
    setSearchInput("");

    if (action === "view") {
      navigate(`/eventos/${eventId}`);
    } else {
      const trip = handleAddToCart(event);
      navigate("/checkout", { state: { event: trip } });
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchResults([]);
    setSearchOpen(false);
    // Re-fetch all events when search is cleared
    dispatch(fetchActiveEventsAsync({ ...filters, language: currentLanguage }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    dispatch(updateFilters({ category: categoryId }));
  };

  const handleTrendingFilter = (trending: boolean) => {
    dispatch(updateFilters({ trending }));
  };

  const handlePresaleFilter = (presale: boolean) => {
    dispatch(updateFilters({ presale }));
  };

  const handleIncludesTransportationFilter = (
    includesTransportation: boolean,
  ) => {
    dispatch(updateFilters({ includesTransportation }));
  };

  const handleRefundableIfNoTicketFilter = (refundableIfNoTicket: boolean) => {
    dispatch(updateFilters({ refundableIfNoTicket }));
  };

  const handleAcceptsUnderAgeFilter = (acceptsUnderAge: boolean) => {
    dispatch(updateFilters({ acceptsUnderAge }));
  };

  const handleJerseyAddonAvailableFilter = (jerseyAddonAvailable: boolean) => {
    dispatch(updateFilters({ jerseyAddonAvailable }));
  };

  const handleLocationFilter = (location: string) => {
    dispatch(updateFilters({ location }));
  };

  const handleVenueNameFilter = (venueName: string) => {
    dispatch(updateFilters({ venueName }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    dispatch(clearFilters());
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add to cart using Redux store (same as Index page)
  const handleAddToCart = (event: ApiEvent) => {
    // Convert ApiEvent to Trip format
    const trip = {
      id: event.id,
      title: event.title,
      category: event.category,
      date: event.event_date,
      location: "", // Note: venue information might need to be added to API
      price:
        event.event_zones.length > 0
          ? Math.min(
              ...event.event_zones.map((zone) => parseFloat(zone.price)),
            ).toString()
          : "0",
      image: event.image_url || "",
      rating: 4.5, // Default rating - could be dynamic
      soldOut: event.is_sold_out === "1" || event.is_sold_out === 1,
      trending: event.is_trending === "1" || event.is_trending === 1,
      includesTransportation:
        event.includes_transportation === "1" ||
        event.includes_transportation === 1,
      isPresale: event.is_presale === "1" || event.is_presale === 1,
      requiresTicketAcquisition:
        event.requires_ticket_acquisition === "1" ||
        event.requires_ticket_acquisition === 1,
      refundableIfNoTicket:
        event.refundable_if_no_ticket === "1" ||
        event.refundable_if_no_ticket === 1,
      paymentOptions: {
        installmentsAvailable:
          event.event_payment_options.length > 0 &&
          event.event_payment_options[0].installments_available > 0,
        presaleDepositAvailable:
          event.event_payment_options.length > 0 &&
          event.event_payment_options[0].presale_deposit_available > 0,
        secondPaymentInstallmentsAvailable:
          event.event_payment_options.length > 0 &&
          event.event_payment_options[0].second_payment_installments_available >
            0,
      },
      gifts: event.event_gifts.map((gift) => ({
        id: gift.id,
        event_id: gift.event_id,
        gift_name: gift.gift_name,
        gift_name_es: gift.gift_name_es,
      })),
      acceptsUnderAge:
        event.accepts_under_age === "1" || event.accepts_under_age === 1,
      jerseyAddonAvailable:
        event.jersey_addon_available === "1" ||
        event.jersey_addon_available === 1,
      jerseyPrice: parseFloat(event.jersey_price) || 120,
      availableZones: event.event_zones.map((zone) => ({
        id: zone.id.toString(),
        name: zone.zone_name,
        price: parseFloat(zone.price),
        description: zone.zone_description,
        available: zone.is_available === 1,
        zone_name: zone.zone_name,
        zone_description: zone.zone_description,
        zone_name_es: zone.zone_name_es,
        zone_description_es: zone.zone_description_es,
      })),
      transportationOptions: event.transportation_options.map((option) => ({
        id: option.id.toString(),
        name: option.type_name,
        name_es: option.type_name_es,
        description: option.description,
        description_es: option.description_es,
        additionalCost: parseFloat(option.additional_cost),
        capacity: option.capacity,
        available: option.is_available === 1,
        specialInstructions: option.special_instructions,
        specialInstructions_es: option.special_instructions_es,
        transportationTypeId: option.transportation_type_id,
        lodgingTypeId: option.lodging_type_id,
        lodgingName: option.lodging_name,
        lodgingName_es: option.lodging_name_es,
        lodgingDescription: option.lodging_description,
        lodgingDescription_es: option.lodging_description_es,
        lodgingActive: option.lodging_is_active === 1,
      })),
    };

    const cartItem = {
      trip,
      quantity: 1,
      zone: "General",
      transportation: "none" as const,
      jerseySelections: [] as any[],
    };
    dispatch(addToCart(cartItem));
    console.log("🛒 Added to cart via Redux:", event.title);
    return trip; // Return the converted trip for navigation
  };

  const formatEventDate = (dateString: string, timeString: string) => {
    try {
      const eventDate = new Date(`${dateString}T${timeString}`);
      return {
        date: format(eventDate, "MMM dd"),
        time: format(eventDate, "HH:mm"),
        weekday: format(eventDate, "EEE"),
      };
    } catch {
      return {
        date: dateString,
        time: timeString,
        weekday: "",
      };
    }
  };

  const formatCurrency = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const EventCard: React.FC<{ event: ApiEvent; index: number }> = ({
    event,
    index,
  }) => {
    const { date, time, weekday } = formatEventDate(
      event.event_date,
      event.event_time,
    );
    const minPrice =
      event.event_zones.length > 0
        ? Math.min(...event.event_zones.map((zone) => parseFloat(zone.price)))
        : 0;

    return (
      <Card
        className="group h-full overflow-hidden bg-card border-border/50 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
        onClick={(e) => {
          // Only navigate if not clicking on buttons or interactive elements
          if (!(e.target as HTMLElement).closest("button")) {
            const trip = handleAddToCart(event);
            navigate("/checkout", { state: { event: trip } });
          }
        }}
      >
        {/* Event Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <div className="aspect-[16/10] relative">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Music className="w-16 h-16 text-white/80" />
              </div>
            )}

            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {event.is_trending === "1" && (
                <Badge className="bg-red-500/90 text-white border-0 backdrop-blur-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {t("common.trending")}
                </Badge>
              )}
              {event.is_presale === "1" && (
                <Badge className="bg-yellow-500/90 text-white border-0 backdrop-blur-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  {t("common.presale")}
                </Badge>
              )}
              {event.is_sold_out === "1" && (
                <Badge className="bg-gray-500/90 text-white border-0 backdrop-blur-sm">
                  {t("common.soldOut")}
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-4 h-4 text-white" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Date */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-2xl font-bold text-primary">
                {date.split(" ")[1]}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {date.split(" ")[0]}
              </div>
              <div className="text-xs text-muted-foreground">{weekday}</div>
            </div>

            {/* Title and Category */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-primary font-medium mt-1">
                {event.category.name}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Time and Location */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{time}</span>
            </div>
            {/* Note: You might want to add venue information to your API/types */}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {event.includes_transportation === "1" && (
              <Badge variant="secondary" className="text-xs">
                <Car className="w-3 h-3 mr-1" />
                {t("eventos.transport")}
              </Badge>
            )}
            {event.jersey_addon_available === "1" && (
              <Badge variant="secondary" className="text-xs">
                <Shirt className="w-3 h-3 mr-1" />
                {t("eventos.jersey")}
              </Badge>
            )}
            {event.accepts_under_age === "1" && (
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {t("eventos.allAges")}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="w-full space-y-4">
            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                {minPrice > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {t("common.from")}
                  </div>
                )}
                <div className="text-2xl font-bold text-foreground">
                  {minPrice > 0
                    ? formatCurrency(minPrice.toString())
                    : t("common.free")}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/eventos/${event.id}`);
                }}
                className="flex-1 h-11 text-xs sm:text-sm px-2"
              >
                <Eye className="w-4 h-4 mr-1" />
                <span className="truncate">
                  {t("eventDetails.viewDetails")}
                </span>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  const trip = handleAddToCart(event);
                  navigate("/checkout", { state: { event: trip } });
                }}
                className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 text-xs sm:text-sm px-2"
                disabled={event.is_sold_out === "1"}
              >
                <span className="truncate">
                  {event.is_sold_out === "1"
                    ? t("common.soldOut")
                    : t("common.getTickets")}
                </span>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const StatsCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number;
    color: string;
  }> = ({ icon, title, value, color }) => (
    <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
      <div className="text-center">
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}
        >
          {icon}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  );

  return (
    <LoadingMask isLoading={false}>
      <div className="min-h-screen bg-background dark:bg-slate-900">
        {/* Header */}
        <AppHeader
          variant="default"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          enableScrollEffect={true}
        />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="container mx-auto relative">
            <div className="text-center max-w-5xl mx-auto">
              {/* Hero Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Ticket className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Hero Title */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {t("common.events")}
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                {t("eventos.heroSubtitle")}
              </p>

              {/* Hero Search with Suggestions */}
              <div className="max-w-2xl mx-auto mb-12">
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
                      <Input
                        ref={searchInputRef}
                        placeholder={t("common.searchEvents")}
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchInput && setSearchOpen(true)}
                        className="pl-12 pr-4 py-4 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 rounded-2xl shadow-lg"
                      />
                      {searchInput && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[600px] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <Command>
                      <CommandList>
                        {searchLoading ? (
                          <CommandEmpty>
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {t("common.loading")}
                            </div>
                          </CommandEmpty>
                        ) : searchResults.length === 0 ? (
                          <CommandEmpty>
                            <div className="p-4 text-center">
                              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {t("eventDetails.noResultsFound")}
                              </p>
                            </div>
                          </CommandEmpty>
                        ) : (
                          <CommandGroup
                            heading={t("eventDetails.searchResults")}
                          >
                            {searchResults.map((event) => {
                              const title =
                                currentLanguage === "es" && event.title_es
                                  ? event.title_es
                                  : event.title;
                              const minPrice =
                                event.event_zones.length > 0
                                  ? Math.min(
                                      ...event.event_zones.map((zone) =>
                                        parseFloat(zone.price),
                                      ),
                                    )
                                  : 0;

                              return (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer group"
                                >
                                  {/* Event Image Thumbnail */}
                                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500">
                                    {event.image_url ? (
                                      <img
                                        src={event.image_url}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Music className="w-8 h-8 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Event Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                      {title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {event.category.name}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {format(
                                          new Date(event.event_date),
                                          "MMM dd, yyyy",
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price */}
                                  <div className="flex-shrink-0 text-right">
                                    <p className="text-sm font-bold text-primary">
                                      {formatCurrency(minPrice.toString())}
                                    </p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex-shrink-0 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSearchSelect(
                                          event.id.toString(),
                                          "view",
                                        );
                                      }}
                                      className="h-8"
                                    >
                                      <ExternalLink className="w-4 h-4 mr-1" />
                                      {t("eventDetails.viewDetails")}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSearchSelect(
                                          event.id.toString(),
                                          "checkout",
                                        );
                                      }}
                                      className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                      disabled={event.is_sold_out === "1"}
                                    >
                                      <Ticket className="w-4 h-4 mr-1" />
                                      {event.is_sold_out === "1"
                                        ? t("common.soldOut")
                                        : t("common.getTickets")}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <StatsCard
                  icon={<Ticket className="w-6 h-6 text-white" />}
                  title={t("eventos.totalEvents")}
                  value={stats.total}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <StatsCard
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  title={t("common.trending")}
                  value={stats.trending}
                  color="bg-gradient-to-r from-red-500 to-red-600"
                />
                <StatsCard
                  icon={<Zap className="w-6 h-6 text-white" />}
                  title={t("common.presale")}
                  value={stats.presale}
                  color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                />
                <StatsCard
                  icon={<Eye className="w-6 h-6 text-white" />}
                  title={t("eventos.available")}
                  value={stats.available}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Filters Section */}
        <section className="py-8 px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-y border-border/50">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Categories Filter */}
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) =>
                    handleCategoryFilter(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("common.categories")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("eventos.allCategories")}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Quick Filter Buttons */}
                <Button
                  variant={filters.trending ? "default" : "outline"}
                  onClick={() => handleTrendingFilter(!filters.trending)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {t("common.trending")}
                </Button>

                <Button
                  variant={filters.presale ? "default" : "outline"}
                  onClick={() => handlePresaleFilter(!filters.presale)}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {t("common.presale")}
                </Button>

                {/* Clear Filters */}
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t("eventos.clearAll")}
                </Button>
              </div>

              {/* View Mode and Advanced Filters */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    onClick={() => setViewMode("grid")}
                    className="p-2"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    onClick={() => setViewMode("list")}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Advanced Filters */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      {t("eventos.advancedFilters")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t("eventos.advancedFilters")}</SheetTitle>
                      <SheetDescription>
                        {t("eventos.advancedFiltersDescription")}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                      {/* Location Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          {t("eventos.location")}
                        </label>
                        <Input
                          placeholder={t("eventos.locationPlaceholder")}
                          value={filters.location}
                          onChange={(e) => handleLocationFilter(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Venue Name Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          {t("eventos.venueName")}
                        </label>
                        <Input
                          placeholder={t("eventos.venueNamePlaceholder")}
                          value={filters.venueName}
                          onChange={(e) =>
                            handleVenueNameFilter(e.target.value)
                          }
                          className="w-full"
                        />
                      </div>

                      {/* Transportation Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          <Car className="w-4 h-4 inline mr-2" />
                          {t("eventos.includesTransportation")}
                        </label>
                        <Button
                          variant={
                            filters.includesTransportation
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleIncludesTransportationFilter(
                              !filters.includesTransportation,
                            )
                          }
                        >
                          {filters.includesTransportation
                            ? t("common.yes")
                            : t("common.no")}
                        </Button>
                      </div>

                      {/* Accepts Under Age Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          <Users className="w-4 h-4 inline mr-2" />
                          {t("eventos.acceptsUnderAge")}
                        </label>
                        <Button
                          variant={
                            filters.acceptsUnderAge ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleAcceptsUnderAgeFilter(
                              !filters.acceptsUnderAge,
                            )
                          }
                        >
                          {filters.acceptsUnderAge
                            ? t("common.yes")
                            : t("common.no")}
                        </Button>
                      </div>

                      {/* Jersey Add-on Available Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          <Shirt className="w-4 h-4 inline mr-2" />
                          {t("eventos.jerseyAddonAvailable")}
                        </label>
                        <Button
                          variant={
                            filters.jerseyAddonAvailable ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleJerseyAddonAvailableFilter(
                              !filters.jerseyAddonAvailable,
                            )
                          }
                        >
                          {filters.jerseyAddonAvailable
                            ? t("common.yes")
                            : t("common.no")}
                        </Button>
                      </div>

                      {/* Refundable If No Ticket Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          {t("eventos.refundableIfNoTicket")}
                        </label>
                        <Button
                          variant={
                            filters.refundableIfNoTicket ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleRefundableIfNoTicketFilter(
                              !filters.refundableIfNoTicket,
                            )
                          }
                        >
                          {filters.refundableIfNoTicket
                            ? t("common.yes")
                            : t("common.no")}
                        </Button>
                      </div>

                      {/* Clear All Button */}
                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            handleClearFilters();
                            setFiltersOpen(false);
                          }}
                        >
                          {t("eventos.clearAllFilters")}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 px-4 bg-background dark:bg-slate-900">
          <div className="container mx-auto max-w-7xl">
            {searchInput ? (
              /* Show message when actively searching */
              <Card className="text-center py-16 border-border/50 bg-card backdrop-blur-sm">
                <CardContent>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {t("eventDetails.searchingEvents")}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t("eventDetails.useSearchSuggestions")}
                  </p>
                  <Button onClick={handleClearSearch}>
                    {t("eventDetails.showAllEvents")}
                  </Button>
                </CardContent>
              </Card>
            ) : loading ? (
              <div className="relative min-h-[500px]">
                <LoadingMask isLoading={true} />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : events.length === 0 ? (
              <Card className="text-center py-16 border-border/50 bg-card backdrop-blur-sm">
                <CardContent>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {t("eventos.noEventsFound")}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t("eventos.noEventsFoundDescription")}
                  </p>
                  <Button onClick={handleClearFilters}>
                    {t("eventos.clearAllFilters")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Events Grid */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {events.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t("common.previous")}
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {t("common.next")}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Call-to-Action Section - Check Your Reservations */}
        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-t border-border/50">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("eventos.trackYourAdventures")}
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("eventos.trackYourAdventuresDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/reservations")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {t("common.myReservations")}
                </Button>

                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => dispatch(openSignInModal())}
                    className="px-8 py-3 text-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <User className="w-5 h-5 mr-2" />
                    {t("common.signIn")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <AppFooter />
      </div>
    </LoadingMask>
  );
};

export default Eventos;
