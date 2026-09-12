"""
🏫 HITS E-Campus — Faculty Leave Application (Agentic AI Demo)

Hindustan Institute of Technology and Science (HITS) E-Campus portal where
faculty members can apply for leaves. A team of specialist agents collaborate
to process each application end-to-end:

  📜 Policy Agent     — validates leave against HITS leave policy & balance
  🗓️ Workload Agent  — checks the faculty's class schedule on the leave dates
  🤝 Substitute Agent — suggests substitute faculty from the same department
  ✅ Approval Agent   — routes the request to the right authority (HOD/Dean/Registrar)
  ✉️ Notifier Agent   — drafts notification emails to HOD, substitute & students

Run:  py -m streamlit run hits_leave_app.py
"""

import json
import time
from datetime import date, datetime, timedelta

import os
import pandas as pd
import streamlit as st
from openai import OpenAI

# ---------- Config ----------
OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_KEY:
    st.error("Set the OPENAI_API_KEY environment variable before running.")
    st.stop()
MODEL = "gpt-4o-mini"
client = OpenAI(api_key=OPENAI_KEY)

st.set_page_config(
    page_title="HITS E-Campus | Faculty Leave Portal",
    page_icon="🏫",
    layout="wide",
)

# ---------- Header ----------
st.markdown(
    """
    <div style="background:linear-gradient(90deg,#0a3d62,#1e6091);
                padding:18px 24px;border-radius:8px;color:white;margin-bottom:18px;">
        <h2 style="margin:0;">🏫 Hindustan Institute of Technology and Science</h2>
        <p style="margin:4px 0 0 0;font-size:15px;opacity:0.9;">
            E-Campus &nbsp;•&nbsp; Faculty Leave Application Portal &nbsp;•&nbsp; Powered by Agentic AI
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)


# ---------- Mock master data (would come from HITS DB / HRMS in production) ----------
FACULTY_DB = {
    "FAC1001": {"name": "Dr. Anitha Ramesh",  "dept": "CSE",  "designation": "Associate Professor",
                "leave_balance": {"Casual": 8, "Earned": 14, "Medical": 10, "On-Duty": 5}},
    "FAC1002": {"name": "Prof. Karthik Iyer", "dept": "ECE",  "designation": "Assistant Professor",
                "leave_balance": {"Casual": 5, "Earned": 9,  "Medical": 10, "On-Duty": 5}},
    "FAC1003": {"name": "Dr. Meera Nair",     "dept": "CSE",  "designation": "Professor",
                "leave_balance": {"Casual": 10,"Earned": 20, "Medical": 12, "On-Duty": 8}},
    "FAC1004": {"name": "Dr. Suresh Pillai",  "dept": "MECH", "designation": "Associate Professor",
                "leave_balance": {"Casual": 6, "Earned": 12, "Medical": 8,  "On-Duty": 4}},
    "FAC1005": {"name": "Prof. Divya Menon",  "dept": "CSE",  "designation": "Assistant Professor",
                "leave_balance": {"Casual": 7, "Earned": 6,  "Medical": 10, "On-Duty": 3}},
}

CLASS_SCHEDULE = {
    "FAC1001": [
        {"day": "Monday",    "time": "09:00-10:00", "course": "CS19411 Operating Systems",     "section": "III-CSE-A"},
        {"day": "Tuesday",   "time": "11:00-12:00", "course": "CS19411 Operating Systems",     "section": "III-CSE-A"},
        {"day": "Wednesday", "time": "10:00-11:00", "course": "CS19501 Compiler Design",       "section": "III-CSE-B"},
        {"day": "Thursday",  "time": "14:00-16:00", "course": "CS19411 Lab",                   "section": "III-CSE-A"},
        {"day": "Friday",    "time": "09:00-10:00", "course": "CS19501 Compiler Design",       "section": "III-CSE-B"},
    ],
    "FAC1002": [
        {"day": "Monday",    "time": "10:00-11:00", "course": "EC19302 Digital Signal Proc.",  "section": "II-ECE-A"},
        {"day": "Wednesday", "time": "11:00-12:00", "course": "EC19302 Digital Signal Proc.",  "section": "II-ECE-A"},
        {"day": "Friday",    "time": "14:00-16:00", "course": "EC19302 Lab",                   "section": "II-ECE-A"},
    ],
    "FAC1003": [
        {"day": "Tuesday",   "time": "09:00-10:00", "course": "CS19601 Machine Learning",      "section": "IV-CSE-A"},
        {"day": "Thursday",  "time": "10:00-11:00", "course": "CS19601 Machine Learning",      "section": "IV-CSE-A"},
    ],
    "FAC1004": [
        {"day": "Monday",    "time": "11:00-12:00", "course": "ME19204 Thermodynamics",        "section": "II-MECH-A"},
        {"day": "Wednesday", "time": "09:00-10:00", "course": "ME19204 Thermodynamics",        "section": "II-MECH-A"},
    ],
    "FAC1005": [
        {"day": "Monday",    "time": "14:00-15:00", "course": "CS19412 Database Systems",      "section": "III-CSE-B"},
        {"day": "Thursday",  "time": "09:00-10:00", "course": "CS19412 Database Systems",      "section": "III-CSE-B"},
    ],
}

HITS_LEAVE_POLICY = """
HITS Faculty Leave Policy (extracts):
- Casual Leave (CL): max 3 consecutive days at a time. Cannot be combined with Earned Leave.
- Earned Leave (EL): minimum 1 day. For >5 days, requires application at least 7 days in advance.
- Medical Leave (ML): supporting medical certificate required if >2 days.
- On-Duty (OD): for conferences, FDPs, official assignments. Needs event proof.
- Approval matrix:
    * 1-2 days  → HOD
    * 3-5 days  → HOD + Dean
    * >5 days   → HOD + Dean + Registrar
- Leave cannot exceed available balance.
- Substitute faculty must be arranged for all class hours during leave.
"""


# ---------- LLM helper ----------
def ask(system: str, user: str, json_mode: bool = False) -> str:
    kwargs = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    }
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    resp = client.chat.completions.create(**kwargs)
    return resp.choices[0].message.content


# ---------- Agent prompts ----------
POLICY_SYSTEM = f"""You are the Policy Agent for HITS E-Campus.
Validate a faculty leave request against the policy below.

{HITS_LEAVE_POLICY}

Respond ONLY in JSON:
{{
  "eligible": true/false,
  "issues": ["<issue 1>", "..."],
  "checks": [
    {{"rule": "<rule>", "status": "pass|fail|warning", "detail": "<explanation>"}}
  ],
  "verdict": "<one-line verdict>"
}}
"""

WORKLOAD_SYSTEM = """You are the Workload Agent.
You receive a pre-computed list of class sessions a faculty member will miss
during their leave (dates, weekdays, times, courses, sections are already correct).
Your only job: write a short one-sentence human summary of the impact
(e.g., "3 sessions across 2 courses will be missed over 4 days.").

Respond ONLY in JSON:
{
  "summary": "<one sentence>"
}
"""

SUBSTITUTE_SYSTEM = """You are the Substitute Agent.
Given affected classes and a list of available colleagues in the same department,
suggest the best substitute faculty for each class. Prefer faculty with lighter loads
and matching expertise hints from the course name.

Respond ONLY in JSON:
{
  "assignments": [
    {"course": "<course>", "section": "<section>", "date": "YYYY-MM-DD",
     "time": "<HH:MM-HH:MM>", "substitute": "<faculty name>",
     "reason": "<why this faculty>"}
  ]
}
"""

APPROVAL_SYSTEM = f"""You are the Approval Routing Agent for HITS.
Based on the leave duration and type, identify the approval chain per HITS policy.

{HITS_LEAVE_POLICY}

Respond ONLY in JSON:
{{
  "approvers": ["<role 1>", "<role 2>", ...],
  "priority": "Normal|High|Urgent",
  "expected_turnaround_hours": <number>,
  "note": "<short note to the faculty>"
}}
"""

NOTIFIER_SYSTEM = """You are the Notifier Agent.
Draft a single, polite, formal email body (4-7 sentences) addressed to the HOD
informing them of the faculty's leave application, the dates, reason, affected
classes count, and the proposed substitutes. Sign off as:
"Sent automatically via HITS E-Campus Leave Portal".
Do NOT include a subject line — just the body.
"""


# ---------- Helpers ----------
def daterange(start: date, end: date):
    days = (end - start).days
    for i in range(days + 1):
        yield start + timedelta(days=i)


def affected_classes_for(fac_id: str, start: date, end: date):
    schedule = CLASS_SCHEDULE.get(fac_id, [])
    by_day = {}
    for s in schedule:
        by_day.setdefault(s["day"], []).append(s)
    affected = []
    for d in daterange(start, end):
        wd = d.strftime("%A")
        for s in by_day.get(wd, []):
            affected.append({
                "date": d.strftime("%Y-%m-%d"),
                "day": wd,
                "time": s["time"],
                "course": s["course"],
                "section": s["section"],
            })
    return affected


def colleagues_in_dept(fac_id: str):
    dept = FACULTY_DB[fac_id]["dept"]
    return [
        {"id": fid, "name": f["name"], "designation": f["designation"],
         "weekly_classes": len(CLASS_SCHEDULE.get(fid, []))}
        for fid, f in FACULTY_DB.items()
        if f["dept"] == dept and fid != fac_id
    ]


# ---------- Sidebar: Faculty Login ----------
with st.sidebar:
    st.header("👤 Faculty Login")
    fac_options = [f"{fid} — {f['name']}" for fid, f in FACULTY_DB.items()]
    selected = st.selectbox("Select Faculty ID", fac_options)
    fac_id = selected.split(" — ")[0]
    fac = FACULTY_DB[fac_id]

    st.markdown(f"**Name:** {fac['name']}")
    st.markdown(f"**Dept:** {fac['dept']}")
    st.markdown(f"**Designation:** {fac['designation']}")

    st.markdown("---")
    st.subheader("📊 Leave Balance")
    bal_df = pd.DataFrame(
        [{"Type": k, "Days Left": v} for k, v in fac["leave_balance"].items()]
    )
    st.dataframe(bal_df, hide_index=True, use_container_width=True)


# ---------- Main: Leave Application Form ----------
st.subheader("1️⃣  Apply for Leave")

col1, col2, col3 = st.columns(3)
with col1:
    leave_type = st.selectbox("Leave Type",
                              ["Casual", "Earned", "Medical", "On-Duty"])
with col2:
    start_date = st.date_input("From Date", value=date.today() + timedelta(days=1),
                               min_value=date.today())
with col3:
    end_date = st.date_input("To Date", value=date.today() + timedelta(days=2),
                             min_value=date.today())

reason = st.text_area("Reason for Leave",
                      placeholder="e.g., Attending IEEE conference at IIT Madras…",
                      height=80)

num_days = (end_date - start_date).days + 1
st.info(f"🗓️ **Duration:** {num_days} day(s) &nbsp;|&nbsp; "
        f"**Available {leave_type} balance:** {fac['leave_balance'][leave_type]} day(s)")

col_a, col_b = st.columns([3, 1])
submit = col_a.button("▶  Submit & Run Agent Team", type="primary", use_container_width=True)
if col_b.button("🔄  Reset", use_container_width=True):
    for k in list(st.session_state.keys()):
        if k.startswith("leave_"):
            st.session_state.pop(k, None)
    st.rerun()

# ---------- Run the agent pipeline ----------
if submit:
    if end_date < start_date:
        st.error("❌ End date cannot be before start date.")
        st.stop()
    if not reason.strip():
        st.error("❌ Please enter a reason for leave.")
        st.stop()

    request_payload = {
        "faculty_id": fac_id,
        "faculty_name": fac["name"],
        "department": fac["dept"],
        "designation": fac["designation"],
        "leave_type": leave_type,
        "from_date": start_date.strftime("%Y-%m-%d"),
        "to_date": end_date.strftime("%Y-%m-%d"),
        "num_days": num_days,
        "reason": reason.strip(),
        "current_balance": fac["leave_balance"][leave_type],
    }

    st.subheader("2️⃣  Agent Team at Work")

    # ===== Agent 1: Policy =====
    with st.status("📜  Policy Agent — checking HITS leave policy…", expanded=True) as box:
        st.write("**Goal:** Validate request against HITS leave policy & balance.")
        raw = ask(POLICY_SYSTEM, json.dumps(request_payload, indent=2), json_mode=True)
        try:
            policy_out = json.loads(raw)
        except json.JSONDecodeError:
            st.error(f"Policy Agent returned invalid JSON:\n{raw}")
            st.stop()

        eligible = policy_out.get("eligible", False)
        checks = policy_out.get("checks", [])
        if checks:
            st.dataframe(pd.DataFrame(checks), use_container_width=True, hide_index=True)
        st.markdown(f"**Verdict:** {policy_out.get('verdict', '—')}")
        if policy_out.get("issues"):
            for iss in policy_out["issues"]:
                st.warning(f"⚠️ {iss}")
        box.update(
            label=f"📜  Policy Agent — {'Eligible ✅' if eligible else 'Issues found ⚠️'}",
            state="complete", expanded=False,
        )

    if not eligible:
        st.error("🚫 Application cannot proceed. Please address the issues above and resubmit.")
        st.stop()

    # ===== Agent 2: Workload =====
    with st.status("🗓️  Workload Agent — scanning your timetable…", expanded=True) as box:
        st.write("**Goal:** Find class sessions affected by the leave.")
        # Compute affected classes deterministically — date math, not an LLM job.
        affected = affected_classes_for(fac_id, start_date, end_date)
        total_hours = len(affected)

        # Use the LLM only to phrase a friendly one-line summary.
        summary_payload = {
            "faculty": fac["name"],
            "from_date": request_payload["from_date"],
            "to_date": request_payload["to_date"],
            "affected_classes": affected,
            "total_sessions": total_hours,
        }
        try:
            raw = ask(WORKLOAD_SYSTEM, json.dumps(summary_payload, indent=2), json_mode=True)
            summary_text = json.loads(raw).get("summary", "")
        except (json.JSONDecodeError, Exception):
            summary_text = (f"{total_hours} class session(s) will be missed "
                            f"from {request_payload['from_date']} to {request_payload['to_date']}.")

        workload_out = {
            "affected_classes": affected,
            "total_hours": total_hours,
            "summary": summary_text,
        }

        if affected:
            st.dataframe(pd.DataFrame(affected), use_container_width=True, hide_index=True)
        else:
            st.info("No class sessions are affected during this leave period.")
        st.caption(summary_text)
        box.update(
            label=f"🗓️  Workload Agent — {len(affected)} class session(s) affected ✅",
            state="complete", expanded=False,
        )

    # ===== Agent 3: Substitute =====
    assignments = []
    if affected:
        with st.status("🤝  Substitute Agent — finding substitute faculty…", expanded=True) as box:
            colleagues = colleagues_in_dept(fac_id)
            st.write(f"**Available colleagues in {fac['dept']}:** {len(colleagues)}")
            sub_payload = {
                "affected_classes": affected,
                "available_colleagues": colleagues,
            }
            raw = ask(SUBSTITUTE_SYSTEM, json.dumps(sub_payload, indent=2), json_mode=True)
            try:
                sub_out = json.loads(raw)
                assignments = sub_out.get("assignments", [])
            except json.JSONDecodeError:
                assignments = []

            if assignments:
                st.dataframe(pd.DataFrame(assignments), use_container_width=True, hide_index=True)
            else:
                st.warning("Could not auto-assign substitutes. HOD will be requested to arrange.")
            box.update(
                label=f"🤝  Substitute Agent — {len(assignments)} assignment(s) proposed ✅",
                state="complete", expanded=False,
            )

    # ===== Agent 4: Approval routing =====
    with st.status("✅  Approval Agent — routing the request…", expanded=True) as box:
        approval_payload = {
            "leave_type": leave_type,
            "num_days": num_days,
            "department": fac["dept"],
        }
        raw = ask(APPROVAL_SYSTEM, json.dumps(approval_payload, indent=2), json_mode=True)
        try:
            approval_out = json.loads(raw)
        except json.JSONDecodeError:
            approval_out = {"approvers": ["HOD"], "priority": "Normal",
                            "expected_turnaround_hours": 24, "note": ""}
        approvers = approval_out.get("approvers", [])
        st.markdown(f"**Approval chain:** {' → '.join(approvers) if approvers else '—'}")
        st.markdown(f"**Priority:** {approval_out.get('priority', 'Normal')}")
        st.markdown(f"**Expected turnaround:** {approval_out.get('expected_turnaround_hours', 24)} hours")
        if approval_out.get("note"):
            st.caption(approval_out["note"])
        box.update(
            label=f"✅  Approval Agent — routed to {len(approvers)} approver(s) ✅",
            state="complete", expanded=False,
        )

    # ===== Agent 5: Notifier =====
    with st.status("✉️  Notifier Agent — drafting HOD notification…", expanded=True) as box:
        notif_payload = {
            "faculty": fac["name"],
            "department": fac["dept"],
            "leave_type": leave_type,
            "from_date": request_payload["from_date"],
            "to_date": request_payload["to_date"],
            "num_days": num_days,
            "reason": reason.strip(),
            "affected_classes_count": len(affected),
            "substitutes": assignments,
        }
        email_body = ask(NOTIFIER_SYSTEM, json.dumps(notif_payload, indent=2))
        st.markdown("**To:** hod." + fac["dept"].lower() + "@hindustanuniv.ac.in")
        st.markdown(f"**Subject:** Leave Application — {fac['name']} "
                    f"({request_payload['from_date']} to {request_payload['to_date']})")
        st.markdown("---")
        st.markdown(email_body)
        box.update(label="✉️  Notifier Agent — HOD email drafted ✅",
                   state="complete", expanded=False)

    # ===== Final receipt =====
    st.subheader("3️⃣  Application Submitted")
    ticket_id = f"HITS-LV-{datetime.now().strftime('%Y%m%d%H%M%S')}-{fac_id[-4:]}"
    st.success(f"🎉 Your leave application has been submitted successfully.\n\n"
               f"**Ticket ID:** `{ticket_id}`")

    receipt = {
        "Ticket ID": ticket_id,
        "Faculty": fac["name"],
        "Department": fac["dept"],
        "Leave Type": leave_type,
        "From": request_payload["from_date"],
        "To": request_payload["to_date"],
        "Days": num_days,
        "Classes Affected": len(affected),
        "Substitutes Assigned": len(assignments),
        "Approval Chain": " → ".join(approval_out.get("approvers", [])),
        "Priority": approval_out.get("priority", "Normal"),
        "Status": "Pending Approval",
    }
    st.table(pd.DataFrame(receipt.items(), columns=["Field", "Value"]))

    st.session_state["leave_last_ticket"] = ticket_id


# ---------- Footer ----------
st.markdown("---")
st.caption(
    "© Hindustan Institute of Technology and Science · E-Campus Faculty Portal · "
    "Agentic AI demo built with Streamlit + OpenAI."
)
