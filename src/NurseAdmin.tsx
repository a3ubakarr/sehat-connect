import { useState } from "react";
import { DemoAccount } from "./auth";
import { Avatar, doctorProfiles, findNurse, nurseProfiles } from "./people";
import { BookingStatus, NursingBooking, nursingStore, statusTone, useBookings } from "./nursingStore";
import { Card, Empty, Modal, PageHeader, fmtDate, fmtTime, pkr } from "./ui";

type Notify = (m: string) => void;

const when = (b: NursingBooking) =>
  b.mode === "On-demand" ? "As soon as possible" : `${fmtDate(b.date)} · ${fmtTime(b.time)}`;

const nextStep: Partial<Record<BookingStatus, BookingStatus>> = {
  Accepted: "On the way",
  "On the way": "In progress",
  "In progress": "Completed",
};

function NurseBanner() {
  return (
    <div className="demo-banner module-demo">
      <span className="mini-shield">✓</span>
      <strong>NURSE WORKSPACE · DEMO DATA</strong>
      <span>Supportive nursing care only. No diagnosis or prescribing.</span>
    </div>
  );
}

function VisitCard({ b, notify }: { b: NursingBooking; notify: Notify }) {
  const [note, setNote] = useState("");
  const next = nextStep[b.status];
  return (
    <Card className="booking-card">
      <div className="booking-top">
        <Avatar initials={b.patient.split(" ").map((p) => p[0]).join("").slice(0, 2)} size={48} className="alt" />
        <div>
          <h3>{b.patient}</h3>
          <p>
            {b.service} · {b.id}
          </p>
        </div>
        <span className={`module-badge ${statusTone(b.status)}`}>{b.status}</span>
      </div>
      <div className="detail-grid">
        <span>
          <small>WHEN</small>
          <strong>{when(b)}</strong>
        </span>
        <span>
          <small>LOCATION</small>
          <strong>
            {b.locality} · {b.address}
          </strong>
        </span>
        <span>
          <small>PATIENT</small>
          <strong>
            {b.relation}
            {b.age ? ` · ${b.age} yrs` : ""}
          </strong>
        </span>
        <span>
          <small>VISIT CHARGES</small>
          <strong>{pkr(b.fee)}</strong>
        </span>
      </div>
      {b.notes.length > 0 && (
        <div className="note-list">
          {b.notes.map((n, i) => (
            <p key={i}>
              <small>{n.at}</small> {n.text}
            </p>
          ))}
        </div>
      )}
      {b.status !== "Requested" && b.status !== "Rejected" && (
        <form
          className="note-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            nursingStore.addNote(b.id, note.trim());
            setNote("");
            notify("Visit note added");
          }}
        >
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add nursing visit note (observations, care given)"
          />
          <button className="outline-button">Add note</button>
          {next && (
            <button
              type="button"
              className="primary-button module-button"
              onClick={() => {
                nursingStore.setStatus(b.id, next);
                notify(`Visit status: ${next}`);
              }}
            >
              Mark: {next}
            </button>
          )}
        </form>
      )}
    </Card>
  );
}

