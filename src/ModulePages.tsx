import { createContext, useContext, useMemo, useState } from "react";
import { Avatar, doctorProfiles, findDoctorByName } from "./people";
import { HomeNursing } from "./HomeNursing";
import { FamilyDemoData, initials } from "./auth";

type Notify = (message: string) => void;
type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Upcoming" | "Completed" | "Cancelled";
};
type Reminder = {
  id: number;
  title: string;
  detail: string;
  date: string;
  type: "Medicine" | "Appointment" | "Check-up";
  done: boolean;
};

const FamilyContext = createContext<FamilyDemoData>({
  username: "omar",
  coordinator: "Omar Khan",
  patient: "Ahmed Khan",
  patientFirst: "Ahmed",
  relationship: "Father",
  secondary: "Saima Khan",
  location: "Lahore, Pakistan",
});

const useFamily = () => useContext(FamilyContext);

const doctors = doctorProfiles;

const initialAppointments: Appointment[] = [
  {
    id: 1,
    doctor: "Dr. Sara Malik",
    specialty: "Cardiology",
    date: "28 May 2025",
    time: "4:30 PM PKT",
    type: "Video consultation",
    status: "Upcoming",
  },
  {
    id: 2,
    doctor: "Dr. Saad Iftikhar",
    specialty: "Internal Medicine",
    date: "12 May 2025",
    time: "11:00 AM PKT",
    type: "Clinic visit",
    status: "Completed",
  },
  {
    id: 3,
    doctor: "Dr. Usman Raza",
    specialty: "General Practice",
    date: "4 April 2025",
    time: "3:00 PM PKT",
    type: "Video consultation",
    status: "Cancelled",
  },
];

const initialReminders: Reminder[] = [
  {
    id: 1,
    title: "Evening medicine",
    detail: "Atorvastatin 20mg · after dinner",
    date: "Today · 8:00 PM",
    type: "Medicine",
    done: false,
  },
  {
    id: 2,
    title: "Cardiology consultation",
    detail: "Video call with Dr. Sara Malik",
    date: "28 May · 4:30 PM",
    type: "Appointment",
    done: false,
  },
  {
    id: 3,
    title: "Annual health assessment",
    detail: "Routine follow-up and vitals",
    date: "5 June · 10:00 AM",
    type: "Check-up",
    done: false,
  },
];

const reports = [
  {
    id: 1,
    name: "Complete Blood Count",
    lab: "Chughtai Lab (Demo)",
    date: "22 May 2025",
    status: "Ready",
    summary: "All displayed values are fictional and shown for interface demonstration only.",
  },
  {
    id: 2,
    name: "Lipid Profile",
    lab: "IDC Lahore (Demo)",
    date: "18 May 2025",
    status: "Reviewed",
    summary: "Reviewed in a fictional follow-up by Dr. Saad Iftikhar.",
  },
  {
    id: 3,
    name: "HbA1c",
    lab: "City Diagnostics (Demo)",
    date: "2 March 2025",
    status: "Reviewed",
    summary: "Historical demo report. Values are not suitable for clinical interpretation.",
  },
];

function DemoBanner() {
  return (
    <div className="demo-banner module-demo">
      <span className="mini-shield">✓</span>
      <strong>DEMO DATA — NOT FOR CLINICAL USE</strong>
      <span>Fictional people, providers, availability and health information.</span>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`module-card ${className}`}>{children}</section>;
}

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span>SEHAT CONNECT · DEMO</span>
            <h2>{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <span>✓</span>
      <strong>All clear</strong>
      <p>{text}</p>
    </div>
  );
}

type Member = { initials: string; name: string; relation: string; detail: string; active: boolean };

