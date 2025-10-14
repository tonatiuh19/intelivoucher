import { API_CONFIG, API_ENDPOINTS } from "./apiConfig";
import type { ApiEvent, Trip, PaymentOptions, ZoneOption } from "../types";

/**
 * Transform API event data to app Trip format
 */
export function transformApiEventToTrip(apiEvent: ApiEvent): Trip {
  const paymentOptions: PaymentOptions = {
    installmentsAvailable:
      apiEvent.event_payment_options[0]?.installments_available === 1,
    presaleDepositAvailable:
      apiEvent.event_payment_options[0]?.presale_deposit_available === 1,
    secondPaymentInstallmentsAvailable:
      apiEvent.event_payment_options[0]
        ?.second_payment_installments_available === 1,
  };

  const availableZones: ZoneOption[] = apiEvent.event_zones.map((zone) => ({
    id: zone.id.toString(),
    name: zone.zone_name,
    price: parseFloat(zone.price),
    description: zone.zone_description,
    available: zone.is_available === 1,
    zone_name: zone.zone_name,
    zone_description: zone.zone_description,
    zone_name_es: zone.zone_name_es,
    zone_description_es: zone.zone_description_es,
  }));

  const gifts = apiEvent.event_gifts.map((gift) => ({
    id: gift.id,
    event_id: gift.event_id,
    gift_name: gift.gift_name,
    gift_name_es: gift.gift_name_es,
  }));

  const transportationOptions = apiEvent.transportation_options?.map(
    (transport) => ({
      id: transport.id.toString(),
      name: transport.type_name,
      name_es: transport.type_name_es,
      description: transport.description,
      description_es: transport.description_es,
      additionalCost: parseFloat(transport.additional_cost),
      capacity: transport.capacity,
      available: transport.is_available === 1,
      specialInstructions: transport.special_instructions,
      specialInstructions_es: transport.special_instructions_es,
      transportationTypeId: transport.transportation_type_id,
      lodgingTypeId: transport.lodging_type_id,
      lodgingName: transport.lodging_name,
      lodgingName_es: transport.lodging_name_es,
      lodgingDescription: transport.lodging_description,
      lodgingDescription_es: transport.lodging_description_es,
      lodgingActive: transport.lodging_is_active === 1,
    }),
  );

  // Get the lowest price from available zones
  const lowestPrice = availableZones
    .filter((zone) => zone.available)
    .reduce((min, zone) => Math.min(min, zone.price), Infinity);

  return {
    id: apiEvent.id,
    title: apiEvent.title,
    title_es: apiEvent.title_es,
    category: apiEvent.category,
    date: apiEvent.event_date,
    location: `Event ${apiEvent.id}`, // You may want to add venue information to your API
    price: lowestPrice === Infinity ? "0" : lowestPrice.toString(),
    image: apiEvent.image_url,
    rating: 4.5, // Default rating since it's not in the API
    soldOut: apiEvent.is_sold_out === "1" || apiEvent.is_sold_out === 1,
    trending: apiEvent.is_trending === "1" || apiEvent.is_trending === 1,
    includesTransportation:
      apiEvent.includes_transportation === "1" ||
      apiEvent.includes_transportation === 1,
    isPresale: apiEvent.is_presale === "1" || apiEvent.is_presale === 1,
    requiresTicketAcquisition:
      apiEvent.requires_ticket_acquisition === "1" ||
      apiEvent.requires_ticket_acquisition === 1,
    refundableIfNoTicket:
      apiEvent.refundable_if_no_ticket === "1" ||
      apiEvent.refundable_if_no_ticket === 1,
    paymentOptions,
    gifts: gifts.length > 0 ? gifts : undefined,
    acceptsUnderAge:
      apiEvent.accepts_under_age === "1" || apiEvent.accepts_under_age === 1,
    jerseyAddonAvailable:
      apiEvent.jersey_addon_available === "1" ||
      apiEvent.jersey_addon_available === 1,
    jerseyPrice: parseFloat(apiEvent.jersey_price),
    availableZones,
    transportationOptions:
      transportationOptions?.length > 0 ? transportationOptions : undefined,
  };
}

/**
 * Fetch active events from the API
 */
export async function fetchActiveEvents(): Promise<Trip[]> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_ACTIVE_EVENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiEvents: ApiEvent[] = await response.json();

    // Transform API events to app Trip format
    return apiEvents.map(transformApiEventToTrip);
  } catch (error) {
    console.error("Error fetching active events:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch active events",
    );
  }
}

/**
 * Fetch a specific event by ID
 */
export async function fetchEventById(eventId: string): Promise<Trip | null> {
  try {
    const response = await fetch(API_ENDPOINTS.GET_ACTIVE_EVENTS_BY_ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: eventId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();

    // Check for API error response
    if (apiResponse.error) {
      if (apiResponse.error === "Event not found") {
        return null;
      }
      throw new Error(apiResponse.error);
    }

    // Transform API event to app Trip format
    const apiEvent = apiResponse as ApiEvent;
    return transformApiEventToTrip(apiEvent);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch event",
    );
  }
}
