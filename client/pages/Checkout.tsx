import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ZoneOption } from "@/data/mockData";
import {
  TicketSelectionStep,
  CustomerInfoStep,
  TicketHoldersInfoStep,
  PaymentInfoStep,
} from "@/components/checkout";
import {
  initialCheckoutValues,
  CheckoutFormValues,
  Step1Values,
  Step2Values,
  Step2_5Values,
  Step3Values,
} from "@/lib/checkoutValidation";

export default function Checkout() {
  const { t } = useTranslation();

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
  const [formData, setFormData] = useState<CheckoutFormValues>(
    initialCheckoutValues,
  );

  const location = useLocation();
  const incomingEvent = (location.state as any)?.event as any | undefined;
  const includesTransportationOffer = Boolean(
    incomingEvent?.includesTransportation,
  );
  // Get available zones from the event
  const availableZones = incomingEvent?.availableZones || [];

  // Jersey add-on state (per-ticket for soccer)
  const isSoccerCategory = (incomingEvent?.category ?? "")
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
  const flightUpgradeSubtotal =
    includesTransportationOffer &&
    formData.step1.transportationMode === "flight"
      ? transportationUpgradeFee * formData.step1.ticketQuantity
      : 0;
  const ticketsSubtotal = basePrice * formData.step1.ticketQuantity;
  const total =
    ticketsSubtotal +
    flightUpgradeSubtotal +
    jerseySubtotal +
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

  const handleStep3Next = (values: Step3Values) => {
    setFormData((prev) => ({ ...prev, step3: values }));
    setCurrentStep(5);
    // Here you would typically submit the form to the backend
    console.log("Final form submission:", { ...formData, step3: values });
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("checkout.backToHome")}
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
              {t("checkout.secureCheckoutTitle")}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Countdown Timer */}
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
                <div className="text-3xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-white/90 text-sm">
                  {t("checkout.timeRemaining")}
                </p>
              </div>
            </div>
            {timeLeft < 300 && (
              <div className="mt-4 flex items-center space-x-2 text-white/90">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  {t("checkout.hurryTimeWarning")}
                </span>
              </div>
            )}
          </div>

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
              <Card className="border-0 shadow-lg dark:bg-slate-800">
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
                      onNext={handleStep2_5Next}
                      onBack={handleStepBack}
                    />
                  )}

                  {currentStep === 4 && (
                    <PaymentInfoStep
                      initialValues={formData.step3}
                      onNext={handleStep3Next}
                      onBack={handleStepBack}
                    />
                  )}

                  {currentStep === 5 && (
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

                      <div className="bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg p-6 text-white">
                        <h4 className="text-lg font-semibold mb-2">
                          {t("checkout.downloadIntelivoucherApp")}
                        </h4>
                        <p className="text-white/90 mb-4">
                          {t("checkout.accessTicketsAndUpdates")}
                        </p>
                        <div className="flex space-x-4 justify-center">
                          <Button variant="secondary" size="sm">
                            {t("checkout.iosAppStore")}
                          </Button>
                          <Button variant="secondary" size="sm">
                            {t("checkout.googlePlay")}
                          </Button>
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
                        {incomingEvent.gifts.map((g: string) => (
                          <Badge key={g} variant="outline" className="text-xs">
                            🎁 {g}
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
                      formData.step1.transportationMode !== "none" && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {t("checkout.transport")}:{" "}
                            {formData.step1.transportationMode === "van"
                              ? t("checkout.van")
                              : t("checkout.flight")}
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
                      <span>${ticketsSubtotal.toFixed(2)}</span>
                    </div>
                    {includesTransportationOffer &&
                      formData.step1.transportationMode === "flight" && (
                        <div className="flex justify-between text-sm">
                          <span>
                            {t("checkout.flightUpgrade").replace(
                              "{{count}}",
                              formData.step1.ticketQuantity.toString(),
                            )}
                          </span>
                          <span>${flightUpgradeSubtotal.toFixed(2)}</span>
                        </div>
                      )}
                    {jerseyAvailable && jerseyCount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("checkout.personalizedJersey").replace(
                            "{{count}}",
                            jerseyCount.toString(),
                          )}
                        </span>
                        <span>${jerseySubtotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t("checkout.serviceFee")}</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{t("checkout.processingFee")}</span>
                      <span>${processingFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("common.total")}</span>
                    <span className="text-brand-blue dark:text-brand-cyan">
                      ${total.toFixed(2)}
                    </span>
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
    </div>
  );
}
