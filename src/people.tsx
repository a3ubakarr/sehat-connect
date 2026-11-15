import { useState } from "react";

// All profiles below are fictional demo profiles. Photos are stock portraits
// (randomuser.me demo portraits) with an initials fallback if they cannot load.
export type Provider = {
  id: string;
  username?: string;
  name: string;
  initials: string;
  photo: string;
  specialty: string;
  qualification: string;
  experience: string;
  location: string;
  fee: string;
  next: string;
  about: string;
};

const portrait = (gender: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

export const doctorProfiles: Provider[] = [
  {
    id: "d1",
    username: "sara",
    name: "Dr. Sara Malik",
    initials: "SM",
    photo: portrait("women", 44),
    specialty: "Cardiology",
    qualification: "MBBS, FCPS (Cardiology)",
    experience: "12 years",
    location: "Gulberg, Lahore",
    fee: "PKR 3,500",
    next: "28 May · 4:30 PM",
    about:
      "Fictional consultant cardiologist focused on preventive cardiac care and long-term follow-up.",
  },
  {
    id: "d2",
    username: "saad",
    name: "Dr. Saad Iftikhar",
    initials: "SI",
    photo: portrait("men", 45),
    specialty: "Internal Medicine",
    qualification: "MBBS, MRCP (UK)",
    experience: "15 years",
    location: "Johar Town, Lahore",
    fee: "PKR 3,000",
    next: "29 May · 11:00 AM",
    about:
      "Fictional internal medicine specialist supporting coordinated care for adults with multiple conditions.",
  },
  {
    id: "d3",
    username: "abdullah",
    name: "Dr. Abdullah Baig",
    initials: "AB",
    photo: portrait("men", 32),
    specialty: "General Physician",
    qualification: "MBBS, FCPS (Family Medicine)",
    experience: "10 years",
    location: "Model Town, Lahore",
    fee: "PKR 2,500",
    next: "Today · 6:00 PM",
    about:
      "Fictional general physician providing routine check-ups, chronic care reviews and coordinated follow-up.",
  },
  {
    id: "d4",
    name: "Dr. Ayesha Noor",
    initials: "AN",
    photo: portrait("women", 65),
    specialty: "Endocrinology",
    qualification: "MBBS, FCPS, FACE",
    experience: "9 years",
    location: "DHA Phase 5, Lahore",
    fee: "PKR 4,000",
    next: "31 May · 2:15 PM",
    about:
      "Fictional endocrinologist with an interest in diabetes education and family-supported care plans.",
  },
  {
    id: "d5",
    name: "Dr. Usman Raza",
    initials: "UR",
    photo: portrait("men", 67),
    specialty: "General Practice",
    qualification: "MBBS, MRCGP",
    experience: "11 years",
    location: "Model Town, Lahore",
    fee: "PKR 2,500",
    next: "Today · 6:00 PM",
    about: "Fictional family physician providing routine check-ups and coordinated follow-up.",
  },
];

export type Nurse = {
  id: string;
  username: string;
  name: string;
  initials: string;
  photo: string;
  specialization: string;
  qualification: string;
  experience: string;
  rate: number; // PKR per visit
  areas: string[];
  services: string[];
  availableNow: boolean;
  about: string;
};

export const localities = [
  "Gulberg",
  "DHA Phase 5",
  "Johar Town",
  "Model Town",
  "Wapda Town",
  "Bahria Town",
  "Cantt",
  "Iqbal Town",
];

export const nursingServices = [
  "Injection administration",
  "IV drip / infusion",
  "Wound dressing",
  "Vitals & BP monitoring",
  "Blood sugar monitoring",
  "Post-operative care",
  "Elderly bedside care",
];

export const nurseProfiles: Nurse[] = [
  {
    id: "n1",
    username: "ayesha",
    name: "Nurse Ayesha",
    initials: "NA",
    photo: portrait("women", 68),
    specialization: "Elderly & post-operative care",
    qualification: "BScN, Registered Nurse",
    experience: "8 years",
    rate: 2500,
    areas: ["Gulberg", "DHA Phase 5", "Model Town", "Cantt"],
    services: [
      "Vitals & BP monitoring",
      "Post-operative care",
      "Elderly bedside care",
      "Wound dressing",
    ],
    availableNow: true,
    about:
      "Fictional registered nurse experienced in recovery support and bedside care for older adults.",
  },
  {
    id: "n2",
    username: "fatima",
    name: "Nurse Fatima",
    initials: "NF",
    photo: portrait("women", 12),
    specialization: "Injections & IV therapy",
    qualification: "Diploma in Nursing, IV Therapy Certificate",
    experience: "6 years",
    rate: 2000,
    areas: ["Johar Town", "Model Town", "Wapda Town", "Iqbal Town"],
    services: ["Injection administration", "IV drip / infusion", "Vitals & BP monitoring"],
    availableNow: false,
    about: "Fictional nurse providing prescribed injections and infusions at home.",
  },
  {
    id: "n3",
    username: "maryam",
    name: "Nurse Maryam",
    initials: "NM",
    photo: portrait("women", 33),
    specialization: "Wound & diabetic care",
    qualification: "BScN, Wound Care Certificate",
    experience: "10 years",
    rate: 3000,
    areas: ["DHA Phase 5", "Cantt", "Bahria Town", "Gulberg"],
    services: [
      "Wound dressing",
      "Blood sugar monitoring",
      "Injection administration",
      "Post-operative care",
    ],
    availableNow: true,
    about: "Fictional nurse specialising in wound management and diabetic home monitoring.",
  },
];

export const findDoctorByName = (name: string) => doctorProfiles.find((d) => d.name === name);
export const findNurse = (username: string) => nurseProfiles.find((n) => n.username === username);

export function Avatar({
  src,
  initials,
  size = 52,
  className = "",
  verified = false,
}: {
  src?: string;
  initials: string;
  size?: number;
  className?: string;
  verified?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`photo-avatar ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size / 3.2) }}
    >
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <b>{initials}</b>
      )}
      {verified && <i className="photo-verified">✓</i>}
    </span>
  );
}
