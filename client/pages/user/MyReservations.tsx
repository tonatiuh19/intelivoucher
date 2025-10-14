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
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <TicketIcon className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  {purchase.purchase_reference ||
                    `${t("common.purchase")} #${purchase.id}`}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formatDate(purchase.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-3 w-3" />
                  <span>
                    {purchase.quantity}{" "}
                    {purchase.quantity === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <div className="text-right">
                <p className="text-xl font-bold text-foreground mb-2">
                  {formatCurrency(purchase.total_amount)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={getStatusBadgeVariant(purchase.purchase_status)}
                  className="flex items-center space-x-1"
                >
                  {getStatusIcon(purchase.purchase_status)}
                  <span className="capitalize">{purchase.purchase_status}</span>
                </Badge>
                <Badge
                  variant={getStatusBadgeVariant(purchase.payment_status)}
                  className="flex items-center space-x-1"
                >
                  <CreditCardIcon className="h-3 w-3" />
                  <span className="capitalize">{purchase.payment_status}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {purchase.transportation_option_id && (
              <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <PlaneIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Transport</p>
                  <p className="text-sm font-medium text-foreground">
                    {purchase.transport_origin}
                  </p>
                </div>
              </div>
            )}
            {purchase.includes_jersey === 1 && (
              <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <ShirtIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Jersey</p>
                  <p className="text-sm font-medium text-foreground">
                    Included
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tickets Section */}
          {tickets.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-foreground">
                <TicketIcon className="h-4 w-4 mr-2 text-primary" />
                {t("common.tickets")}
              </h4>
              <div className="grid gap-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border backdrop-blur-sm group-hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <TicketIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {ticket.ticket_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.attendee_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getStatusBadgeVariant(ticket.ticket_status)}
                      >
                        {ticket.ticket_status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h4 className="font-semibold flex items-center text-foreground">
                <ShirtIcon className="h-4 w-4 mr-2 text-primary" />
                {t("common.jerseySelections")}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {jersey_selections.map((jersey) => (
                  <div
                    key={jersey.id}
                    className="p-4 bg-muted/50 rounded-xl border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">
                          {t("common.size")}: {jersey.jersey_size}
                        </p>
                        {jersey.jersey_type && (
                          <p className="text-sm text-muted-foreground">
                            {t("common.type")}: {jersey.jersey_type}
                          </p>
                        )}
                        {jersey.player_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {jersey.player_name} #{jersey.player_number}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        +{formatCurrency(jersey.additional_cost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
            {purchase.emergency_contact_name && (
              <div>
                <h5 className="font-medium text-foreground mb-2">
                  {t("common.emergencyContact")}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {purchase.emergency_contact_name} -{" "}
                  {purchase.emergency_contact_phone}
                </p>
              </div>
            )}
            {purchase.special_requests && (
              <div>
                <h5 className="font-medium text-foreground mb-2">
                  {t("common.specialRequests")}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {purchase.special_requests}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => {
                // TODO: Implement ticket download functionality
                console.log("Downloading tickets for purchase:", purchase.id);
                // This could open a PDF or trigger a download
              }}
            >
              <FileDown className="w-4 h-4 mr-2" />
              {t("common.downloadTickets")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
              <Receipt className="w-4 h-4 mr-2" />
              {t("common.requestInvoice")}
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

        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <TicketIcon className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("common.myReservations")}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Track your bookings, manage your tickets, and relive your
                amazing experiences
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TicketIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalReservations}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Bookings
                    </p>
                  </div>
                </Card>

                <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(stats.totalSpent.toString())}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </Card>

                <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.activeReservations}
                    </p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </Card>

                <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.completedReservations}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t("common.searchReservations")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["all", "confirmed", "completed", "pending"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
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
                disabled={isLoadingUserReservations}
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
              <Card className="text-center py-16 border-border/50 bg-card backdrop-blur-sm">
                <CardContent>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TicketIcon className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {userReservations.length === 0
                      ? t("common.noReservationsFound")
                      : "No matches found"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {userReservations.length === 0
                      ? t("common.noReservationsText")
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {userReservations.length === 0 && (
                    <Button onClick={() => navigate("/")}>
                      {t("common.browseEvents")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
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

        {/* Support Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              window.open(
                "https://wa.me/1234567890?text=Hello, I need help with my reservation",
                "_blank",
              )
            }
            aria-label={t("common.whatsappSupport")}
            title={t("common.whatsappSupport")}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              window.open(
                "mailto:support@intelivoucher.com?subject=Support Request - My Reservations",
                "_blank",
              )
            }
            aria-label={t("common.emailSupport")}
            title={t("common.emailSupport")}
          >
            <Mail className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </LoadingMask>
  );
};

export default MyReservations;
