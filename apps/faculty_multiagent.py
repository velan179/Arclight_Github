"""
🤖 Faculty Agent Team — a multi-agent demo for Day 2.

Four specialist agents collaborate sequentially:
  🔍 Analyst       — finds at-risk students
  ✉️ Communicator — drafts personalized parent emails
  📅 Scheduler    — books mentoring slots (mock calendar)
  📊 Reporter     — writes an HOD summary

Each agent's "thinking" streams into the UI so faculty SEE the team work.

Run:  py -m streamlit run faculty_agent.py
"""

import json
import time
from datetime import datetime, timedelta

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

st.set_page_config(page_title="Faculty Agent Team", page_icon="🤖", layout="wide")
st.title("🤖 Faculty Agent Team")
st.caption("Day 2 demo  •  Multi-agent system  •  Watch each agent work in sequence.")


# ---------- LLM helper ----------
def ask(system: str, user: str, json_mode: bool = False) -> str:
    """One LLM call. Returns the text response."""
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


# ---------- Agent definitions ----------
ANALYST_SYSTEM = """You are the Analyst Agent on a faculty operations team.
Your job: find at-risk students in the data.

A student is AT RISK if ANY of these are true:
  - marks (or score / total) below 40
  - attendance below 75%

Respond ONLY in JSON with this shape:
{
  "at_risk": [
    {"name": "<student name>", "reason": "<short reason citing numbers>"},
    ...
  ],
  "summary": "<one sentence overall>"
}
"""

COMMUNICATOR_SYSTEM = """You are the Communicator Agent on a faculty operations team.
Your job: draft a short, empathetic email to the PARENT of a specific student.

Tone: warm, supportive, factual. NOT alarming.
Length: 4-6 sentences.
Sign off as: "Faculty Mentor, Greenwood Institute".
Do NOT include subject line — just the body.
"""

SCHEDULER_SYSTEM = """You are the Scheduler Agent.
Given a list of students, propose mentoring slots over the next 5 working days,
30 minutes each, between 10:00 AM and 4:00 PM. Avoid lunch (1-2 PM).
Respond ONLY in JSON:
{
  "schedule": [
    {"student": "<name>", "day": "<weekday>", "time": "<HH:MM>"}
  ]
}
"""

REPORTER_SYSTEM = """You are the Reporter Agent.
Write a crisp summary for the Head of Department (HOD).
Structure:
  - One-line headline
  - 3 bullet points of key findings
  - 1-sentence recommendation
Keep it under 120 words. Use markdown formatting.
"""


# ---------- UI: upload ----------
st.subheader("1️⃣  Upload student Excel")
uploaded = st.file_uploader("Same file you used in the Day 1 demo works fine", type=["xlsx"])

if not uploaded:
    st.info("Waiting for an Excel file…")
    st.stop()

df = pd.read_excel(uploaded)
with st.expander(f"📋 Loaded {len(df)} students", expanded=False):
    st.dataframe(df, use_container_width=True)

st.subheader("2️⃣  Run the team")
col_a, col_b = st.columns([3, 1])
run_clicked = col_a.button("▶  Run Agent Team", type="primary", use_container_width=True)
if col_b.button("🔄  Reset", use_container_width=True):
    for k in ("results", "sent_emails"):
        st.session_state.pop(k, None)
    st.rerun()

