import React, { useState } from "react";
import {
  Heart,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  User,
  Users,
  Activity,
  ClipboardList,
  AlertCircle,
  Stethoscope,
  HeartPulse,
  TrendingUp,
  MapPin,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";


const SERVICES = [
  {
    id: "nursing",
    name: "Nursing Care",
    icon: Stethoscope,
    desc: "Skilled nursing for medication, wound care, and vitals monitoring.",
    duration: "4 hr / 8 hr / 24 hr",
    price: "₹450/hr",
    qualification: "GNM / B.Sc Nursing",
  },
  {
    id: "attendant",
    name: "Elderly Attendant",
    icon: HeartPulse,
    desc: "Daily living support — bathing, feeding, mobility, and companionship.",
    duration: "8 hr / 12 hr",
    price: "₹280/hr",
    qualification: "Certified Attendant",
  },
  {
    id: "physio",
    name: "Physiotherapy",
    icon: Activity,
    desc: "Home-based mobility and post-surgery rehabilitation sessions.",
    duration: "1 hr sessions",
    price: "₹600/session",
    qualification: "BPT / MPT",
  },
  {
    id: "posthospital",
    name: "Post-Hospital Care",
    icon: ClipboardList,
    desc: "Transition support after discharge — monitoring, dressing, follow-up.",
    duration: "7-day / 14-day plans",
    price: "₹3,200/day",
    qualification: "RN, 2+ yrs",
  },
];

const CAREGIVERS = [
  {
    id: 1,
    name: "Lakshmi Narayanan",
    role: "Registered Nurse",
    exp: "9 yrs",
    rating: 4.9,
    reviews: 132,
    rate: "₹480/hr",
    verified: true,
    initials: "LN",
    color: "#1B4B43",
    area: "Adyar, Chennai",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    role: "Elderly Attendant",
    exp: "5 yrs",
    rating: 4.7,
    reviews: 88,
    rate: "₹300/hr",
    verified: true,
    initials: "RK",
    color: "#8A5A2B",
    area: "Anna Nagar, Chennai",
  },
  {
    id: 3,
    name: "Priya Suresh",
    role: "Physiotherapist",
    exp: "6 yrs",
    rating: 4.8,
    reviews: 61,
    rate: "₹650/session",
    verified: true,
    initials: "PS",
    color: "#5B4B8A",
    area: "T. Nagar, Chennai",
  },
];

const STATUS_STEPS = [
  "Requested",
  "Confirmed",
  "In Progress",
  "Completed",
];

const INITIAL_BOOKINGS = [
  {
    id: 101,
    service: "Nursing Care",
    caregiver: "Lakshmi Narayanan",
    schedule: "Daily · 9:00 AM–1:00 PM",
    status: 2,
    notes:
      "Morning medication given. BP: 128/82, stable. Light breakfast taken well.",
  },
];

const INITIAL_REQUESTS = [
  {
    id: 201,
    family: "Meenakshi household",
    patient: "Mr. Subramaniam, 78",
    service: "Elderly Attendant",
    schedule: "Tomorrow, 8:00 AM–8:00 PM",
    area: "Anna Nagar",
    status: "pending",
  },
  {
    id: 202,
    family: "Iyer household",
    patient: "Mrs. Iyer, 82",
    service: "Elderly Attendant",
    schedule: "Thu, 9:00 AM–5:00 PM",
    area: "Anna Nagar",
    status: "pending",
  },
];

const PENDING_CAREGIVERS = [
  {
    id: 1,
    name: "Deepa Raman",
    role: "GNM Nurse",
    docs: "License, ID, 2 references",
    submitted: "2 days ago",
  },
  {
    id: 2,
    name: "Mohan Das",
    role: "Elderly Attendant",
    docs: "ID, 1 reference, training cert.",
    submitted: "5 days ago",
  },
];

const COMPLAINTS = [
  {
    id: 1,
    family: "Rajan household",
    issue: "Caregiver arrived 40 min late",
    status: "Open",
  },
  {
    id: 2,
    family: "Krishnan household",
    issue: "Billing discrepancy for long-term plan",
    status: "In review",
  },
];

const BOOKINGS_CHART = [
  { week: "W1", bookings: 42 },
  { week: "W2", bookings: 51 },
  { week: "W3", bookings: 47 },
  { week: "W4", bookings: 63 },
  { week: "W5", bookings: 58 },
  { week: "W6", bookings: 71 },
];



function Badge({ children, tone = "primary" }) {
  const tones = {
    primary: {
      background: "rgba(27,75,67,0.1)",
      color: "var(--c-primary)",
    },
    gold: {
      background: "rgba(201,138,62,0.15)",
      color: "var(--c-accent-dark)",
    },
    danger: {
      background: "rgba(181,83,60,0.12)",
      color: "var(--c-danger)",
    },
  };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={tones[tone] || tones.primary}
    >
      {children}
    </span>
  );
}

