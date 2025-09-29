import { Trip, Purchase } from "../types";

const TRIPS_KEY = "trips";
const PURCHASES_KEY = "purchases";

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const tripsStore = {
  list(): Trip[] {
    return readJSON<Trip[]>(TRIPS_KEY, []);
  },
  upsert(trip: Trip) {
    const items = this.list();
    const idx = items.findIndex((t) => t.id === trip.id);
    if (idx >= 0) items[idx] = trip;
    else items.unshift(trip);
    writeJSON(TRIPS_KEY, items);
  },
  remove(id: string) {
    const next = this.list().filter((t) => t.id !== id);
    writeJSON(TRIPS_KEY, next);
  },
};

export const purchasesStore = {
  list(): Purchase[] {
    return readJSON<Purchase[]>(PURCHASES_KEY, []);
  },
  upsert(p: Purchase) {
    const items = this.list();
    const idx = items.findIndex((x) => x.id === p.id);
    if (idx >= 0) items[idx] = p;
    else items.unshift(p);
    writeJSON(PURCHASES_KEY, items);
  },
  remove(id: string) {
    const next = this.list().filter((p) => p.id !== id);
    writeJSON(PURCHASES_KEY, next);
  },
};