# If no cached results AND user just clicked Run → execute the pipeline once
if run_clicked and "results" not in st.session_state:
    data_text = df.to_string(index=False)

    # ===== Agent 1: Analyst =====
    with st.status("🔍  Analyst Agent — scanning student data…", expanded=True) as box:
        st.write("**Goal:** Identify students needing support based on marks & attendance.")
        st.write("**Thinking…**")
        raw = ask(ANALYST_SYSTEM, f"STUDENT DATA:\n{data_text}", json_mode=True)
        try:
            analyst_out = json.loads(raw)
        except json.JSONDecodeError:
            st.error(f"Couldn't parse Analyst output:\n{raw}")
            st.stop()
        at_risk = analyst_out.get("at_risk", [])
        st.write(f"**Result:** Flagged **{len(at_risk)}** student(s):")
        for s in at_risk:
            st.markdown(f"- **{s['name']}** — {s['reason']}")
        if analyst_out.get("summary"):
            st.caption(analyst_out["summary"])
        box.update(label=f"🔍  Analyst Agent — {len(at_risk)} student(s) flagged ✅",
                   state="complete", expanded=False)

    if not at_risk:
        st.success("🎉 No at-risk students. The team has nothing to escalate today.")
        st.stop()

    # ===== Agent 2: Communicator =====
    emails = []
    with st.status("✉️  Communicator Agent — drafting parent emails…", expanded=True) as box:
        for i, student in enumerate(at_risk, 1):
            st.write(f"✏️  Drafting **{i}/{len(at_risk)}** — for {student['name']}…")
            body = ask(
                COMMUNICATOR_SYSTEM,
                f"Student: {student['name']}\nIssue: {student['reason']}\n"
                "Write the email body to the parent."
            )
            emails.append({"student": student["name"], "body": body.strip()})
            time.sleep(0.1)
        st.write(f"**Result:** {len(emails)} email(s) ready.")
        box.update(label=f"✉️  Communicator Agent — {len(emails)} email(s) drafted ✅",
                   state="complete", expanded=False)

    # ===== Agent 3: Scheduler =====
    with st.status("📅  Scheduler Agent — proposing mentoring slots…", expanded=True) as box:
        names = [s["name"] for s in at_risk]
        st.write(f"Scheduling **{len(names)}** student(s) over the next 5 working days…")
        raw = ask(
            SCHEDULER_SYSTEM,
            f"Today is {datetime.now().strftime('%A, %d %b %Y')}.\n"
            f"Students to schedule (ONE slot per student, max {len(names)} slots): "
            f"{', '.join(names)}",
            json_mode=True,
        )
        try:
            schedule = json.loads(raw).get("schedule", [])
        except json.JSONDecodeError:
            schedule = []
        if schedule:
            st.dataframe(pd.DataFrame(schedule), use_container_width=True, hide_index=True)
        else:
            st.warning("Scheduler couldn't propose slots.")
        box.update(label=f"📅  Scheduler Agent — {len(schedule)} slot(s) booked ✅",
                   state="complete", expanded=False)

    # ===== Agent 4: Reporter =====
    with st.status("📊  Reporter Agent — writing HOD summary…", expanded=True) as box:
        payload = {
            "at_risk_count": len(at_risk),
            "students": at_risk,
            "schedule": schedule,
        }
        report = ask(REPORTER_SYSTEM, json.dumps(payload, indent=2))
        if not report or not report.strip():
            report = ("**Headline:** No summary returned by Reporter agent.\n\n"
                      "- Please rerun the team.\n- Check API quota.\n- Try again later.")
        st.markdown(report)
        box.update(label="📊  Reporter Agent — HOD summary ready ✅",
                   state="complete", expanded=False)

    # Cache everything so reruns don't re-call the LLM
    st.session_state["results"] = {
        "analyst": analyst_out,
        "at_risk": at_risk,
        "emails": emails,
        "schedule": schedule,
        "report": report,
    }

# ---------- Render results (from cache, every rerun) ----------
if "results" not in st.session_state:
    st.stop()

r = st.session_state["results"]
analyst_out = r["analyst"]
at_risk     = r["at_risk"]
emails      = r["emails"]
schedule    = r["schedule"]
report      = r["report"]

st.divider()
st.subheader("🔍  Summary of what the team did")
col1, col2, col3, col4 = st.columns(4)
col1.metric("Flagged", len(at_risk))
col2.metric("Emails drafted", len(emails))
col3.metric("Slots scheduled", len(schedule))
col4.metric("Sent (mock)", len(st.session_state.get("sent_emails", {})))

st.subheader("📊  HOD Summary")
st.markdown(report if report and report.strip() else "_No report generated._")

if schedule:
    st.subheader("📅  Proposed mentoring slots")
    st.dataframe(pd.DataFrame(schedule), use_container_width=True, hide_index=True)

# ---------- Email review & send (mock) ----------
st.divider()
st.subheader("📬  Drafted Emails  —  Review before sending")

if "sent_emails" not in st.session_state:
    st.session_state["sent_emails"] = {}

for e in emails:
    name = e["student"]
    sent_at = st.session_state["sent_emails"].get(name)
    label = (f"✅  Sent to parent of  {name}  ({sent_at})"
             if sent_at else f"📨  Pending — parent of  {name}")
    with st.expander(label, expanded=False):
        st.text_area(
            "Email body (edit before sending)",
            value=e["body"],
            height=200,
            key=f"email_{name}",
            disabled=bool(sent_at),
        )
        if sent_at:
            st.success(f"✅  Email sent (mock) at {sent_at}")
        else:
            if st.button("📤  Send (mock)", key=f"send_{name}",
                         help="In a real system this would call your email API."):
                st.session_state["sent_emails"][name] = \
                    datetime.now().strftime("%H:%M:%S")
                st.toast(f"📤  Email sent to parent of {name}!", icon="✅")
                st.rerun()

# Bulk send
pending = [e["student"] for e in emails
           if e["student"] not in st.session_state["sent_emails"]]
if pending:
    if st.button(f"📨  Send ALL remaining ({len(pending)}) (mock)"):
        now = datetime.now().strftime("%H:%M:%S")
        for name in pending:
            st.session_state["sent_emails"][name] = now
        st.toast(f"📨  Sent {len(pending)} emails!", icon="✅")
        st.rerun()
else:
    st.success(f"✨  All {len(emails)} emails sent. "
               "Four agents did the legwork — you stayed in the loop.")
