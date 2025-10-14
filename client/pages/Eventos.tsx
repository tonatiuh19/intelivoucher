import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { format } from "date-fns";

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

  // Effects
  useEffect(() => {
    dispatch(fetchActiveEventsAsync());
  }, [dispatch]);

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
    dispatch(updateFilters({ search: value }));
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
      category: event.category.name,
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
      soldOut: event.is_sold_out === "1",
      trending: event.is_trending === "1",
      includesTransportation: event.includes_transportation === "1",
      isPresale: event.is_presale === "1",
      requiresTicketAcquisition: event.requires_ticket_acquisition === "1",
      refundableIfNoTicket: event.refundable_if_no_ticket === "1",
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
      acceptsUnderAge: event.accepts_under_age === "1",
      jerseyAddonAvailable: event.jersey_addon_available === "1",
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
          <div className="w-full flex items-center justify-between">
            <div>
              {minPrice > 0 && (
                <div className="text-sm text-muted-foreground">
                  {t("common.from")}
                </div>
              )}
              <div className="text-xl font-bold text-foreground">
                {minPrice > 0
                  ? formatCurrency(minPrice.toString())
                  : t("common.free")}
              </div>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                const trip = handleAddToCart(event);
                navigate("/checkout", { state: { event: trip } });
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
              disabled={event.is_sold_out === "1"}
            >
              {event.is_sold_out === "1"
                ? t("common.soldOut")
                : t("common.getTickets")}
            </Button>
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

              {/* Hero Search */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder={t("common.searchEvents")}
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 rounded-2xl shadow-lg"
                  />
                </div>
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
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t("eventos.advancedFilters")}</SheetTitle>
                      <SheetDescription>
                        {t("eventos.advancedFiltersDescription")}
                      </SheetDescription>
                    </SheetHeader>
                    {/* Add more advanced filter controls here */}
                    <div className="py-6">
                      <p className="text-sm text-muted-foreground">
                        {t("eventos.moreFiltersComingSoon")}
                      </p>
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
            {loading ? (
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
