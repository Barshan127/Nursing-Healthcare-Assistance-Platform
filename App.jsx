import time
import pandas as pd
import streamlit as st

# --------------------------------------------------
# Page config
# --------------------------------------------------

st.set_page_config(
    page_title="Saathi Care",
    page_icon="💚",
    layout="wide",
)

# --------------------------------------------------
# Theme / CSS (mirrors the React color tokens)
# --------------------------------------------------

st.markdown(
    """
    <style>
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
    }

    html, body, [class*="css"]  {
        font-family: 'Source Sans 3', sans-serif;
    }

    .stApp {
        background: var(--c-bg);
    }

    .saathi-card {
        background: var(--c-surface);
        border: 1px solid var(--c-line);
        border-radius: 16px;
        padding: 18px;
        margin-bottom: 14px;
    }

    .saathi-title {
        font-family: 'Fraunces', serif;
        color: var(--c-primary);
        font-size: 1.15rem;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .saathi-kpi-label {
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--c-muted);
    }

    .saathi-kpi-value {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 1.6rem;
        font-weight: 600;
        color: var(--c-primary);
    }

    .saathi-kpi-sub {
        font-size: 0.75rem;
        color: var(--c-muted);
    }

    .saathi-price {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 600;
        color: var(--c-accent-dark);
    }

    .saathi-muted {
        color: var(--c-muted);
        font-size: 0.8rem;
    }

    .saathi-badge {
        display: inline-block;
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 0.72rem;
        font-weight: 600;
    }
    .badge-primary { background: rgba(27,75,67,0.1); color: var(--c-primary); }
    .badge-gold { background: rgba(201,138,62,0.15); color: var(--c-accent-dark); }
    .badge-danger { background: rgba(181,83,60,0.12); color: var(--c-danger); }

    .saathi-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        color: white;
        font-family: 'Fraunces', serif;
        font-weight: 600;
        width: 44px;
        height: 44px;
        font-size: 1rem;
    }

    .saathi-header-band {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
    }

    hr { border-color: var(--c-line); }
    </style>
    """,
    unsafe_allow_html=True,
)

# --------------------------------------------------
# Mock data
# --------------------------------------------------

SERVICES = [
    {
        "id": "nursing",
        "name": "Nursing Care",
        "icon": "🩺",
        "desc": "Skilled nursing for medication, wound care, and vitals monitoring.",
        "duration": "4 hr / 8 hr / 24 hr",
        "price": "₹450/hr",
        "qualification": "GNM / B.Sc Nursing",
    },
    {
        "id": "attendant",
        "name": "Elderly Attendant",
        "icon": "❤️‍🩹",
        "desc": "Daily living support — bathing, feeding, mobility, and companionship.",
        "duration": "8 hr / 12 hr",
        "price": "₹280/hr",
        "qualification": "Certified Attendant",
    },
    {
        "id": "physio",
        "name": "Physiotherapy",
        "icon": "🏃",
        "desc": "Home-based mobility and post-surgery rehabilitation sessions.",
        "duration": "1 hr sessions",
        "price": "₹600/session",
        "qualification": "BPT / MPT",
    },
    {
        "id": "posthospital",
        "name": "Post-Hospital Care",
        "icon": "📋",
        "desc": "Transition support after discharge — monitoring, dressing, follow-up.",
        "duration": "7-day / 14-day plans",
        "price": "₹3,200/day",
        "qualification": "RN, 2+ yrs",
    },
]

