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
      title: t("checkout.steps.payment.title"),
      description: t("checkout.steps.payment.description"),
    },
    {
      id: 4,
      title: t("checkout.steps.confirmation.title"),
      description: t("checkout.steps.confirmation.description"),
    },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const location = useLocation();
  const incomingEvent = (location.state as any)?.event as any | undefined;
  const includesTransportationOffer = Boolean(
    incomingEvent?.includesTransportation,
  );
  // Get available zones from the event
  const availableZones = incomingEvent?.availableZones || [];

  const [selectedZone, setSelectedZone] = useState<string>("");
  const [transportationMode, setTransportationMode] = useState<
    "none" | "van" | "flight"
  >("none");
  const [transportOrigin, setTransportOrigin] = useState<string>("");
  const [vanSeats, setVanSeats] = useState<string[]>(Array(2).fill(""));

  // Jersey add-on state (per-ticket for soccer)
  const isSoccerCategory = (incomingEvent?.category ?? "")
    .toLowerCase()
    .includes("soccer");
  const jerseyAvailable =
    Boolean(incomingEvent?.jerseyAddonAvailable) || isSoccerCategory;
  const jerseyUnitPrice = Number(
    (incomingEvent?.jerseyPrice as number | undefined) ?? 120,
  );
  const [jerseySelected, setJerseySelected] = useState<boolean[]>(
    Array(2).fill(false),
  );
  const [jerseyNames, setJerseyNames] = useState<string[]>(Array(2).fill(""));
  const [jerseyNumbers, setJerseyNumbers] = useState<string[]>(
    Array(2).fill(""),
  );
  const [jerseySizes, setJerseySizes] = useState<string[]>(Array(2).fill(""));

  // Keep arrays in sync with ticketQuantity
  useEffect(() => {
    setVanSeats((prev) => {
      const next = [...prev];
      next.length = ticketQuantity;
      return next.map((v) => v || "");
    });
  }, [ticketQuantity]);

  useEffect(() => {
    const sync = <T,>(arr: T[], fill: T) => {
      const next = [...arr];
      next.length = ticketQuantity;
      return next.map((v) => v ?? fill);
    };
    setJerseySelected((prev) => sync(prev, false));
    setJerseyNames((prev) => sync(prev, ""));
    setJerseyNumbers((prev) => sync(prev, ""));
    setJerseySizes((prev) => sync(prev, ""));
  }, [ticketQuantity]);

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
  // Get price based on selected zone
  const selectedZoneData = availableZones.find((z) => z.id === selectedZone);
  const zonePrice =
    selectedZoneData?.price ||
    parsePrice(incomingEvent?.price ?? eventDetails.price);
  const basePrice = zonePrice;
  const transportationUpgradeFee = 150;

  // Set default zone when component loads
  useEffect(() => {
    if (availableZones.length > 0 && !selectedZone) {
      const defaultZone =
        availableZones.find((z) => z.available)?.id ||
        availableZones[0]?.id ||
        "";
      setSelectedZone(defaultZone);
    }
  }, [availableZones, selectedZone]);

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

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jerseyCount = jerseySelected.filter(Boolean).length;
  const jerseySubtotal = jerseyAvailable ? jerseyCount * jerseyUnitPrice : 0;
  const flightUpgradeSubtotal =
    includesTransportationOffer && transportationMode === "flight"
      ? transportationUpgradeFee * ticketQuantity
      : 0;
  const serviceFee = 8.5;
  const processingFee = 3.99;
  const ticketsSubtotal = basePrice * ticketQuantity;
  const total =
    ticketsSubtotal +
    flightUpgradeSubtotal +
    jerseySubtotal +
    serviceFee +
    processingFee;

  const origins = [
    "New York, NY",
    "Miami, FL",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
  ];

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
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-semibold">
                          {t("checkout.selectQuantity")}
                        </Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setTicketQuantity(Math.max(1, ticketQuantity - 1))
                            }
                          >
                            -
                          </Button>
                          <span className="text-xl font-semibold px-4">
                            {ticketQuantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setTicketQuantity(Math.min(8, ticketQuantity + 1))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold">
                          {t("checkout.zoneSelection")}
                        </Label>
                        <RadioGroup
                          value={selectedZone}
                          onValueChange={setSelectedZone}
                          className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                          {availableZones.map((zone) => (
                            <div
                              key={zone.id}
                              className={`flex items-center justify-between space-x-2 rounded-lg border ${zone.available ? "border-slate-200 dark:border-slate-700" : "border-slate-300 dark:border-slate-600 opacity-50"} p-3`}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  id={`zone-${zone.id}`}
                                  value={zone.id}
                                  disabled={!zone.available}
                                />
                                <div className="flex flex-col">
                                  <Label
                                    htmlFor={`zone-${zone.id}`}
                                    className={`cursor-pointer ${zone.available ? "" : "cursor-not-allowed opacity-70"}`}
                                  >
                                    {zone.name}
                                  </Label>
                                  {zone.description && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {zone.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold">
                                  ${zone.price}
                                </span>
                                {!zone.available && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {t("common.soldOut")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {t("checkout.noteZoneSelection")}
                        </p>
                      </div>

                      {includesTransportationOffer && (
                        <div className="space-y-4">
                          <Label className="text-lg font-semibold">
                            {t("checkout.transportation")}
                          </Label>
                          <RadioGroup
                            value={transportationMode}
                            onValueChange={(v) =>
                              setTransportationMode(
                                v as "none" | "van" | "flight",
                              )
                            }
                            className="grid grid-cols-1 md:grid-cols-3 gap-3"
                          >
                            <div className="flex items-center space-x-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <RadioGroupItem id="mode-none" value="none" />
                              <Label
                                htmlFor="mode-none"
                                className="cursor-pointer"
                              >
                                {t("checkout.none")}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <RadioGroupItem id="mode-van" value="van" />
                              <Label
                                htmlFor="mode-van"
                                className="cursor-pointer"
                              >
                                {t("checkout.van")} (included)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <RadioGroupItem id="mode-flight" value="flight" />
                              <Label
                                htmlFor="mode-flight"
                                className="cursor-pointer"
                              >
                                {t("checkout.flight")} upgrade (+$
                                {transportationUpgradeFee} per person)
                              </Label>
                            </div>
                          </RadioGroup>

                          {(transportationMode === "van" ||
                            transportationMode === "flight") && (
                            <div className="space-y-3">
                              <Label className="font-medium">
                                {t("checkout.originCity")}
                              </Label>
                              <Select
                                value={transportOrigin}
                                onValueChange={setTransportOrigin}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={t("checkout.selectOrigin")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {origins.map((o) => (
                                    <SelectItem value={o} key={o}>
                                      {o}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {transportationMode === "van" && (
                            <div className="space-y-3">
                              <Label className="font-medium">
                                {t("checkout.selectVanSeats")}
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Array.from(
                                  { length: ticketQuantity },
                                  (_, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center space-x-2"
                                    >
                                      <span className="text-sm w-24 text-slate-600 dark:text-slate-400">
                                        {t("checkout.passenger")} {i + 1}
                                      </span>
                                      <Select
                                        value={vanSeats[i]}
                                        onValueChange={(val) =>
                                          setVanSeats((prev) => {
                                            const next = [...prev];
                                            next[i] = val;
                                            return next;
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue
                                            placeholder={t(
                                              "checkout.chooseSeat",
                                            )}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 12 }, (_, s) =>
                                            String(s + 1),
                                          ).map((s) => (
                                            <SelectItem value={s} key={s}>
                                              {t("checkout.seat")} {s}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {transportationMode === "flight" && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {t("checkout.flightSelectionNote")}
                            </div>
                          )}
                        </div>
                      )}

                      {jerseyAvailable && (
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold">
                            {t("checkout.officialJerseyAddon")}
                          </Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t("checkout.jerseyDescription")}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.from({ length: ticketQuantity }, (_, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium">
                                    {t("checkout.passenger")} {i + 1}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`jersey-check-${i}`}
                                      checked={!!jerseySelected[i]}
                                      onCheckedChange={(v) =>
                                        setJerseySelected((prev) => {
                                          const next = [...prev];
                                          next[i] = Boolean(v);
                                          return next;
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor={`jersey-check-${i}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {t("checkout.addJerseyWithPrice").replace(
                                        "{{price}}",
                                        jerseyUnitPrice.toString(),
                                      )}
                                    </Label>
                                  </div>
                                </div>
                                {jerseySelected[i] && (
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="col-span-2">
                                      <Label
                                        htmlFor={`jersey-name-${i}`}
                                        className="text-xs"
                                      >
                                        {t("checkout.jerseyNameLabel")}
                                      </Label>
                                      <Input
                                        id={`jersey-name-${i}`}
                                        maxLength={12}
                                        value={jerseyNames[i] || ""}
                                        onChange={(e) =>
                                          setJerseyNames((prev) => {
                                            const next = [...prev];
                                            next[i] =
                                              e.target.value.toUpperCase();
                                            return next;
                                          })
                                        }
                                        className="mt-1 dark:bg-slate-700 dark:text-white"
                                        placeholder="e.g. MESSI"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`jersey-number-${i}`}
                                        className="text-xs"
                                      >
                                        {t("checkout.jerseyNumberLabel")}
                                      </Label>
                                      <Input
                                        id={`jersey-number-${i}`}
                                        type="number"
                                        min={0}
                                        max={99}
                                        value={jerseyNumbers[i] || ""}
                                        onChange={(e) => {
                                          const v = e.target.value.replace(
                                            /[^0-9]/g,
                                            "",
                                          );
                                          const n = Math.max(
                                            0,
                                            Math.min(99, Number(v || 0)),
                                          );
                                          setJerseyNumbers((prev) => {
                                            const next = [...prev];
                                            next[i] = String(n);
                                            return next;
                                          });
                                        }}
                                        className="mt-1 dark:bg-slate-700 dark:text-white"
                                        placeholder="10"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        {t("checkout.jerseySizeLabel")}
                                      </Label>
                                      <Select
                                        value={jerseySizes[i] || ""}
                                        onValueChange={(val) =>
                                          setJerseySizes((prev) => {
                                            const next = [...prev];
                                            next[i] = val;
                                            return next;
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-full mt-1">
                                          <SelectValue
                                            placeholder={t(
                                              "checkout.selectSize",
                                            )}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[
                                            "XS",
                                            "S",
                                            "M",
                                            "L",
                                            "XL",
                                            "XXL",
                                          ].map((s) => (
                                            <SelectItem key={s} value={s}>
                                              {s}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">
                            {t("checkout.firstName")}
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="mt-1 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">
                            {t("checkout.lastName")}
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="mt-1 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">{t("checkout.email")}</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            className="pl-10 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">{t("checkout.phone")}</Label>
                        <div className="relative mt-1">
                          <Smartphone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="pl-10 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          {t("checkout.ticketsMobileNotice")}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="cardNumber">
                          {t("checkout.cardNumber")}
                        </Label>
                        <div className="relative mt-1">
                          <CreditCard className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">
                            {t("checkout.expiryDate")}
                          </Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="mt-1 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            className="mt-1 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">
                          {t("checkout.nameOnCard")}
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            className="pl-10 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            {t("checkout.securePayment")}
                          </p>
                          <p className="text-xs text-green-700">
                            {t("checkout.paymentSecurityNote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
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

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("common.previous")}
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                  >
                    {currentStep === 3
                      ? t("checkout.completePurchaseButton")
                      : t("common.continue")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
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
                      {t("checkout.zone")}: {selectedZone}
                    </Badge>
                    {includesTransportationOffer &&
                      transportationMode !== "none" && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {t("checkout.transport")}:{" "}
                            {transportationMode === "van"
                              ? t("checkout.van")
                              : t("checkout.flight")}
                            {transportOrigin ? ` • ${transportOrigin}` : ""}
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
                          ticketQuantity.toString(),
                        )}
                      </span>
                      <span>${ticketsSubtotal.toFixed(2)}</span>
                    </div>
                    {includesTransportationOffer &&
                      transportationMode === "flight" && (
                        <div className="flex justify-between text-sm">
                          <span>
                            {t("checkout.flightUpgrade").replace(
                              "{{count}}",
                              ticketQuantity.toString(),
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