export function NurseWorkspace({
  active,
  account,
  notify,
  navigate,
}: {
  active: string;
  account: DemoAccount;
  notify: Notify;
  navigate: (p: string) => void;
}) {
  const all = useBookings();
  const me = findNurse(account.username);
  // Least privilege: only bookings assigned to this nurse
  const mine = all.filter((b) => b.nurse === account.username);
  const requests = mine.filter((b) => b.status === "Requested");
  const visits = mine.filter((b) => b.status !== "Requested" && b.status !== "Rejected");
  const live = visits.filter((b) => b.status !== "Completed");
  const patients = Array.from(
    new Map(mine.filter((b) => b.status !== "Rejected").map((b) => [b.patient, b])).values(),
  );
  const sorted = [...live].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  if (!me) return null;
  return (
    <div className="module-host">
      <NurseBanner />
      {active === "Nurse Dashboard" && (
        <>
          <PageHeader
            eyebrow="NURSING WORKSPACE"
            title={`Welcome, ${account.name}`}
            description="Your assigned home nursing requests and visits."
          />
          <div className="stats-grid four">
            <Card>
              <small>NEW REQUESTS</small>
              <strong>{requests.length}</strong>
              <span>Awaiting your response</span>
            </Card>
            <Card>
              <small>ACTIVE VISITS</small>
              <strong>{live.length}</strong>
              <span>Accepted or in progress</span>
            </Card>
            <Card>
              <small>COMPLETED</small>
              <strong>{visits.length - live.length}</strong>
              <span>Visits finished</span>
            </Card>
            <Card>
              <small>ASSIGNED PATIENTS</small>
              <strong>{patients.length}</strong>
              <span>Your patients only</span>
            </Card>
          </div>
          <Card>
            <div className="card-title">
              <h2>Next visits</h2>
              <button className="text-link" onClick={() => navigate("Nursing Schedule")}>
                Full schedule →
              </button>
            </div>
            {sorted.length ? (
              <div className="simple-list">
                {sorted.slice(0, 3).map((b) => (
                  <div className="simple-row" key={b.id}>
                    <span>
                      <strong>{b.patient}</strong>
                      <small>
                        {b.service} · {b.locality}
                      </small>
                    </span>
                    <span>{when(b)}</span>
                    <i className={`module-badge ${statusTone(b.status)}`}>{b.status}</i>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text="No active visits." />
            )}
          </Card>
        </>
      )}
      {active === "Nurse Profile" && (
        <>
          <PageHeader eyebrow="PROFESSIONAL PROFILE" title="My Nurse Profile" description="Fictional demo profile shown to families." />
          <Card className="doctor-profile-page">
            <div className="doctor-profile-main">
              <Avatar src={me.photo} initials={me.initials} size={112} verified />
              <div>
                <span className="module-badge blue">Demo verified profile</span>
                <h2>{me.name}</h2>
                <p>{me.specialization} · Lahore, Pakistan</p>
              </div>
            </div>
            <div className="detail-grid four-detail">
              <span>
                <small>QUALIFICATIONS</small>
                <strong>{me.qualification}</strong>
              </span>
              <span>
                <small>EXPERIENCE</small>
                <strong>{me.experience}</strong>
              </span>
              <span>
                <small>CHARGES</small>
                <strong>{pkr(me.rate)} per visit</strong>
              </span>
              <span>
                <small>SERVICE AREAS</small>
                <strong>{me.areas.join(", ")}</strong>
              </span>
            </div>
            <div className="profile-about">
              <h3>Services offered</h3>
              <div className="chip-row">
                {me.services.map((s) => (
                  <span key={s} className="module-badge green">
                    {s}
                  </span>
                ))}
              </div>
              <p>{me.about}</p>
            </div>
          </Card>
        </>
      )}
      {active === "Nurse Patients" && (
        <>
          <PageHeader eyebrow="ASSIGNED PATIENTS" title="Assigned Patients" description="Patients linked to your accepted or pending bookings." />
          {patients.length ? (
            <div className="doctor-grid">
              {patients.map((b) => (
                <Card className="doctor-card" key={b.patient}>
                  <div className="doctor-card-top">
                    <Avatar initials={b.patient.split(" ").map((p) => p[0]).join("")} size={52} className="alt" />
                    <div>
                      <h3>{b.patient}</h3>
                      <p>
                        {b.relation}
                        {b.age ? ` · ${b.age} yrs` : ""}
                      </p>
                    </div>
                  </div>
                  <dl>
                    <div>
                      <dt>LOCALITY</dt>
                      <dd>{b.locality}</dd>
                    </div>
                    <div>
                      <dt>LATEST SERVICE</dt>
                      <dd>{b.service}</dd>
                    </div>
                  </dl>
                  <p className="privacy-note">Clinical records are not shared with nursing accounts.</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Empty text="No patients assigned yet." />
            </Card>
          )}
        </>
      )}
      {active === "Nursing Bookings" && (
        <>
          <PageHeader eyebrow="HOME NURSING" title="Assigned Bookings" description="Accept or reject requests assigned to you." />
          {mine.length ? (
            <div className="booking-list">
              {mine.map((b) => (
                <Card className="booking-card" key={b.id}>
                  <div className="booking-top">
                    <div>
                      <h3>{b.patient}</h3>
                      <p>
                        {b.service} · {b.locality} · {when(b)}
                      </p>
                    </div>
                    <span className={`module-badge ${statusTone(b.status)}`}>{b.status}</span>
                  </div>
                  {b.status === "Requested" ? (
                    <div className="card-actions">
                      <button
                        className="outline-button"
                        onClick={() => {
                          nursingStore.setStatus(b.id, "Rejected");
                          notify("Booking rejected");
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="primary-button module-button"
                        onClick={() => {
                          nursingStore.setStatus(b.id, "Accepted");
                          notify("Booking accepted");
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <button className="text-link" onClick={() => navigate("Visit Details")}>
                      Open visit details →
                    </button>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Empty text="No bookings assigned to you." />
            </Card>
          )}
        </>
      )}
      {active === "Visit Details" && (
        <>
          <PageHeader eyebrow="PATIENT VISITS" title="Visit Details" description="Update visit status and add nursing visit notes." />
          {visits.length ? (
            <div className="booking-list">
              {visits.map((b) => (
                <VisitCard key={b.id} b={b} notify={notify} />
              ))}
            </div>
          ) : (
            <Card>
              <Empty text="Accept a booking to manage its visit." />
            </Card>
          )}
        </>
      )}
      {active === "Nursing Schedule" && (
        <>
          <PageHeader eyebrow="SCHEDULE" title="Nursing Schedule" description="Upcoming accepted visits in date order." />
          <Card>
            {sorted.length ? (
              <div className="simple-list">
                {sorted.map((b) => (
                  <div className="simple-row" key={b.id}>
                    <span>
                      <strong>{when(b)}</strong>
                      <small>{b.locality}</small>
                    </span>
                    <span>
                      {b.patient}
                      <small>{b.service}</small>
                    </span>
                    <i className={`module-badge ${statusTone(b.status)}`}>{b.status}</i>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text="No scheduled visits." />
            )}
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------- Admin additions (view / manage only, no clinical actions) ---------- */

export function AdminNurses({ notify }: { notify: Notify }) {
  const [list, setList] = useState(nurseProfiles.map((n) => ({ ...n, active: true })));
  return (
    <>
      <PageHeader eyebrow="ADMIN-ONLY ACCOUNT CONTROL" title="Nurse Management" description="Review fictional nurse accounts and service areas." />
      <Card className="data-card">
        <div className="simple-list">
          {list.map((n) => (
            <div className="simple-row" key={n.id}>
              <span className="row-person">
                <Avatar src={n.photo} initials={n.initials} size={44} />
                <span>
                  <strong>{n.name}</strong>
                  <small>@{n.username} · {n.areas.join(", ")}</small>
                </span>
              </span>
              <span>Nurse</span>
              <i className={`module-badge ${n.active ? "green" : "amber"}`}>{n.active ? "Active" : "Suspended"}</i>
              <button
                className="text-link"
                onClick={() => {
                  setList((l) => l.map((x) => (x.id === n.id ? { ...x, active: !x.active } : x)));
                  notify(`${n.name} ${n.active ? "suspended" : "reactivated"} (demo)`);
                }}
              >
                {n.active ? "Suspend" : "Reactivate"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function AdminNursingBookings() {
  const all = useBookings();
  const [open, setOpen] = useState<NursingBooking | null>(null);
  return (
    <>
      <PageHeader eyebrow="PLATFORM OVERSIGHT" title="Home Nursing Bookings" description="View-only overview. Clinical and visit decisions belong to nurses." />
      <Card className="data-card">
        <div className="simple-list">
          {all.map((b) => {
            const nurse = findNurse(b.nurse);
            return (
              <div className="simple-row" key={b.id}>
                <span className="row-person">
                  {nurse && <Avatar src={nurse.photo} initials={nurse.initials} size={40} />}
                  <span>
                    <strong>{b.id} · {b.patient}</strong>
                    <small>{nurse?.name} · {b.service}</small>
                  </span>
                </span>
                <span>
                  {b.locality}
                  <small>{when(b)}</small>
                </span>
                <i className={`module-badge ${statusTone(b.status)}`}>{b.status}</i>
                <button className="text-link" onClick={() => setOpen(b)}>
                  View →
                </button>
              </div>
            );
          })}
        </div>
      </Card>
      {open && (
        <Modal title={`Booking ${open.id}`} onClose={() => setOpen(null)}>
          <div className="detail-grid">
            <span><small>PATIENT</small><strong>{open.patient}</strong></span>
            <span><small>NURSE</small><strong>{findNurse(open.nurse)?.name}</strong></span>
            <span><small>SERVICE</small><strong>{open.service}</strong></span>
            <span><small>MODE</small><strong>{open.mode}</strong></span>
            <span><small>LOCALITY</small><strong>{open.locality}</strong></span>
            <span><small>CHARGES</small><strong>{pkr(open.fee)}</strong></span>
          </div>
          <div className="privacy-note">Admin view only. Visit notes are not shown to administrators.</div>
        </Modal>
      )}
    </>
  );
}

export function ProviderListings({ notify }: { notify: Notify }) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const rows = [
    ...doctorProfiles.map((d) => ({ id: d.id, name: d.name, role: "Doctor", detail: d.specialty, photo: d.photo, initials: d.initials })),
    ...nurseProfiles.map((n) => ({ id: n.id, name: n.name, role: "Nurse", detail: n.specialization, photo: n.photo, initials: n.initials })),
  ];
  return (
    <>
      <PageHeader eyebrow="DIRECTORY MANAGEMENT" title="Provider Listings" description="Control which fictional providers appear in family search." />
      <Card className="data-card">
        <div className="simple-list">
          {rows.map((r) => (
            <div className="simple-row" key={r.id}>
              <span className="row-person">
                <Avatar src={r.photo} initials={r.initials} size={44} />
                <span>
                  <strong>{r.name}</strong>
                  <small>{r.detail}</small>
                </span>
              </span>
              <span>{r.role}</span>
              <i className={`module-badge ${hidden[r.id] ? "amber" : "green"}`}>{hidden[r.id] ? "Hidden" : "Listed"}</i>
              <button
                className="text-link"
                onClick={() => {
                  setHidden((h) => ({ ...h, [r.id]: !h[r.id] }));
                  notify(`${r.name} ${hidden[r.id] ? "listed" : "hidden"} (demo)`);
                }}
              >
                {hidden[r.id] ? "List" : "Hide"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