function MyFamily({
  notify,
  permissions,
  setPermissions,
  members,
  setMembers,
}: {
  notify: Notify;
  permissions: Record<string, boolean>;
  setPermissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}) {
  const family = useFamily();
  const [addOpen, setAddOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("Parent");
  return (
    <>
      <PageHeader
        eyebrow="FAMILY CARE CIRCLE"
        title="My Family"
        description="Coordinate care while keeping each family member in control of their information."
        action={
          <button className="primary-button module-button" onClick={() => setAddOpen(true)}>
            + Add family member
          </button>
        }
      />
      <div className="stats-grid three">
        <Card>
          <small>FAMILY MEMBERS</small>
          <strong>{members.length}</strong>
          <span>1 active care plan</span>
        </Card>
        <Card>
          <small>ACTIVE CONSENTS</small>
          <strong>2</strong>
          <span>Reviewed 24 May</span>
        </Card>
        <Card>
          <small>SHARED UPDATES</small>
          <strong>8</strong>
          <span>During the last 30 days</span>
        </Card>
      </div>
      <div className="family-grid">
        {members.map((member, index) => (
          <Card
            className={`family-profile ${member.active ? "selected-card" : ""}`}
            key={`${member.name}-${index}`}
          >
            <div className="profile-row">
              <span className="large-avatar">{member.initials}</span>
              <div>
                <h3>{member.name}</h3>
                <p>{member.relation}</p>
              </div>
              {member.active && <span className="module-badge green">Current patient</span>}
            </div>
            <p className="muted-line">⌖ {member.detail}</p>
            <div className="profile-facts">
              <span>
                <small>HEALTH CARD</small>
                <strong>{member.active ? "Up to date" : "Not connected"}</strong>
              </span>
              <span>
                <small>LAST ACTIVITY</small>
                <strong>{member.active ? "Today" : "8 days ago"}</strong>
              </span>
            </div>
            <div className="card-actions">
              <button
                className="outline-button"
                onClick={() => notify(`Opening ${member.name}'s profile`)}
              >
                View profile
              </button>
              <button className="text-link" onClick={() => notify("Care timeline opened")}>
                Care timeline →
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="permission-panel">
        <div className="card-title">
          <div>
            <span className="card-icon">✓</span>
            <div>
              <h2>{family.patientFirst}'s sharing permissions</h2>
              <p>Consent given by {family.patient} · Last reviewed 24 May 2025</p>
            </div>
          </div>
          <span className="module-badge green">Consent active</span>
        </div>
        <div className="setting-list">
          {[
            [
              "records",
              "Share health records",
              `Allow ${family.coordinator} to view reports, appointments and prescriptions`,
            ],
            [
              "doctors",
              "Share with treating doctors",
              "Allow selected clinicians to access relevant care history",
            ],
            [
              "updates",
              "Family activity updates",
              "Send non-clinical care updates to approved family members",
            ],
          ].map(([key, title, detail]) => (
            <label className="setting-row" key={key}>
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              <input
                type="checkbox"
                checked={permissions[key]}
                onChange={() => setPermissions((p) => ({ ...p, [key]: !p[key] }))}
              />
              <i className="toggle" />
            </label>
          ))}
        </div>
      </Card>
      {addOpen && (
        <Modal title="Add a family member" onClose={() => setAddOpen(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              setMembers((m) => [
                ...m,
                {
                  initials: initials(newMemberName),
                  name: newMemberName,
                  relation: newMemberRelation,
                  detail: "Pakistan · Invitation pending",
                  active: false,
                },
              ]);
              setNewMemberName("");
              setNewMemberRelation("Parent");
              setAddOpen(false);
              notify("Demo family invitation created");
            }}
          >
            <label>
              Full name
              <input
                required
                value={newMemberName}
                onChange={(event) => setNewMemberName(event.target.value)}
                placeholder="Family member's name"
              />
            </label>
            <label>
              Relationship
              <select
                value={newMemberRelation}
                onChange={(event) => setNewMemberRelation(event.target.value)}
              >
                <option>Parent</option>
                <option>Spouse</option>
                <option>Sibling</option>
                <option>Other</option>
              </select>
            </label>
            <label className="full-field">
              Email or mobile
              <input required placeholder="For a fictional demo invitation" />
            </label>
            <div className="privacy-note">
              Consent is required before any health information can be shared.
            </div>
            <button className="primary-button module-button full-field">
              Send demo invitation
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function FindDoctors({
  notify,
  addAppointment,
}: {
  notify: Notify;
  addAppointment: (doctor: (typeof doctors)[0]) => void;
}) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [selected, setSelected] = useState<(typeof doctors)[0] | null>(null);
  const filtered = doctors.filter(
    (doctor) =>
      (specialty === "All specialties" || doctor.specialty === specialty) &&
      `${doctor.name} ${doctor.specialty} ${doctor.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="FICTIONAL PROVIDER DIRECTORY"
        title="Find Doctors"
        description="Explore demo clinician profiles and simulated appointment availability in Lahore."
      />
      <Card className="filter-bar">
        <label className="search-input">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, specialty or location"
          />
        </label>
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
          <option>All specialties</option>
          <option>Cardiology</option>
          <option>Internal Medicine</option>
          <option>General Physician</option>
          <option>Endocrinology</option>
          <option>General Practice</option>
        </select>
        <select>
          <option>Any consultation type</option>
          <option>Video consultation</option>
          <option>Clinic visit</option>
        </select>
      </Card>
      <div className="result-summary">
        <span>
          <strong>{filtered.length}</strong> fictional doctors found
        </span>
        <span>Availability is simulated demo data</span>
      </div>
      <div className="doctor-grid">
        {filtered.map((doctor) => (
          <Card className="doctor-card" key={doctor.id}>
            <div className="doctor-card-top">
              <Avatar src={doctor.photo} initials={doctor.initials} size={64} verified />
              <div>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialty}</p>
                <span className="module-badge blue">Demo profile</span>
              </div>
            </div>
            <dl>
              <div>
                <dt>QUALIFICATION</dt>
                <dd>{doctor.qualification}</dd>
              </div>
              <div>
                <dt>EXPERIENCE</dt>
                <dd>{doctor.experience}</dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>{doctor.location}</dd>
              </div>
            </dl>
            <div className="availability">
              <span>
                <small>NEXT DEMO SLOT</small>
                <strong>{doctor.next}</strong>
              </span>
              <span>
                <small>DEMO FEE</small>
                <strong>{doctor.fee}</strong>
              </span>
            </div>
            <div className="card-actions">
              <button className="outline-button" onClick={() => setSelected(doctor)}>
                View profile
              </button>
              <button
                className="primary-button module-button"
                onClick={() => {
                  addAppointment(doctor);
                  notify("Demo appointment booked and added to Appointments");
                }}
              >
                Book appointment
              </button>
            </div>
          </Card>
        ))}
      </div>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} wide>
          <div className="doctor-detail">
            <Avatar src={selected.photo} initials={selected.initials} size={92} verified />
            <div>
              <span className="module-badge blue">Fictional verified profile</span>
              <h3>{selected.specialty}</h3>
              <p>{selected.about}</p>
            </div>
          </div>
          <div className="detail-grid">
            <span>
              <small>QUALIFICATIONS</small>
              <strong>{selected.qualification}</strong>
            </span>
            <span>
              <small>EXPERIENCE</small>
              <strong>{selected.experience}</strong>
            </span>
            <span>
              <small>LOCATION</small>
              <strong>{selected.location}</strong>
            </span>
            <span>
              <small>NEXT DEMO SLOT</small>
              <strong>{selected.next}</strong>
            </span>
          </div>
          <div className="privacy-note">
            This profile and its availability are fictional. Sehat Connect does not claim a real
            provider relationship.
          </div>
          <button
            className="primary-button module-button block-button"
            onClick={() => {
              addAppointment(selected);
              setSelected(null);
              notify("Demo appointment booked");
            }}
          >
            Book demo appointment
          </button>
        </Modal>
      )}
    </>
  );
}

function Appointments({
  appointments,
  setAppointments,
  notify,
}: {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  notify: Notify;
}) {
  const family = useFamily();
  const [tab, setTab] = useState<Appointment["status"]>("Upcoming");
  const [booking, setBooking] = useState(false);
  const shown = appointments.filter((a) => a.status === tab);
  const update = (id: number, status: Appointment["status"]) =>
    setAppointments((all) => all.map((a) => (a.id === id ? { ...a, status } : a)));
  return (
    <>
      <PageHeader
        eyebrow="COORDINATED CARE SCHEDULE"
        title="Appointments"
        description={`Manage in-person and video consultations for ${family.patientFirst}.`}
        action={
          <button className="primary-button module-button" onClick={() => setBooking(true)}>
            + Book appointment
          </button>
        }
      />
      <div className="tab-bar">
        {(["Upcoming", "Completed", "Cancelled"] as const).map((name) => (
          <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>
            {name}
            <span>{appointments.filter((a) => a.status === name).length}</span>
          </button>
        ))}
      </div>
      <div className="appointment-page-list">
        {shown.map((appointment) => (
          <Card className="appointment-page-card" key={appointment.id}>
            <span className="date-block">
              <b>{appointment.date.split(" ")[0]}</b>
              <small>{appointment.date.split(" ")[1]}</small>
            </span>
            <div className="appointment-main">
              <div className="with-photo">
                <Avatar
                  src={findDoctorByName(appointment.doctor)?.photo}
                  initials={findDoctorByName(appointment.doctor)?.initials ?? "DR"}
                  size={48}
                />
                <span>
                  <h3>{appointment.doctor}</h3>
                  <p>{appointment.specialty}</p>
                </span>
              </div>
              <div className="appointment-data">
                <span>
                  <small>DATE & TIME</small>
                  <strong>
                    {appointment.date} · {appointment.time}
                  </strong>
                </span>
                <span>
                  <small>CONSULTATION</small>
                  <strong>{appointment.type}</strong>
                </span>
              </div>
            </div>
            <span
              className={`module-badge ${appointment.status === "Upcoming" ? "green" : appointment.status === "Cancelled" ? "red" : "blue"}`}
            >
              {appointment.status}
            </span>
            <div className="stack-actions">
              <button
                className="outline-button"
                onClick={() => notify("Appointment details opened")}
              >
                View details
              </button>
              {appointment.status === "Upcoming" && (
                <>
                  <button
                    className="text-link"
                    onClick={() => {
                      setAppointments((all) =>
                        all.map((a) =>
                          a.id === appointment.id
                            ? { ...a, date: "30 May 2025", time: "5:00 PM PKT" }
                            : a,
                        ),
                      );
                      notify("Appointment rescheduled to 30 May at 5:00 PM");
                    }}
                  >
                    Reschedule
                  </button>
                  <button
                    className="danger-link"
                    onClick={() => {
                      update(appointment.id, "Cancelled");
                      notify("Demo appointment cancelled");
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </Card>
        ))}
        {!shown.length && <Empty text={`No ${tab.toLowerCase()} appointments.`} />}
      </div>
      {booking && (
        <Modal title="Book a new appointment" onClose={() => setBooking(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              setAppointments((a) => [
                ...a,
                {
                  id: Date.now(),
                  doctor: "Dr. Ayesha Noor",
                  specialty: "Endocrinology",
                  date: "31 May 2025",
                  time: "2:15 PM PKT",
                  type: "Video consultation",
                  status: "Upcoming",
                },
              ]);
              setBooking(false);
              notify("New demo appointment booked");
            }}
          >
            <label className="full-field">
              Doctor
              <select>
                <option>Dr. Ayesha Noor · Endocrinology</option>
                <option>Dr. Usman Raza · General Practice</option>
              </select>
            </label>
            <label>
              Date
              <input type="date" defaultValue="2025-05-31" />
            </label>
            <label>
              Time
              <select>
                <option>2:15 PM PKT</option>
                <option>4:00 PM PKT</option>
              </select>
            </label>
            <label className="full-field">
              Consultation type
              <select>
                <option>Video consultation</option>
                <option>Clinic visit</option>
              </select>
            </label>
            <button className="primary-button module-button full-field">
              Confirm demo booking
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function VideoConsultations({ notify }: { notify: Notify }) {
  const family = useFamily();
  const [room, setRoom] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  return (
    <>
      <PageHeader
        eyebrow="SIMULATED TELEHEALTH"
        title="Video Consultations"
        description="Prepare for and review online consultations. No real video connection is provided."
      />
      <Card className="video-upcoming">
        <div className="video-art">
          <span>SM</span>
          <i>VIDEO DEMO</i>
        </div>
        <div className="video-details">
          <span className="module-badge green">Upcoming · 28 May</span>
          <h2>Cardiology follow-up</h2>
          <p>Dr. Sara Malik · 4:30 PM PKT · approximately 20 minutes</p>
          <div className="check-row">
            <span>✓ Device check</span>
            <span>✓ Health summary ready</span>
            <span>✓ Consent active</span>
          </div>
        </div>
        <div className="stack-actions">
          <button className="primary-button module-button" onClick={() => setRoom(true)}>
            Open simulated room
          </button>
          <button
            className="outline-button"
            onClick={() => notify("Device check complete — demo only")}
          >
            Test device
          </button>
        </div>
      </Card>
      <div className="content-grid two">
        <Card className="padded-card">
          <div className="card-title">
            <div>
              <h2>Before your consultation</h2>
              <p>Help {family.patientFirst} prepare for the conversation.</p>
            </div>
          </div>
          <ul className="clean-list">
            <li>
              <span>✓</span>Keep current medicines nearby
            </li>
            <li>
              <span>✓</span>Note any recent symptoms or concerns
            </li>
            <li>
              <span>✓</span>Choose a quiet, well-lit room
            </li>
          </ul>
        </Card>
        <Card className="padded-card">
          <div className="card-title">
            <div>
              <h2>Previous online consultation</h2>
              <p>12 May 2025 · Dr. Saad Iftikhar</p>
            </div>
          </div>
          <p className="body-copy">
            A fictional consultation summary and follow-up plan is available in{" "}
            {family.patientFirst}'s health card.
          </p>
          <button className="text-link" onClick={() => notify("Consultation summary opened")}>
            View summary →
          </button>
        </Card>
      </div>
      {room && (
        <Modal title="Simulated consultation room" onClose={() => setRoom(false)} wide>
          <div className="video-room">
            <div className="video-stage">
              <div className="doctor-placeholder">
                <span>SM</span>
                <strong>Dr. Sara Malik</strong>
                <small>Simulated video preview</small>
              </div>
              <div className="self-view">
                {camera ? (
                  <>
                    <span>{initials(family.patient)}</span>
                    <small>{family.patientFirst}</small>
                  </>
                ) : (
                  <small>Camera off</small>
                )}
              </div>
              <div className="simulation-label">SIMULATION — NO LIVE CALL</div>
            </div>
            <div className="call-controls">
              <button className={!mic ? "off" : ""} onClick={() => setMic(!mic)}>
                {mic ? "Mic on" : "Mic off"}
              </button>
              <button className={!camera ? "off" : ""} onClick={() => setCamera(!camera)}>
                {camera ? "Camera on" : "Camera off"}
              </button>
              <button
                className="end-call"
                onClick={() => {
                  setRoom(false);
                  notify("Simulated consultation ended");
                }}
              >
                End simulation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function HealthCard({
  permissions,
  setPermissions,
  notify,
}: {
  permissions: Record<string, boolean>;
  setPermissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  notify: Notify;
}) {
  const family = useFamily();
  const [section, setSection] = useState("Summary");
  const sections = [
    "Summary",
    "Medical history",
    "Lab reports",
    "Prescriptions",
    "Appointments",
    "Access history",
  ];
  return (
    <>
      <PageHeader
        eyebrow="PATIENT-CONTROLLED RECORD"
        title="Digital Health Card"
        description={`A coordinated demo record for ${family.patient}, shared according to patient consent.`}
        action={
          <button
            className="outline-button page-action"
            onClick={() => notify("Demo health card download prepared")}
          >
            Download demo PDF
          </button>
        }
      />
      <Card className="health-identity">
        <div className="health-person">
          <span className="large-avatar">{initials(family.patient)}</span>
          <div>
            <span className="module-badge green">Record up to date</span>
            <h2>{family.patient}</h2>
            <p>
              {family.relationship} · {family.location} · Demo ID SC-10428
            </p>
          </div>
        </div>
        <div className="health-meta">
          <span>
            <small>DATE OF BIRTH</small>
            <strong>14 March 1960</strong>
          </span>
          <span>
            <small>BLOOD GROUP</small>
            <strong>B+</strong>
          </span>
          <span>
            <small>EMERGENCY CONTACT</small>
            <strong>{family.coordinator}</strong>
          </span>
        </div>
      </Card>
      <div className="record-layout">
        <Card className="record-nav">
          {sections.map((item) => (
            <button
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
              key={item}
            >
              {item}
              <span>›</span>
            </button>
          ))}
        </Card>
        <Card className="record-content">
          <div className="card-title">
            <div>
              <h2>{section}</h2>
              <p>Fictional demonstration health information</p>
            </div>
          </div>
          {section === "Summary" && (
            <div className="summary-grid">
              <article>
                <small>KNOWN CONDITIONS</small>
                <strong>Hypertension</strong>
                <p>Recorded 2021 · managed</p>
              </article>
              <article>
                <small>ALLERGIES</small>
                <strong>Penicillin</strong>
                <p>Patient reported · demo</p>
              </article>
              <article>
                <small>CURRENT CARE</small>
                <strong>Cardiology follow-up</strong>
                <p>Next review 28 May</p>
              </article>
              <article>
                <small>PRIMARY DOCTOR</small>
                <strong>Dr. Saad Iftikhar</strong>
                <p>Internal Medicine · fictional</p>
              </article>
            </div>
          )}
          {section === "Medical history" && (
            <div className="history-list">
              <article>
                <time>2024</time>
                <div>
                  <strong>Routine cardiac review</strong>
                  <p>Demo history entry with no clinical significance.</p>
                </div>
              </article>
              <article>
                <time>2021</time>
                <div>
                  <strong>Hypertension recorded</strong>
                  <p>Patient-reported fictional history.</p>
                </div>
              </article>
            </div>
          )}
          {section === "Lab reports" && (
            <SimpleRows rows={reports.map((r) => [r.name, `${r.lab} · ${r.date}`, r.status])} />
          )}
          {section === "Prescriptions" && (
            <SimpleRows
              rows={[
                ["Cardiac care prescription", "Dr. Saad Iftikhar · 12 May 2025", "Active"],
                ["Seasonal care prescription", "Dr. Usman Raza · 3 Jan 2025", "Completed"],
              ]}
            />
          )}
          {section === "Appointments" && (
            <SimpleRows
              rows={initialAppointments.map((a) => [a.doctor, `${a.date} · ${a.type}`, a.status])}
            />
          )}
          {section === "Access history" && (
            <SimpleRows
              rows={[
                [family.coordinator, "Viewed health summary · Today, 10:42 AM", "Family"],
                ["Dr. Sara Malik", "Viewed shared cardiac records · 24 May", "Doctor"],
                [family.patient, "Updated consent · 24 May", "Patient"],
              ]}
            />
          )}
        </Card>
      </div>
      <Card className="permission-panel compact-permissions">
        <div className="card-title">
          <div>
            <h2>Record sharing controls</h2>
            <p>Changes take effect immediately in this prototype.</p>
          </div>
          <span className="module-badge green">Patient controlled</span>
        </div>
        <div className="setting-list">
          {[
            ["records", "Family record access"],
            ["doctors", "Treating doctor access"],
            ["updates", "Share care activity"],
          ].map(([key, label]) => (
            <label className="setting-row" key={key}>
              <span>
                <strong>{label}</strong>
                <small>Approved by {family.patient}</small>
              </span>
              <input
                type="checkbox"
                checked={permissions[key]}
                onChange={() => setPermissions((p) => ({ ...p, [key]: !p[key] }))}
              />
              <i className="toggle" />
            </label>
          ))}
        </div>
      </Card>
    </>
  );
}

function SimpleRows({ rows }: { rows: string[][] }) {
  return (
    <div className="simple-rows">
      {rows.map((row, i) => (
        <div key={`${row[0]}-${i}`}>
          <span>
            <strong>{row[0]}</strong>
            <small>{row[1]}</small>
          </span>
          <span className="module-badge blue">{row[2]}</span>
        </div>
      ))}
    </div>
  );
}

function LabReports({ notify }: { notify: Notify }) {
  const family = useFamily();
  const [allReports, setAllReports] = useState(reports);
  const [selected, setSelected] = useState<(typeof reports)[0] | null>(null);
  const [upload, setUpload] = useState(false);
  const [book, setBook] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="DIAGNOSTIC RECORDS"
        title="Lab Reports"
        description={`Track fictional tests and keep reports together in ${family.patientFirst}'s health record.`}
        action={
          <div className="header-button-row">
            <button className="outline-button page-action" onClick={() => setUpload(true)}>
              Upload demo report
            </button>
            <button className="primary-button module-button" onClick={() => setBook(true)}>
              Book lab test
            </button>
          </div>
        }
      />
      <div className="stats-grid three">
        <Card>
          <small>AVAILABLE REPORTS</small>
          <strong>{allReports.length}</strong>
          <span>Across 3 demo labs</span>
        </Card>
        <Card>
          <small>AWAITING SAMPLE</small>
          <strong>1</strong>
          <span>Kidney function panel</span>
        </Card>
        <Card>
          <small>REVIEWED</small>
          <strong>2</strong>
          <span>By fictional doctors</span>
        </Card>
      </div>
      <Card className="data-card">
        <div className="data-card-head">
          <div>
            <h2>Reports and test status</h2>
            <p>Availability and lab names are simulated.</p>
          </div>
          <select>
            <option>All statuses</option>
            <option>Ready</option>
            <option>Reviewed</option>
          </select>
        </div>
        <div className="responsive-table">
          <div className="table-row table-head">
            <span>REPORT</span>
            <span>LAB</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          {allReports.map((report) => (
            <div className="table-row" key={report.id}>
              <span data-label="Report">
                <strong>{report.name}</strong>
                <small>Report #{String(report.id).padStart(4, "0")}</small>
              </span>
              <span data-label="Lab">{report.lab}</span>
              <span data-label="Date">{report.date}</span>
              <span data-label="Status">
                <i className="module-badge green">{report.status}</i>
              </span>
              <span data-label="Action">
                <button className="text-link" onClick={() => setSelected(report)}>
                  View report →
                </button>
              </span>
            </div>
          ))}
          <div className="table-row pending-row">
            <span data-label="Test">
              <strong>Kidney Function Panel</strong>
              <small>Home sample request</small>
            </span>
            <span data-label="Lab">City Diagnostics (Demo)</span>
            <span data-label="Date">30 May 2025</span>
            <span data-label="Status">
              <i className="module-badge amber">Awaiting sample</i>
            </span>
            <span data-label="Action">
              <button className="text-link" onClick={() => notify("Demo booking details opened")}>
                Details →
              </button>
            </span>
          </div>
        </div>
      </Card>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} wide>
          <div className="report-sheet">
            <div className="report-brand">
              <span>SC</span>
              <div>
                <strong>{selected.lab}</strong>
                <small>FICTIONAL LAB REPORT</small>
              </div>
            </div>
            <div className="detail-grid">
              <span>
                <small>PATIENT</small>
                <strong>{family.patient}</strong>
              </span>
              <span>
                <small>REPORT DATE</small>
                <strong>{selected.date}</strong>
              </span>
              <span>
                <small>STATUS</small>
                <strong>{selected.status}</strong>
              </span>
            </div>
            <div className="report-values">
              <div>
                <span>Demo marker A</span>
                <strong>12.4</strong>
                <small>Fictional range 11–15</small>
              </div>
              <div>
                <span>Demo marker B</span>
                <strong>4.8</strong>
                <small>Fictional range 4–6</small>
              </div>
              <div>
                <span>Demo marker C</span>
                <strong>210</strong>
                <small>Fictional range 150–300</small>
              </div>
            </div>
            <div className="clinical-warning">
              DEMO VALUES ONLY — Do not use for diagnosis, treatment or any clinical decision.
            </div>
          </div>
        </Modal>
      )}
      {upload && (
        <Modal title="Upload a demo report" onClose={() => setUpload(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAllReports((r) => [
                {
                  id: Date.now(),
                  name: "Uploaded Demo Report",
                  lab: "User upload (Demo)",
                  date: "26 May 2025",
                  status: "Ready",
                  summary: "Demo upload",
                },
                ...r,
              ]);
              setUpload(false);
              notify("Demo report added to the list");
            }}
          >
            <label className="upload-zone">
              <input type="file" />
              <strong>Choose a demo PDF or image</strong>
              <span>No file is sent to a real clinical system.</span>
            </label>
            <button className="primary-button module-button block-button">Add demo report</button>
          </form>
        </Modal>
      )}
      {book && (
        <Modal title="Book a lab test" onClose={() => setBook(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              setBook(false);
              notify("Demo lab test booking created");
            }}
          >
            <label className="full-field">
              Test
              <select>
                <option>Kidney Function Panel</option>
                <option>Complete Blood Count</option>
                <option>Lipid Profile</option>
              </select>
            </label>
            <label>
              Date
              <input type="date" defaultValue="2025-05-30" />
            </label>
            <label>
              Collection
              <select>
                <option>Home sample</option>
                <option>Demo lab visit</option>
              </select>
            </label>
            <div className="privacy-note full-field">This does not create a real lab booking.</div>
            <button className="primary-button module-button full-field">
              Confirm demo booking
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Prescriptions() {
  const family = useFamily();
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState("Active");
  const items =
    tab === "Active"
      ? [
          {
            name: "Cardiac care prescription",
            doctor: "Dr. Saad Iftikhar",
            date: "12 May 2025",
            meds: 3,
            status: "Active",
          },
        ]
      : [
          {
            name: "Seasonal care prescription",
            doctor: "Dr. Usman Raza",
            date: "3 January 2025",
            meds: 2,
            status: "Completed",
          },
          {
            name: "Blood pressure review",
            doctor: "Dr. Sara Malik",
            date: "8 November 2024",
            meds: 1,
            status: "Completed",
          },
        ];
  return (
    <>
      <PageHeader
        eyebrow="DOCTOR-ISSUED RECORDS"
        title="Prescriptions"
        description="Review fictional prescriptions recorded by treating doctors for coordinated care."
      />
      <div className="clinical-warning prominent">
        Prescriptions must be issued by a qualified treating doctor. Sehat Connect does not
        prescribe or recommend medicines.
      </div>
      <div className="tab-bar compact-tabs">
        {["Active", "Previous"].map((name) => (
          <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>
            {name}
          </button>
        ))}
      </div>
      <div className="prescription-grid">
        {items.map((item) => (
          <Card className="prescription-page-card" key={item.name}>
            <div className="rx-large">Rx</div>
            <span className={`module-badge ${item.status === "Active" ? "green" : "blue"}`}>
              {item.status}
            </span>
            <h2>{item.name}</h2>
            <p>
              Issued by <strong>{item.doctor}</strong>
            </p>
            <small>
              {item.date} · {item.meds} medicines
            </small>
            <button className="outline-button block-button" onClick={() => setSelected(item.name)}>
              View prescription
            </button>
          </Card>
        ))}
      </div>
      {selected && (
        <Modal title={selected} onClose={() => setSelected(null)} wide>
          <div className="prescription-detail">
            <div className="detail-grid">
              <span>
                <small>PATIENT</small>
                <strong>{family.patient}</strong>
              </span>
              <span>
                <small>PRESCRIBER</small>
                <strong>Dr. Saad Iftikhar (Fictional)</strong>
              </span>
              <span>
                <small>ISSUED</small>
                <strong>12 May 2025</strong>
              </span>
            </div>
            <div className="medicine-lines">
              <article>
                <span>01</span>
                <div>
                  <strong>
                    Cardioval 5mg <i>Fictional brand</i>
                  </strong>
                  <p>One tablet each morning · 30 days</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <strong>
                    Lipicure 20mg <i>Fictional brand</i>
                  </strong>
                  <p>One tablet after dinner · 30 days</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <strong>
                    GastroSafe 20mg <i>Fictional brand</i>
                  </strong>
                  <p>One capsule before breakfast · 14 days</p>
                </div>
              </article>
            </div>
            <div className="clinical-warning">
              Fictional demonstration only. Follow instructions from a qualified treating doctor and
              pharmacist.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function MedicineFinder() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const medicines = [
    {
      name: "Cardioval 5mg",
      type: "Fictional prescription medicine",
      pharmacy: "Green Care Pharmacy (Demo)",
      area: "Gulberg",
      stock: "Simulated available",
      price: "PKR 420",
    },
    {
      name: "Lipicure 20mg",
      type: "Fictional prescription medicine",
      pharmacy: "Family Health Pharmacy (Demo)",
      area: "Johar Town",
      stock: "Simulated limited",
      price: "PKR 680",
    },
    {
      name: "GastroSafe 20mg",
      type: "Fictional prescription medicine",
      pharmacy: "Model Pharmacy (Demo)",
      area: "Model Town",
      stock: "Simulated available",
      price: "PKR 350",
    },
  ];
  const results = medicines.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeader
        eyebrow="SIMULATED PHARMACY SEARCH"
        title="Medicine Finder"
        description="Compare fictional medicine listings and demo pharmacy information. No purchases or reservations are made."
      />
      <Card className="medicine-search">
        <div className="medicine-search-copy">
          <h2>Search a medicine by name</h2>
          <p>
            Use a medicine name from a doctor-issued prescription. We do not provide
            recommendations.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Cardioval” or “Lipicure”"
          />
          <button className="primary-button module-button">Search demo listings</button>
        </form>
        <div className="search-disclaimer">
          All pharmacy names, prices and availability labels are fictional and not real-time.
        </div>
      </Card>
      {(searched || query) && (
        <>
          <div className="result-summary">
            <span>
              <strong>{results.length}</strong> simulated listings
            </span>
            <span>Not a prescribing or recommendation service</span>
          </div>
          <div className="medicine-results">
            {results.map((medicine) => (
              <Card className="medicine-card" key={medicine.name}>
                <div className="medicine-symbol">Rx</div>
                <div className="medicine-info">
                  <h3>{medicine.name}</h3>
                  <p>{medicine.type}</p>
                  <div>
                    <span>
                      <small>DEMO PHARMACY</small>
                      <strong>{medicine.pharmacy}</strong>
                    </span>
                    <span>
                      <small>AREA</small>
                      <strong>{medicine.area}</strong>
                    </span>
                    <span>
                      <small>DEMO PRICE</small>
                      <strong>{medicine.price}</strong>
                    </span>
                  </div>
                </div>
                <span
                  className={`module-badge ${medicine.stock.includes("limited") ? "amber" : "green"}`}
                >
                  {medicine.stock}
                </span>
                <button className="outline-button" onClick={() => setSelected(medicine.name)}>
                  View details
                </button>
              </Card>
            ))}
          </div>
        </>
      )}
      {!searched && !query && (
        <Card className="finder-empty">
          <span>Rx</span>
          <h2>Start with a prescribed medicine name</h2>
          <p>Search results will show simulated listings from fictional pharmacies in Lahore.</p>
        </Card>
      )}
      {selected && (
        <Modal title={selected} onClose={() => setSelected(null)}>
          <div className="medicine-modal">
            <span className="module-badge amber">Simulated listing</span>
            <p>
              This fictional medicine detail is shown only to demonstrate how users might compare
              packaging, strength and pharmacy location.
            </p>
            <dl>
              <div>
                <dt>FORM</dt>
                <dd>Demo tablets</dd>
              </div>
              <div>
                <dt>PACK SIZE</dt>
                <dd>30 tablets</dd>
              </div>
              <div>
                <dt>PRESCRIPTION</dt>
                <dd>Required</dd>
              </div>
            </dl>
            <div className="clinical-warning">
              No medical recommendation is provided. Confirm medicines with the treating doctor and
              a qualified pharmacist.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function HealthReminders({
  reminders,
  setReminders,
  notify,
}: {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  notify: Notify;
}) {
  const [edit, setEdit] = useState<Reminder | "new" | null>(null);
  const [filter, setFilter] = useState("All");
  const visible = reminders.filter((r) => filter === "All" || r.type === filter);
  return (
    <>
      <PageHeader
        eyebrow="CARE ROUTINES"
        title="Health Reminders"
        description="Keep medicines, appointments and follow-ups visible to the family care circle."
        action={
          <button className="primary-button module-button" onClick={() => setEdit("new")}>
            + Add reminder
          </button>
        }
      />
      <div className="chip-filters">
        {["All", "Medicine", "Appointment", "Check-up"].map((name) => (
          <button
            className={filter === name ? "active" : ""}
            onClick={() => setFilter(name)}
            key={name}
          >
            {name}
            <span>
              {name === "All" ? reminders.length : reminders.filter((r) => r.type === name).length}
            </span>
          </button>
        ))}
      </div>
      <div className="reminder-page-list">
        {visible.map((reminder) => (
          <Card
            className={`reminder-page-card ${reminder.done ? "completed" : ""}`}
            key={reminder.id}
          >
            <button
              className={`complete-check ${reminder.done ? "checked" : ""}`}
              onClick={() => {
                setReminders((all) =>
                  all.map((r) => (r.id === reminder.id ? { ...r, done: !r.done } : r)),
                );
                notify(reminder.done ? "Reminder reopened" : "Reminder completed");
              }}
              aria-label="Toggle complete"
            >
              {reminder.done && "✓"}
            </button>
            <span className="reminder-type-icon">
              {reminder.type === "Medicine" ? "Rx" : reminder.type === "Appointment" ? "CAL" : "FU"}
            </span>
            <div>
              <span className="module-badge blue">{reminder.type}</span>
              <h3>{reminder.title}</h3>
              <p>{reminder.detail}</p>
            </div>
            <time>{reminder.date}</time>
            <div className="row-menu">
              <button onClick={() => setEdit(reminder)}>Edit</button>
              <button
                className="danger-link"
                onClick={() => {
                  setReminders((all) => all.filter((r) => r.id !== reminder.id));
                  notify("Reminder deleted");
                }}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
      {edit && (
        <Modal
          title={edit === "new" ? "Add a reminder" : "Edit reminder"}
          onClose={() => setEdit(null)}
        >
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              if (edit === "new")
                setReminders((all) => [
                  ...all,
                  {
                    id: Date.now(),
                    title: "New care reminder",
                    detail: "Added by Omar · Demo",
                    date: "1 June · 9:00 AM",
                    type: "Check-up",
                    done: false,
                  },
                ]);
              else
                setReminders((all) =>
                  all.map((r) => (r.id === edit.id ? { ...r, date: "2 June · 10:30 AM" } : r)),
                );
              setEdit(null);
              notify(edit === "new" ? "Reminder added" : "Reminder updated");
            }}
          >
            <label className="full-field">
              Title
              <input
                defaultValue={edit === "new" ? "" : edit.title}
                required
                placeholder="Reminder title"
              />
            </label>
            <label>
              Type
              <select defaultValue={edit === "new" ? "Medicine" : edit.type}>
                <option>Medicine</option>
                <option>Appointment</option>
                <option>Check-up</option>
              </select>
            </label>
            <label>
              Date & time
              <input type="datetime-local" />
            </label>
            <label className="full-field">
              Notes
              <textarea
                defaultValue={edit === "new" ? "" : edit.detail}
                placeholder="Optional details"
              />
            </label>
            <button className="primary-button module-button full-field">
              {edit === "new" ? "Add reminder" : "Save changes"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function FamilyUpdates({ permissions }: { permissions: Record<string, boolean> }) {
  const family = useFamily();
  const [filter, setFilter] = useState("All updates");
  const activities = [
    [
      "Today · 10:42 AM",
      "Appointment confirmed",
      "Cardiology video consultation with Dr. Sara Malik",
      "Appointment",
    ],
    [
      "Yesterday · 3:15 PM",
      "Lab report available",
      `Complete Blood Count uploaded to ${family.patientFirst}'s record`,
      "Lab report",
    ],
    [
      "24 May · 5:20 PM",
      "Consent reviewed",
      `${family.patientFirst} confirmed family record sharing permissions`,
      "Privacy",
    ],
    [
      "20 May · 6:08 PM",
      "Follow-up scheduled",
      "Annual health assessment added for 5 June",
      "Appointment",
    ],
    [
      "18 May · 1:40 PM",
      "Report reviewed",
      "Lipid Profile marked as reviewed by a fictional doctor",
      "Lab report",
    ],
    [
      "12 May · 12:10 PM",
      "Consultation completed",
      "Follow-up plan added to the digital health card",
      "Consultation",
    ],
  ];
  const visible = activities.filter((a) => filter === "All updates" || a[3] === filter);
  return (
    <>
      <PageHeader
        eyebrow="CONSENT-AWARE ACTIVITY"
        title="Family Updates"
        description="A chronological view of care coordination activity shared with approved family members."
      />
      <Card className="sharing-summary">
        <span className="card-icon">✓</span>
        <div>
          <strong>Updates are shared with patient consent</strong>
          <p>
            {family.patientFirst} currently allows family care activity updates. Clinical details
            remain limited by patient permissions.
          </p>
        </div>
        <span className={`module-badge ${permissions.updates ? "green" : "red"}`}>
          {permissions.updates ? "Sharing active" : "Sharing paused"}
        </span>
      </Card>
      <div className="chip-filters">
        {["All updates", "Appointment", "Lab report", "Consultation", "Privacy"].map((name) => (
          <button
            className={filter === name ? "active" : ""}
            onClick={() => setFilter(name)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      <Card className="activity-page">
        <div className="activity-date">MAY 2025</div>
        {visible.map((activity, index) => (
          <article className="activity-row" key={activity[1]}>
            <span className={`activity-dot dot-${index % 4}`}>{activity[3].slice(0, 1)}</span>
            <div>
              <span className="module-badge blue">{activity[3]}</span>
              <h3>{activity[1]}</h3>
              <p>{activity[2]}</p>
              <time>{activity[0]}</time>
            </div>
            <button aria-label="View update">›</button>
          </article>
        ))}
      </Card>
    </>
  );
}

function Settings({
  permissions,
  setPermissions,
  notify,
}: {
  permissions: Record<string, boolean>;
  setPermissions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  notify: Notify;
}) {
  const family = useFamily();
  const [section, setSection] = useState("Personal profile");
  const [prefs, setPrefs] = useState({ email: true, push: true, medicine: true, marketing: false });
  const menu = [
    "Personal profile",
    "Notifications",
    "Privacy & security",
    "Family access",
    "Account",
  ];
  return (
    <>
      <PageHeader
        eyebrow="ACCOUNT PREFERENCES"
        title="Settings"
        description="Manage your coordinator profile, privacy and family access preferences."
      />
      <div className="settings-layout">
        <Card className="settings-nav">
          {menu.map((item) => (
            <button
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
              key={item}
            >
              {item}
              <span>›</span>
            </button>
          ))}
        </Card>
        <Card className="settings-content">
          <div className="card-title">
            <div>
              <h2>{section}</h2>
              <p>Changes are stored only in this prototype session.</p>
            </div>
          </div>
          {section === "Personal profile" && (
            <form
              className="form-grid settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                notify("Profile changes saved");
              }}
            >
              <label>
                Full name
                <input defaultValue={family.coordinator} />
              </label>
              <label>
                Relationship to patient
                <input defaultValue="Son" />
              </label>
              <label>
                Email
                <input defaultValue="omar@example.com" />
              </label>
              <label>
                Time zone
                <select>
                  <option>London · GMT+1</option>
                  <option>Dubai · GMT+4</option>
                  <option>Toronto · GMT-4</option>
                </select>
              </label>
              <label className="full-field">
                Mobile
                <input defaultValue="+44 7000 000 000" />
              </label>
              <button className="primary-button module-button">Save profile</button>
            </form>
          )}
          {section === "Notifications" && (
            <SettingsToggles
              items={[
                ["email", "Email updates", "Appointment and report activity"],
                ["push", "Push notifications", "Time-sensitive family care updates"],
                ["medicine", "Medicine reminders", "Daily schedule notifications"],
                ["marketing", "Product news", "Occasional prototype announcements"],
              ]}
              values={prefs}
              setValues={setPrefs}
            />
          )}
          {section === "Privacy & security" && (
            <>
              <div className="security-item">
                <span>
                  <strong>Password</strong>
                  <small>Last changed 4 months ago</small>
                </span>
                <button
                  className="outline-button"
                  onClick={() => notify("Demo password flow opened")}
                >
                  Change password
                </button>
              </div>
              <div className="security-item">
                <span>
                  <strong>Two-step verification</strong>
                  <small>Protect your coordinator account</small>
                </span>
                <button
                  className="outline-button"
                  onClick={() => notify("Two-step verification enabled for demo")}
                >
                  Enable
                </button>
              </div>
              <div className="security-item">
                <span>
                  <strong>Active sessions</strong>
                  <small>2 fictional devices</small>
                </span>
                <button className="text-link" onClick={() => notify("Session list opened")}>
                  Review sessions
                </button>
              </div>
            </>
          )}
          {section === "Family access" && (
            <SettingsToggles
              items={[
                [
                  "records",
                  `${family.patientFirst}'s health records`,
                  `Access approved by ${family.patientFirst}`,
                ],
                [
                  "updates",
                  `${family.patientFirst}'s care updates`,
                  `Activity notifications for ${family.coordinator}`,
                ],
                [
                  "doctors",
                  "Doctor record sharing",
                  "Share relevant history with treating doctors",
                ],
              ]}
              values={permissions}
              setValues={setPermissions}
            />
          )}
          {section === "Account" && (
            <>
              <div className="security-item">
                <span>
                  <strong>Export demo data</strong>
                  <small>Download a copy of prototype information</small>
                </span>
                <button className="outline-button" onClick={() => notify("Demo export prepared")}>
                  Export
                </button>
              </div>
              <div className="danger-zone">
                <h3>Close prototype account</h3>
                <p>This action is disabled because this is a demonstration experience.</p>
                <button disabled>Close account</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

function SettingsToggles({
  items,
  values,
  setValues,
}: {
  items: string[][];
  values: Record<string, boolean>;
  setValues: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <div className="setting-list">
      {items.map(([key, title, detail]) => (
        <label className="setting-row" key={key}>
          <span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </span>
          <input
            type="checkbox"
            checked={values[key]}
            onChange={() => setValues((p: Record<string, boolean>) => ({ ...p, [key]: !p[key] }))}
          />
          <i className="toggle" />
        </label>
      ))}
    </div>
  );
}

function AdminDashboard({ notify }: { notify: Notify }) {
  const [tab, setTab] = useState("Provider verification");
  return (
    <>
      <PageHeader
        eyebrow="FICTIONAL ADMIN WORKSPACE"
        title="Platform Administration"
        description="A separate demonstration view of provider review, users and platform activity."
        action={<span className="module-badge amber page-badge">Admin demo mode</span>}
      />
      <div className="stats-grid four">
        <Card>
          <small>DEMO USERS</small>
          <strong>2,486</strong>
          <span className="positive">+8.4% this month</span>
        </Card>
        <Card>
          <small>ACTIVE PROVIDERS</small>
          <strong>184</strong>
          <span>Fictional profiles</span>
        </Card>
        <Card>
          <small>APPOINTMENTS</small>
          <strong>612</strong>
          <span>Demo activity · May</span>
        </Card>
        <Card>
          <small>PENDING REVIEWS</small>
          <strong>12</strong>
          <span className="attention">Requires attention</span>
        </Card>
      </div>
      <Card className="admin-chart-card">
        <div className="card-title">
          <div>
            <h2>Appointment activity</h2>
            <p>Simulated platform activity during the last seven days</p>
          </div>
          <select>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="bar-chart">
          {[54, 72, 48, 88, 67, 94, 76].map((height, i) => (
            <div key={i}>
              <span style={{ height: `${height}%` }}>
                <i>{Math.round(height * 1.4)}</i>
              </span>
              <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</small>
            </div>
          ))}
        </div>
      </Card>
      <div className="tab-bar admin-tabs">
        {["Provider verification", "User management", "Activity log"].map((name) => (
          <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>
            {name}
          </button>
        ))}
      </div>
      <Card className="data-card">
        {tab === "Provider verification" && (
          <div className="responsive-table admin-table">
            <div className="table-row table-head">
              <span>PROVIDER</span>
              <span>SPECIALTY</span>
              <span>SUBMITTED</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>
            {[
              ["Dr. Nida Farooq", "Dermatology", "Today", "Pending"],
              ["Dr. Bilal Ahmed", "Neurology", "Yesterday", "In review"],
              ["Dr. Sana Riaz", "Paediatrics", "24 May", "Pending"],
            ].map((row) => (
              <div className="table-row" key={row[0]}>
                <span data-label="Provider">
                  <strong>{row[0]}</strong>
                  <small>Fictional applicant</small>
                </span>
                <span data-label="Specialty">{row[1]}</span>
                <span data-label="Submitted">{row[2]}</span>
                <span data-label="Status">
                  <i className="module-badge amber">{row[3]}</i>
                </span>
                <span data-label="Action">
                  <button
                    className="text-link"
                    onClick={() => notify(`Review opened for ${row[0]}`)}
                  >
                    Review →
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "User management" && (
          <div className="responsive-table admin-table">
            <div className="table-row table-head">
              <span>USER</span>
              <span>ROLE</span>
              <span>LOCATION</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>
            {[
              ["Omar Malik", "Family coordinator", "United Kingdom", "Active"],
              ["Ahmed Khan", "Patient", "Pakistan", "Active"],
              ["Demo Lab User", "Lab coordinator", "Pakistan", "Review"],
            ].map((row) => (
              <div className="table-row" key={row[0]}>
                <span data-label="User">
                  <strong>{row[0]}</strong>
                  <small>Fictional demo user</small>
                </span>
                <span data-label="Role">{row[1]}</span>
                <span data-label="Location">{row[2]}</span>
                <span data-label="Status">
                  <i className="module-badge green">{row[3]}</i>
                </span>
                <span data-label="Action">
                  <button className="text-link" onClick={() => notify("Demo user record opened")}>
                    Manage →
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "Activity log" && (
          <SimpleRows
            rows={[
              ["Provider profile submitted", "Dr. Nida Farooq · Today, 9:32 AM", "Review"],
              ["User consent updated", "Ahmed Khan · Yesterday, 5:20 PM", "Privacy"],
              ["Appointment cancelled", "Demo appointment #2408 · 24 May", "Activity"],
              ["Report uploaded", "Demo report #1034 · 22 May", "Records"],
            ]}
          />
        )}
      </Card>
    </>
  );
}

function SearchResults({
  query,
  onNavigate,
}: {
  query: string;
  onNavigate: (name: string) => void;
}) {
  const results = [
    ["Dr. Sara Malik", "Fictional cardiologist in Lahore", "Find Doctors"],
    ["Complete Blood Count", "Demo report · 22 May 2025", "Lab Reports"],
    ["Cardiac care prescription", "Issued 12 May 2025", "Prescriptions"],
  ].filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeader
        eyebrow="GLOBAL SEARCH"
        title={`Results for “${query}”`}
        description="Search across fictional doctors, records and care activities."
      />
      <Card className="search-results">
        {results.length ? (
          results.map((result) => (
            <button key={result[0]} onClick={() => onNavigate(result[2])}>
              <span>
                <strong>{result[0]}</strong>
                <small>{result[1]}</small>
              </span>
              <span>{result[2]} →</span>
            </button>
          ))
        ) : (
          <Empty text="No demo records match this search." />
        )}
      </Card>
    </>
  );
}

export function ModulePages({
  active,
  hidden,
  onNavigate,
  notify,
  family,
}: {
  active: string;
  hidden: boolean;
  onNavigate: (name: string) => void;
  notify: Notify;
  family: FamilyDemoData;
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [reminders, setReminders] = useState(initialReminders);
  const [members, setMembers] = useState<Member[]>([
    {
      initials: initials(family.patient),
      name: family.patient,
      relation: family.relationship,
      detail: `${family.location} · Primary patient`,
      active: true,
    },
    {
      initials: initials(family.secondary),
      name: family.secondary,
      relation: "Family member",
      detail: `${family.location} · Family profile`,
      active: false,
    },
  ]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    records: true,
    doctors: true,
    updates: true,
  });
  const addAppointment = (doctor: (typeof doctors)[0]) => {
    setAppointments((current) => [
      ...current,
      {
        id: Date.now(),
        doctor: doctor.name,
        specialty: doctor.specialty,
        date: doctor.next.split(" · ")[0] + " 2025",
        time: doctor.next.split(" · ")[1] + " PKT",
        type: "Video consultation",
        status: "Upcoming",
      },
    ]);
  };
  const page = useMemo(() => {
    if (active.startsWith("Search:")) return "Search";
    if (active === "Profile") return "Settings";
    if (active === "Laboratory Services") return "Lab Reports";
    if (active === "E-Prescriptions") return "Prescriptions";
    if (active === "Pharmacies") return "Medicine Finder";
    return active;
  }, [active]);
  return (
    <FamilyContext.Provider value={family}>
      <div className={`module-host ${hidden ? "module-hidden" : ""}`}>
        <DemoBanner />
        {page === "My Family" && (
          <MyFamily
            notify={notify}
            permissions={permissions}
            setPermissions={setPermissions}
            members={members}
            setMembers={setMembers}
          />
        )}
        {page === "Find Doctors" && <FindDoctors notify={notify} addAppointment={addAppointment} />}
        {page === "Appointments" && (
          <Appointments
            appointments={appointments}
            setAppointments={setAppointments}
            notify={notify}
          />
        )}
        {page === "Home Nursing" && (
          <HomeNursing
            members={members}
            username={family.username}
            defaultLocation={family.location}
            notify={notify}
          />
        )}
        {page === "Video Consultations" && <VideoConsultations notify={notify} />}
        {page === "Digital Health Card" && (
          <HealthCard permissions={permissions} setPermissions={setPermissions} notify={notify} />
        )}
        {page === "Lab Reports" && <LabReports notify={notify} />}
        {page === "Prescriptions" && <Prescriptions />}
        {page === "Medicine Finder" && <MedicineFinder />}
        {page === "Health Reminders" && (
          <HealthReminders reminders={reminders} setReminders={setReminders} notify={notify} />
        )}
        {page === "Family Updates" && <FamilyUpdates permissions={permissions} />}
        {page === "Settings" && (
          <Settings permissions={permissions} setPermissions={setPermissions} notify={notify} />
        )}
        {page === "Admin Dashboard" && <AdminDashboard notify={notify} />}
        {page === "Search" && (
          <SearchResults query={active.replace("Search:", "").trim()} onNavigate={onNavigate} />
        )}
      </div>
    </FamilyContext.Provider>
  );
}
