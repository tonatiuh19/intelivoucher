import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingMask } from "@/components/ui/loading-mask";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  Ticket,
  Smartphone,
  Shield,
  Zap,
  Timer,
  Users,
  TrendingUp,
  Award,
  Globe,
  ChevronRight,
  Sparkles,
  Heart,
  Music,
  Trophy,
  Camera,
  ArrowRight,
  Menu,
  X,
  Lock,
  CreditCard,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

// Redux store imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  selectTrip,
  setTrips,
  fetchTrips,
} from "../store/slices/tripsSlice";
import { addToCart } from "../store/slices/checkoutSlice";
import {
  selectFilteredTrips,
  selectTrendingTrips,
  selectTripsLoading,
  selectCartItemCount,
} from "../store/selectors";
import {
  selectIsAuthenticated,
  selectUser,
} from "../store/selectors/authSelectors";
import { openSignInModal, signOut } from "../store/slices/authSlice";

// Import test data
import {
  mockCategoriesData,
  mockStatsData,
  mockVenuesData,
} from "../data/mockData";
import { formatCurrency } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  // Local state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown example
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Redux store state
  const filteredTrips = useAppSelector(selectFilteredTrips);
  const trendingTrips = useAppSelector(selectTrendingTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Always enable dark mode
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, []);

  // Load real data from API on component mount
  useEffect(() => {
    // Fetch active events from the real API
    dispatch(fetchTrips({}));
  }, [dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle search using Redux store
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setSearchQuery(value));
    console.log("🔍 Search updated in Redux store:", value);
  };

  // Handle add to cart using Redux store
  const handleAddToCart = (trip: any) => {
    const cartItem = {
      trip,
      quantity: 1,
      zone: "General",
      transportation: "none" as const,
      jerseySelections: [] as any[],
    };
    dispatch(addToCart(cartItem));
    console.log("🛒 Added to cart via Redux:", trip.title);
  };

  const heroBackgrounds = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Amante de la Música",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop",
      content:
        "¡La mejor plataforma de boletos que he usado! Conseguí asientos en primera fila para el concierto de mi banda favorita. ¡El sistema de reserva me salvó de perderme el evento!",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Fanático del Fútbol",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      content:
        "Conseguí boletos para la final del América vs Chivas en segundos. La plataforma web es súper fluida y las notificaciones por email llegaron inmediatamente.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "Amante del Teatro",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content:
        "Encontré boletos para obras de teatro que estaban agotadas en todos lados. ¡Intelivoucher tiene la mejor selección de eventos y me mantiene informada por email!",
      rating: 5,
    },
  ];

  // Use imported mock data instead of hardcoded data
  const categories = mockCategoriesData;
  const stats = mockStatsData.map((stat, index) => ({
    ...stat,
    icon: [Users, Calendar, Globe, Award][index], // Map icons to stats
  }));
  const venues = mockVenuesData;

  // Extract popular event titles from actual API data for popular tags
  const popularEventTags = React.useMemo(() => {
    console.log(
      "🎯 Popular Tags Debug: filteredTrips length:",
      filteredTrips.length,
    );

    if (filteredTrips.length > 0) {
      // Get the current language
      const currentLanguage = i18n.language || "en";
      console.log("🎯 Current language:", currentLanguage);

      // Extract actual event titles directly (not keywords)
      const eventTitles = filteredTrips
        .slice(0, 6) // Take more events to get better variety
        .map((event) => {
          // Use appropriate title based on language
          let title =
            currentLanguage === "es"
              ? event.title_es || event.title
              : event.title || event.title_es;

          console.log("🎯 Event:", {
            title,
            title_es: event.title_es,
            original_title: event.title,
          });

          // Clean up the title - remove extra spaces and trim
          title = title.trim();

          // For better readability, limit title length if too long
          if (title.length > 25) {
            // Split by common separators and take first meaningful part
            const parts = title.split(/[-:|–—]/);
            title = parts[0].trim();

            // If still too long, truncate at word boundary
            if (title.length > 25) {
              const words = title.split(" ");
              title = words.slice(0, 3).join(" ");
              if (title.length > 25) {
                title = title.substring(0, 22) + "...";
              }
            }
          }

          return title;
        })
        .filter((title, index, array) => {
          // Remove duplicates and empty titles
          return title && array.indexOf(title) === index;
        })
        .slice(0, 4); // Take only 4 for display

      console.log("🎯 Final event titles for tags:", eventTitles);

      // Return event titles if we have any, otherwise use fallback
      if (eventTitles.length > 0) {
        return eventTitles;
      }
    }

    // Fallback when no events are available
    console.log("🎯 Using fallback categories");
    return [
      t("categories.concerts"),
      t("categories.sports"),
      t("categories.theater"),
      t("categories.festivals"),
    ];
  }, [filteredTrips, i18n.language, t]);

  return (
    <LoadingMask
      isLoading={tripsLoading}
      variant="spinner"
      size="xl"
      text={t("common.loading")}
      blur={true}
      overlay={60}
    >
      <div>
        {/* Header - positioned absolutely over hero */}
        <AppHeader
          variant="home"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          enableScrollEffect={true}
        />

        {/* Enhanced Hero Section - full viewport, starts from top */}
        <section className="relative min-h-screen w-full px-4 overflow-hidden flex items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          {/* Background Images with Parallax Effect */}
          <div className="absolute inset-0 z-0">
            {heroBackgrounds.map((bg, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHeroIndex ? "opacity-20" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
            <div className="absolute top-20 left-10 w-20 h-20 bg-brand-blue/20 rounded-full animate-pulse" />
            <div
              className="absolute top-40 right-20 w-32 h-32 bg-brand-cyan/20 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-40 left-1/4 w-16 h-16 bg-brand-green/20 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-60 right-1/4 w-24 h-24 bg-brand-orange/20 rounded-full animate-bounce"
              style={{ animationDelay: "3s" }}
            />
          </div>

          <div className="container mx-auto text-center relative z-10">
            {/* Main Hero Content */}
            <div className="space-y-12 py-20">
              <div className="space-y-8">
                <h2 className="text-6xl sm:text-7xl md:text-9xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-green bg-clip-text text-transparent animate-pulse">
                    {t("hero.discover")}
                  </span>
                  <br />
                  <span className="text-slate-800 dark:text-slate-200">
                    {t("hero.unforgettable")}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
                    {t("hero.experiences")}
                  </span>
                </h2>
                <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("hero.subtitle").replace(
                        "{{count}}",
                        '<span class="font-bold text-brand-blue">2M+ users</span>',
                      ),
                    }}
                  />
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
                      <Input
                        placeholder={t("hero.searchPlaceholder")}
                        className="pl-12 h-14 text-lg border-0 focus-visible:ring-2 focus-visible:ring-brand-blue bg-slate-700 text-white rounded-xl min-h-[56px]"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    <Button className="h-14 min-h-[56px] bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-lg rounded-xl font-semibold shadow-lg px-8 flex items-center justify-center">
                      <Search className="w-5 h-5 mr-2" />
                      {t("common.findEvents")}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center mt-6 space-x-6">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      {t("common.popular")}:
                    </span>
                    {popularEventTags.map((tag) => (
                      <Button
                        key={tag}
                        variant="ghost"
                        size="sm"
                        className="text-brand-blue hover:bg-brand-blue/10 rounded-full"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Proof & Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-brand-blue/20 to-brand-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-brand-blue" />
                    </div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm">
                      {i18n.language === "es"
                        ? stat.label_es || stat.label
                        : stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Highlight */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full px-8 py-4 border border-blue-500/20">
                <Ticket className="w-6 h-6 text-blue-500" />
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                  {t("hero.secureBooking")}
                </span>
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Events */}
        <section id="events" className="py-20 px-4 bg-slate-900">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-red-500/10 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <span className="text-red-400 font-semibold">
                  {t("hero.trendingNow")}
                </span>
              </div>
              <h3 className="text-5xl font-bold text-slate-200 mb-4">
                {t("hero.whatsHot")}
              </h3>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {t("hero.whatsHotSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Use Redux store data for trending trips */}
              {trendingTrips.map((event) => (
                <Card
                  key={event.id}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 border-0 shadow-xl overflow-hidden bg-slate-800 relative"
                >
                  {event.trending && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
                        🔥 Trending
                      </Badge>
                    </div>
                  )}
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-brand-blue hover:bg-brand-blue">
                      {event.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-3 text-slate-200">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-slate-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{event.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.includesTransportation && (
                        <Badge
                          variant="outline"
                          className="text-xs border-green-500/40 text-green-400 bg-green-500/10"
                        >
                          🚌 Transportation Included
                        </Badge>
                      )}
                      {event.isPresale && (
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-500/40 text-blue-400 bg-blue-500/10"
                        >
                          Pre-sale
                        </Badge>
                      )}
                      {event.isPresale && event.requiresTicketAcquisition && (
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
                        >
                          Ticket Allocation Pending
                        </Badge>
                      )}
                      {event.refundableIfNoTicket && (
                        <Badge
                          variant="outline"
                          className="text-xs border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                        >
                          Refundable if Not Allocated
                        </Badge>
                      )}
                      {event.paymentOptions?.presaleDepositAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
                        >
                          Reserve with Deposit
                        </Badge>
                      )}
                      {event.paymentOptions?.installmentsAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-500/40 text-purple-400 bg-purple-500/10"
                        >
                          Installments Available
                        </Badge>
                      )}
                      {event.isPresale &&
                        event.paymentOptions
                          ?.secondPaymentInstallmentsAvailable && (
                          <Badge
                            variant="outline"
                            className="text-xs border-indigo-500/40 text-indigo-400 bg-indigo-500/10"
                          >
                            Second Payment in Installments
                          </Badge>
                        )}
                      {event.gifts && event.gifts.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-pink-500/40 text-pink-400 bg-pink-500/10"
                        >
                          Includes Gifts
                        </Badge>
                      )}
                      {event.acceptsUnderAge && (
                        <Badge
                          variant="outline"
                          className="text-xs border-teal-500/40 text-teal-400 bg-teal-500/10"
                        >
                          Under-age Allowed
                        </Badge>
                      )}
                      {event.jerseyAddonAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-orange-500/40 text-orange-400 bg-orange-500/10"
                        >
                          Jersey Add-on
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-brand-cyan">
                        {t("common.from")}: $
                        {formatCurrency(event.price, "", 2)}
                      </span>
                      <Button
                        className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                        disabled={event.soldOut}
                        onClick={() => {
                          if (!event.soldOut) {
                            handleAddToCart(event);
                            navigate("/checkout", { state: { event } });
                          }
                        }}
                      >
                        {event.soldOut
                          ? t("common.soldOut")
                          : t("common.getTickets")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                {t("categories.title")}
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {t("categories.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer hover:scale-110 transition-all duration-500 border-0 shadow-xl overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div
                      className={`${category.color} p-10 text-white relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 text-8xl opacity-20 -mr-6 -mt-4 transform rotate-12">
                        {category.icon}
                      </div>
                      <div className="relative z-10">
                        <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h4 className="text-2xl font-bold mb-3">
                          {i18n.language === "es"
                            ? category.name_es || category.name
                            : category.name}
                        </h4>
                        <p className="text-white/90 mb-4">
                          {i18n.language === "es"
                            ? category.count_es || category.count
                            : category.count}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          {t("common.explore")}{" "}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20 px-4 bg-slate-900">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h3 className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {t("featuredEvents.title")}
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  {t("featuredEvents.subtitle")}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white dark:border-brand-cyan dark:text-brand-cyan"
              >
                {t("featuredEvents.viewAllEvents")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Use filtered trips from Redux store, limit to first 6 */}
              {filteredTrips.slice(0, 6).map((event) => (
                <Card
                  key={event.id}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 border-0 shadow-lg overflow-hidden dark:bg-slate-800"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {event.soldOut && (
                      <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-500">
                        {t("common.soldOut")}
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-brand-blue hover:bg-brand-blue">
                      {event.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-slate-200">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-slate-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{event.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.includesTransportation && (
                        <Badge
                          variant="outline"
                          className="text-xs border-green-500/40 text-green-400 bg-green-500/10"
                        >
                          🚌 Transportation Included
                        </Badge>
                      )}
                      {event.isPresale && (
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-500/40 text-blue-400 bg-blue-500/10"
                        >
                          Pre-sale
                        </Badge>
                      )}
                      {event.isPresale && event.requiresTicketAcquisition && (
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
                        >
                          Ticket Allocation Pending
                        </Badge>
                      )}
                      {event.refundableIfNoTicket && (
                        <Badge
                          variant="outline"
                          className="text-xs border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                        >
                          Refundable if Not Allocated
                        </Badge>
                      )}
                      {event.paymentOptions?.presaleDepositAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
                        >
                          Reserve with Deposit
                        </Badge>
                      )}
                      {event.paymentOptions?.installmentsAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-500/40 text-purple-400 bg-purple-500/10"
                        >
                          Installments Available
                        </Badge>
                      )}
                      {event.isPresale &&
                        event.paymentOptions
                          ?.secondPaymentInstallmentsAvailable && (
                          <Badge
                            variant="outline"
                            className="text-xs border-indigo-500/40 text-indigo-400 bg-indigo-500/10"
                          >
                            Second Payment in Installments
                          </Badge>
                        )}
                      {event.gifts && event.gifts.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-pink-500/40 text-pink-400 bg-pink-500/10"
                        >
                          Includes Gifts
                        </Badge>
                      )}
                      {event.acceptsUnderAge && (
                        <Badge
                          variant="outline"
                          className="text-xs border-teal-500/40 text-teal-400 bg-teal-500/10"
                        >
                          Under-age Allowed
                        </Badge>
                      )}
                      {event.jerseyAddonAvailable && (
                        <Badge
                          variant="outline"
                          className="text-xs border-orange-500/40 text-orange-400 bg-orange-500/10"
                        >
                          Jersey Add-on
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-brand-cyan">
                        {event.price}
                      </span>
                      <Button
                        className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                        disabled={event.soldOut}
                        onClick={() => {
                          if (!event.soldOut) {
                            handleAddToCart(event);
                            navigate("/checkout", { state: { event } });
                          }
                        }}
                      >
                        {event.soldOut
                          ? t("common.soldOut")
                          : t("common.getTickets")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold mb-4 text-slate-200">
                {t("testimonials.title")}
              </h3>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {t("testimonials.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-slate-800 hover:scale-105 transition-transform duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Avatar className="w-16 h-16 mr-4">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-slate-200">
                          {testimonial.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 italic">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* App Features */}
        <section className="py-20 px-4 bg-slate-900">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold mb-4 text-slate-200">
                {t("features.whyChooseTitle")}
              </h3>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {t("features.whyChooseSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                  <Globe className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("features.webPlatform.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("features.webPlatform.description")}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/30">
                  <Shield className="w-10 h-10 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("features.secureCheckout.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("features.secureCheckout.description")}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <Zap className="w-10 h-10 text-green-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("features.instantAccess.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("features.instantAccess.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="py-20 px-4 bg-slate-800">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-4 text-slate-200">
                {t("security.title")}
              </h3>
              <p className="text-xl text-slate-400">{t("security.subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <Shield className="w-10 h-10 text-green-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("security.ssl.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("security.ssl.description")}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                  <Lock className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("security.encryption.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("security.encryption.description")}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                  <CreditCard className="w-10 h-10 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("security.pci.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("security.pci.description")}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-orange-500/30">
                  <Eye className="w-10 h-10 text-orange-400" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-200">
                  {t("security.monitoring.title")}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t("security.monitoring.description")}
                </p>
              </div>
            </div>
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-4 bg-slate-700/50 rounded-full px-8 py-4">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-slate-200 font-semibold">
                  {t("security.guarantee")}
                </span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {t("security.certified")}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 px-4 bg-gradient-to-r from-brand-blue to-brand-cyan">
          <div className="container mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("newsletter.title")}
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("newsletter.subtitle")}
            </p>
            <div className="max-w-md mx-auto mb-8">
              <div className="flex space-x-4">
                <Input
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
                />
                <Button className="bg-white text-brand-blue hover:bg-slate-100 h-12 px-8">
                  {t("newsletter.subscribeButton")}
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-lg">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-2xl mr-3">📧</span>
                  <h4 className="text-white font-semibold text-lg">
                    {t("newsletter.stayUpdatedTitle")}
                  </h4>
                </div>
                <p className="text-white/90 text-center">
                  {t("newsletter.emailNotificationText")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Redux Store Debug Panel (for testing) */}
        {process.env.NODE_ENV === "development" && (
          <section className="py-8 px-4 bg-slate-800 border-t border-slate-700">
            <div className="container mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                🔧 Redux Store Debug Panel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Store State
                  </h4>
                  <p className="text-slate-300">
                    Total Trips: {filteredTrips.length}
                  </p>
                  <p className="text-slate-300">
                    Trending: {trendingTrips.length}
                  </p>
                  <p className="text-slate-300">Cart Items: {cartItemCount}</p>
                  <p className="text-slate-300">
                    Loading: {tripsLoading.toString()}
                  </p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">
                    Actions Tested
                  </h4>
                  <p className="text-slate-300">✅ setTrips (data loaded)</p>
                  <p className="text-slate-300">
                    ✅ setSearchQuery (search functionality)
                  </p>
                  <p className="text-slate-300">
                    ✅ addToCart (add items to cart)
                  </p>
                  <p className="text-slate-300">✅ Selectors (filtered data)</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">
                    Current Search
                  </h4>
                  <p className="text-slate-300">Query: "{searchTerm}"</p>
                  <p className="text-slate-300">
                    Results: {filteredTrips.length}
                  </p>
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleSearch("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <AppFooter />
      </div>
    </LoadingMask>
  );
}