CAREGIVERS = [
    {
        "id": 1,
        "name": "Lakshmi Narayanan",
        "role": "Registered Nurse",
        "exp": "9 yrs",
        "rating": 4.9,
        "reviews": 132,
        "rate": "₹480/hr",
        "verified": True,
        "initials": "LN",
        "color": "#1B4B43",
        "area": "Adyar, Chennai",
    },
    {
        "id": 2,
        "name": "Ravi Kumar",
        "role": "Elderly Attendant",
        "exp": "5 yrs",
        "rating": 4.7,
        "reviews": 88,
        "rate": "₹300/hr",
        "verified": True,
        "initials": "RK",
        "color": "#8A5A2B",
        "area": "Anna Nagar, Chennai",
    },
    {
        "id": 3,
        "name": "Priya Suresh",
        "role": "Physiotherapist",
        "exp": "6 yrs",
        "rating": 4.8,
        "reviews": 61,
        "rate": "₹650/session",
        "verified": True,
        "initials": "PS",
        "color": "#5B4B8A",
        "area": "T. Nagar, Chennai",
    },
]

STATUS_STEPS = ["Requested", "Confirmed", "In Progress", "Completed"]

INITIAL_BOOKINGS = [
    {
        "id": 101,
        "service": "Nursing Care",
        "caregiver": "Lakshmi Narayanan",
        "schedule": "Daily · 9:00 AM–1:00 PM",
        "status": 2,
        "notes": "Morning medication given. BP: 128/82, stable. Light breakfast taken well.",
    }
]

INITIAL_REQUESTS = [
    {
        "id": 201,
        "family": "Meenakshi household",
        "patient": "Mr. Subramaniam, 78",
        "service": "Elderly Attendant",
        "schedule": "Tomorrow, 8:00 AM–8:00 PM",
        "area": "Anna Nagar",
        "status": "pending",
    },
    {
        "id": 202,
        "family": "Iyer household",
        "patient": "Mrs. Iyer, 82",
        "service": "Elderly Attendant",
        "schedule": "Thu, 9:00 AM–5:00 PM",
        "area": "Anna Nagar",
        "status": "pending",
    },
]

PENDING_CAREGIVERS = [
    {
        "id": 1,
        "name": "Deepa Raman",
        "role": "GNM Nurse",
        "docs": "License, ID, 2 references",
        "submitted": "2 days ago",
    },
    {
        "id": 2,
        "name": "Mohan Das",
        "role": "Elderly Attendant",
        "docs": "ID, 1 reference, training cert.",
        "submitted": "5 days ago",
    },
]

COMPLAINTS = [
    {"id": 1, "family": "Rajan household", "issue": "Caregiver arrived 40 min late", "status": "Open"},
    {"id": 2, "family": "Krishnan household", "issue": "Billing discrepancy for long-term plan", "status": "In review"},
]

BOOKINGS_CHART = pd.DataFrame(
    {
        "week": ["W1", "W2", "W3", "W4", "W5", "W6"],
        "bookings": [42, 51, 47, 63, 58, 71],
    }
).set_index("week")

# --------------------------------------------------
# Session state init
# --------------------------------------------------

if "bookings" not in st.session_state:
    st.session_state.bookings = INITIAL_BOOKINGS.copy()

if "requests" not in st.session_state:
    st.session_state.requests = [r.copy() for r in INITIAL_REQUESTS]

if "pending_caregivers" not in st.session_state:
    st.session_state.pending_caregivers = [c.copy() for c in PENDING_CAREGIVERS]

if "available" not in st.session_state:
    st.session_state.available = True

if "patient" not in st.session_state:
    st.session_state.patient = {
        "name": "Mr. Subramaniam",
        "age": "78",
        "needs": "Diabetes management, limited mobility, requires assistance with daily activities.",
    }

if "modal_caregiver_id" not in st.session_state:
    st.session_state.modal_caregiver_id = None

if "role" not in st.session_state:
    st.session_state.role = "Family"

# --------------------------------------------------
# Small helpers
# --------------------------------------------------


def badge(text, tone="primary"):
    return f'<span class="saathi-badge badge-{tone}">{text}</span>'


def card_open(title=None):
    st.markdown('<div class="saathi-card">', unsafe_allow_html=True)
    if title:
        st.markdown(f'<div class="saathi-title">{title}</div>', unsafe_allow_html=True)


def card_close():
    st.markdown("</div>", unsafe_allow_html=True)