function StatusThread({ step }) {
  return (
    <div className="flex items-center w-full">
      {STATUS_STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div
            className="flex flex-col items-center gap-1.5"
            style={{ minWidth: 64 }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 26,
                height: 26,
                background:
                  i <= step ? "var(--c-primary)" : "var(--c-surface)",
                border: `2px solid ${
                  i <= step ? "var(--c-primary)" : "var(--c-line)"
                }`,
              }}
            >
              {i < step ? (
                <CheckCircle2 size={15} color="white" />
              ) : (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: i === step ? "white" : "transparent",
                  }}
                />
              )}
            </div>

            <span
              className="text-[11px] font-medium text-center"
              style={{
                color:
                  i <= step ? "var(--c-text)" : "var(--c-muted)",
              }}
            >
              {label}
            </span>
          </div>

          {i < STATUS_STEPS.length - 1 && (
            <div
              className="flex-1 mx-0.5"
              style={{
                height: 2,
                marginTop: -18,
                background:
                  i < step
                    ? "var(--c-primary)"
                    : "var(--c-line)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, sub }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--c-surface)",
        border: "1px solid var(--c-line)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--c-muted)" }}
        >
          {label}
        </span>

        <Icon
          size={16}
          style={{ color: "var(--c-accent-dark)" }}
        />
      </div>

      <div
        className="font-mono text-2xl font-semibold"
        style={{ color: "var(--c-primary)" }}
      >
        {value}
      </div>

      {sub && (
        <div
          className="text-xs mt-1"
          style={{ color: "var(--c-muted)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}


function FamilyView() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [modalCaregiver, setModalCaregiver] = useState(null);
  const [schedType, setSchedType] = useState("Daily");

  const [patient, setPatient] = useState({
    name: "Mr. Subramaniam",
    age: "78",
    needs:
      "Diabetes management, limited mobility, requires assistance with daily activities.",
  });

  function confirmBooking() {
    if (!modalCaregiver) return;

    const newBooking = {
      id: Date.now(),
      service: "Nursing Care",
      caregiver: modalCaregiver.name,
      schedule: `${schedType} · 9:00 AM–1:00 PM`,
      status: 0,
      notes: "",
    };

    setBookings((current) => [newBooking, ...current]);
    setModalCaregiver(null);
  }

  return (
    <div className="space-y-8">
      {/* Patient profile */}
      <section
        className="rounded-2xl p-5"
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-line)",
        }}
      >
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Patient profile
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label
              className="text-xs font-medium"
              style={{ color: "var(--c-muted)" }}
            >
              Name
            </label>

            <input
              value={patient.name}
              onChange={(e) =>
                setPatient((current) => ({
                  ...current,
                  name: e.target.value,
                }))
              }
              className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
              style={{
                border: "1px solid var(--c-line)",
                background: "var(--c-bg)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-medium"
              style={{ color: "var(--c-muted)" }}
            >
              Age
            </label>

            <input
              value={patient.age}
              onChange={(e) =>
                setPatient((current) => ({
                  ...current,
                  age: e.target.value,
                }))
              }
              className="w-full mt-1 rounded-lg px-3 py-2 text-sm"
              style={{
                border: "1px solid var(--c-line)",
                background: "var(--c-bg)",
              }}
            />
          </div>

          <div className="sm:col-span-1 sm:row-span-2">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--c-muted)" }}
            >
              Medical needs
            </label>

            <textarea
              value={patient.needs}
              onChange={(e) =>
                setPatient((current) => ({
                  ...current,
                  needs: e.target.value,
                }))
              }
              rows={3}
              className="w-full mt-1 rounded-lg px-3 py-2 text-sm resize-none"
              style={{
                border: "1px solid var(--c-line)",
                background: "var(--c-bg)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Care services
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="rounded-2xl p-4 flex flex-col"
                style={{
                  background: "var(--c-surface)",
                  border: "1px solid var(--c-line)",
                }}
              >
                <Icon
                  size={20}
                  style={{ color: "var(--c-primary)" }}
                />

                <h4
                  className="font-semibold mt-3 text-sm"
                  style={{ color: "var(--c-text)" }}
                >
                  {service.name}
                </h4>

                <p
                  className="text-xs mt-1.5 flex-1"
                  style={{ color: "var(--c-muted)" }}
                >
                  {service.desc}
                </p>

                <div
                  className="mt-3 pt-3 flex items-center justify-between"
                  style={{
                    borderTop: "1px solid var(--c-line)",
                  }}
                >
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{
                      color: "var(--c-accent-dark)",
                    }}
                  >
                    {service.price}
                  </span>

                  <span
                    className="text-[11px]"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {service.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Caregivers */}
      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Available caregivers near you
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          {CAREGIVERS.map((caregiver) => (
            <div
              key={caregiver.id}
              className="rounded-2xl p-4"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center rounded-full font-serif text-base font-semibold shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    background: caregiver.color,
                    color: "white",
                  }}
                >
                  {caregiver.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4
                      className="font-semibold text-sm truncate"
                      style={{ color: "var(--c-text)" }}
                    >
                      {caregiver.name}
                    </h4>

                    {caregiver.verified && (
                      <ShieldCheck
                        size={13}
                        style={{
                          color: "var(--c-primary)",
                        }}
                      />
                    )}
                  </div>

                  <p
                    className="text-xs"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {caregiver.role} · {caregiver.exp}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-1 mt-3 text-xs"
                style={{ color: "var(--c-text)" }}
              >
                <Star
                  size={13}
                  fill="var(--c-accent-dark)"
                  color="var(--c-accent-dark)"
                />

                <span className="font-medium">
                  {caregiver.rating}
                </span>

                <span style={{ color: "var(--c-muted)" }}>
                  ({caregiver.reviews} reviews)
                </span>
              </div>

              <div
                className="flex items-center gap-1 mt-1.5 text-xs"
                style={{ color: "var(--c-muted)" }}
              >
                <MapPin size={12} />
                {caregiver.area}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className="font-mono text-sm font-semibold"
                  style={{
                    color: "var(--c-accent-dark)",
                  }}
                >
                  {caregiver.rate}
                </span>

                <button
                  type="button"
                  onClick={() => setModalCaregiver(caregiver)}
                  className="text-xs font-semibold rounded-lg px-3 py-2 hover:opacity-90"
                  style={{
                    background: "var(--c-primary)",
                    color: "white",
                  }}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service tracking */}
      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Service tracking
        </h3>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl p-5"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h4
                    className="font-semibold text-sm"
                    style={{ color: "var(--c-text)" }}
                  >
                    {booking.service} — {booking.caregiver}
                  </h4>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {booking.schedule}
                  </p>
                </div>

                <Badge
                  tone={
                    booking.status === 3 ? "primary" : "gold"
                  }
                >
                  {STATUS_STEPS[booking.status]}
                </Badge>
              </div>

              <StatusThread step={booking.status} />

              {booking.notes && (
                <div
                  className="mt-4 rounded-lg p-3 text-xs"
                  style={{
                    background: "var(--c-bg)",
                    color: "var(--c-text)",
                  }}
                >
                  <span
                    className="font-semibold"
                    style={{
                      color: "var(--c-primary)",
                    }}
                  >
                    Care note:{" "}
                  </span>
                  {booking.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Booking modal */}
      {modalCaregiver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(20,30,26,0.45)",
          }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm"
            style={{
              background: "var(--c-surface)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4
                className="font-serif text-lg"
                style={{
                  color: "var(--c-primary)",
                }}
              >
                Confirm booking
              </h4>

              <button
                type="button"
                onClick={() => setModalCaregiver(null)}
                aria-label="Close booking modal"
              >
                <X
                  size={18}
                  style={{ color: "var(--c-muted)" }}
                />
              </button>
            </div>

            <p
              className="text-sm mb-4"
              style={{ color: "var(--c-text)" }}
            >
              {modalCaregiver.name} · {modalCaregiver.role}
            </p>

            <label
              className="text-xs font-medium"
              style={{ color: "var(--c-muted)" }}
            >
              Schedule type
            </label>

            <div className="flex gap-2 mt-2 mb-5">
              {["Hourly", "Daily", "Long-term"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSchedType(type)}
                  className="text-xs font-semibold rounded-lg px-3 py-2 flex-1"
                  style={{
                    background:
                      schedType === type
                        ? "var(--c-primary)"
                        : "var(--c-bg)",
                    color:
                      schedType === type
                        ? "white"
                        : "var(--c-text)",
                    border: "1px solid var(--c-line)",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={confirmBooking}
              className="w-full rounded-lg py-2.5 text-sm font-semibold"
              style={{
                background: "var(--c-accent-dark)",
                color: "white",
              }}
            >
              Send request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Caregiver view
// --------------------------------------------------

function CaregiverView() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [available, setAvailable] = useState(true);

  function respond(id, decision) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status: decision }
          : request
      )
    );
  }

  return (
    <div className="space-y-8">
      <section
        className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-line)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full font-serif font-semibold"
            style={{
              width: 48,
              height: 48,
              background: "#1B4B43",
              color: "white",
            }}
          >
            LN
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4
                className="font-semibold text-sm"
                style={{ color: "var(--c-text)" }}
              >
                Lakshmi Narayanan
              </h4>

              <ShieldCheck
                size={14}
                style={{
                  color: "var(--c-primary)",
                }}
              />
            </div>

            <p
              className="text-xs"
              style={{ color: "var(--c-muted)" }}
            >
              Registered Nurse · Adyar, Chennai
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAvailable((current) => !current)}
          className="text-xs font-semibold rounded-full px-4 py-2"
          style={{
            background: available
              ? "rgba(76,122,91,0.14)"
              : "rgba(181,83,60,0.12)",
            color: available
              ? "#4C7A5B"
              : "var(--c-danger)",
          }}
        >
          {available
            ? "● Available for requests"
            : "● Not accepting requests"}
        </button>
      </section>

      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Service requests
        </h3>

        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
              }}
            >
              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: "var(--c-text)" }}
                >
                  {request.patient} — {request.service}
                </h4>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--c-muted)" }}
                >
                  {request.schedule} · {request.area} ·{" "}
                  {request.family}
                </p>
              </div>

              {request.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      respond(request.id, "rejected")
                    }
                    className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-2"
                    style={{
                      border: "1px solid var(--c-line)",
                      color: "var(--c-danger)",
                    }}
                  >
                    <XCircle size={14} />
                    Decline
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      respond(request.id, "accepted")
                    }
                    className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-2"
                    style={{
                      background: "var(--c-primary)",
                      color: "white",
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Accept
                  </button>
                </div>
              ) : (
                <Badge
                  tone={
                    request.status === "accepted"
                      ? "primary"
                      : "danger"
                  }
                >
                  {request.status === "accepted"
                    ? "Accepted"
                    : "Declined"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <KpiCard
          label="This month"
          value="₹34,600"
          icon={TrendingUp}
          sub="Earnings"
        />

        <KpiCard
          label="Completed visits"
          value="47"
          icon={CheckCircle2}
          sub="Last 30 days"
        />

        <KpiCard
          label="Rating"
          value="4.9"
          icon={Star}
          sub="132 reviews"
        />
      </section>
    </div>
  );
}


function AdminView() {
  const [pending, setPending] = useState(
    PENDING_CAREGIVERS
  );

  function decide(id) {
    setPending((current) =>
      current.filter((caregiver) => caregiver.id !== id)
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="Users"
          value="2,184"
          icon={Users}
        />

        <KpiCard
          label="Verified caregivers"
          value="316"
          icon={ShieldCheck}
        />

        <KpiCard
          label="Completion rate"
          value="94%"
          icon={CheckCircle2}
        />

        <KpiCard
          label="Avg. response"
          value="6.2m"
          icon={Clock}
        />

        <KpiCard
          label="Satisfaction"
          value="4.7/5"
          icon={Star}
        />

        <KpiCard
          label="MAU"
          value="1,392"
          icon={Activity}
        />
      </section>

      <section
        className="rounded-2xl p-5"
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-line)",
        }}
      >
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Bookings, last 6 weeks
        </h3>

        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BOOKINGS_CHART}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--c-line)"
                vertical={false}
              />

              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 11,
                  fill: "var(--c-muted)",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "var(--c-muted)",
                }}
                axisLine={false}
                tickLine={false}
                width={28}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--c-line)",
                  fontSize: 12,
                }}
              />

              <Bar
                dataKey="bookings"
                fill="var(--c-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Caregiver verification queue
        </h3>

        <div className="space-y-3">
          {pending.length === 0 && (
            <p
              className="text-sm"
              style={{ color: "var(--c-muted)" }}
            >
              Queue is clear.
            </p>
          )}

          {pending.map((caregiver) => (
            <div
              key={caregiver.id}
              className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
              }}
            >
              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: "var(--c-text)" }}
                >
                  {caregiver.name} — {caregiver.role}
                </h4>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--c-muted)" }}
                >
                  {caregiver.docs} · submitted{" "}
                  {caregiver.submitted}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => decide(caregiver.id)}
                  className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-2"
                  style={{
                    border: "1px solid var(--c-line)",
                    color: "var(--c-danger)",
                  }}
                >
                  <XCircle size={14} />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => decide(caregiver.id)}
                  className="flex items-center gap-1 text-xs font-semibold rounded-lg px-3 py-2"
                  style={{
                    background: "var(--c-primary)",
                    color: "white",
                  }}
                >
                  <CheckCircle2 size={14} />
                  Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3
          className="font-serif text-lg mb-4"
          style={{ color: "var(--c-primary)" }}
        >
          Open complaints
        </h3>

        <div className="space-y-3">
          {COMPLAINTS.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-2xl p-4 flex items-center justify-between gap-3"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  style={{
                    color: "var(--c-danger)",
                    marginTop: 2,
                  }}
                />

                <div>
                  <h4
                    className="font-semibold text-sm"
                    style={{ color: "var(--c-text)" }}
                  >
                    {complaint.family}
                  </h4>

                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {complaint.issue}
                  </p>
                </div>
              </div>

              <Badge
                tone={
                  complaint.status === "Open"
                    ? "danger"
                    : "gold"
                }
              >
                {complaint.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------
// App shell
// --------------------------------------------------

export default function App() {
  const [role, setRole] = useState("family");

  const roles = [
    {
      id: "family",
      label: "Family",
      icon: Heart,
    },
    {
      id: "caregiver",
      label: "Caregiver",
      icon: User,
    },
    {
      id: "admin",
      label: "Admin",
      icon: ShieldCheck,
    },
  ];

  return (
    <div
      style={{
        background: "var(--c-bg)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        :root {
          --c-bg: #EEF1EC;
          --c-surface: #FFFFFF;
          --c-primary: #1B4B43;
          --c-accent-dark: #A9702E;
          --c-danger: #A8543B;
          --c-text: #22302B;
          --c-muted: #6B7A73;
          --c-line: #DCE3DD;

          --font-display: 'Fraunces', serif;
          --font-body: 'Source Sans 3', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
        }

        .font-serif {
          font-family: var(--font-display);
        }

        .font-mono {
          font-family: var(--font-mono);
        }

        * {
          box-sizing: border-box;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        input:focus,
        textarea:focus {
          outline: 2px solid rgba(27, 75, 67, 0.2);
          outline-offset: 1px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 38,
                height: 38,
                background: "var(--c-primary)",
              }}
            >
              <Heart
                size={19}
                color="white"
                fill="white"
              />
            </div>

            <div>
              <h1
                className="font-serif text-xl leading-tight"
                style={{
                  color: "var(--c-primary)",
                }}
              >
                Saathi Care
              </h1>

              <p
                className="text-[11px] leading-tight"
                style={{
                  color: "var(--c-muted)",
                }}
              >
                Trusted companionship for every home
              </p>
            </div>
          </div>

          <div
            className="flex rounded-full p-1"
            style={{
              background: "var(--c-surface)",
              border: "1px solid var(--c-line)",
            }}
          >
            {roles.map((roleItem) => {
              const Icon = roleItem.icon;

              return (
                <button
                  type="button"
                  key={roleItem.id}
                  onClick={() => setRole(roleItem.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-2 transition-colors"
                  style={{
                    background:
                      role === roleItem.id
                        ? "var(--c-primary)"
                        : "transparent",
                    color:
                      role === roleItem.id
                        ? "white"
                        : "var(--c-muted)",
                  }}
                >
                  <Icon size={14} />
                  {roleItem.label}
                </button>
              );
            })}
          </div>
        </header>

        {role === "family" && <FamilyView />}
        {role === "caregiver" && <CaregiverView />}
        {role === "admin" && <AdminView />}

        <footer
          className="mt-12 pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid var(--c-line)",
            color: "var(--c-muted)",
          }}
        >
          Prototype build — mock data, three simulated perspectives
          (Family, Caregiver, Admin) run independently.
        </footer>
      </div>
    </div>
  );
}
