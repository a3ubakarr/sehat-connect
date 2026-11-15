import { useState } from "react";
import { Avatar, Nurse, localities, nurseProfiles, nursingServices, findNurse } from "./people";
import { NursingBooking, nursingStore, statusTone, useBookings } from "./nursingStore";
import { Card, Empty, Modal, PageHeader, fmtDate, fmtTime, pkr } from "./ui";

export type FamilyMember = { initials: string; name: string; relation: string };

export function NurseCard({
  nurse,
  onView,
  onBook,
  bookLabel = "Request booking",
}: {
  nurse: Nurse;
  onView: () => void;
  onBook?: () => void;
  bookLabel?: string;
}) {
  return (
    <Card className="doctor-card nurse-card">
      <div className="doctor-card-top">
        <Avatar src={nurse.photo} initials={nurse.initials} size={60} verified />
        <div>
          <h3>{nurse.name}</h3>
          <p>{nurse.specialization}</p>
          <span className="module-badge blue">Demo profile</span>
        </div>
      </div>
      <dl>
        <div>
          <dt>QUALIFICATION</dt>
          <dd>{nurse.qualification}</dd>
        </div>
        <div>
          <dt>EXPERIENCE</dt>
          <dd>{nurse.experience}</dd>
        </div>
        <div>
          <dt>SERVICE AREAS</dt>
          <dd>{nurse.areas.join(", ")}</dd>
        </div>
      </dl>
      <div className="availability">
        <span>
          <small>AVAILABILITY</small>
          <strong>{nurse.availableNow ? "Available now" : "Scheduled only"}</strong>
        </span>
        <span>
          <small>DEMO CHARGES</small>
          <strong>{pkr(nurse.rate)} / visit</strong>
        </span>
      </div>
      <div className="card-actions">
        <button className="outline-button" onClick={onView}>
          View profile
        </button>
        {onBook && (
          <button className="primary-button module-button" onClick={onBook}>
            {bookLabel}
          </button>
        )}
      </div>
    </Card>
  );
}

export function NurseProfileModal({
  nurse,
  onClose,
  onBook,
}: {
  nurse: Nurse;
  onClose: () => void;
  onBook?: () => void;
}) {
  return (
    <Modal title={nurse.name} onClose={onClose}>
      <div className="doctor-detail">
        <Avatar src={nurse.photo} initials={nurse.initials} size={92} verified />
        <div>
          <span className="module-badge blue">Fictional verified profile</span>
          <h3>{nurse.specialization}</h3>
          <p>{nurse.about}</p>
        </div>
      </div>
      <div className="detail-grid">
        <span>
          <small>QUALIFICATIONS</small>
          <strong>{nurse.qualification}</strong>
        </span>
        <span>
          <small>EXPERIENCE</small>
          <strong>{nurse.experience}</strong>
        </span>
        <span>
          <small>CHARGES</small>
          <strong>{pkr(nurse.rate)} per visit</strong>
        </span>
        <span>
          <small>SERVICE AREAS</small>
          <strong>{nurse.areas.join(", ")}</strong>
        </span>
      </div>
      <div className="chip-row">
        {nurse.services.map((s) => (
          <span key={s} className="module-badge green">
            {s}
          </span>
        ))}
      </div>
      <div className="privacy-note">
        This profile is fictional. Nurses provide supportive nursing care only and do not diagnose
        or prescribe.
      </div>
      {onBook && (
        <button className="primary-button module-button block-button" onClick={onBook}>
          Request booking
        </button>
      )}
    </Modal>
  );
}

function BookingCard({ b }: { b: NursingBooking }) {
  const nurse = findNurse(b.nurse);
  return (
    <Card className="booking-card">
      <div className="booking-top">
        {nurse && <Avatar src={nurse.photo} initials={nurse.initials} size={52} />}
        <div>
          <h3>{nurse?.name}</h3>
          <p>
            {b.service} · {b.id}
          </p>
        </div>
        <span className={`module-badge ${statusTone(b.status)}`}>{b.status}</span>
      </div>
      <div className="detail-grid">
        <span>
          <small>PATIENT</small>
          <strong>
            {b.patient} ({b.relation})
          </strong>
        </span>
        <span>
          <small>WHEN</small>
          <strong>
            {b.mode === "On-demand" ? "As soon as possible" : `${fmtDate(b.date)} · ${fmtTime(b.time)}`}
          </strong>
        </span>
        <span>
          <small>LOCALITY</small>
          <strong>{b.locality}</strong>
        </span>
        <span>
          <small>CHARGES</small>
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
    </Card>
  );
}

