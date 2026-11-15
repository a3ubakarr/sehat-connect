export type Role = "family" | "doctor" | "nurse" | "admin";

export type DemoAccount = {
  username: string;
  name: string;
  role: Role;
  subtitle: string;
};

export const DEMO_PASSWORD = "12345";

export const demoAccounts: DemoAccount[] = [
  { name: "Ahmad Ali", username: "ahmad", role: "family", subtitle: "Family coordinator" },
  { name: "Omar Khan", username: "omar", role: "family", subtitle: "Family coordinator" },
  { name: "Sana Ahmed", username: "sana", role: "family", subtitle: "Family coordinator" },
  { name: "Dr. Abdullah Baig", username: "abdullah", role: "doctor", subtitle: "General Physician" },
  { name: "Dr. Saad Iftikhar", username: "saad", role: "doctor", subtitle: "Internal Medicine" },
  { name: "Dr. Sara Malik", username: "sara", role: "doctor", subtitle: "Cardiology" },
  { name: "Nurse Ayesha", username: "ayesha", role: "nurse", subtitle: "Elderly & post-operative care" },
  { name: "Nurse Fatima", username: "fatima", role: "nurse", subtitle: "Injections & IV therapy" },
  { name: "Nurse Maryam", username: "maryam", role: "nurse", subtitle: "Wound & diabetic care" },
  { name: "Administrator", username: "admin", role: "admin", subtitle: "Platform administrator" },
];

export const familyPages = [
  "Overview",
  "My Family",
  "Find Doctors",
  "Appointments",
  "Video Consultations",
  "Home Nursing",
  "Digital Health Card",
  "Lab Reports",
  "Laboratory Services",
  "E-Prescriptions",
  "Medicine Finder",
  "Pharmacies",
  "Health Reminders",
  "Family Updates",
  "Settings",
  "Profile",
];

export const doctorPages = [
  "Doctor Dashboard",
  "Doctor Profile",
  "Assigned Patients",
  "Doctor Appointments",
  "Patient Records",
  "Doctor Lab Reports",
  "Consultation Notes",
  "Doctor Prescriptions",
  "Consultation Schedule",
  "Doctor Settings",
];

export const nursePages = [
  "Nurse Dashboard",
  "Nurse Profile",
  "Nurse Patients",
  "Nursing Bookings",
  "Visit Details",
  "Nursing Schedule",
];

export const adminPages = [
  "Admin Dashboard",
  "User Management",
  "Doctor Management",
  "Nurse Management",
  "All Appointments",
  "Home Nursing Bookings",
  "Provider Listings",
  "Role Assignments",
  "System Activity",
  "Admin Settings",
];

export function authenticate(username: string, password: string): DemoAccount | null {
  const normalized = username.trim().toLowerCase();
  if (password !== DEMO_PASSWORD) return null;
  return demoAccounts.find((account) => account.username.toLowerCase() === normalized) ?? null;
}

export function defaultPage(role: Role) {
  if (role === "doctor") return "Doctor Dashboard";
  if (role === "nurse") return "Nurse Dashboard";
  if (role === "admin") return "Admin Dashboard";
  return "Overview";
}

export function canAccess(role: Role, page: string) {
  if (page.startsWith("Search:")) return role === "family";
  const pages =
    role === "family"
      ? familyPages
      : role === "doctor"
        ? doctorPages
        : role === "nurse"
          ? nursePages
          : adminPages;
  return pages.includes(page);
}

export type FamilyDemoData = {
  username: string;
  coordinator: string;
  patient: string;
  patientFirst: string;
  relationship: string;
  secondary: string;
  location: string;
};

const familyData: Record<string, Omit<FamilyDemoData, "username">> = {
  ahmad: {
    coordinator: "Ahmad Ali",
    patient: "Rashid Ali",
    patientFirst: "Rashid",
    relationship: "Father",
    secondary: "Nusrat Ali",
    location: "Lahore, Pakistan",
  },
  omar: {
    coordinator: "Omar Khan",
    patient: "Ahmed Khan",
    patientFirst: "Ahmed",
    relationship: "Father",
    secondary: "Saima Khan",
    location: "Lahore, Pakistan",
  },
  sana: {
    coordinator: "Sana Ahmed",
    patient: "Farah Ahmed",
    patientFirst: "Farah",
    relationship: "Mother",
    secondary: "Khalid Ahmed",
    location: "Lahore, Pakistan",
  },
};

export function getFamilyData(username: string): FamilyDemoData {
  return { ...(familyData[username] ?? familyData.omar), username };
}

export function initials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