def kpi_card(label, value, sub=None):
    sub_html = f'<div class="saathi-kpi-sub">{sub}</div>' if sub else ""
    st.markdown(
        f"""
        <div class="saathi-card">
            <div class="saathi-kpi-label">{label}</div>
            <div class="saathi-kpi-value">{value}</div>
            {sub_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def status_thread(step: int):
    cols = st.columns(len(STATUS_STEPS))
    for i, (col, label) in enumerate(zip(cols, STATUS_STEPS)):
        with col:
            if i < step:
                marker = "✅"
            elif i == step:
                marker = "🟢"
            else:
                marker = "⚪"
            weight = "600" if i <= step else "400"
            color = "var(--c-text)" if i <= step else "var(--c-muted)"
            st.markdown(
                f'<div style="text-align:center;">{marker}<br>'
                f'<span style="font-size:11px;font-weight:{weight};color:{color};">{label}</span></div>',
                unsafe_allow_html=True,
            )


# --------------------------------------------------
# Family view
# --------------------------------------------------


def family_view():
    # Patient profile
    card_open("Patient profile")
    c1, c2, c3 = st.columns([1, 1, 2])
    with c1:
        st.session_state.patient["name"] = st.text_input(
            "Name", value=st.session_state.patient["name"], key="patient_name"
        )
    with c2:
        st.session_state.patient["age"] = st.text_input(
            "Age", value=st.session_state.patient["age"], key="patient_age"
        )
    with c3:
        st.session_state.patient["needs"] = st.text_area(
            "Medical needs", value=st.session_state.patient["needs"], key="patient_needs", height=90
        )
    card_close()

    # Services
    st.markdown('<div class="saathi-title">Care services</div>', unsafe_allow_html=True)
    cols = st.columns(4)
    for col, service in zip(cols, SERVICES):
        with col:
            card_open()
            st.markdown(f"### {service['icon']}")
            st.markdown(f"**{service['name']}**")
            st.markdown(f'<span class="saathi-muted">{service["desc"]}</span>', unsafe_allow_html=True)
            st.markdown("---")
            st.markdown(
                f'<span class="saathi-price">{service["price"]}</span> '
                f'<span class="saathi-muted">· {service["duration"]}</span>',
                unsafe_allow_html=True,
            )
            card_close()

    # Caregivers
    st.markdown('<div class="saathi-title">Available caregivers near you</div>', unsafe_allow_html=True)
    cols = st.columns(3)
    for col, caregiver in zip(cols, CAREGIVERS):
        with col:
            card_open()
            st.markdown(
                f'<div style="display:flex;align-items:center;gap:10px;">'
                f'<div class="saathi-avatar" style="background:{caregiver["color"]};">{caregiver["initials"]}</div>'
                f'<div><b>{caregiver["name"]}</b> {"✅" if caregiver["verified"] else ""}<br>'
                f'<span class="saathi-muted">{caregiver["role"]} · {caregiver["exp"]}</span></div>'
                f"</div>",
                unsafe_allow_html=True,
            )
            st.markdown(
                f'⭐ **{caregiver["rating"]}** '
                f'<span class="saathi-muted">({caregiver["reviews"]} reviews)</span><br>'
                f'<span class="saathi-muted">📍 {caregiver["area"]}</span>',
                unsafe_allow_html=True,
            )
            b1, b2 = st.columns([1, 1])
            with b1:
                st.markdown(f'<span class="saathi-price">{caregiver["rate"]}</span>', unsafe_allow_html=True)
            with b2:
                if st.button("Book", key=f"book_{caregiver['id']}"):
                    st.session_state.modal_caregiver_id = caregiver["id"]
            card_close()

    # Booking modal (rendered inline as an expander/dialog-style card)
    if st.session_state.modal_caregiver_id is not None:
        chosen = next(
            (c for c in CAREGIVERS if c["id"] == st.session_state.modal_caregiver_id), None
        )
        if chosen:
            with st.container():
                card_open(f"Confirm booking — {chosen['name']} ({chosen['role']})")
                sched_type = st.radio(
                    "Schedule type", ["Hourly", "Daily", "Long-term"], horizontal=True, key="sched_type"
                )
                c1, c2 = st.columns(2)
                with c1:
                    if st.button("Send request", key="confirm_booking"):
                        new_booking = {
                            "id": int(time.time() * 1000),
                            "service": "Nursing Care",
                            "caregiver": chosen["name"],
                            "schedule": f"{sched_type} · 9:00 AM–1:00 PM",
                            "status": 0,
                            "notes": "",
                        }
                        st.session_state.bookings.insert(0, new_booking)
                        st.session_state.modal_caregiver_id = None
                        st.rerun()
                with c2:
                    if st.button("Cancel", key="cancel_booking"):
                        st.session_state.modal_caregiver_id = None
                        st.rerun()
                card_close()

    # Service tracking
    st.markdown('<div class="saathi-title">Service tracking</div>', unsafe_allow_html=True)
    for booking in st.session_state.bookings:
        card_open()
        top1, top2 = st.columns([3, 1])
        with top1:
            st.markdown(f"**{booking['service']} — {booking['caregiver']}**")
            st.markdown(f'<span class="saathi-muted">{booking["schedule"]}</span>', unsafe_allow_html=True)
        with top2:
            tone = "primary" if booking["status"] == 3 else "gold"
            st.markdown(badge(STATUS_STEPS[booking["status"]], tone), unsafe_allow_html=True)

        status_thread(booking["status"])

        if booking["notes"]:
            st.markdown(
                f'<div style="background:var(--c-bg);border-radius:8px;padding:10px;margin-top:10px;font-size:0.8rem;">'
                f'<b style="color:var(--c-primary);">Care note: </b>{booking["notes"]}</div>',
                unsafe_allow_html=True,
            )
        card_close()


# --------------------------------------------------
# Caregiver view
# --------------------------------------------------


def caregiver_view():
    card_open()
    top1, top2 = st.columns([3, 1])
    with top1:
        st.markdown(
            '<div style="display:flex;align-items:center;gap:10px;">'
            '<div class="saathi-avatar" style="background:#1B4B43;">LN</div>'
            '<div><b>Lakshmi Narayanan</b> ✅<br>'
            '<span class="saathi-muted">Registered Nurse · Adyar, Chennai</span></div>'
            "</div>",
            unsafe_allow_html=True,
        )
    with top2:
        label = "● Available for requests" if st.session_state.available else "● Not accepting requests"
        if st.button(label, key="toggle_available"):
            st.session_state.available = not st.session_state.available
            st.rerun()
    card_close()

    st.markdown('<div class="saathi-title">Service requests</div>', unsafe_allow_html=True)
    for request in st.session_state.requests:
        card_open()
        c1, c2 = st.columns([3, 1])
        with c1:
            st.markdown(f"**{request['patient']} — {request['service']}**")
            st.markdown(
                f'<span class="saathi-muted">{request["schedule"]} · {request["area"]} · {request["family"]}</span>',
                unsafe_allow_html=True,
            )
        with c2:
            if request["status"] == "pending":
                b1, b2 = st.columns(2)
                with b1:
                    if st.button("Decline", key=f"decline_{request['id']}"):
                        request["status"] = "rejected"
                        st.rerun()
                with b2:
                    if st.button("Accept", key=f"accept_{request['id']}"):
                        request["status"] = "accepted"
                        st.rerun()
            else:
                tone = "primary" if request["status"] == "accepted" else "danger"
                label = "Accepted" if request["status"] == "accepted" else "Declined"
                st.markdown(badge(label, tone), unsafe_allow_html=True)
        card_close()

    st.markdown('<div class="saathi-title">Summary</div>', unsafe_allow_html=True)
    c1, c2, c3 = st.columns(3)
    with c1:
        kpi_card("This month", "₹34,600", "Earnings")
    with c2:
        kpi_card("Completed visits", "47", "Last 30 days")
    with c3:
        kpi_card("Rating", "4.9", "132 reviews")


# --------------------------------------------------
# Admin view
# --------------------------------------------------


def admin_view():
    cols = st.columns(6)
    kpis = [
        ("Users", "2,184"),
        ("Verified caregivers", "316"),
        ("Completion rate", "94%"),
        ("Avg. response", "6.2m"),
        ("Satisfaction", "4.7/5"),
        ("MAU", "1,392"),
    ]
    for col, (label, value) in zip(cols, kpis):
        with col:
            kpi_card(label, value)

    card_open("Bookings, last 6 weeks")
    st.bar_chart(BOOKINGS_CHART, color="#1B4B43", height=220)
    card_close()

    st.markdown('<div class="saathi-title">Caregiver verification queue</div>', unsafe_allow_html=True)
    if not st.session_state.pending_caregivers:
        st.markdown('<span class="saathi-muted">Queue is clear.</span>', unsafe_allow_html=True)
    else:
        for caregiver in list(st.session_state.pending_caregivers):
            card_open()
            c1, c2 = st.columns([3, 1])
            with c1:
                st.markdown(f"**{caregiver['name']} — {caregiver['role']}**")
                st.markdown(
                    f'<span class="saathi-muted">{caregiver["docs"]} · submitted {caregiver["submitted"]}</span>',
                    unsafe_allow_html=True,
                )
            with c2:
                b1, b2 = st.columns(2)
                with b1:
                    if st.button("Reject", key=f"reject_{caregiver['id']}"):
                        st.session_state.pending_caregivers = [
                            c for c in st.session_state.pending_caregivers if c["id"] != caregiver["id"]
                        ]
                        st.rerun()
                with b2:
                    if st.button("Verify", key=f"verify_{caregiver['id']}"):
                        st.session_state.pending_caregivers = [
                            c for c in st.session_state.pending_caregivers if c["id"] != caregiver["id"]
                        ]
                        st.rerun()
            card_close()

    st.markdown('<div class="saathi-title">Open complaints</div>', unsafe_allow_html=True)
    for complaint in COMPLAINTS:
        card_open()
        c1, c2 = st.columns([3, 1])
        with c1:
            st.markdown(f"⚠️ **{complaint['family']}**")
            st.markdown(f'<span class="saathi-muted">{complaint["issue"]}</span>', unsafe_allow_html=True)
        with c2:
            tone = "danger" if complaint["status"] == "Open" else "gold"
            st.markdown(badge(complaint["status"], tone), unsafe_allow_html=True)
        card_close()


# --------------------------------------------------
# App shell
# --------------------------------------------------

header_l, header_r = st.columns([2, 2])
with header_l:
    st.markdown(
        """
        <div class="saathi-header-band">
            <div style="width:38px;height:38px;background:var(--c-primary);border-radius:12px;
                        display:flex;align-items:center;justify-content:center;font-size:18px;">💚</div>
            <div>
                <div class="saathi-title" style="margin:0;font-size:1.3rem;">Saathi Care</div>
                <div class="saathi-muted">Trusted companionship for every home</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with header_r:
    st.session_state.role = st.radio(
        "Role",
        ["Family", "Caregiver", "Admin"],
        horizontal=True,
        label_visibility="collapsed",
        index=["Family", "Caregiver", "Admin"].index(st.session_state.role),
    )

st.markdown("<br>", unsafe_allow_html=True)

if st.session_state.role == "Family":
    family_view()
elif st.session_state.role == "Caregiver":
    caregiver_view()
else:
    admin_view()

st.markdown("---")
st.markdown(
    '<div class="saathi-muted" style="text-align:center;">'
    "Prototype build — mock data, three simulated perspectives "
    "(Family, Caregiver, Admin) run independently.</div>",
    unsafe_allow_html=True,
)
