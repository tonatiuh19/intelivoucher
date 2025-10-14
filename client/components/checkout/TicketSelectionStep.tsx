import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { ticketSelectionSchema, Step1Values } from "@/lib/checkoutValidation";
import { formatCurrency } from "@/lib/utils";

interface Step1Props {
  initialValues: Step1Values;
  availableZones: any[];
  includesTransportationOffer: boolean;
  transportationOptions?: any[];
  jerseyAvailable: boolean;
  jerseyUnitPrice: number;
  transportationUpgradeFee: number;
  origins: string[];
  onNext: (values: Step1Values) => void;
  onBack: () => void;
}

export const TicketSelectionStep: React.FC<Step1Props> = ({
  initialValues,
  availableZones,
  includesTransportationOffer,
  transportationOptions = [],
  jerseyAvailable,
  jerseyUnitPrice,
  transportationUpgradeFee,
  origins,
  onNext,
  onBack,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ticketSelectionSchema}
      onSubmit={(values) => {
        onNext(values);
      }}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Ticket Quantity */}
          <div>
            <Label className="text-lg font-semibold">
              {t("checkout.selectQuantity")}
            </Label>
            <div className="flex items-center space-x-4 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFieldValue(
                    "ticketQuantity",
                    Math.max(1, values.ticketQuantity - 1),
                  )
                }
              >
                -
              </Button>
              <span className="text-xl font-semibold px-4">
                {values.ticketQuantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFieldValue(
                    "ticketQuantity",
                    Math.min(8, values.ticketQuantity + 1),
                  )
                }
              >
                +
              </Button>
            </div>
            <ErrorMessage
              name="ticketQuantity"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Zone Selection */}
          <div>
            <Label className="text-lg font-semibold">
              {t("checkout.zoneSelection")}
            </Label>
            <Field name="selectedZone">
              {({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) =>
                    setFieldValue("selectedZone", value)
                  }
                  className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {availableZones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`flex items-center justify-between space-x-2 rounded-lg border ${
                        zone.available
                          ? "border-slate-200 dark:border-slate-700"
                          : "border-slate-300 dark:border-slate-600 opacity-50"
                      } p-3`}
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
                            className={`cursor-pointer ${
                              zone.available
                                ? ""
                                : "cursor-not-allowed opacity-70"
                            }`}
                          >
                            {i18n.language === "es" && zone.zone_name_es
                              ? zone.zone_name_es
                              : zone.zone_name || zone.name}
                          </Label>
                          {((i18n.language === "es" &&
                            zone.zone_description_es) ||
                            zone.zone_description ||
                            zone.description) && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {i18n.language === "es" &&
                              zone.zone_description_es
                                ? zone.zone_description_es
                                : zone.zone_description || zone.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">
                          {formatCurrency(zone.price)}
                        </span>
                        {!zone.available && (
                          <Badge variant="secondary" className="text-xs">
                            {t("common.soldOut")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </Field>
            <ErrorMessage
              name="selectedZone"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t("checkout.noteZoneSelection")}
            </p>
          </div>

          {/* Transportation */}
          {includesTransportationOffer && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {t("checkout.extras")}
              </Label>
              <Field name="transportationMode">
                {({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) =>
                      setFieldValue("transportationMode", value)
                    }
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {/* Always include "none" option */}
                    <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <RadioGroupItem id="mode-none" value="none" />
                      <Label
                        htmlFor="mode-none"
                        className="cursor-pointer font-medium"
                      >
                        {t("checkout.none")}
                      </Label>
                    </div>

                    {/* Dynamic transportation options from API */}
                    {transportationOptions
                      .filter((transport) => {
                        // Only show if:
                        // 1. Transportation is included (transportationTypeId !== 1) OR
                        // 2. Lodging is included (lodgingTypeId !== 11)
                        return (
                          transport.transportationTypeId !== 1 ||
                          transport.lodgingTypeId !== 11
                        );
                      })
                      .map((transport) => (
                        <div
                          key={transport.id}
                          className={`flex items-start space-x-3 rounded-lg border ${
                            transport.available
                              ? "border-slate-200 dark:border-slate-700"
                              : "border-slate-300 dark:border-slate-600 opacity-50"
                          } p-4`}
                        >
                          <RadioGroupItem
                            id={`mode-${transport.id}`}
                            value={transport.id}
                            disabled={!transport.available}
                            className="mt-1"
                          />
                          <div className="flex flex-col flex-1 space-y-1">
                            <Label
                              htmlFor={`mode-${transport.id}`}
                              className={`cursor-pointer font-medium leading-tight ${
                                transport.available
                                  ? ""
                                  : "cursor-not-allowed opacity-70"
                              }`}
                            >
                              {/* Transportation name - show if transportation is included */}
                              {transport.transportationTypeId !== 1 && (
                                <>
                                  {i18n.language === "es" && transport.name_es
                                    ? transport.name_es
                                    : transport.name}
                                </>
                              )}

                              {/* Separator - show if both transportation and lodging are included */}
                              {transport.transportationTypeId !== 1 &&
                                transport.lodgingTypeId !== 11 && (
                                  <span className="text-sm"> + </span>
                                )}

                              {/* Lodging name - show if lodging is included */}
                              {transport.lodgingTypeId !== 11 && (
                                <>
                                  {i18n.language === "es" &&
                                  transport.lodgingName_es
                                    ? transport.lodgingName_es
                                    : transport.lodgingName}
                                </>
                              )}
                            </Label>

                            {/* Price information */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex-1">
                                {transport.additionalCost === 0 ? (
                                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {t("checkout.steps.selectTickets.included")}
                                  </span>
                                ) : (
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    +{formatCurrency(transport.additionalCost)}{" "}
                                    {t(
                                      "checkout.steps.selectTickets.per_person",
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-1">
                              {/* Transportation description */}
                              {transport.transportationTypeId !== 1 &&
                                ((i18n.language === "es" &&
                                  transport.description_es) ||
                                  transport.description) && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {i18n.language === "es" &&
                                    transport.description_es
                                      ? transport.description_es
                                      : transport.description}
                                  </div>
                                )}

                              {/* Lodging description */}
                              {transport.lodgingTypeId !== 11 &&
                                ((i18n.language === "es" &&
                                  transport.lodgingDescription_es) ||
                                  transport.lodgingDescription) && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {transport.transportationTypeId !== 1 &&
                                      "• "}
                                    {i18n.language === "es" &&
                                    transport.lodgingDescription_es
                                      ? transport.lodgingDescription_es
                                      : transport.lodgingDescription}
                                  </div>
                                )}

                              {/* Special instructions */}
                              {((i18n.language === "es" &&
                                transport.specialInstructions_es) ||
                                transport.specialInstructions) && (
                                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 py-1 rounded mt-2">
                                  {i18n.language === "es" &&
                                  transport.specialInstructions_es
                                    ? transport.specialInstructions_es
                                    : transport.specialInstructions}
                                </div>
                              )}
                            </div>

                            {!transport.available && (
                              <Badge
                                variant="secondary"
                                className="text-xs w-fit mt-1"
                              >
                                {t("common.soldOut")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </RadioGroup>
                )}
              </Field>
              <ErrorMessage
                name="transportationMode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />

              {values.transportationMode !== "none" &&
                transportationOptions.find(
                  (t) => t.id === values.transportationMode,
                ) && (
                  <div className="space-y-3">
                    <Label className="font-medium">
                      {t("checkout.originCity")}
                    </Label>
                    <Field name="transportOrigin">
                      {({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            setFieldValue("transportOrigin", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("checkout.selectOrigin")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {origins.map((origin) => (
                              <SelectItem value={origin} key={origin}>
                                {origin}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="transportOrigin"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

              {/* Seat selection for specific transportation types - currently disabled for dynamic options */}
              {false && values.transportationMode === "van" && (
                <div className="space-y-3">
                  <Label className="font-medium">
                    {t("checkout.selectVanSeats")}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: values.ticketQuantity }, (_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <span className="text-sm w-24 text-slate-600 dark:text-slate-400">
                          {t("checkout.passenger")} {i + 1}
                        </span>
                        <Field name={`vanSeats.${i}`}>
                          {({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                setFieldValue(`vanSeats.${i}`, value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("checkout.chooseSeat")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, s) =>
                                  String(s + 1),
                                ).map((seat) => (
                                  <SelectItem value={seat} key={seat}>
                                    {t("checkout.seat")} {seat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage
                    name="vanSeats"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}

              {/* Show special instructions for selected transportation */}
              {values.transportationMode !== "none" &&
                (() => {
                  const selectedTransport = transportationOptions.find(
                    (t) => t.id === values.transportationMode,
                  );
                  return (
                    selectedTransport &&
                    ((i18n.language === "es" &&
                      selectedTransport.specialInstructions_es) ||
                      selectedTransport.specialInstructions) && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {i18n.language === "es" &&
                        selectedTransport.specialInstructions_es
                          ? selectedTransport.specialInstructions_es
                          : selectedTransport.specialInstructions}
                      </div>
                    )
                  );
                })()}
            </div>
          )}

          {/* Jersey Add-ons */}
          {jerseyAvailable && (
            <div className="space-y-3">
              <Label className="text-lg font-semibold">
                {t("checkout.officialJerseyAddon")}
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("checkout.jerseyDescription")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: values.ticketQuantity }, (_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {t("checkout.passenger")} {i + 1}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Field name={`jerseySelected.${i}`}>
                          {({ field }) => (
                            <Checkbox
                              id={`jersey-check-${i}`}
                              checked={field.value || false}
                              onCheckedChange={(checked) =>
                                setFieldValue(`jerseySelected.${i}`, checked)
                              }
                            />
                          )}
                        </Field>
                        <Label
                          htmlFor={`jersey-check-${i}`}
                          className="text-sm cursor-pointer"
                        >
                          {t("checkout.addJerseyWithPrice").replace(
                            "{{price}}",
                            formatCurrency(jerseyUnitPrice, "", 2),
                          )}
                        </Label>
                      </div>
                    </div>
                    {values.jerseySelected[i] && (
                      <div className="mt-3 space-y-3">
                        {/* Personalization Option */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">
                            {t("checkout.jerseyPersonalization")}
                          </Label>
                          <RadioGroup
                            value={
                              values.jerseyPersonalized[i]
                                ? "personalized"
                                : "standard"
                            }
                            onValueChange={(value) => {
                              const isPersonalized = value === "personalized";
                              setFieldValue(
                                `jerseyPersonalized.${i}`,
                                isPersonalized,
                              );
                              // Clear personalization fields if switching to standard (but keep size)
                              if (!isPersonalized) {
                                setFieldValue(`jerseyNames.${i}`, "");
                                setFieldValue(`jerseyNumbers.${i}`, "");
                              }
                            }}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="standard"
                                id={`standard-${i}`}
                              />
                              <Label
                                htmlFor={`standard-${i}`}
                                className="text-xs cursor-pointer"
                              >
                                {t("checkout.standardJersey")}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="personalized"
                                id={`personalized-${i}`}
                              />
                              <Label
                                htmlFor={`personalized-${i}`}
                                className="text-xs cursor-pointer"
                              >
                                {t("checkout.personalizedJersey")}
                              </Label>
                            </div>
                          </RadioGroup>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t("checkout.personalizationNote")}
                          </p>
                        </div>

                        {/* Size Selection - Always show for both standard and personalized */}
                        <div>
                          <Label className="text-xs">
                            {t("checkout.jerseySizeLabel")}
                          </Label>
                          <Field name={`jerseySizes.${i}`}>
                            {({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={(value) =>
                                  setFieldValue(`jerseySizes.${i}`, value)
                                }
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue
                                    placeholder={t("checkout.selectSize")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <SelectItem key={size} value={size}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                        </div>

                        {/* Jersey Type Selection - Local or Away */}
                        <div>
                          <Label className="text-xs">
                            {t("checkout.jerseyTypeLabel")}
                          </Label>
                          <Field name={`jerseyTypes.${i}`}>
                            {({ field }) => (
                              <RadioGroup
                                value={field.value || "local"}
                                onValueChange={(value) =>
                                  setFieldValue(`jerseyTypes.${i}`, value)
                                }
                                className="flex flex-row space-x-4 mt-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="local"
                                    id={`local-${i}`}
                                  />
                                  <Label
                                    htmlFor={`local-${i}`}
                                    className="text-xs cursor-pointer"
                                  >
                                    {t("checkout.jerseyLocal")}
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="away"
                                    id={`away-${i}`}
                                  />
                                  <Label
                                    htmlFor={`away-${i}`}
                                    className="text-xs cursor-pointer"
                                  >
                                    {t("checkout.jerseyAway")}
                                  </Label>
                                </div>
                              </RadioGroup>
                            )}
                          </Field>
                        </div>

                        {/* Personalization Fields - Only show when personalized is selected */}
                        {values.jerseyPersonalized[i] && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                              <Label
                                htmlFor={`jersey-name-${i}`}
                                className="text-xs"
                              >
                                {t("checkout.jerseyNameLabel")}
                              </Label>
                              <Field name={`jerseyNames.${i}`}>
                                {({ field }) => (
                                  <Input
                                    id={`jersey-name-${i}`}
                                    maxLength={12}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `jerseyNames.${i}`,
                                        e.target.value.toUpperCase(),
                                      )
                                    }
                                    className="mt-1 dark:bg-slate-700 dark:text-white"
                                    placeholder="e.g. MESSI"
                                  />
                                )}
                              </Field>
                            </div>
                            <div>
                              <Label
                                htmlFor={`jersey-number-${i}`}
                                className="text-xs"
                              >
                                {t("checkout.jerseyNumberLabel")}
                              </Label>
                              <Field name={`jerseyNumbers.${i}`}>
                                {({ field }) => (
                                  <Input
                                    id={`jersey-number-${i}`}
                                    type="number"
                                    min={0}
                                    max={99}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(
                                        /[^0-9]/g,
                                        "",
                                      );
                                      const n = Math.max(
                                        0,
                                        Math.min(99, Number(v || 0)),
                                      );
                                      setFieldValue(
                                        `jerseyNumbers.${i}`,
                                        String(n),
                                      );
                                    }}
                                    className="mt-1 dark:bg-slate-700 dark:text-white"
                                    placeholder="10"
                                  />
                                )}
                              </Field>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <ErrorMessage
                name="jerseyNames"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <ErrorMessage
                name="jerseyNumbers"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <ErrorMessage
                name="jerseySizes"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onBack}>
              {t("common.previous")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
            >
              {t("common.continue")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
