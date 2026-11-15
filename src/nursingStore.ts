import { useSyncExternalStore } from "react";

export type BookingStatus =
  | "Requested"
  | "Accepted"
  | "On the way"
  | "In progress"
  | "Completed"
  | "Rejected";

export type VisitNote = { at: string; text: string };

export type NursingBooking = {
  id: string;
  owner: string; // family username — used for least-privilege filtering
  patient: string;
  relation: string;
  age: number;
  locality: string;
  address: string;
  service: string;
  date: string;
  time: string;
  mode: "On-demand" | "Scheduled";
  nurse: string; // nurse username
  fee: number;
  status: BookingStatus;
  notes: VisitNote[];
};

let bookings: NursingBooking[] = [
  {
    id: "HN-1001",
    owner: "ahmad",
    patient: "Rashid Ali",
    relation: "Father",
    age: 68,
    locality: "Gulberg",
    address: "House 14, Block C (demo address)",
    service: "Vitals & BP monitoring",
    date: "2026-11-18",
    time: "10:00",
    mode: "Scheduled",
    nurse: "ayesha",
    fee: 2500,
    status: "Requested",
    notes: [],
  },
  {
    id: "HN-1002",
    owner: "omar",
    patient: "Ahmed Khan",
    relation: "Father",
    age: 65,
    locality: "DHA Phase 5",
    address: "Street 9, Phase 5 (demo address)",
    service: "Blood sugar monitoring",
    date: "2026-11-17",
    time: "16:30",
    mode: "Scheduled",
    nurse: "maryam",
    fee: 3000,
    status: "Accepted",
    notes: [{ at: "15 Nov, 9:10 AM", text: "Patient prefers an afternoon visit." }],
  },
  {
    id: "HN-1003",
    owner: "sana",
    patient: "Farah Ahmed",
    relation: "Mother",
    age: 61,
    locality: "Johar Town",
    address: "Block F, Johar Town (demo address)",
    service: "Injection administration",
    date: "2026-11-16",
    time: "09:00",
    mode: "Scheduled",
    nurse: "fatima",
    fee: 2000,
    status: "Requested",
    notes: [],
  },
  {
    id: "HN-1004",
    owner: "omar",
    patient: "Saima Khan",
    relation: "Mother",
    age: 60,
    locality: "Model Town",
    address: "C Block, Model Town (demo address)",
    service: "Wound dressing",
    date: "2026-11-12",
    time: "11:00",
    mode: "Scheduled",
    nurse: "ayesha",
    fee: 2500,
    status: "Completed",
    notes: [{ at: "12 Nov, 11:40 AM", text: "Dressing changed. Site clean, no redness." }],
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const nursingStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => bookings,
  add(b: Omit<NursingBooking, "id" | "status" | "notes">) {
    const created: NursingBooking = {
      ...b,
      id: `HN-${1000 + bookings.length + 1}`,
      status: "Requested",
      notes: [],
    };
    bookings = [created, ...bookings];
    emit();
    return created;
  },
  setStatus(id: string, status: BookingStatus) {
    bookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    emit();
  },
  addNote(id: string, text: string) {
    const at = new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
    bookings = bookings.map((b) =>
      b.id === id ? { ...b, notes: [...b.notes, { at, text }] } : b,
    );
    emit();
  },
};

export const useBookings = () =>
  useSyncExternalStore(nursingStore.subscribe, nursingStore.get, nursingStore.get);

export const statusTone = (s: BookingStatus) =>
  s === "Completed" || s === "Accepted"
    ? "green"
    : s === "Rejected"
      ? "red"
      : s === "Requested"
        ? "amber"
        : "blue";
