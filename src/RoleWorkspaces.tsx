import { useState } from "react";
import { DemoAccount } from "./auth";
import { Avatar, findDoctorByName } from "./people";
import { AdminNurses, AdminNursingBookings, ProviderListings } from "./NurseAdmin";

type Notify = (message: string) => void;

const doctorPatients: Record<
  string,
  { name: string; initials: string; age: number; city: string; care: string; next: string }[]
> = {
  abdullah: [
    {
      name: "Rashid Ali",
      initials: "RA",
      age: 68,
      city: "Lahore",
      care: "General health review",
      next: "27 May · 5:00 PM",
    },
    {
      name: "Farah Ahmed",
      initials: "FA",
      age: 61,
      city: "Lahore",
      care: "Routine follow-up",
      next: "30 May · 12:30 PM",
    },
    {
      name: "Mariam Iqbal",
      initials: "MI",
      age: 58,
      city: "Islamabad",
      care: "General follow-up",
      next: "29 May · 10:00 AM",
    },
    {
      name: "Tariq Bashir",
      initials: "TB",
      age: 64,
      city: "Rawalpindi",
      care: "Annual assessment",
      next: "2 June · 1:30 PM",
    },
  ],
  saad: [
    {
      name: "Ahmed Khan",
      initials: "AK",
      age: 65,
      city: "Lahore",
      care: "Internal medicine review",
      next: "30 May · 11:00 AM",
    },
    {
      name: "Nasreen Akhtar",
      initials: "NA",
      age: 61,
      city: "Lahore",
      care: "Medication follow-up",
      next: "3 June · 3:15 PM",
    },
  ],
  sara: [
    {
      name: "Ahmed Khan",
      initials: "AK",
      age: 65,
      city: "Lahore",
      care: "Cardiology follow-up",
      next: "28 May · 4:30 PM",
    },
    {
      name: "Shahid Mahmood",
      initials: "SM",
      age: 57,
      city: "Gujranwala",
      care: "Cardiac review",
      next: "31 May · 12:00 PM",
    },
  ],
};

function RoleBanner({ role }: { role: "doctor" | "admin" }) {
  return (
    <div className="demo-banner module-demo">
      <span className="mini-shield">✓</span>
      <strong>
        {role === "doctor" ? "DOCTOR WORKSPACE · DEMO DATA" : "ADMIN WORKSPACE · DEMO DATA"}
      </strong>
      <span>Frontend RBAC demonstration — not production security.</span>
    </div>
  );
}

