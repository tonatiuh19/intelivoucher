import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Lock,
  Smartphone,
  Mail,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Ticket,
  Timer,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ZoneOption } from "@/types";
import {
  TicketSelectionStep,
  CustomerInfoStep,
  TicketHoldersInfoStep,
  PaymentInfoStep,
} from "@/components/checkout";
import AppHeader from "@/components/AppHeader";
import {
  initialCheckoutValues,
  CheckoutFormValues,
  Step1Values,
  Step2Values,
  Step2_5Values,
  Step3Values,
} from "@/lib/checkoutValidation";
import { formatCurrency, generatePurchaseReference } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/checkoutSlice";
import { LoadingMask } from "@/components/ui/loading-mask";
import {
  createReservationAsync,
  clearCurrentReservation,
  clearReservationErrors,
} from "@/store/slices/reservationSlice";
import {
  selectIsReservationLoading,
  selectIsProcessingPayment,
  selectReservationError,
  selectCurrentReservation,
  selectIsReservationComplete,
  selectReservationSuccessData,
} from "@/store/selectors/reservationSelectors";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Go Back confirmation dialog state
  const [showGoBackDialog, setShowGoBackDialog] = useState(false);

  const STEPS = [
    {
      id: 1,
      title: t("checkout.steps.selectTickets.title"),
      description: t("checkout.steps.selectTickets.description"),
    },
    {
      id: 2,
      title: t("checkout.steps.customerInfo.title"),
      description: t("checkout.steps.customerInfo.description"),
    },
    {
      id: 3,
      title: t("checkout.steps.ticketHoldersInfo.title", "Ticket Holders"),
      description: t(
        "checkout.steps.ticketHoldersInfo.description",
        "Enter information for each ticket",
      ),
    },
    {
      id: 4,
      title: t("checkout.steps.payment.title"),
      description: t("checkout.steps.payment.description"),
    },
    {
      id: 5,
      title: t("checkout.steps.confirmation.title"),
      description: t("checkout.steps.confirmation.description"),
    },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormValues>(
    initialCheckoutValues,
  );

  const location = useLocation();
  const incomingEvent = (location.state as any)?.event as any | undefined;

  // Check if no event data exists and redirect to home
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useAppDispatch();

  // Reservation state
  const isReservationLoading = useAppSelector(selectIsReservationLoading);
  const isProcessingPayment = useAppSelector(selectIsProcessingPayment);
  const reservationError = useAppSelector(selectReservationError);
  const currentReservation = useAppSelector(selectCurrentReservation);
  const isReservationComplete = useAppSelector(selectIsReservationComplete);
  const reservationSuccessData = useAppSelector(selectReservationSuccessData);

  useEffect(() => {
    if (!incomingEvent) {
      // Clear checkout store and reset state
      dispatch(clearCart());
      setIsRedirecting(true);
      navigate("/", { replace: true });
    }
  }, [incomingEvent, navigate, dispatch]);

  // If redirecting, show loading screen
  if (isRedirecting || !incomingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingMask
            isLoading={true}
            text={t("checkout.redirecting", "Redirecting...")}
          />
        </div>
      </div>
    );
  }

  const includesTransportationOffer = Boolean(
    incomingEvent?.includesTransportation,
  );
  // Get available zones from the event
  const availableZones = incomingEvent?.availableZones || [];

  // Get transportation options from the event
  const transportationOptions = incomingEvent?.transportationOptions || [];

  // Jersey add-on state (per-ticket for soccer)
  const isSoccerCategory = (incomingEvent?.category?.name ?? "")
    .toLowerCase()
    .includes("soccer");
  const jerseyAvailable =
    Boolean(incomingEvent?.jerseyAddonAvailable) || isSoccerCategory;
  const jerseyUnitPrice = Number(
    (incomingEvent?.jerseyPrice as number | undefined) ?? 120,
  );

  // Initialize default zone when available zones are loaded
  useEffect(() => {
    if (availableZones.length > 0 && !formData.step1.selectedZone) {
      const defaultZone =
        availableZones.find((z) => z.available)?.id ||
        availableZones[0]?.id ||
        "";
      setFormData((prev) => ({
        ...prev,
        step1: {
          ...prev.step1,
          selectedZone: defaultZone,
        },
      }));
    }
  }, [availableZones, formData.step1.selectedZone]);

  // Sync arrays with ticket quantity changes
  useEffect(() => {
    const ticketQuantity = formData.step1.ticketQuantity;
    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        vanSeats: Array(ticketQuantity)
          .fill("")
          .map((_, i) => prev.step1.vanSeats[i] || ""),
        jerseySelected: Array(ticketQuantity)
          .fill(false)
          .map((_, i) => prev.step1.jerseySelected[i] || false),
        jerseyPersonalized: Array(ticketQuantity)
          .fill(false)
          .map((_, i) => prev.step1.jerseyPersonalized[i] || false),
        jerseyNames: Array(ticketQuantity)
          .fill("")
          .map((_, i) => prev.step1.jerseyNames[i] || ""),
        jerseyNumbers: Array(ticketQuantity)
          .fill("")
          .map((_, i) => prev.step1.jerseyNumbers[i] || ""),
        jerseySizes: Array(ticketQuantity)
          .fill("")
          .map((_, i) => prev.step1.jerseySizes[i] || ""),
        jerseyTypes: Array(ticketQuantity)
          .fill("local")
          .map((_, i) => prev.step1.jerseyTypes[i] || "local"),
      },
      step2_5: {
        ...prev.step2_5,
        ticketHolders: Array(ticketQuantity)
          .fill(null)
          .map(
            (_, i) =>
              prev.step2_5.ticketHolders[i] || {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                idNumber: "",
              },
          ),
      },
    }));
  }, [formData.step1.ticketQuantity]);

  // Define fallback event details BEFORE any usage
  const eventDetails = {
    title: "Coldplay World Tour 2024",
    date: "December 15, 2024",
    time: "8:00 PM",
    venue: "Madison Square Garden",
    location: "New York, NY",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
    section: "Floor A",
    row: "12",
    seats: ["15", "16"],
    price: 89,
  };

  const parsePrice = (p: string | number) => {
    if (typeof p === "number") return p;
    const n = parseFloat(String(p).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : eventDetails.price;
  };

  // Currency conversion utility (MXN to USD)
  // Note: In production, this should fetch from a real-time API
  const convertMXNToUSD = (mxnAmount: number) => {
    const exchangeRate = 0.056; // Approximate rate: 1 MXN ≈ 0.056 USD (as of Oct 2024)
    return mxnAmount * exchangeRate;
  };
  const transportationUpgradeFee = 150;
  const serviceFee = 8.5;
  const processingFee = 3.99;
  const origins = [
    "New York, NY",
    "Miami, FL",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle timer expiration - only show dialog if checkout not completed
  useEffect(() => {
    if (timeLeft === 0 && !showExpiredDialog && !isCheckoutCompleted) {
      setShowExpiredDialog(true);
    }
  }, [timeLeft, showExpiredDialog, isCheckoutCompleted]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // If payment is being processed, prevent navigation and show warning
      if (isReservationLoading || isProcessingPayment) {
        const message = t(
          "checkout.preventNavigationMessage",
          "Your payment is being processed. Are you sure you want to leave? This may cause your payment to fail.",
        );
        event.preventDefault();
        event.returnValue = message; // For older browsers
        return message;
      }

      // Otherwise, clear checkout and reservation state normally
      dispatch(clearCart());
      dispatch(clearCurrentReservation());
      setFormData(initialCheckoutValues);
      setCurrentStep(1);
      setTimeLeft(900); // Reset timer to 15 minutes
      setIsCheckoutCompleted(false); // Reset completion flag
      setShowExpiredDialog(false);
      // Redirect to home page
      navigate("/", { replace: true });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Clear reservation state on unmount (only if not processing)
      if (!isReservationLoading && !isProcessingPayment) {
        dispatch(clearCurrentReservation());
      }
    };
  }, [dispatch, navigate, isReservationLoading, isProcessingPayment, t]);

  const handleSessionExpired = () => {
    // Clear all state when session expires
    dispatch(clearCart());
    dispatch(clearCurrentReservation());
    dispatch(clearReservationErrors());
    setCurrentStep(1); // Reset to first step
    setFormData(initialCheckoutValues); // Reset form data
    setIsCheckoutCompleted(false); // Reset completion flag
    setShowExpiredDialog(false);
    navigate("/", { replace: true });
  };

  const handleGoBackConfirm = () => {
    // Clear all checkout state when user confirms they want to leave
    dispatch(clearCart());
    dispatch(clearCurrentReservation());
    dispatch(clearReservationErrors());
    setCurrentStep(1);
    setFormData(initialCheckoutValues);
    setIsCheckoutCompleted(false);
    setShowGoBackDialog(false);
    navigate("/eventos", { replace: true });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  };

  // Calculate prices based on current form data
  const selectedZoneData = availableZones.find(
    (z) => z.id === formData.step1.selectedZone,
  );
  const zonePrice =
    selectedZoneData?.price ||
    parsePrice(incomingEvent?.price ?? eventDetails.price);
  const basePrice = zonePrice;
  const jerseyCount = formData.step1.jerseySelected.filter(Boolean).length;
  const jerseySubtotal = jerseyAvailable ? jerseyCount * jerseyUnitPrice : 0;

  // Find selected transportation option and calculate cost
  const selectedTransportationOption = transportationOptions.find(
    (option) => option.id === formData.step1.transportationMode,
  );
  const transportationSubtotal =
    includesTransportationOffer &&
    formData.step1.transportationMode !== "none" &&
    selectedTransportationOption
      ? selectedTransportationOption.additionalCost *
        formData.step1.ticketQuantity
      : 0;

  const ticketsSubtotal = basePrice * formData.step1.ticketQuantity;

  // Calculate IVA (Mexican tax - 16%)
  const subtotalBeforeTax =
    ticketsSubtotal + transportationSubtotal + jerseySubtotal;
  const taxRate = 0.16; // 16% IVA
  const taxAmount = subtotalBeforeTax * taxRate;

  const total =
    ticketsSubtotal +
    transportationSubtotal +
    jerseySubtotal +
    taxAmount +
    serviceFee +
    processingFee;

  // Step navigation handlers
  const handleStep1Next = (values: Step1Values) => {
    setFormData((prev) => ({ ...prev, step1: values }));
    setCurrentStep(2);
  };

  const handleStep2Next = (values: Step2Values) => {
    setFormData((prev) => ({ ...prev, step2: values }));
    setCurrentStep(3);
  };

  const handleStep2_5Next = (values: Step2_5Values) => {
    setFormData((prev) => ({ ...prev, step2_5: values }));
    setCurrentStep(4);
  };

  const handleStep3Next = async (values: Step3Values) => {
    try {
      // Clear any previous reservation errors
      dispatch(clearReservationErrors());

      // Update form data
      setFormData((prev) => ({ ...prev, step3: values }));

      // Prepare checkout data for reservation
      const checkoutData = {
        userId: 1, // You'll need to get this from your auth state
        eventId: parseInt(incomingEvent?.id || "1"),
        zoneId: parseInt(formData.step1.selectedZone || "1"),
        quantity: formData.step1.ticketQuantity,
        unitPrice: zonePrice,
        subtotal: ticketsSubtotal,
        taxes: taxAmount,
        fees: serviceFee + processingFee,
        discount: 0,
        totalAmount: total,
        currency: "mxn",
        purchaseReference: (() => {
          const ref = generatePurchaseReference();
          console.log("Generated purchase reference:", ref);
          return ref;
        })(), // Generate unique reference to prevent duplicates
        passengers: formData.step2_5.ticketHolders.map((holder) => ({
          attendee_name: `${holder.firstName} ${holder.lastName}`.trim(),
          ticket_status: "active",
        })),
        transportationOptionId:
          formData.step1.transportationMode !== "none"
            ? parseInt(formData.step1.transportationMode || "0")
            : undefined,
        transportOrigin: formData.step1.transportOrigin,
        emergencyContactName:
          `${formData.step2.firstName} ${formData.step2.lastName}`.trim(),
        emergencyContactPhone: formData.step2.phone,
        includesJersey: jerseyCount > 0,
        jerseySelections:
          jerseyCount > 0
            ? formData.step1.jerseySelected
                .map((isSelected, index) => {
                  if (!isSelected) return null;
                  return {
                    jersey_size: formData.step1.jerseySizes[index] || "",
                    jersey_type: formData.step1.jerseyTypes[index] || "local",
                    player_name: formData.step1.jerseyPersonalized[index]
                      ? formData.step1.jerseyNames[index] || ""
                      : "",
                    player_number: formData.step1.jerseyPersonalized[index]
                      ? formData.step1.jerseyNumbers[index] || ""
                      : "",
                    additional_cost: jerseyUnitPrice, // Jersey unit price
                  };
                })
                .filter(Boolean)
            : undefined,
        specialRequests: null,
        promoCode: null,
      };

      // Prepare payment data based on payment result
      const paymentResult = values.paymentResult;
      let paymentData;

      console.log("Payment result received:", paymentResult);

      if (!paymentResult) {
        throw new Error("No payment result received");
      }

      // Determine payment method based on result structure
      if (paymentResult.paymentMethod === "paypal") {
        // PayPal payment
        paymentData = {
          payment_method: "paypal" as const,
          paypal_order_id: paymentResult.id,
        };
        console.log("Prepared PayPal payment data:", paymentData);
      } else {
        // Stripe payment (default if not explicitly PayPal)
        paymentData = {
          payment_method: "stripe" as const,
          payment_token: paymentResult.id,
        };
        console.log("Prepared Stripe payment data:", paymentData);
        console.log("Payment method ID being sent:", paymentResult.id);
      }

      // Create reservation
      const result = await dispatch(
        createReservationAsync({
          checkoutData,
          paymentData,
        }),
      );

      if (createReservationAsync.fulfilled.match(result)) {
        // Success - move to confirmation step and stop timer
        setCurrentStep(5);
        setIsCheckoutCompleted(true); // Mark checkout as completed
        setTimeLeft(0); // Stop the timer
        console.log("Reservation created successfully:", result.payload);
      } else {
        // Handle error - stay on payment step for retry
        console.error("Reservation creation failed:", result.payload);
        // Don't advance to step 5, keep user on payment step to retry
        // The error will be displayed in the UI via reservationError selector
      }
    } catch (error) {
      console.error("Error in handleStep3Next:", error);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <AppHeader variant="checkout" />

      {/* Go Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <Button
          variant="ghost"
          onClick={() => setShowGoBackDialog(true)}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-4"
          disabled={isReservationLoading || isProcessingPayment}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("checkout.goBack")}</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Global Processing Warning Banner */}
          {(isReservationLoading || isProcessingPayment) &&
            !reservationError && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 mb-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <div>
                      <h3 className="font-semibold">
                        {t(
                          "checkout.processingPaymentTitle",
                          "Processing Your Payment",
                        )}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {t(
                          "checkout.processingStayOnPage",
                          "Please stay on this page while we process your order",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-4 text-sm text-blue-100">
                    <span>🚫 {t("checkout.dontRefresh", "Don't refresh")}</span>
                    <span>🚫 {t("checkout.dontGoBack", "Don't go back")}</span>
                    <span>✅ {t("checkout.stayHere", "Stay here")}</span>
                  </div>
                </div>
              </div>
            )}
          {/* Countdown Timer - Show different states based on current step and reservation status */}
          {currentStep < 5 || !isReservationComplete || reservationError ? (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Timer className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t("checkout.ticketsReserved")}
                    </h3>
                    <p className="text-white/90">
                      {t("checkout.completePurchase")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-mono font-bold ${
                      timeLeft < 60
                        ? "animate-pulse text-red-200"
                        : timeLeft < 300
                          ? "text-yellow-200"
                          : ""
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-white/90 text-sm">
                    {t("checkout.timeRemaining")}
                  </p>
                </div>
              </div>
              {timeLeft < 300 && timeLeft > 0 && (
                <div className="mt-4 flex items-center space-x-2 text-white/90">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {timeLeft < 60
                      ? t(
                          "checkout.criticalTimeWarning",
                          "⚠️ Less than 1 minute remaining! Complete your purchase now.",
                        )
                      : t(
                          "checkout.hurryTimeWarning",
                          "Hurry! Complete your purchase before time runs out.",
                        )}
                  </span>
                </div>
              )}
              {timeLeft === 0 && currentStep < 5 && (
                <div className="mt-4 flex items-center space-x-2 text-white/90">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("checkout.timeExpired", "Time expired! Redirecting...")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Success Banner - Only show when truly successful */
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t(
                        "checkout.purchaseCompleted",
                        "Purchase Completed Successfully!",
                      )}
                    </h3>
                    <p className="text-white/90">
                      {t(
                        "checkout.confirmationSent",
                        "Confirmation details have been sent to your email",
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">✓</div>
                  <p className="text-white/90 text-sm">
                    {t("checkout.secured", "Secured")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout */}
            <div className="lg:col-span-2">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          currentStep >= step.id
                            ? "bg-brand-blue text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className={`h-1 w-16 mx-2 rounded ${
                            currentStep > step.id
                              ? "bg-brand-blue"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="flex justify-between mt-2">
                  {STEPS.map((step) => (
                    <div key={step.id} className="text-center">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <Card
                className={`border-0 shadow-lg dark:bg-slate-800 relative ${
                  timeLeft === 0 || isReservationLoading || isProcessingPayment
                    ? "pointer-events-none"
                    : ""
                } ${
                  (isReservationLoading || isProcessingPayment) &&
                  !reservationError
                    ? "opacity-75"
                    : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl dark:text-slate-200">
                    {STEPS[currentStep - 1].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStep === 1 && (
                    <TicketSelectionStep
                      initialValues={formData.step1}
                      availableZones={availableZones}
                      includesTransportationOffer={includesTransportationOffer}
                      transportationOptions={transportationOptions}
                      jerseyAvailable={jerseyAvailable}
                      jerseyUnitPrice={jerseyUnitPrice}
                      transportationUpgradeFee={transportationUpgradeFee}
                      origins={origins}
                      onNext={handleStep1Next}
                      onBack={handleStepBack}
                    />
                  )}

                  {currentStep === 2 && (
                    <CustomerInfoStep
                      initialValues={formData.step2}
                      onNext={handleStep2Next}
                      onBack={handleStepBack}
                    />
                  )}

                  {currentStep === 3 && (
                    <TicketHoldersInfoStep
                      initialValues={formData.step2_5}
                      ticketQuantity={formData.step1.ticketQuantity}
                      primaryContact={formData.step2}
                      transportationMode={formData.step1.transportationMode}
                      onNext={handleStep2_5Next}
                      onBack={handleStepBack}
                    />
                  )}

                  {currentStep === 4 && (
                    <>
                      <PaymentInfoStep
                        initialValues={formData.step3}
                        onNext={handleStep3Next}
                        onBack={handleStepBack}
                        totalAmount={Math.round(total * 100)} // Convert to cents
                      />

                      {/* Reservation Processing Overlay - only show when loading and no error */}
                      {(isReservationLoading || isProcessingPayment) &&
                        !reservationError && (
                          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg flex items-center justify-center z-10">
                            <div className="text-center space-y-6 max-w-md mx-auto p-6">
                              <LoadingMask
                                isLoading={true}
                                text={t(
                                  "checkout.creatingReservation",
                                  "Creating your reservation...",
                                )}
                              />
                              <div className="space-y-4">
                                <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                                  {t(
                                    "checkout.processingPaymentMessage",
                                    "Please wait while we process your payment and create your reservation.",
                                  )}
                                </p>

                                {/* Warning Box */}
                                <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4">
                                  <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                        {t(
                                          "checkout.processingWarningTitle",
                                          "⚠️ Important: Do Not Leave This Page",
                                        )}
                                      </h4>
                                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                        <li>
                                          •{" "}
                                          {t(
                                            "checkout.processingWarning1",
                                            "Do not refresh or close your browser",
                                          )}
                                        </li>
                                        <li>
                                          •{" "}
                                          {t(
                                            "checkout.processingWarning2",
                                            "Do not press the back button",
                                          )}
                                        </li>
                                        <li>
                                          •{" "}
                                          {t(
                                            "checkout.processingWarning3",
                                            "Your payment is being processed securely",
                                          )}
                                        </li>
                                        <li>
                                          •{" "}
                                          {t(
                                            "checkout.processingWarning4",
                                            "This process may take up to 30 seconds",
                                          )}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Reservation Error Display */}
                      {reservationError && (
                        <div className="mt-4">
                          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                              <div className="space-y-2">
                                <div>
                                  <strong>
                                    {t(
                                      "checkout.reservationError",
                                      "Reservation Error",
                                    )}
                                    :
                                  </strong>{" "}
                                  {reservationError}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    dispatch(clearReservationErrors())
                                  }
                                  className="bg-white hover:bg-red-50 text-red-700 border-red-300"
                                >
                                  {t("checkout.tryAgain", "Try Again")}
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </>
                  )}

                  {currentStep === 5 &&
                    isReservationComplete &&
                    !reservationError && (
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                            {t("checkout.paymentSuccessful")}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {t("checkout.ticketsSentToDevice")}
                          </p>
                        </div>

                        {/* Reservation Details */}
                        {reservationSuccessData && (
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
                            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                              {t(
                                "checkout.reservationDetails",
                                "Reservation Details",
                              )}
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {t("checkout.purchaseId", "Purchase ID")}:
                                </span>
                                <p className="font-mono font-bold">
                                  #{reservationSuccessData.purchaseId}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {t(
                                    "checkout.transactionId",
                                    "Transaction ID",
                                  )}
                                  :
                                </span>
                                <p className="font-mono text-xs">
                                  {reservationSuccessData.transactionId}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {t(
                                    "checkout.paymentMethod",
                                    "Payment Method",
                                  )}
                                  :
                                </span>
                                <p className="capitalize">
                                  {reservationSuccessData.paymentMethod}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {t("checkout.totalPaid", "Total Paid")}:
                                </span>
                                <p className="font-bold">
                                  MXN{" "}
                                  {formatCurrency(
                                    reservationSuccessData.totalAmount,
                                  )}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  ≈ USD{" "}
                                  {formatCurrency(
                                    convertMXNToUSD(
                                      reservationSuccessData.totalAmount,
                                    ),
                                  )}{" "}
                                  {t(
                                    "checkout.approximateRate",
                                    "Approximate rate",
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Tickets */}
                            {reservationSuccessData.tickets &&
                              reservationSuccessData.tickets.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    {t("checkout.yourTickets", "Your Tickets")}
                                  </h5>
                                  <div className="space-y-2">
                                    {reservationSuccessData.tickets.map(
                                      (ticket, index) => (
                                        <div
                                          key={ticket.ticket_id}
                                          className="flex justify-between items-center bg-white dark:bg-slate-700 p-3 rounded border"
                                        >
                                          <span className="font-mono text-sm">
                                            {ticket.ticket_number}
                                          </span>
                                          <span className="text-sm">
                                            {ticket.attendee_name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {ticket.ticket_status}
                                          </Badge>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Next Steps Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <h5 className="font-semibold text-blue-900 dark:text-blue-100">
                                {t(
                                  "checkout.emailConfirmation",
                                  "Email Confirmation",
                                )}
                              </h5>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              {t(
                                "checkout.emailConfirmationDesc",
                                "Check your email for detailed booking confirmation and ticket information.",
                              )}
                            </p>
                          </div>

                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Smartphone className="w-4 h-4 text-green-600" />
                              <h5 className="font-semibold text-green-900 dark:text-green-100">
                                {t("checkout.mobileTickets", "Mobile Tickets")}
                              </h5>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {t(
                                "checkout.mobileTicketsDesc",
                                "Your tickets will be sent to your email with entry instructions. No need to print anything!",
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Important Reminders */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                {t(
                                  "checkout.importantReminders",
                                  "Important Reminders",
                                )}
                              </h5>
                              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                                <li>
                                  {t(
                                    "checkout.bringId",
                                    "Bring valid ID matching your ticket information",
                                  )}
                                </li>
                                <li>
                                  {t(
                                    "checkout.arriveEarly",
                                    "Arrive at least 30 minutes before event start",
                                  )}
                                </li>
                                <li>
                                  {t(
                                    "checkout.checkEmail",
                                    "Check your email for ticket details and updates",
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg p-6 text-white">
                          <h4 className="text-lg font-semibold mb-2">
                            {t(
                              "checkout.emailConfirmation",
                              "Email Confirmation Sent",
                            )}
                          </h4>
                          <p className="text-white/90 mb-4">
                            {t(
                              "checkout.checkEmailForTickets",
                              "Check your email for ticket details, entry instructions, and event updates.",
                            )}
                          </p>
                          <div className="flex items-center justify-center">
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                              <span className="text-2xl mr-2">📧</span>
                              <span className="font-medium">
                                {t(
                                  "checkout.emailSent",
                                  "Confirmation email sent!",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24 dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-slate-200">
                    {t("checkout.orderSummary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <img
                      src={
                        (incomingEvent?.image as string) ?? eventDetails.image
                      }
                      alt={
                        (incomingEvent?.title as string) ?? eventDetails.title
                      }
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        {(incomingEvent?.title as string) ?? eventDetails.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {(incomingEvent?.date as string) ?? eventDetails.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{eventDetails.time}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {incomingEvent?.location ?? eventDetails.location}
                      </span>
                    </div>
                    {incomingEvent?.gifts?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {incomingEvent.gifts.map((gift: any) => (
                          <Badge
                            key={gift.id || gift.gift_name}
                            variant="outline"
                            className="text-xs"
                          >
                            🎁{" "}
                            {i18n.language === "es"
                              ? gift.gift_name_es || gift.gift_name
                              : gift.gift_name}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    {incomingEvent?.acceptsUnderAge === false && (
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs text-red-400 border-red-500/40"
                        >
                          {t("checkout.eighteenPlusOnly")}
                        </Badge>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {t("checkout.zone")}: {formData.step1.selectedZone}
                    </Badge>
                    {includesTransportationOffer &&
                      formData.step1.transportationMode !== "none" &&
                      selectedTransportationOption && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {t("checkout.transport")}:{" "}
                            {i18n.language === "es"
                              ? selectedTransportationOption.name_es ||
                                selectedTransportationOption.name
                              : selectedTransportationOption.name}
                            {formData.step1.transportOrigin
                              ? ` • ${formData.step1.transportOrigin}`
                              : ""}
                          </Badge>
                        </div>
                      )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>
                        {t("checkout.ticketsCount").replace(
                          "{{count}}",
                          formData.step1.ticketQuantity.toString(),
                        )}
                      </span>
                      <span>{formatCurrency(ticketsSubtotal)}</span>
                    </div>
                    {includesTransportationOffer &&
                      formData.step1.transportationMode !== "none" &&
                      selectedTransportationOption && (
                        <div className="flex justify-between text-sm">
                          <span>
                            {i18n.language === "es"
                              ? selectedTransportationOption.name_es ||
                                selectedTransportationOption.name
                              : selectedTransportationOption.name}{" "}
                            ({formData.step1.ticketQuantity}x)
                          </span>
                          <span>{formatCurrency(transportationSubtotal)}</span>
                        </div>
                      )}
                    {jerseyAvailable && jerseyCount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("checkout.personalizedJerseyCount").replace(
                            "{{count}}",
                            jerseyCount.toString(),
                          )}
                        </span>
                        <span>{formatCurrency(jerseySubtotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t("checkout.taxes", "IVA (16%)")}</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t("checkout.serviceFee")}</span>
                      <span>{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t("checkout.processingFee")}</span>
                      <span>{formatCurrency(processingFee)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("common.total")}</span>
                    <div className="text-right">
                      <div className="text-brand-blue dark:text-brand-cyan">
                        MXN {formatCurrency(total)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                        ≈ USD {formatCurrency(convertMXNToUSD(total))}{" "}
                        {t("checkout.approximateRate", "Approximate rate")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("checkout.secureCheckoutStripe")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Go Back Confirmation Dialog */}
      <AlertDialog open={showGoBackDialog} onOpenChange={setShowGoBackDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{t("checkout.goBackConfirmTitle")}</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("checkout.goBackConfirmMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Warning Section - Outside of AlertDialogDescription to avoid nesting issues */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mx-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  {t("checkout.processingWarningTitle", "⚠️ Important:")}
                </h5>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• {t("checkout.goBackConsequences1")}</li>
                  <li>• {t("checkout.goBackConsequences2")}</li>
                  <li>• {t("checkout.goBackConsequences3")}</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowGoBackDialog(false)}
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-300 dark:border-green-700"
            >
              {t("checkout.stayAndContinue")}
            </Button>
            <AlertDialogAction
              onClick={handleGoBackConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t("checkout.leaveCheckout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Session Expired Dialog */}
      <AlertDialog open={showExpiredDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("checkout.sessionExpiredTitle", "Session Expired")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "checkout.sessionExpiredMessage",
                "Your reservation time has expired. You will be redirected back to select your tickets again.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSessionExpired}>
              {t("common.goBack", "Go Back")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
