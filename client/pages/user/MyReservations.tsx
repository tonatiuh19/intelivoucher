import React, { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/store";
import { fetchUserReservationsAsync } from "@/store/slices/reservationSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingMask } from "@/components/ui/loading-mask";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
  TicketIcon,
  ShirtIcon,
  PlaneIcon,
  AlertCircle,
  CheckCircle2,
  Ticket,
  Menu,
  X,
  Heart,
  Music,
  Trophy,
  Camera,
  Download,
  Share2,
  Star,
  Clock,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Mail,
  FileDown,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectUser,
} from "@/store/selectors/authSelectors";
import { openSignInModal } from "@/store/slices/authSlice";
import type { UserReservation } from "@/types";

const MyReservations: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Selectors
  const { userReservations, isLoadingUserReservations, userReservationsError } =
    useAppSelector((state: RootState) => state.reservation);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

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

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserReservationsAsync(user.id));
    }
  }, [dispatch, user?.id]);

  // Filter reservations
  const filteredReservations = userReservations.filter((reservation) => {
    const matchesStatus =
      filterStatus === "all" ||
      reservation.purchase.purchase_status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      reservation.purchase.purchase_reference
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.tickets.some((ticket) =>
        ticket.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return dateString;
    }
  };

  // Stats calculation
  const stats = {
    totalReservations: userReservations.length,
    totalSpent: userReservations.reduce(
      (sum, res) => sum + parseFloat(res.purchase.total_amount),
      0,
    ),
    activeReservations: userReservations.filter(
      (res) => res.purchase.purchase_status === "confirmed",
    ).length,
    completedReservations: userReservations.filter(
      (res) => res.purchase.purchase_status === "completed",
    ).length,
  };

  const ReservationCard: React.FC<{ reservation: UserReservation }> = ({
    reservation,
  }) => {
    const { purchase, tickets, jersey_selections, payment_installments } =
      reservation;

    return (
      <Card className="w-full group hover:shadow-xl transition-all duration-300 border-border/50 bg-card backdrop-blur-sm">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TicketIcon className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base md:text-lg text-foreground truncate">
                  {purchase.purchase_reference ||
                    `${t("common.purchase")} #${purchase.id}`}
                </CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-1 sm:gap-0 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {formatDate(purchase.created_at)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-3 w-3 flex-shrink-0" />
                  <span>
                    {purchase.quantity}{" "}
                    {purchase.quantity === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start md:space-y-3 gap-3 md:gap-0">
              <div className="text-left md:text-right">
                <p className="text-lg md:text-xl font-bold text-foreground">
                  {formatCurrency(purchase.total_amount)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={getStatusBadgeVariant(purchase.purchase_status)}
                  className="flex items-center space-x-1 text-xs"
                >
                  {getStatusIcon(purchase.purchase_status)}
                  <span className="capitalize">{purchase.purchase_status}</span>
                </Badge>
                <Badge
                  variant={getStatusBadgeVariant(purchase.payment_status)}
                  className="flex items-center space-x-1 text-xs"
                >
                  <CreditCardIcon className="h-3 w-3" />
                  <span className="capitalize">{purchase.payment_status}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-6">
          {/* Quick Info Grid */}
          {(purchase.transportation_option_id ||
            purchase.includes_jersey === 1) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {purchase.transportation_option_id && (
                <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                  <PlaneIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Transport</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {purchase.transport_origin}
                    </p>
                  </div>
                </div>
              )}
              {purchase.includes_jersey === 1 && (
                <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                  <ShirtIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Jersey</p>
                    <p className="text-sm font-medium text-foreground">
                      Included
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tickets Section */}
          {tickets.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-foreground text-sm md:text-base">
                <TicketIcon className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                {t("common.tickets")}
              </h4>
              <div className="grid gap-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border backdrop-blur-sm group-hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TicketIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm md:text-base truncate">
                          {ticket.ticket_number}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {ticket.attendee_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <Badge
                        variant={getStatusBadgeVariant(ticket.ticket_status)}
                        className="text-xs"
                      >
                        {ticket.ticket_status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jersey Selections */}
          {jersey_selections.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-foreground text-sm md:text-base">
                <ShirtIcon className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                {t("common.jerseySelections")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jersey_selections.map((jersey) => (
                  <div
                    key={jersey.id}
                    className="p-3 md:p-4 bg-muted/50 rounded-xl border"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm md:text-base">
                          {t("common.size")}: {jersey.jersey_size}
                        </p>
                        {jersey.jersey_type && (
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {t("common.type")}: {jersey.jersey_type}
                          </p>
                        )}
                        {jersey.player_name && (
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {jersey.player_name} #{jersey.player_number}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary flex-shrink-0">
                        +{formatCurrency(jersey.additional_cost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {(purchase.emergency_contact_name || purchase.special_requests) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-border/50">
              {purchase.emergency_contact_name && (
                <div>
                  <h5 className="font-medium text-foreground mb-2 text-sm md:text-base">
                    {t("common.emergencyContact")}
                  </h5>
                  <p className="text-xs md:text-sm text-muted-foreground break-words">
                    {purchase.emergency_contact_name} -{" "}
                    {purchase.emergency_contact_phone}
                  </p>
                </div>
              )}
              {purchase.special_requests && (
                <div>
                  <h5 className="font-medium text-foreground mb-2 text-sm md:text-base">
                    {t("common.specialRequests")}
                  </h5>
                  <p className="text-xs md:text-sm text-muted-foreground break-words">
                    {purchase.special_requests}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-border/50">
            {/*             <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-11"
              size="sm"
              onClick={() => {
                // TODO: Implement ticket download functionality
                console.log("Downloading tickets for purchase:", purchase.id);
                // This could open a PDF or trigger a download
              }}
            >
              <FileDown className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{t("common.downloadTickets")}</span>
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-11"
              onClick={() => {
                // TODO: Implement invoice request functionality
                console.log("Requesting invoice for purchase:", purchase.id);
                // This could open a modal or send a request to the server
                window.open(
                  `mailto:billing@intelivoucher.com?subject=Invoice Request - ${purchase.purchase_reference || `Purchase #${purchase.id}`}&body=Hello, I would like to request an invoice for my purchase with reference: ${purchase.purchase_reference || `#${purchase.id}`}. Purchase date: ${purchase.created_at}. Total amount: ${purchase.total_amount}.`,
                  "_blank",
                );
              }}
            >
              <Receipt className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{t("common.requestInvoice")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <LoadingMask isLoading={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <AppHeader
          variant="default"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Breadcrumb Navigation */}
        <nav className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-border/50 py-3 md:py-4 px-4 pt-20 md:pt-24">
          <div className="container mx-auto">
            <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="h-auto p-0 text-muted-foreground hover:text-foreground flex-shrink-0 min-w-0"
              >
                <span className="hidden sm:inline">{t("common.home")}</span>
                <span className="sm:hidden">
                  {t("common.home").substring(0, 1)}
                </span>
              </Button>
              <span className="flex-shrink-0">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/eventos")}
                className="h-auto p-0 text-muted-foreground hover:text-foreground flex-shrink-0 min-w-0"
              >
                <span className="hidden sm:inline">{t("common.events")}</span>
                <span className="sm:hidden">
                  {t("common.events").substring(0, 1)}
                </span>
              </Button>
              <span className="flex-shrink-0">/</span>
              <span className="text-foreground font-medium truncate min-w-0">
                <span className="hidden sm:inline">
                  {t("common.myReservations")}
                </span>
                <span className="sm:hidden">Reservations</span>
              </span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
          <div className="absolute inset-0 hidden md:block">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <TicketIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("common.myReservations")}
                </span>
              </h1>

              <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Track your bookings, manage your tickets, and relive your
                amazing experiences
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
                <Card className="p-4 md:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <TicketIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats.totalReservations}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Total Bookings
                    </p>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {formatCurrency(stats.totalSpent.toString())}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Total Spent
                    </p>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats.activeReservations}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Active
                    </p>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats.completedReservations}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Completed
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t("common.searchReservations")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {["all", "confirmed", "completed", "pending"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    className="flex-shrink-0 h-10"
                  >
                    {t(`common.${status}`)}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => {
                  if (user?.id) {
                    dispatch(fetchUserReservationsAsync(user.id));
                  }
                }}
                variant="outline"
                size="sm"
                disabled={isLoadingUserReservations}
                className="h-10 flex-shrink-0"
              >
                {t("common.refresh")}
              </Button>
            </div>

            {/* Content */}
            {isLoadingUserReservations ? (
              <div className="relative min-h-[400px]">
                <LoadingMask isLoading={true} />
              </div>
            ) : userReservationsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>{userReservationsError}</AlertDescription>
              </Alert>
            ) : filteredReservations.length === 0 ? (
              <Card className="text-center py-12 md:py-16 border-border/50 bg-card backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <TicketIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground px-4">
                    {userReservations.length === 0
                      ? t("common.noReservationsFound")
                      : "No matches found"}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md mx-auto px-4">
                    {userReservations.length === 0
                      ? t("common.noReservationsText")
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {userReservations.length === 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                      <Button
                        onClick={() => navigate("/eventos")}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        {t("common.browseEvents")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        {t("common.home")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.purchase.id}
                    reservation={reservation}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <AppFooter />

        {/* Support Buttons - Hidden on small mobile */}
        <div className="hidden sm:flex fixed bottom-6 right-6 flex-col gap-3 z-40">
          <Button
            size="lg"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              window.open(
                "https://wa.me/1234567890?text=Hello, I need help with my reservation",
                "_blank",
              )
            }
            aria-label={t("common.whatsappSupport")}
            title={t("common.whatsappSupport")}
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Button
            size="lg"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              window.open(
                "mailto:support@intelivoucher.com?subject=Support Request - My Reservations",
                "_blank",
              )
            }
            aria-label={t("common.emailSupport")}
            title={t("common.emailSupport")}
          >
            <Mail className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </div>
    </LoadingMask>
  );
};

export default MyReservations;