function Header({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
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
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span>SEHAT CONNECT · ROLE-RESTRICTED DEMO</span>
            <h2>{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function DoctorDashboard({
  account,
  patients,
  navigate,
}: {
  account: DemoAccount;
  patients: (typeof doctorPatients)[string];
  navigate: (page: string) => void;
}) {
  return (
    <>
      <Header
        eyebrow="CLINICAL WORKSPACE"
        title={`Good morning, ${account.name}.`}
        text="Your assigned patients, consultations and follow-up work for today."
      />
      <div className="stats-grid four">
        <Card>
          <small>TODAY'S CONSULTATIONS</small>
          <strong>4</strong>
          <span>2 video · 2 clinic</span>
        </Card>
        <Card>
          <small>ASSIGNED PATIENTS</small>
          <strong>{patients.length}</strong>
          <span>Limited to your care list</span>
        </Card>
        <Card>
          <small>NOTES TO COMPLETE</small>
          <strong>2</strong>
          <span className="attention">Requires attention</span>
        </Card>
        <Card>
          <small>REPORTS TO REVIEW</small>
          <strong>3</strong>
          <span>Fictional reports</span>
        </Card>
      </div>
      <div className="role-dashboard-grid">
        <Card className="padded-card">
          <div className="card-title">
            <div>
              <h2>Today's schedule</h2>
              <p>Tuesday, 27 May · Pakistan Standard Time</p>
            </div>
            <button className="text-link" onClick={() => navigate("Consultation Schedule")}>
              Full schedule →
            </button>
          </div>
          <div className="doctor-schedule">
            <article>
              <time>09:30</time>
              <span className="schedule-line" />
              <div>
                <strong>Mariam Iqbal</strong>
                <p>General follow-up · Video consultation</p>
              </div>
              <i className="module-badge green">Confirmed</i>
            </article>
            <article>
              <time>11:00</time>
              <span className="schedule-line blue" />
              <div>
                <strong>{patients[0]?.name}</strong>
                <p>{patients[0]?.care} · Clinic visit</p>
              </div>
              <i className="module-badge blue">Checked in</i>
            </article>
            <article>
              <time>15:15</time>
              <span className="schedule-line amber" />
              <div>
                <strong>{patients[1]?.name}</strong>
                <p>{patients[1]?.care} · Video consultation</p>
              </div>
              <i className="module-badge green">Confirmed</i>
            </article>
          </div>
        </Card>
        <Card className="padded-card">
          <div className="card-title">
            <div>
              <h2>Assigned patient overview</h2>
              <p>Only patients currently assigned to you</p>
            </div>
          </div>
          <div className="assigned-compact">
            {patients.map((patient) => (
              <button key={patient.name} onClick={() => navigate("Assigned Patients")}>
                <span className="large-avatar">{patient.initials}</span>
                <span>
                  <strong>{patient.name}</strong>
                  <small>
                    {patient.age} years · {patient.city}
                  </small>
                </span>
                <i>›</i>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card className="doctor-guardrail">
        <span>✓</span>
        <div>
          <strong>Least-privilege access is active</strong>
          <p>
            This demo account can only open records for the patients listed as assigned.
            Administrative controls and other doctors' patients are unavailable.
          </p>
        </div>
      </Card>
    </>
  );
}

function DoctorProfile({ account, notify }: { account: DemoAccount; notify: Notify }) {
  const me = findDoctorByName(account.name);
  return (
    <>
      <Header
        eyebrow="PROFESSIONAL PROFILE"
        title="My Doctor Profile"
        text="Review the fictional professional details shown to families in this prototype."
      />
      <Card className="doctor-profile-page">
        <div className="doctor-profile-main">
          <Avatar src={me?.photo} initials={me?.initials ?? "DR"} size={112} verified />
          <div>
            <span className="module-badge blue">Demo verified profile</span>
            <h2>{account.name}</h2>
            <p>{account.subtitle} · {me?.location ?? "Lahore, Pakistan"}</p>
          </div>
          <button
            className="outline-button"
            onClick={() => notify("Profile editor opened for this demo")}
          >
            Edit profile
          </button>
        </div>
        <div className="detail-grid four-detail">
          <span>
            <small>QUALIFICATIONS</small>
            <strong>{me?.qualification ?? "MBBS (Demo)"}</strong>
          </span>
          <span>
            <small>EXPERIENCE</small>
            <strong>{me?.experience ?? "12 years"}</strong>
          </span>
          <span>
            <small>CONSULTATION FEE</small>
            <strong>{me?.fee ?? "PKR 3,000"}</strong>
          </span>
          <span>
            <small>CONSULTATION TYPES</small>
            <strong>Video and clinic</strong>
          </span>
        </div>
        <div className="profile-about">
          <h3>Professional summary</h3>
          <p>
            This is a fictional doctor profile created solely to demonstrate the Sehat Connect
            provider experience. It does not represent a real practitioner or registration.
          </p>
        </div>
      </Card>
    </>
  );
}

function AssignedPatients({
  patients,
  notify,
}: {
  patients: (typeof doctorPatients)[string];
  notify: Notify;
}) {
  const [selected, setSelected] = useState<(typeof patients)[0] | null>(null);
  return (
    <>
      <Header
        eyebrow="ACCESS-LIMITED CARE LIST"
        title="Assigned Patients"
        text="Only patients explicitly assigned to this doctor account are visible."
      />
      <div className="doctor-patient-grid">
        {patients.map((patient) => (
          <Card className="doctor-patient-card" key={patient.name}>
            <div>
              <span className="large-avatar">{patient.initials}</span>
              <span>
                <h2>{patient.name}</h2>
                <p>
                  {patient.age} years · {patient.city}
                </p>
              </span>
              <i className="module-badge green">Assigned</i>
            </div>
            <dl>
              <div>
                <dt>CARE REASON</dt>
                <dd>{patient.care}</dd>
              </div>
              <div>
                <dt>NEXT CONTACT</dt>
                <dd>{patient.next}</dd>
              </div>
              <div>
                <dt>SHARING</dt>
                <dd>Relevant records consented</dd>
              </div>
            </dl>
            <div className="card-actions">
              <button className="outline-button" onClick={() => setSelected(patient)}>
                View permitted record
              </button>
              <button
                className="text-link"
                onClick={() => notify(`Opening appointments for ${patient.name}`)}
              >
                Appointments →
              </button>
            </div>
          </Card>
        ))}
      </div>
      {selected && (
        <Modal title={`${selected.name} · permitted record`} onClose={() => setSelected(null)}>
          <div className="patient-record-modal">
            <div className="clinical-warning">
              Only information relevant to this doctor's assigned care is displayed.
            </div>
            <div className="summary-grid">
              <article>
                <small>CARE PLAN</small>
                <strong>{selected.care}</strong>
                <p>Demo care context</p>
              </article>
              <article>
                <small>ALLERGY FLAG</small>
                <strong>Penicillin</strong>
                <p>Patient-reported demo data</p>
              </article>
              <article>
                <small>LATEST REPORT</small>
                <strong>Complete Blood Count</strong>
                <p>22 May · Demo</p>
              </article>
              <article>
                <small>CONSENT</small>
                <strong>Active</strong>
                <p>Relevant records only</p>
              </article>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function DoctorAppointments({
  patients,
  notify,
}: {
  patients: (typeof doctorPatients)[string];
  notify: Notify;
}) {
  const [tab, setTab] = useState("Upcoming");
  return (
    <>
      <Header
        eyebrow="MY APPOINTMENTS"
        title="Consultations"
        text="Appointments assigned to your doctor profile only."
      />
      <div className="tab-bar">
        {["Upcoming", "Completed", "Cancelled"].map((name) => (
          <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>
            {name}
          </button>
        ))}
      </div>
      <div className="appointment-page-list">
        {tab === "Upcoming" ? (
          patients.map((patient, index) => (
            <Card className="appointment-page-card" key={patient.name}>
              <span className="date-block">
                <b>{28 + index}</b>
                <small>MAY</small>
              </span>
              <div className="appointment-main">
                <div>
                  <h3>{patient.name}</h3>
                  <p>{patient.care}</p>
                </div>
                <div className="appointment-data">
                  <span>
                    <small>TIME</small>
                    <strong>{patient.next.split(" · ")[1]}</strong>
                  </span>
                  <span>
                    <small>CONSULTATION</small>
                    <strong>{index ? "Clinic visit" : "Video consultation"}</strong>
                  </span>
                </div>
              </div>
              <span className="module-badge green">Confirmed</span>
              <div className="stack-actions">
                <button
                  className="outline-button"
                  onClick={() => notify("Assigned appointment details opened")}
                >
                  View details
                </button>
                <button
                  className="text-link"
                  onClick={() => notify("Demo consultation workspace opened")}
                >
                  Prepare →
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-state">
            <span>✓</span>
            <strong>No {tab.toLowerCase()} consultations</strong>
            <p>There are no matching appointments in this demo view.</p>
          </div>
        )}
      </div>
    </>
  );
}

function PatientRecords({ patients }: { patients: (typeof doctorPatients)[string] }) {
  const [patient, setPatient] = useState(patients[0]);
  const [section, setSection] = useState("Summary");
  return (
    <>
      <Header
        eyebrow="CONSENTED CLINICAL CONTEXT"
        title="Patient Records"
        text="Relevant records for assigned patients. Unassigned records remain inaccessible."
      />
      <div className="record-toolbar">
        <label>
          Assigned patient
          <select
            value={patient.name}
            onChange={(e) =>
              setPatient(patients.find((p) => p.name === e.target.value) ?? patients[0])
            }
          >
            {patients.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
        <span className="module-badge green">Consent active</span>
      </div>
      <div className="record-layout">
        <Card className="record-nav">
          {["Summary", "History", "Lab reports", "Prescriptions", "Access history"].map((item) => (
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
              <h2>
                {patient.name} · {section}
              </h2>
              <p>Restricted to information relevant to assigned care</p>
            </div>
          </div>
          {section === "Summary" && (
            <div className="summary-grid">
              <article>
                <small>CURRENT CARE</small>
                <strong>{patient.care}</strong>
                <p>Active demo care plan</p>
              </article>
              <article>
                <small>KNOWN CONDITION</small>
                <strong>Hypertension</strong>
                <p>Fictional health data</p>
              </article>
              <article>
                <small>ALLERGY</small>
                <strong>Penicillin</strong>
                <p>Patient-reported</p>
              </article>
              <article>
                <small>NEXT CONTACT</small>
                <strong>{patient.next}</strong>
                <p>Confirmed</p>
              </article>
            </div>
          )}
          {section !== "Summary" && (
            <div className="simple-rows">
              <div>
                <span>
                  <strong>{section} entry</strong>
                  <small>Fictional patient information · 22 May 2025</small>
                </span>
                <span className="module-badge blue">Permitted</span>
              </div>
              <div>
                <span>
                  <strong>Previous {section.toLowerCase()} entry</strong>
                  <small>Fictional demonstration record · 12 May 2025</small>
                </span>
                <span className="module-badge blue">Reviewed</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function DoctorLabs({
  patients,
  notify,
}: {
  patients: (typeof doctorPatients)[string];
  notify: Notify;
}) {
  return (
    <>
      <Header
        eyebrow="ASSIGNED PATIENT REPORTS"
        title="Lab Reports"
        text="View fictional reports shared by patients assigned to your care."
      />
      <Card className="data-card">
        <div className="data-card-head">
          <div>
            <h2>Reports requiring review</h2>
            <p>Demo values are not clinically meaningful.</p>
          </div>
          <select>
            <option>All assigned patients</option>
            {patients.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="responsive-table">
          <div className="table-row table-head">
            <span>PATIENT / REPORT</span>
            <span>LAB</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          {patients.map((patient, i) => (
            <div className="table-row" key={patient.name}>
              <span data-label="Patient / report">
                <strong>{i ? "Lipid Profile" : "Complete Blood Count"}</strong>
                <small>{patient.name}</small>
              </span>
              <span data-label="Lab">Demo Diagnostics</span>
              <span data-label="Date">{22 - i} May 2025</span>
              <span data-label="Status">
                <i className="module-badge amber">{i ? "Reviewed" : "New"}</i>
              </span>
              <span data-label="Action">
                <button
                  className="text-link"
                  onClick={() => notify("Restricted demo report opened")}
                >
                  Review →
                </button>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function ConsultationNotes({
  patients,
  notify,
}: {
  patients: (typeof doctorPatients)[string];
  notify: Notify;
}) {
  const [notes, setNotes] = useState([
    {
      patient: patients[0]?.name,
      date: "12 May 2025",
      title: "Follow-up consultation",
      text: "Demo note: discussed ongoing care plan and follow-up.",
    },
  ]);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header
        eyebrow="DOCTOR-AUTHORED RECORDS"
        title="Consultation Notes"
        text="Create fictional notes for assigned patients only."
        action={
          <button className="primary-button module-button" onClick={() => setOpen(true)}>
            + New consultation note
          </button>
        }
      />
      <div className="notes-list">
        {notes.map((note, index) => (
          <Card className="note-card" key={`${note.patient}-${index}`}>
            <span className="note-icon">N</span>
            <div>
              <span className="module-badge blue">Doctor note · Demo</span>
              <h2>{note.title}</h2>
              <p>{note.text}</p>
              <small>
                {note.patient} · {note.date}
              </small>
            </div>
          </Card>
        ))}
      </div>
      {open && (
        <Modal title="New consultation note" onClose={() => setOpen(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              setNotes((all) => [
                {
                  patient: patients[0].name,
                  date: "Today",
                  title: "Consultation note",
                  text: "New fictional consultation note created for demonstration.",
                },
                ...all,
              ]);
              setOpen(false);
              notify("Demo consultation note saved");
            }}
          >
            <label className="full-field">
              Assigned patient
              <select>
                {patients.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="full-field">
              Consultation title
              <input required defaultValue="Consultation note" />
            </label>
            <label className="full-field">
              Clinical note
              <textarea required placeholder="Enter fictional demo notes only" />
            </label>
            <div className="clinical-warning full-field">
              This note remains within the frontend demonstration and is not a real medical record.
            </div>
            <button className="primary-button module-button full-field">Save demo note</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function DoctorPrescriptions({
  patients,
  account,
  notify,
}: {
  patients: (typeof doctorPatients)[string];
  account: DemoAccount;
  notify: Notify;
}) {
  const [prescriptions, setPrescriptions] = useState([
    {
      patient: patients[0].name,
      medicine: "Cardioval 5mg (Fictional)",
      issued: "12 May 2025",
      status: "Active",
    },
  ]);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header
        eyebrow="QUALIFIED DOCTOR WORKFLOW"
        title="E-Prescriptions"
        text="Create fictional prescriptions only for patients assigned to your care."
        action={
          <button className="primary-button module-button" onClick={() => setOpen(true)}>
            + Create demo prescription
          </button>
        }
      />
      <div className="clinical-warning prominent">
        Only the signed-in fictional doctor can create prescriptions here. Administrators and family
        accounts cannot prescribe.
      </div>
      <div className="prescription-grid">
        {prescriptions.map((rx, index) => (
          <Card className="prescription-page-card" key={`${rx.patient}-${index}`}>
            <div className="rx-large">Rx</div>
            <span className="module-badge green">{rx.status}</span>
            <h2>{rx.medicine}</h2>
            <p>
              Patient: <strong>{rx.patient}</strong>
            </p>
            <small>
              Issued by {account.name} · {rx.issued}
            </small>
            <button
              className="outline-button block-button"
              onClick={() => notify("Demo prescription details opened")}
            >
              View prescription
            </button>
          </Card>
        ))}
      </div>
      {open && (
        <Modal title="Create demo e-prescription" onClose={() => setOpen(false)}>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              setPrescriptions((all) => [
                {
                  patient: patients[0].name,
                  medicine: "DemoCare 10mg (Fictional)",
                  issued: "Today",
                  status: "Active",
                },
                ...all,
              ]);
              setOpen(false);
              notify("Demo e-prescription created");
            }}
          >
            <label className="full-field">
              Assigned patient
              <select>
                {patients.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <label>
              Medicine name
              <input required placeholder="Fictional medicine name" />
            </label>
            <label>
              Strength
              <input required placeholder="e.g. 10mg" />
            </label>
            <label className="full-field">
              Instructions
              <textarea required placeholder="Demo dosage instructions" />
            </label>
            <div className="clinical-warning full-field">
              Demonstration only. This does not issue a legally valid prescription.
            </div>
            <button className="primary-button module-button full-field">
              Create demo prescription
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Schedule({ patients }: { patients: (typeof doctorPatients)[string] }) {
  return (
    <>
      <Header
        eyebrow="CONSULTATION CALENDAR"
        title="My Schedule"
        text="A weekly view of consultations assigned to your profile."
      />
      <Card className="week-calendar">
        <div className="calendar-header">
          <button>←</button>
          <div>
            <strong>26 May – 1 June 2025</strong>
            <small>Pakistan Standard Time</small>
          </div>
          <button>→</button>
        </div>
        <div className="calendar-grid">
          {["MON 26", "TUE 27", "WED 28", "THU 29", "FRI 30"].map((day, index) => (
            <div key={day}>
              <strong>{day}</strong>
              {index === 2 && (
                <article>
                  <time>4:30 PM</time>
                  <b>{patients[0].name}</b>
                  <small>Video · Follow-up</small>
                </article>
              )}
              {index === 3 && (
                <article className="clinic-slot">
                  <time>10:00 AM</time>
                  <b>{patients[1].name}</b>
                  <small>Clinic · Review</small>
                </article>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function DoctorSettings({ notify }: { notify: Notify }) {
  const [prefs, setPrefs] = useState({ appointments: true, reports: true, notes: true });
  return (
    <>
      <Header
        eyebrow="DOCTOR PREFERENCES"
        title="Workspace Settings"
        text="Manage notifications for your own doctor workspace."
      />
      <Card className="settings-content standalone-settings">
        <div className="card-title">
          <div>
            <h2>Clinical workspace notifications</h2>
            <p>System-wide settings are not available to doctor accounts.</p>
          </div>
        </div>
        <div className="setting-list">
          {[
            ["appointments", "Appointment updates"],
            ["reports", "New shared lab reports"],
            ["notes", "Incomplete consultation notes"],
          ].map(([key, title]) => (
            <label className="setting-row" key={key}>
              <span>
                <strong>{title}</strong>
                <small>Notifications for assigned care only</small>
              </span>
              <input
                type="checkbox"
                checked={prefs[key as keyof typeof prefs]}
                onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
              />
              <i className="toggle" />
            </label>
          ))}
        </div>
        <button
          className="primary-button module-button settings-save"
          onClick={() => notify("Doctor preferences saved")}
        >
          Save preferences
        </button>
      </Card>
    </>
  );
}

export function DoctorWorkspace({
  active,
  account,
  notify,
  navigate,
}: {
  active: string;
  account: DemoAccount;
  notify: Notify;
  navigate: (page: string) => void;
}) {
  const patients = doctorPatients[account.username] ?? [];
  return (
    <div className="module-host">
      <RoleBanner role="doctor" />
      {active === "Doctor Dashboard" && (
        <DoctorDashboard account={account} patients={patients} navigate={navigate} />
      )}
      {active === "Doctor Profile" && <DoctorProfile account={account} notify={notify} />}
      {active === "Assigned Patients" && <AssignedPatients patients={patients} notify={notify} />}
      {active === "Doctor Appointments" && (
        <DoctorAppointments patients={patients} notify={notify} />
      )}
      {active === "Patient Records" && <PatientRecords patients={patients} />}
      {active === "Doctor Lab Reports" && <DoctorLabs patients={patients} notify={notify} />}
      {active === "Consultation Notes" && <ConsultationNotes patients={patients} notify={notify} />}
      {active === "Doctor Prescriptions" && (
        <DoctorPrescriptions patients={patients} account={account} notify={notify} />
      )}
      {active === "Consultation Schedule" && <Schedule patients={patients} />}
      {active === "Doctor Settings" && <DoctorSettings notify={notify} />}
    </div>
  );
}

const adminUsers = [
  { name: "Ahmad Ali", username: "ahmad", role: "Family", status: "Active" },
  { name: "Omar Khan", username: "omar", role: "Family", status: "Active" },
  { name: "Sana Ahmed", username: "sana", role: "Family", status: "Active" },
];
const adminDoctors = [
  { name: "Dr. Abdullah Baig", specialty: "General Physician", status: "Verified" },
  { name: "Dr. Saad Iftikhar", specialty: "Internal Medicine", status: "Verified" },
  { name: "Dr. Sara Malik", specialty: "Cardiology", status: "Verified" },
];

function AdminHome({ navigate }: { navigate: (page: string) => void }) {
  return (
    <>
      <Header
        eyebrow="PLATFORM ADMINISTRATION"
        title="Admin Dashboard"
        text="Monitor fictional platform activity without making clinical decisions."
      />
      <div className="stats-grid four">
        <Card>
          <small>DEMO USERS</small>
          <strong>2,486</strong>
          <span className="positive">+8.4% this month</span>
        </Card>
        <Card>
          <small>DOCTOR ACCOUNTS</small>
          <strong>184</strong>
          <span>12 pending review</span>
        </Card>
        <Card>
          <small>APPOINTMENTS</small>
          <strong>612</strong>
          <span>Demo activity · May</span>
        </Card>
        <Card>
          <small>SYSTEM EVENTS</small>
          <strong>3,204</strong>
          <span>Last 30 days</span>
        </Card>
      </div>
      <div className="role-dashboard-grid">
        <Card className="admin-chart-card">
          <div className="card-title">
            <div>
              <h2>Platform appointment activity</h2>
              <p>Simulated activity during the last seven days</p>
            </div>
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
        <Card className="padded-card admin-actions">
          <div className="card-title">
            <div>
              <h2>Administrative actions</h2>
              <p>Restricted to administrator accounts</p>
            </div>
          </div>
          <button onClick={() => navigate("User Management")}>
            <span>U</span>
            <div>
              <strong>Manage users</strong>
              <small>Accounts and access status</small>
            </div>
            <i>›</i>
          </button>
          <button onClick={() => navigate("Doctor Management")}>
            <span>D</span>
            <div>
              <strong>Manage doctors</strong>
              <small>Provider verification</small>
            </div>
            <i>›</i>
          </button>
          <button onClick={() => navigate("System Activity")}>
            <span>A</span>
            <div>
              <strong>System activity</strong>
              <small>Review demo audit events</small>
            </div>
            <i>›</i>
          </button>
        </Card>
      </div>
      <Card className="doctor-guardrail admin-guardrail">
        <span>!</span>
        <div>
          <strong>Administrative boundary</strong>
          <p>
            Administrators manage platform access and operations. They cannot create consultation
            notes, prescribe medicines or make medical decisions.
          </p>
        </div>
      </Card>
    </>
  );
}

function AdminTable({ type, notify }: { type: "users" | "doctors"; notify: Notify }) {
  const [query, setQuery] = useState("");
  const rows =
    type === "users"
      ? adminUsers.map((u) => [u.name, `@${u.username}`, u.role, u.status])
      : adminDoctors.map((d) => [d.name, d.specialty, "Doctor", d.status]);
  const filtered = rows.filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <Header
        eyebrow="ADMIN-ONLY ACCOUNT CONTROL"
        title={type === "users" ? "User Management" : "Doctor Management"}
        text={
          type === "users"
            ? "View and manage fictional family coordinator accounts."
            : "Review fictional doctor accounts and verification status."
        }
        action={
          <button
            className="primary-button module-button"
            onClick={() => notify(`New demo ${type === "users" ? "user" : "doctor"} form opened`)}
          >
            + Add demo account
          </button>
        }
      />
      <Card className="filter-bar admin-filter">
        <label className="search-input">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${type}`}
          />
        </label>
        <select>
          <option>All roles</option>
        </select>
        <select>
          <option>All statuses</option>
        </select>
      </Card>
      <Card className="data-card admin-account-table">
        <div className="responsive-table">
          <div className="table-row table-head">
            <span>ACCOUNT</span>
            <span>{type === "users" ? "USERNAME" : "SPECIALTY"}</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          {filtered.map((row) => (
            <div className="table-row" key={row[0]}>
              <span data-label="Account">
                <strong>{row[0]}</strong>
                <small>Fictional demo account</small>
              </span>
              <span data-label={type === "users" ? "Username" : "Specialty"}>{row[1]}</span>
              <span data-label="Role">{row[2]}</span>
              <span data-label="Status">
                <i className="module-badge green">{row[3]}</i>
              </span>
              <span data-label="Action">
                <button
                  className="text-link"
                  onClick={() => notify(`${row[0]} account controls opened`)}
                >
                  Manage →
                </button>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function AdminAppointments({ notify }: { notify: Notify }) {
  return (
    <>
      <Header
        eyebrow="PLATFORM OPERATIONS"
        title="All Appointments"
        text="Operational visibility into fictional appointments. Clinical decisions remain with doctors."
      />
      <Card className="data-card">
        <div className="data-card-head">
          <div>
            <h2>Appointment activity</h2>
            <p>All records shown are demonstration data.</p>
          </div>
          <select>
            <option>All statuses</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="responsive-table">
          <div className="table-row table-head">
            <span>PATIENT / DOCTOR</span>
            <span>TYPE</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>
          {[
            ["Ahmed Khan", "Dr. Sara Malik", "Video", "28 May"],
            ["Mariam Iqbal", "Dr. Abdullah", "Clinic", "29 May"],
            ["Nasreen Akhtar", "Dr. Saad Iftikhar", "Video", "3 June"],
          ].map((row) => (
            <div className="table-row" key={row[0]}>
              <span data-label="Patient / doctor">
                <strong>{row[0]}</strong>
                <small>{row[1]}</small>
              </span>
              <span data-label="Type">{row[2]}</span>
              <span data-label="Date">{row[3]} 2025</span>
              <span data-label="Status">
                <i className="module-badge green">Confirmed</i>
              </span>
              <span data-label="Action">
                <button
                  className="text-link"
                  onClick={() => notify("Operational appointment details opened")}
                >
                  View →
                </button>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Roles({ notify }: { notify: Notify }) {
  const [roles, setRoles] = useState({
    ahmad: "Family",
    omar: "Family",
    sana: "Family",
    abdullah: "Doctor",
    saad: "Doctor",
    sara: "Doctor",
    ayesha: "Nurse",
    fatima: "Nurse",
    maryam: "Nurse",
  });
  return (
    <>
      <Header
        eyebrow="LEAST-PRIVILEGE ACCESS"
        title="Role Assignments"
        text="Review fictional account roles. Changes affect this prototype session only."
      />
      <Card className="role-matrix">
        <div className="clinical-warning prominent">
          Role changes in this frontend demonstration are not production access controls.
        </div>
        {Object.entries(roles).map(([username, role]) => (
          <div className="role-row" key={username}>
            <span className={`credential-avatar ${role.toLowerCase()}`}>
              {username.slice(0, 2).toUpperCase()}
            </span>
            <span>
              <strong>@{username}</strong>
              <small>Demo account</small>
            </span>
            <select
              value={role}
              onChange={(e) => setRoles((current) => ({ ...current, [username]: e.target.value }))}
            >
              <option>Family</option>
              <option>Doctor</option>
              <option>Nurse</option>
              <option>Admin</option>
            </select>
            <button
              className="outline-button"
              onClick={() => notify(`Demo role saved for @${username}`)}
            >
              Save
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

function Activity() {
  return (
    <>
      <Header
        eyebrow="ADMIN AUDIT VIEW"
        title="System Activity"
        text="A fictional operational audit trail for the platform demonstration."
      />
      <Card className="activity-page">
        {[
          [
            "10:42 AM",
            "Appointment confirmed",
            "Family account @omar · Demo appointment #2408",
            "Appointment",
          ],
          ["9:32 AM", "Doctor profile reviewed", "Administrator · Dr. Abdullah", "Provider"],
          [
            "Yesterday",
            "Consent updated",
            "Family account @sara · Patient-controlled access",
            "Privacy",
          ],
          ["24 May", "Role assignment reviewed", "Administrator · No change", "Security"],
          ["22 May", "Report uploaded", "Demo lab integration event", "Records"],
        ].map((item, i) => (
          <article className="activity-row" key={item[1]}>
            <span className={`activity-dot dot-${i % 4}`}>{item[3][0]}</span>
            <div>
              <span className="module-badge blue">{item[3]}</span>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
              <time>{item[0]}</time>
            </div>
            <button>›</button>
          </article>
        ))}
      </Card>
    </>
  );
}

function AdminSettings({ notify }: { notify: Notify }) {
  const [settings, setSettings] = useState({ maintenance: false, review: true, audit: true });
  return (
    <>
      <Header
        eyebrow="ADMINISTRATIVE CONFIGURATION"
        title="Admin Settings"
        text="Manage fictional platform operations. Medical workflows are not available here."
      />
      <Card className="settings-content standalone-settings">
        <div className="card-title">
          <div>
            <h2>Platform controls</h2>
            <p>Restricted to the administrator demo account.</p>
          </div>
        </div>
        <div className="setting-list">
          {[
            ["maintenance", "Maintenance notice", "Display a prototype-wide maintenance banner"],
            ["review", "Provider review alerts", "Notify admin about pending fictional providers"],
            ["audit", "Activity logging", "Record frontend demonstration events"],
          ].map(([key, title, detail]) => (
            <label className="setting-row" key={key}>
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings]}
                onChange={() => setSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
              />
              <i className="toggle" />
            </label>
          ))}
        </div>
        <button
          className="primary-button module-button settings-save"
          onClick={() => notify("Administrative settings saved for this demo session")}
        >
          Save settings
        </button>
      </Card>
    </>
  );
}

export function AdminWorkspace({
  active,
  notify,
  navigate,
}: {
  active: string;
  notify: Notify;
  navigate: (page: string) => void;
}) {
  return (
    <div className="module-host">
      <RoleBanner role="admin" />
      {active === "Admin Dashboard" && <AdminHome navigate={navigate} />}
      {active === "User Management" && <AdminTable type="users" notify={notify} />}
      {active === "Doctor Management" && <AdminTable type="doctors" notify={notify} />}
      {active === "Nurse Management" && <AdminNurses notify={notify} />}
      {active === "Home Nursing Bookings" && <AdminNursingBookings />}
      {active === "Provider Listings" && <ProviderListings notify={notify} />}
      {active === "All Appointments" && <AdminAppointments notify={notify} />}
      {active === "Role Assignments" && <Roles notify={notify} />}
      {active === "System Activity" && <Activity />}
      {active === "Admin Settings" && <AdminSettings notify={notify} />}
    </div>
  );
}
