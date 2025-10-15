import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Car,
  Shirt,
  Gift,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  Ticket,
  BadgeCheck,
  TrendingUp,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";
import { format } from "date-fns";

// Components
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { LoadingMask } from "@/components/ui/loading-mask";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Store
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEventByIdAsync } from "@/store/slices/eventsSlice";
import { addToCart } from "@/store/slices/checkoutSlice";
import {
  selectEventsLoading,
  selectEventsError,
  selectSelectedEvent,
} from "@/store/selectors/eventsSelectors";
import { selectCurrentLanguage } from "@/store/selectors/languageSelectors";

// Types
import type { ApiEvent } from "@/types";

const EventDetails: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // Local state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Selectors
  const event = useAppSelector(selectSelectedEvent);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const currentLanguage = useAppSelector(selectCurrentLanguage);

  // Fetch event details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchEventByIdAsync(id));
    }
  }, [dispatch, id]);

  // Force dark mode
  useEffect(() => {
    const ensureDarkMode = () => {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {
        console.warn("localStorage not available");
      }
    };

    ensureDarkMode();
    const interval = setInterval(ensureDarkMode, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle add to cart and navigate to checkout
  const handleGetTickets = () => {
    if (!event) return;

    const trip = convertEventToTrip(event);
    const cartItem = {
      trip,
      quantity: 1,
      zone: "General",
      transportation: "none" as const,
      jerseySelections: [] as any[],
    };
    dispatch(addToCart(cartItem));
    navigate("/checkout", { state: { event: trip } });
  };

  // Convert ApiEvent to Trip format
  const convertEventToTrip = (event: ApiEvent) => {
    const trip = {
      id: event.id,
      title: event.title,
      title_es: event.title_es,
      category: event.category, // Pass full ApiCategory object
      date: event.event_date,
      location: "",
      price:
        event.event_zones.length > 0
          ? Math.min(
              ...event.event_zones.map((zone) => parseFloat(zone.price)),
            ).toString()
          : "0",
      image: event.image_url || "",
      rating: 4.5,
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

    return trip;
  };

  const formatEventDate = (dateString: string, timeString: string) => {
    try {
      const eventDate = new Date(`${dateString}T${timeString}`);
      return {
        date: format(eventDate, "MMMM dd, yyyy"),
        time: format(eventDate, "HH:mm"),
        weekday: format(eventDate, "EEEE"),
      };
    } catch {
      return {
        date: dateString,
        time: timeString,
        weekday: "",
      };
    }
  };

  const formatCurrency = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900">
        <AppHeader
          variant="default"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          enableScrollEffect={true}
        />
        <div className="relative min-h-[500px] pt-20">
          <LoadingMask isLoading={true} />
        </div>
        <AppFooter />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900">
        <AppHeader
          variant="default"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          enableScrollEffect={true}
        />
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>
              {error || t("eventDetails.eventNotFound")}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-8">
            <Button onClick={() => navigate("/eventos")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("eventDetails.backToEvents")}
            </Button>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  const { date, time, weekday } = formatEventDate(
    event.event_date,
    event.event_time,
  );
  const minPrice =
    event.event_zones.length > 0
      ? Math.min(...event.event_zones.map((zone) => parseFloat(zone.price)))
      : 0;

  const title =
    currentLanguage === "es" && event.title_es ? event.title_es : event.title;
  const description =
    currentLanguage === "es" && event.description_es
      ? event.description_es
      : event.description;

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>{`${title} - InteliVoucher`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {event.image_url && (
          <meta property="og:image" content={event.image_url} />
        )}
        <meta property="og:type" content="event" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {event.image_url && (
          <meta name="twitter:image" content={event.image_url} />
        )}
      </Helmet>

      <LoadingMask isLoading={false}>
        <div className="min-h-screen bg-background dark:bg-slate-900">
          {/* Header */}
          <AppHeader
            variant="default"
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            enableScrollEffect={true}
          />

          {/* Hero Section with Event Image */}
          <section className="relative pt-20 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 h-[500px]">
              {event.image_url ? (
                <>
                  <img
                    src={event.image_url}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900 dark:to-slate-900" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 pt-12 pb-20">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate("/eventos")}
                className="mb-8 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("eventDetails.backToEvents")}
              </Button>

              <div className="max-w-4xl">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.is_trending === "1" && (
                    <Badge className="bg-red-500/90 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {t("common.trending")}
                    </Badge>
                  )}
                  {event.is_presale === "1" && (
                    <Badge className="bg-yellow-500/90 text-white border-0">
                      <Zap className="w-3 h-3 mr-1" />
                      {t("common.presale")}
                    </Badge>
                  )}
                  {event.is_sold_out === "1" && (
                    <Badge className="bg-gray-500/90 text-white border-0">
                      {t("common.soldOut")}
                    </Badge>
                  )}
                  <Badge className="bg-primary/90 text-white border-0">
                    {event.category.name}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  {title}
                </h1>

                {/* Event Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">{weekday}</p>
                      <p className="font-semibold">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">
                        {t("eventDetails.time")}
                      </p>
                      <p className="font-semibold">{time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">
                        {t("common.from")}
                      </p>
                      <p className="font-semibold text-xl">
                        {formatCurrency(minPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={handleGetTickets}
                    disabled={event.is_sold_out === "1"}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-8"
                  >
                    <Ticket className="w-5 h-5 mr-2" />
                    {event.is_sold_out === "1"
                      ? t("common.soldOut")
                      : t("common.getTickets")}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {t("eventDetails.saveEvent")}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    {t("eventDetails.share")}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16 px-4 bg-background dark:bg-slate-900">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        {t("eventDetails.about")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Available Zones */}
                  {event.event_zones.length > 0 && (
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          {t("eventDetails.availableZones")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {event.event_zones.map((zone) => (
                          <div
                            key={zone.id}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {currentLanguage === "es" && zone.zone_name_es
                                  ? zone.zone_name_es
                                  : zone.zone_name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {currentLanguage === "es" &&
                                zone.zone_description_es
                                  ? zone.zone_description_es
                                  : zone.zone_description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(zone.price)}
                              </p>
                              {zone.is_available === 0 && (
                                <Badge variant="destructive" className="mt-1">
                                  {t("common.soldOut")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Transportation Options */}
                  {event.transportation_options.length > 0 && (
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-primary" />
                          {t("eventDetails.extras")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {event.transportation_options.map((option, index) => (
                            <AccordionItem
                              key={option.id}
                              value={`item-${index}`}
                            >
                              <AccordionTrigger>
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span className="font-semibold">
                                    {/* Transportation name - show if transportation is included */}
                                    {option.transportation_type_id !== 1 && (
                                      <>
                                        {currentLanguage === "es" &&
                                        option.type_name_es
                                          ? option.type_name_es
                                          : option.type_name}
                                      </>
                                    )}

                                    {/* Separator - show if both transportation and lodging are included */}
                                    {option.transportation_type_id !== 1 &&
                                      option.lodging_type_id !== 11 && (
                                        <span className="text-sm"> + </span>
                                      )}

                                    {/* Lodging name - show if lodging is included */}
                                    {option.lodging_type_id !== 11 && (
                                      <>
                                        {currentLanguage === "es" &&
                                        option.lodging_name_es
                                          ? option.lodging_name_es
                                          : option.lodging_name}
                                      </>
                                    )}
                                  </span>
                                  <span className="text-primary font-bold">
                                    +{formatCurrency(option.additional_cost)}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                  {/* Transportation Description */}
                                  {option.transportation_type_id !== 1 && (
                                    <div>
                                      <p className="font-medium text-foreground mb-1">
                                        {currentLanguage === "es" &&
                                        option.type_name_es
                                          ? option.type_name_es
                                          : option.type_name}
                                      </p>
                                      <p>
                                        {currentLanguage === "es" &&
                                        option.description_es
                                          ? option.description_es
                                          : option.description}
                                      </p>
                                      {option.special_instructions && (
                                        <p className="italic mt-1">
                                          {currentLanguage === "es" &&
                                          option.special_instructions_es
                                            ? option.special_instructions_es
                                            : option.special_instructions}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* Lodging Description */}
                                  {option.lodging_type_id !== 11 && (
                                    <div>
                                      <p className="font-medium text-foreground mb-1">
                                        {currentLanguage === "es" &&
                                        option.lodging_name_es
                                          ? option.lodging_name_es
                                          : option.lodging_name}
                                      </p>
                                      <p>
                                        {currentLanguage === "es" &&
                                        option.lodging_description_es
                                          ? option.lodging_description_es
                                          : option.lodging_description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Capacity */}
                                  <p>
                                    <span className="font-medium">
                                      {t("eventDetails.capacity")}:
                                    </span>{" "}
                                    {option.capacity}
                                  </p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* Jersey Add-on */}
                  {(event.jersey_addon_available === "1" ||
                    event.jersey_addon_available === 1) && (
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shirt className="w-5 h-5 text-primary" />
                          {t("checkout.officialJerseyAddon")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Shirt className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  {t("checkout.jerseyAddOn")}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {t("checkout.jerseyDescription")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(event.jersey_price)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("common.perPerson")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gifts */}
                  {event.event_gifts.length > 0 && (
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary" />
                          {t("eventDetails.includedGifts")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {event.event_gifts.map((gift) => (
                            <li
                              key={gift.id}
                              className="flex items-center gap-2 text-muted-foreground"
                            >
                              <BadgeCheck className="w-4 h-4 text-primary" />
                              {currentLanguage === "es" && gift.gift_name_es
                                ? gift.gift_name_es
                                : gift.gift_name}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Quick Info Card */}
                  <Card className="border-border/50 sticky top-24">
                    <CardHeader>
                      <CardTitle>{t("eventDetails.eventInfo")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Features */}
                      <div className="space-y-3">
                        {event.includes_transportation === "1" && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Car className="w-5 h-5 text-primary" />
                            <span className="text-sm">
                              {t("eventDetails.transportationIncluded")}
                            </span>
                          </div>
                        )}

                        {event.accepts_under_age === "1" && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-sm">
                              {t("eventDetails.allAgesWelcome")}
                            </span>
                          </div>
                        )}

                        {event.jersey_addon_available === "1" && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Shirt className="w-5 h-5 text-primary" />
                            <span className="text-sm">
                              {t("eventDetails.jerseyAvailable")}
                            </span>
                          </div>
                        )}

                        {event.refundable_if_no_ticket === "1" && (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            <span className="text-sm">
                              {t("eventDetails.refundablePolicy")}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Payment Options */}
                      {event.event_payment_options.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">
                            {t("eventDetails.paymentOptions")}
                          </h4>
                          {event.event_payment_options[0]
                            .installments_available > 0 && (
                            <p className="text-sm text-muted-foreground">
                              • {t("eventDetails.installmentsAvailable")}
                            </p>
                          )}
                          {event.event_payment_options[0]
                            .presale_deposit_available > 0 && (
                            <p className="text-sm text-muted-foreground">
                              • {t("eventDetails.presaleDeposit")}
                            </p>
                          )}
                        </div>
                      )}

                      <Separator />

                      {/* CTA Button */}
                      <Button
                        size="lg"
                        onClick={handleGetTickets}
                        disabled={event.is_sold_out === "1"}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        {event.is_sold_out === "1"
                          ? t("common.soldOut")
                          : t("common.getTickets")}
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <AppFooter />
        </div>
      </LoadingMask>
    </>
  );
};

export default EventDetails;