export function HomeNursing({
  members,
  username,
  defaultLocation,
  notify,
}: {
  members: FamilyMember[];
  username: string;
  defaultLocation: string;
  notify: (m: string) => void;
}) {
  const all = useBookings();
  const mine = all.filter((b) => b.owner === username);
  const [tab, setTab] = useState<"book" | "mine">("book");
  const [memberName, setMemberName] = useState(members[0]?.name ?? "");
  const [locality, setLocality] = useState(localities[0]);
  const [address, setAddress] = useState("");
  const [service, setService] = useState(nursingServices[0]);
  const [mode, setMode] = useState<"On-demand" | "Scheduled">("Scheduled");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [searched, setSearched] = useState(false);
  const [viewing, setViewing] = useState<Nurse | null>(null);

  const matches = nurseProfiles.filter(
    (n) =>
      n.areas.includes(locality) &&
      n.services.includes(service) &&
      (mode === "Scheduled" || n.availableNow),
  );

  const book = (nurse: Nurse) => {
    const member = members.find((m) => m.name === memberName) ?? members[0];
    nursingStore.add({
      owner: username,
      patient: member.name,
      relation: member.relation,
      age: 0,
      locality,
      address: address || `${locality} (address not provided)`,
      service,
      date,
      time,
      mode,
      nurse: nurse.username,
      fee: nurse.rate,
    });
    setViewing(null);
    setSearched(false);
    setTab("mine");
    notify("Home nursing request sent. Status: Requested");
  };

  return (
    <>
      <PageHeader
        eyebrow="HOME NURSING · DEMO"
        title="Home Nursing"
        description={`Request a fictional nurse for a family member. Sample localities only. No GPS is used. (${defaultLocation.split(",")[0]})`}
      />
      <div className="tab-row">
        <button className={tab === "book" ? "active" : ""} onClick={() => setTab("book")}>
          Book a nurse
        </button>
        <button className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}>
          My bookings <b>{mine.length}</b>
        </button>
      </div>

      {tab === "book" && (
        <>
          <Card>
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault();
                setSearched(true);
              }}
            >
              <label>
                Family member
                <select value={memberName} onChange={(e) => setMemberName(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} · {m.relation}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Patient locality
                <select
                  value={locality}
                  onChange={(e) => {
                    setLocality(e.target.value);
                    setSearched(false);
                  }}
                >
                  {localities.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
              <label>
                Nursing service
                <select
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setSearched(false);
                  }}
                >
                  {nursingServices.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Address note (optional)
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / street (fictional)"
                />
              </label>
              <div className="full-field segmented">
                <button
                  type="button"
                  className={mode === "On-demand" ? "active" : ""}
                  onClick={() => {
                    setMode("On-demand");
                    setSearched(false);
                  }}
                >
                  On-demand · nurse available now
                </button>
                <button
                  type="button"
                  className={mode === "Scheduled" ? "active" : ""}
                  onClick={() => {
                    setMode("Scheduled");
                    setSearched(false);
                  }}
                >
                  Scheduled visit
                </button>
              </div>
              {mode === "Scheduled" && (
                <>
                  <label>
                    Date
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Time
                    <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
                  </label>
                </>
              )}
              <button className="primary-button module-button full-field">
                Find nearby nurses
              </button>
            </form>
          </Card>
          {searched && (
            <>
              <div className="result-summary">
                <span>
                  <strong>{matches.length}</strong> nurse{matches.length === 1 ? "" : "s"} serving{" "}
                  {locality} for {service.toLowerCase()}
                </span>
                <span>Matched by service area · demo data</span>
              </div>
              {matches.length ? (
                <div className="doctor-grid">
                  {matches.map((n) => (
                    <NurseCard
                      key={n.id}
                      nurse={n}
                      onView={() => setViewing(n)}
                      onBook={() => book(n)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <Empty
                    title="No matching nurses"
                    text="Try another locality or service, or switch to a scheduled visit."
                  />
                </Card>
              )}
            </>
          )}
        </>
      )}

      {tab === "mine" &&
        (mine.length ? (
          <div className="booking-list">
            {mine.map((b) => (
              <BookingCard key={b.id} b={b} />
            ))}
          </div>
        ) : (
          <Card>
            <Empty title="No bookings yet" text="Your home nursing requests will appear here." />
          </Card>
        ))}

      {viewing && (
        <NurseProfileModal nurse={viewing} onClose={() => setViewing(null)} onBook={() => book(viewing)} />
      )}
    </>
  );
}
