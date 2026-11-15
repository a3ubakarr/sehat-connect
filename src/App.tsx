import { useEffect, useRef, useState } from "react";
import { Login } from "./Login";
import { ModulePages } from "./ModulePages";
import { AdminWorkspace, DoctorWorkspace } from "./RoleWorkspaces";
import { NurseWorkspace } from "./NurseAdmin";
import { Avatar, findDoctorByName } from "./people";
import {
  DemoAccount,
  FamilyDemoData,
  canAccess,
  demoAccounts,
  defaultPage,
  getFamilyData,
  initials,
} from "./auth";

type IconName =
  | "activity"
  | "bell"
  | "calendar"
  | "card"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "doctor"
  | "family"
  | "file"
  | "flask"
  | "home"
  | "menu"
  | "message"
  | "pill"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "stethoscope"
  | "user"
  | "video";

const iconPaths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-7h6v7" />
    </>
  ),
  family: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  doctor: (
    <>
      <path d="M12 2v4M10 4h4" />
      <path d="M8 6v5a4 4 0 0 0 8 0V6M16 9h2a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0v-1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3z" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8" cy="10" r="2" />
      <path d="M5.5 16c.5-2 4.5-2 5 0M14 9h4M14 13h4" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
      <path d="M8 15h8" />
    </>
  ),
  file: (
    <>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5M9 13h6M9 17h5" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  message: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3v-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3h4v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.25.62.86 1 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  chevron: <path d="m7 10 5 5 5-5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 15v1a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

type NavItem = { label: string; icon: IconName };

const familyNavItems: NavItem[] = [
  { label: "Overview", icon: "home" },
  { label: "My Family", icon: "family" },
  { label: "Find Doctors", icon: "doctor" },
  { label: "Appointments", icon: "calendar" },
  { label: "Video Consultations", icon: "video" },
  { label: "Home Nursing", icon: "activity" },
  { label: "Digital Health Card", icon: "card" },
  { label: "Lab Reports", icon: "flask" },
  { label: "Laboratory Services", icon: "stethoscope" },
  { label: "E-Prescriptions", icon: "file" },
  { label: "Medicine Finder", icon: "pill" },
  { label: "Pharmacies", icon: "plus" },
  { label: "Health Reminders", icon: "clock" },
  { label: "Family Updates", icon: "message" },
  { label: "Settings", icon: "settings" },
];

const doctorNavItems: NavItem[] = [
  { label: "Doctor Dashboard", icon: "home" },
  { label: "Doctor Profile", icon: "doctor" },
  { label: "Assigned Patients", icon: "family" },
  { label: "Doctor Appointments", icon: "calendar" },
  { label: "Patient Records", icon: "card" },
  { label: "Doctor Lab Reports", icon: "flask" },
  { label: "Consultation Notes", icon: "file" },
  { label: "Doctor Prescriptions", icon: "pill" },
  { label: "Consultation Schedule", icon: "clock" },
  { label: "Doctor Settings", icon: "settings" },
];

const nurseNavItems: NavItem[] = [
  { label: "Nurse Dashboard", icon: "home" },
  { label: "Nurse Profile", icon: "user" },
  { label: "Nurse Patients", icon: "family" },
  { label: "Nursing Bookings", icon: "calendar" },
  { label: "Visit Details", icon: "file" },
  { label: "Nursing Schedule", icon: "clock" },
];

const adminNavItems: NavItem[] = [
  { label: "Admin Dashboard", icon: "shield" },
  { label: "User Management", icon: "family" },
  { label: "Doctor Management", icon: "doctor" },
  { label: "Nurse Management", icon: "stethoscope" },
  { label: "All Appointments", icon: "calendar" },
  { label: "Home Nursing Bookings", icon: "activity" },
  { label: "Provider Listings", icon: "card" },
  { label: "Role Assignments", icon: "card" },
  { label: "System Activity", icon: "activity" },
  { label: "Admin Settings", icon: "settings" },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <Icon name="activity" size={21} />
      </div>
      {!compact && (
        <div>
          <strong>
            SEHAT <span>CONNECT</span>
          </strong>
          <small>Care. Connected.</small>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  active,
  items,
  role,
  onNavigate,
  open,
  onClose,
  onSignOut,
}: {
  onSignOut: () => void;
  active: string;
  items: NavItem[];
  role: DemoAccount["role"];
  onNavigate: (name: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div className={`sidebar-scrim ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Brand />
          <button
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">CARE MANAGEMENT</p>
          {items.map((item, index) => (
            <button
              key={item.label}
              className={`nav-item ${active === item.label ? "active" : ""} ${item.label.includes("Settings") ? "settings-link" : ""}`}
              onClick={() => {
                onNavigate(item.label);
                onClose();
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {active === item.label && <span className="active-dot" />}
            </button>
          ))}
        </nav>
        <button className="sidebar-signout" onClick={onSignOut}>
          Sign out
        </button>
        <div className="privacy-card">
          <div className="privacy-icon">
            <Icon name="shield" size={18} />
          </div>
          <div>
            <strong>Your family's privacy matters</strong>
            <p>Health information is protected and shared only with consent.</p>
          </div>
        </div>
        <div className="prototype-label">
          <span /> {role.toUpperCase()} · PROTOTYPE
        </div>
      </aside>
    </>
  );
}

function Dropdown({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`dropdown ${className}`}>{children}</div>;
}

function Header({
  onMenu,
  onNavigate,
  onSignOut,
  account,
  family,
}: {
  onMenu: () => void;
  onNavigate: (name: string) => void;
  onSignOut: () => void;
  account: DemoAccount;
  family: FamilyDemoData | null;
}) {
  const [patientOpen, setPatientOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [query, setQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setPatientOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <header className="topbar" ref={headerRef}>
      <div className="mobile-brand">
        <button className="icon-button" onClick={onMenu} aria-label="Open navigation">
          <Icon name="menu" />
        </button>
        <Brand />
      </div>
      {account.role === "family" && family ? (
        <div className="patient-select-wrap">
          <span className="field-label">MANAGING CARE FOR</span>
          <button
            className="patient-selector"
            onClick={() => setPatientOpen(!patientOpen)}
            aria-expanded={patientOpen}
          >
            <span className="avatar avatar-sm">{initials(family.patient)}</span>
            <span>
              <strong>{family.patient}</strong>
              <small>
                {family.relationship} · {family.location.split(",")[0]}
              </small>
            </span>
            <Icon name="chevron" size={17} />
          </button>
          {patientOpen && (
            <Dropdown className="patient-menu">
              <p className="dropdown-title">Select family member</p>
              <button className="person-option selected">
                <span className="avatar avatar-sm">{initials(family.patient)}</span>
                <span>
                  <strong>{family.patient}</strong>
                  <small>
                    {family.relationship} · {family.location.split(",")[0]}
                  </small>
                </span>
                <Icon name="check" size={17} />
              </button>
              <button
                className="person-option"
                onClick={() => {
                  setPatientOpen(false);
                  onNavigate("My Family");
                }}
              >
                <span className="avatar avatar-sm alt">{initials(family.secondary)}</span>
                <span>
                  <strong>{family.secondary}</strong>
                  <small>Family member · {family.location.split(",")[0]}</small>
                </span>
              </button>
              <button className="add-person" onClick={() => onNavigate("My Family")}>
                <Icon name="plus" size={17} /> Add family member
              </button>
            </Dropdown>
          )}
        </div>
      ) : (
        <div className="role-context">
          <span className={`role-context-icon ${account.role}`}>
            <Icon name={account.role === "admin" ? "shield" : "stethoscope"} size={18} />
          </span>
          <span>
            <small>{account.role === "doctor" ? "CLINICAL WORKSPACE" : account.role === "nurse" ? "NURSING WORKSPACE" : "ADMIN WORKSPACE"}</small>
            <strong>{account.subtitle}</strong>
          </span>
        </div>
      )}
      <div className="header-actions">
        {account.role === "family" && (
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) onNavigate(`Search: ${query}`);
            }}
          >
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
              placeholder="Search doctors, reports, medicines..."
            />
            <kbd>⌘ K</kbd>
          </form>
        )}
        <div className="relative">
          <button
            className="icon-button notification-button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Icon name="bell" />
            {unreadNotifications > 0 && <span className="notification-dot" />}
          </button>
          {notificationsOpen && (
            <Dropdown className="notification-menu">
              <div className="dropdown-heading">
                <strong>Notifications</strong>
                {unreadNotifications > 0 ? (
                  <button onClick={() => setUnreadNotifications(0)}>
                    Mark all read · {unreadNotifications}
                  </button>
                ) : (
                  <span>All read</span>
                )}
              </div>
              <button
                className={`notification ${unreadNotifications < 1 ? "read" : ""}`}
                onClick={() => setUnreadNotifications((count) => Math.max(0, count - 1))}
              >
                <i className="notif-icon green">
                  <Icon name="calendar" size={17} />
                </i>
                <span>
                  <strong>
                    {account.role === "admin"
                      ? "Provider review pending"
                      : account.role === "doctor"
                        ? "Assigned appointment updated"
                        : "Appointment confirmed"}
                  </strong>
                  <small>
                    {account.role === "admin"
                      ? "A fictional doctor profile needs review"
                      : account.role === "doctor"
                        ? "Your consultation schedule has changed"
                        : "Dr. Sara Malik · Tomorrow at 4:30 PM"}
                  </small>
                  <time>12 min ago</time>
                </span>
              </button>
              <button
                className={`notification ${unreadNotifications < 2 ? "read" : ""}`}
                onClick={() => setUnreadNotifications((count) => Math.max(0, count - 1))}
              >
                <i className="notif-icon blue">
                  <Icon name="flask" size={17} />
                </i>
                <span>
                  <strong>
                    {account.role === "admin"
                      ? "Platform activity summary"
                      : account.role === "doctor"
                        ? "Shared report available"
                        : "Lab report available"}
                  </strong>
                  <small>
                    {account.role === "admin"
                      ? "Yesterday's demo operations are ready"
                      : account.role === "doctor"
                        ? "An assigned patient shared a demo report"
                        : "Complete Blood Count report uploaded"}
                  </small>
                  <time>Yesterday</time>
                </span>
              </button>
              <button
                className="view-all"
                onClick={() =>
                  onNavigate(
                    account.role === "family"
                      ? "Family Updates"
                      : account.role === "doctor"
                        ? "Doctor Appointments"
                        : account.role === "nurse"
                          ? "Nursing Bookings"
                          : "System Activity",
                  )
                }
              >
                View all notifications
              </button>
            </Dropdown>
          )}
        </div>
        <div className="relative">
          <button
            className="profile-button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            aria-expanded={profileOpen}
          >
            <span className="user-avatar">{initials(account.name)}</span>
            <span className="profile-copy">
              <strong>{account.name}</strong>
              <small>{account.subtitle}</small>
            </span>
            <Icon name="chevron" size={16} />
          </button>
          {profileOpen && (
            <Dropdown className="profile-menu">
              <div className="profile-summary">
                <span className="user-avatar">{initials(account.name)}</span>
                <span>
                  <strong>{account.name}</strong>
                  <small>
                    @{account.username} · {account.role}
                  </small>
                </span>
              </div>
              <button
                onClick={() =>
                  onNavigate(
                    account.role === "doctor"
                      ? "Doctor Profile"
                      : account.role === "nurse"
                        ? "Nurse Profile"
                        : account.role === "admin"
                        ? "Admin Settings"
                        : "Profile",
                  )
                }
              >
                <Icon name="user" size={17} /> My profile
              </button>
              <button
                onClick={() =>
                  onNavigate(
                    account.role === "doctor"
                      ? "Doctor Settings"
                      : account.role === "nurse"
                        ? "Nursing Schedule"
                        : account.role === "admin"
                        ? "Admin Settings"
                        : "Settings",
                  )
                }
              >
                <Icon name="settings" size={17} /> Account settings
              </button>
              <button className="signout" onClick={onSignOut}>
                Sign out
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}

function SectionCard({
  title,
  action,
  onAction,
  children,
  className = "",
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-card ${className}`}>
      <div className="section-heading">
        <h2>{title}</h2>
        {action && (
          <button onClick={onAction}>
            {action} <span>→</span>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Dashboard({
  onNavigate,
  notify,
  account,
  family,
}: {
  onNavigate: (name: string) => void;
  notify: (message: string) => void;
  account: DemoAccount;
  family: FamilyDemoData;
}) {
  const quickActions: { label: string; icon: IconName; page: string; tone: string }[] = [
    { label: "Find a Doctor", icon: "doctor", page: "Find Doctors", tone: "sage" },
    { label: "Book Appointment", icon: "calendar", page: "Appointments", tone: "blue" },
    { label: "View Health Card", icon: "card", page: "Digital Health Card", tone: "amber" },
    { label: "Find Medicine", icon: "pill", page: "Medicine Finder", tone: "rose" },
  ];
  return (
    <>
      <div className="demo-banner">
        <Icon name="shield" size={15} />
        <strong>DEMO DATA — NOT FOR CLINICAL USE</strong>
        <span>This is a prototype experience using fictional information.</span>
      </div>
      <section className="welcome">
        <div>
          <p className="eyebrow">MONDAY, 26 MAY</p>
          <h1>Good morning, {account.name.split(" ")[0]}.</h1>
          <p>
            Here's an overview of {family.patientFirst}'s care in {family.location.split(",")[0]}.
          </p>
        </div>
        <div className="consent-pill">
          <span className="consent-icon">
            <Icon name="shield" size={18} />
          </span>
          <span>
            <small>SHARING STATUS</small>
            <strong>
              <i /> Consent active
            </strong>
          </span>
        </div>
      </section>

      <div className="quick-grid">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="quick-action"
            onClick={() => onNavigate(action.page)}
          >
            <span className={`quick-icon ${action.tone}`}>
              <Icon name={action.icon} />
            </span>
            <span>{action.label}</span>
            <b>↗</b>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <section className="patient-card">
            <div className="patient-identity">
              <div className="patient-photo">
                AK
                <span className="online-status" />
              </div>
              <div>
                <span className="card-kicker">CURRENT PATIENT</span>
                <h2>
                  {family.patient} <em>Demo</em>
                </h2>
                <p>
                  <span>⌖</span> {family.location}
                </p>
              </div>
            </div>
            <div className="record-meta">
              <div>
                <small>HEALTH RECORD</small>
                <strong>
                  <Icon name="check" size={14} /> Up to date
                </strong>
              </div>
              <div>
                <small>LAST UPDATED</small>
                <strong>24 May 2025</strong>
              </div>
            </div>
            <button className="primary-button" onClick={() => onNavigate("Digital Health Card")}>
              <Icon name="card" size={17} /> View Health Card
            </button>
          </section>

          <SectionCard
            title="Upcoming appointment"
            action="View all"
            onAction={() => onNavigate("Appointments")}
          >
            <article className="appointment">
              <div className="date-tile">
                <strong>28</strong>
                <span>MAY</span>
              </div>
              <Avatar
                src={findDoctorByName("Dr. Sara Malik")?.photo}
                initials="SM"
                size={56}
                verified
              />
              <div className="appointment-info">
                <div className="title-row">
                  <h3>Dr. Sara Malik</h3>
                  <span className="status confirmed">Confirmed</span>
                </div>
                <p>Consultant Cardiologist</p>
                <div className="meta-row">
                  <span>
                    <Icon name="clock" size={15} /> 4:30 PM PKT
                  </span>
                  <span>
                    <Icon name="video" size={15} /> Video consultation
                  </span>
                </div>
              </div>
              <div className="appointment-actions">
                <button
                  className="secondary-button"
                  onClick={() => notify("Opening appointment details")}
                >
                  View details
                </button>
                <button
                  className="join-button"
                  onClick={() =>
                    notify("The demo consultation room opens 10 minutes before the appointment")
                  }
                >
                  Join call
                </button>
              </div>
            </article>
            <div className="appointment-footer">
              <Icon name="clock" size={15} /> In 2 days · You’ll receive a reminder 30 minutes
              before
            </div>
            <button className="book-link" onClick={() => onNavigate("Find Doctors")}>
              <Icon name="plus" size={16} /> Book another appointment
            </button>
          </SectionCard>

          <div className="two-column">
            <SectionCard
              title="Recent lab reports"
              action="All reports"
              onAction={() => onNavigate("Lab Reports")}
            >
              <div className="list">
                <button
                  className="list-item"
                  onClick={() => notify("Opening Complete Blood Count report")}
                >
                  <span className="doc-icon">
                    <Icon name="flask" size={18} />
                  </span>
                  <span className="list-copy">
                    <strong>Complete Blood Count</strong>
                    <small>Chughtai Lab · 22 May 2025</small>
                  </span>
                  <span className="status ready">Ready</span>
                  <span className="arrow">→</span>
                </button>
                <button
                  className="list-item"
                  onClick={() => notify("Opening Lipid Profile report")}
                >
                  <span className="doc-icon">
                    <Icon name="flask" size={18} />
                  </span>
                  <span className="list-copy">
                    <strong>Lipid Profile</strong>
                    <small>IDC Lahore · 18 May 2025</small>
                  </span>
                  <span className="status reviewed">Reviewed</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            </SectionCard>
            <SectionCard
              title="Active prescriptions"
              action="View all"
              onAction={() => onNavigate("E-Prescriptions")}
            >
              <div className="prescription">
                <div className="prescription-top">
                  <span className="rx">Rx</span>
                  <span className="status active">Active</span>
                </div>
                <h3>Cardiac care prescription</h3>
                <p>
                  Issued by <strong>Dr. Saad Iftikhar</strong>
                </p>
                <small>12 May 2025 · 3 medicines</small>
                <button
                  className="text-button"
                  onClick={() => notify("Opening cardiac care prescription")}
                >
                  View prescription <span>→</span>
                </button>
              </div>
            </SectionCard>
          </div>
        </div>

        <aside className="right-column">
          <SectionCard
            title="Health reminders"
            action="View all"
            onAction={() => onNavigate("Health Reminders")}
          >
            <div className="reminders">
              <button
                className="reminder"
                onClick={() => notify("Medicine reminder marked as acknowledged")}
              >
                <span className="reminder-date">
                  <b>26</b>
                  <small>MAY</small>
                </span>
                <span className="reminder-line mint" />
                <span className="reminder-copy">
                  <span>
                    <strong>Evening medicine</strong>
                    <em>Today</em>
                  </span>
                  <small>Atorvastatin · 8:00 PM</small>
                </span>
              </button>
              <button className="reminder" onClick={() => onNavigate("Appointments")}>
                <span className="reminder-date">
                  <b>28</b>
                  <small>MAY</small>
                </span>
                <span className="reminder-line blue" />
                <span className="reminder-copy">
                  <span>
                    <strong>Cardiology appointment</strong>
                    <em className="upcoming">Upcoming</em>
                  </span>
                  <small>Video call · 4:30 PM</small>
                </span>
              </button>
              <button
                className="reminder"
                onClick={() => notify("Opening annual check-up reminder")}
              >
                <span className="reminder-date">
                  <b>05</b>
                  <small>JUN</small>
                </span>
                <span className="reminder-line amber" />
                <span className="reminder-copy">
                  <span>
                    <strong>Annual check-up</strong>
                    <em className="planned">Planned</em>
                  </span>
                  <small>Routine health assessment</small>
                </span>
              </button>
            </div>
            <button className="add-reminder" onClick={() => notify("New reminder form opened")}>
              <Icon name="plus" size={16} /> Add a reminder
            </button>
          </SectionCard>

          <SectionCard
            title="Recent family activity"
            action="See updates"
            onAction={() => onNavigate("Family Updates")}
          >
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-icon green">
                  <Icon name="check" size={14} />
                </span>
                <div>
                  <strong>Appointment confirmed</strong>
                  <p>Cardiology video consultation with Dr. Sara Malik</p>
                  <time>Today, 10:42 AM</time>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-icon blue">
                  <Icon name="flask" size={14} />
                </span>
                <div>
                  <strong>Lab report uploaded</strong>
                  <p>Complete Blood Count from Chughtai Lab</p>
                  <time>22 May, 3:15 PM</time>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-icon amber">
                  <Icon name="calendar" size={14} />
                </span>
                <div>
                  <strong>Follow-up scheduled</strong>
                  <p>Annual check-up added for 5 June</p>
                  <time>20 May, 6:08 PM</time>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="support-card">
            <span>
              <Icon name="message" size={20} />
            </span>
            <div>
              <strong>Need help coordinating care?</strong>
              <p>Our prototype support guide can walk you through the platform.</p>
              <button onClick={() => notify("Support guide opened")}>Open support guide →</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function App() {
  const [account, setAccount] = useState<DemoAccount | null>(() => {
    try {
      const username = sessionStorage.getItem("sehat-connect-session");
      return username ? (demoAccounts.find((item) => item.username === username) ?? null) : null;
    } catch {
      return null;
    }
  });
  const [active, setActive] = useState(() => (account ? defaultPage(account.role) : "Overview"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const navigate = (name: string) => {
    if (!account || !canAccess(account.role, name)) {
      notify("This page is not available to your account role");
      setActive(account ? defaultPage(account.role) : "Overview");
      return;
    }
    setActive(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const login = (nextAccount: DemoAccount) => {
    sessionStorage.setItem("sehat-connect-session", nextAccount.username);
    setAccount(nextAccount);
    setActive(defaultPage(nextAccount.role));
  };
  const logout = () => {
    sessionStorage.removeItem("sehat-connect-session");
    setLogoutOpen(false);
    setAccount(null);
    setActive("Overview");
  };
  if (!account) return <Login onLogin={login} />;
  const family = account.role === "family" ? getFamilyData(account.username) : null;
  const items =
    account.role === "family"
      ? familyNavItems
      : account.role === "doctor"
        ? doctorNavItems
        : account.role === "nurse"
          ? nurseNavItems
          : adminNavItems;
  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        items={items}
        role={account.role}
        onNavigate={navigate}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignOut={() => setLogoutOpen(true)}
      />
      <div className="workspace">
        <Header
          onMenu={() => setMenuOpen(true)}
          onNavigate={navigate}
          onSignOut={() => setLogoutOpen(true)}
          account={account}
          family={family}
        />
        <main>
          {account.role === "family" && family && (
            <>
              {active === "Overview" && (
                <Dashboard
                  onNavigate={navigate}
                  notify={notify}
                  account={account}
                  family={family}
                />
              )}
              <ModulePages
                key={account.username}
                active={active}
                hidden={active === "Overview"}
                onNavigate={navigate}
                notify={notify}
                family={family}
              />
            </>
          )}
          {account.role === "doctor" && (
            <DoctorWorkspace
              active={active}
              account={account}
              notify={notify}
              navigate={navigate}
            />
          )}
          {account.role === "nurse" && (
            <NurseWorkspace
              active={active}
              account={account}
              notify={notify}
              navigate={navigate}
            />
          )}
          {account.role === "admin" && (
            <AdminWorkspace active={active} notify={notify} navigate={navigate} />
          )}
        </main>
        <footer>
          <span>© 2025 Sehat Connect · Prototype only</span>
          <span>
            Privacy-first care coordination · <strong>Fictional demo data</strong>
          </span>
        </footer>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
      {logoutOpen && (
        <div className="modal-backdrop" onMouseDown={() => setLogoutOpen(false)}>
          <div
            className="modal logout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm sign out"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="logout-confirm">
              <span className="logout-icon">
                <Icon name="shield" size={22} />
              </span>
              <h2>Sign out of Sehat Connect?</h2>
              <p>
                Your demo session on this device will be cleared. You can sign in again with any
                demo account.
              </p>
              <div>
                <button className="outline-button" onClick={() => setLogoutOpen(false)}>
                  Stay signed in
                </button>
                <button className="logout-button" onClick={logout}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
