import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SignInModal } from "@/components/SignInModal";
import { UserDropdown } from "@/components/UserDropdown";

// Redux store imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  selectTrip,
  setTrips,
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
  mockEventsData,
  mockCategoriesData,
  mockStatsData,
  mockVenuesData,
} from "../data/mockData";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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

  // Load test data into store on component mount
  useEffect(() => {
    // Simulate loading featured events into the store
    loadTestDataIntoStore();
  }, [dispatch]);

  // Helper function to populate store with test data
  const loadTestDataIntoStore = () => {
    // Convert mock events to the Trip format expected by the store
    const tripsData = mockEventsData.map((event) => ({
      id: event.id.toString(),
      title: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      price: event.price,
      image: event.image,
      rating: event.rating,
      soldOut: event.soldOut,
      trending: event.trending,
      includesTransportation: event.includesTransportation,
      isPresale: event.isPresale,
      requiresTicketAcquisition: event.requiresTicketAcquisition,
      refundableIfNoTicket: event.refundableIfNoTicket,
      paymentOptions: event.paymentOptions,
      gifts: event.gifts || [],
      acceptsUnderAge: event.acceptsUnderAge,
      jerseyAddonAvailable: event.jerseyAddonAvailable || false,
      jerseyPrice: event.jerseyPrice || 0,
      availableZones: event.availableZones,
    }));

    // Dispatch the setTrips action to populate the store
    dispatch(setTrips(tripsData));
    console.log(
      "✅ Test data loaded into Redux store:",
      tripsData.length,
      "trips",
    );
  };

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
      name: "Sarah Chen",
      role: "Music Enthusiast",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop",
      content:
        "Best ticketing app ever! Got front row seats to my favorite band's concert. The countdown timer feature saved me from missing out!",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Sports Fan",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      content:
        "Secured Lakers playoff tickets in seconds. The mobile app is super smooth and the seat selection is amazing.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Theater Lover",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content:
        "Found Broadway show tickets that were sold out everywhere else. Intelivoucher has the best selection!",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
                Intelivoucher
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#events"
                className="text-slate-700 dark:text-slate-300 hover:text-brand-blue transition-colors"
              >
                {t("common.events")}
              </a>
              <a
                href="#categories"
                className="text-slate-700 dark:text-slate-300 hover:text-brand-blue transition-colors"
              >
                {t("common.categories")}
              </a>

              {isAuthenticated ? (
                <UserDropdown user={user} />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(openSignInModal())}
                >
                  {t("common.signIn")}
                </Button>
              )}
              <LanguageSelector />
            </nav>
            <button
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              <a
                href="#events"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-slate-800 dark:text-slate-200"
              >
                {t("common.events")}
              </a>
              <a
                href="#categories"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-slate-800 dark:text-slate-200"
              >
                {t("common.categories")}
              </a>
              <div className="pt-2">
                {isAuthenticated ? (
                  <div className="py-2">
                    <UserDropdown user={user} />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        dispatch(openSignInModal());
                        setMobileOpen(false);
                      }}
                    >
                      {t("common.signIn")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
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
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight">
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
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                    <Input
                      placeholder={t("hero.searchPlaceholder")}
                      className="pl-12 h-14 text-lg border-0 focus-visible:ring-2 focus-visible:ring-brand-blue bg-slate-700 text-white rounded-xl"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                    <Input
                      placeholder={t("hero.cityPlaceholder")}
                      className="pl-12 h-14 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue bg-slate-700 text-white rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                    <Input
                      placeholder={t("hero.datePlaceholder")}
                      className="pl-12 h-14 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue bg-slate-700 text-white rounded-xl"
                    />
                  </div>
                  <Button className="h-14 bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-lg rounded-xl font-semibold shadow-lg">
                    <Search className="w-5 h-5 mr-2" />
                    {t("common.findEvents")}
                  </Button>
                </div>
                <div className="flex items-center justify-center mt-6 space-x-6">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {t("common.popular")}:
                  </span>
                  {["Taylor Swift", "NBA Finals", "Broadway", "Coachella"].map(
                    (tag) => (
                      <Button
                        key={tag}
                        variant="ghost"
                        size="sm"
                        className="text-brand-blue hover:bg-brand-blue/10 rounded-full"
                      >
                        {tag}
                      </Button>
                    ),
                  )}
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
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Countdown Timer Demo */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-8 py-4 border border-orange-500/20">
              <Timer className="w-6 h-6 text-orange-500" />
              <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                {t("hero.hotTicketExpires")} {formatTime(timeLeft)}
              </span>
              <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
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
            {/* Show loading state */}
            {tripsLoading && (
              <div className="col-span-full text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-slate-400">
                  Loading trips from Redux store...
                </p>
              </div>
            )}
            {/* Use Redux store data for trending trips */}
            {!tripsLoading &&
              trendingTrips.map((event) => (
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
                        {category.name}
                      </h4>
                      <p className="text-white/90 mb-4">{category.count}</p>
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
              What Our Users Say
            </h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join millions of happy customers who found their perfect events
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
              Why Choose Intelivoucher?
            </h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              The most secure and user-friendly way to discover and purchase
              event tickets on mobile.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-200">
                Mobile First
              </h4>
              <p className="text-slate-400 text-lg leading-relaxed">
                Designed for iOS and Android with an intuitive mobile experience
                for discovering and purchasing tickets on the go.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-brand-cyan to-brand-green rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-200">
                Secure Checkout
              </h4>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our wizard-style checkout process with countdown timers ensures
                your tickets are reserved safely and securely.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-brand-green to-brand-orange rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-200">
                Instant Access
              </h4>
              <p className="text-slate-400 text-lg leading-relaxed">
                Get instant access to thousands of concerts, sports events, and
                cultural experiences with real-time availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Venues */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-slate-200">
              Trusted by Top Venues
            </h3>
            <p className="text-xl text-slate-400">
              Partner venues worldwide trust us with their most exclusive events
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {venues.map((venue, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{venue.logo}</span>
                </div>
                <p className="text-slate-300 font-medium">{venue.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-blue to-brand-cyan">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Never Miss the Next Big Event
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get early access to tickets, exclusive presales, and personalized
            event recommendations.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <div className="flex space-x-4">
              <Input
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
              />
              <Button className="bg-white text-brand-blue hover:bg-slate-100 h-12 px-8">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-white text-brand-blue hover:bg-slate-100 text-lg px-8 py-4"
            >
              📱 Download for iOS
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brand-blue text-lg px-8 py-4"
            >
              🤖 Download for Android
            </Button>
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
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-2xl font-bold">Intelivoucher</h4>
              </div>
              <p className="text-slate-400 mb-6">
                The ultimate event ticketing platform for concerts, sports, and
                cultural experiences.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Music className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Trophy className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Events</h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Concerts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Theater
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Festivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Comedy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Family
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              &copy; 2024 Intelivoucher. All rights reserved. Made with ❤️ for
              event lovers worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal />
    </div>
  );
}
