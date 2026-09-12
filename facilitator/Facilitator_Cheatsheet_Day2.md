# 🎓 Facilitator Cheat Sheet — Day 2

**Mantra:** Day 1 was *learning*. Day 2 is *playing + producing*.
**Goal:** Every faculty walks out with (a) AI running on their laptop, (b) a personal prompt library, (c) one committed use-case for their course.

> Day 1 already covered: Intro to AI, RAG, Agentic AI deck (slides 1–11, 13–15.x), Open LLMs.
> Day 2 picks up where the *code* stopped and shifts to *experience + commitment*.

---

## ⏱️ Flow at a glance

| Time | Block | Mode | Energy |
|---|---|---|---|
| 09:30 – 10:45 | **Open LLM lab** (Ollama install + first chat) | 💻 Hands-on | Focused |
| 10:45 – 11:00 | ☕ Break | — | — |
| 11:00 – 11:30 | **Slide 12 — Multi-agent LIVE demo** | 🎬 Demo | High |
| 11:30 – 12:30 | **AI Petting Zoo** (8 stations, rotate) | 🎪 Play | Loud, fun |
| 12:30 – 13:30 | 🍴 Lunch | — | — |
| 13:30 – 14:45 | **Build Your Course Toolkit** (prompt library) | ✍️ Produce | Focused |
| 14:45 – 15:00 | ☕ Break | — | — |
| 15:00 – 15:45 | **"Spot the AI"** game + ethics discussion | 🎯 Game | Loud |
| 15:45 – 16:30 | **"AI in My Subject"** showcase (2 min each) | 🎤 Commit | Personal |
| 16:30 – 17:00 | Closing, roadmap, feedback | 💬 Reflect | Calm |

---

## 🌅 MORNING

### Block A — Open LLM Lab (75 min)

Use [LAB_ROLLOUT_LOCAL_LLM.md](LAB_ROLLOUT_LOCAL_LLM.md) as the script. Target:

1. Install Ollama on each laptop (Windows installer pre-staged on USB)
2. `ollama pull llama3.2:3b` (small enough for any laptop)
3. `ollama run llama3.2:3b` — first chat from CLI
4. Open [local_llm_chat.py](local_llm_chat.py) → run it → chat from Python
5. **Side-by-side moment:** ask the same question to ChatGPT *and* the local model. Faculty *feel* the trade-off (privacy vs power).

**Pitfalls to pre-empt:**
- Antivirus blocks Ollama → whitelist before session
- No GPU laptops → stick to 3B models, set expectations
- Disk space → each model ~2 GB, clean old downloads

**Closing line:** *"This model is yours. No internet, no API key, no data leaves your laptop. Now let's see what it can do in a team."*

### Block B — Multi-Agent Demo, Slide 12 (30 min)

- Run [faculty_multiagent.py](faculty_multiagent.py) **live**.
- Narrate the ReAct loop out loud: *"See — the agent is thinking, picking a tool, observing, thinking again."*
- Show the agent failing once (wrong tool / hallucinated answer) on purpose if it happens. **Don't hide it.** That's the lesson.

---

## 🎪 PETTING ZOO (60 min) — Switch the Energy

See [Day2_Petting_Zoo_Stations.md](Day2_Petting_Zoo_Stations.md) for printable station cards.

**Setup:**
- 8 stations, A4 card at each with: Tool name • What it does • 1 prompt to try • QR code / URL
- Groups of 3–4, rotate every 7 min, you ring a bell
- No instruction — just *play*

**Stations:**
1. NotebookLM — turn a PDF into a podcast
2. ChatGPT vs Gemini vs Claude — same prompt, compare
3. Perplexity — research with citations
4. Gamma / Napkin AI — text → slides / diagrams
5. Suno — generate a course jingle
6. Ideogram — text → image for lecture
7. HuggingChat / LM Studio — open models with UI
8. GitHub Copilot — watch code get written

**Debrief (5 min at end):**
- "Which station surprised you?"
- "Which one will you use this week?"

---

## ✍️ AFTERNOON — Block C: Build Your Course Toolkit (75 min)

See [Day2_Prompt_Library.md](Day2_Prompt_Library.md) for the starter pack.

**The pitch:** *"By 3 PM, you'll have 5 prompts you can use Monday morning."*

**Flow:**
| Min | Activity |
|---|---|
| 0–10 | You demo: take a *bad* prompt → make it *great* live on ChatGPT. Show before/after output. |
| 10–20 | Hand out the [prompt library](Day2_Prompt_Library.md). Walk through the 5 templates. |
| 20–60 | **Solo work:** each faculty picks 3 templates, customises for *their* subject. They run them on ChatGPT/Gemini/local LLM and tune. |
| 60–75 | **Pair-share:** show your best prompt + output to your neighbour. Best 3 pairs share with the room. |

**Output:** every faculty leaves with a personal `my_prompts.md` (give them a USB or Google Doc link).

---

## 🎯 AFTERNOON — Block D: "Spot the AI" Game (45 min)

See [Day2_Spot_The_AI.md](Day2_Spot_The_AI.md) for the rounds + answer key.

**Format:**
- 8 rounds, each round shows 2 items (A and B) — one human, one AI
- Faculty vote A / B with raised fingers
- You reveal answer + discuss for 1–2 min

**Categories:**
1. Essay paragraph (history)
2. Code (Python function)
3. Research paper abstract
4. Poem
5. Photo vs AI image (faces)
6. Photo vs AI image (landscapes)
7. Student answer to a physics question
8. Email to a parent

**Discussion prompts (last 10 min):**
- Where did your detection break down?
- If *you* can't tell, can your students?
- What does this mean for assignment design?

---

## 🎤 AFTERNOON — Block E: "AI in My Subject" Showcase (45 min)

The commitment block. Each faculty gets **exactly 2 minutes** at the mic to share:

> *"One way I'll use AI in my course next semester — and one risk I'll watch out for."*

**Rules:**
- 2 min hard stop (you ring a bell)
- No slides, just talk
- You write each idea on the whiteboard in 4 columns:
  - Content creation
  - Assessment
  - Student support
  - Research

**Why this works:** public commitment → higher follow-through. Whiteboard becomes the institutional roadmap.

---

## 💬 CLOSING (30 min)

| Min | Item |
|---|---|
| 0–5 | Photo of the whiteboard (the roadmap) |
| 5–15 | **When to use what** — quick decision tree on board: *Prompt only → RAG → Agent → Fine-tune* |
| 15–20 | **Ethics one-liners**: attribution, hallucination check, no student data to public APIs, redesign assessment |
| 20–25 | **What's next at our institution**: who owns the GPU box, internal prompt-sharing channel, follow-up session in 4 weeks |
| 25–30 | Feedback form (QR code) + thank you |

**Closing line:** *"You came in scared of AI. You're leaving with AI on your laptop and 5 prompts in your pocket. Now go use it on Monday."*

---

## 🎒 Pre-flight checklist

- [ ] Ollama installer on every laptop / USB
- [ ] Wi-Fi tested with 30+ devices
- [ ] Petting Zoo cards printed × 2 sets (so 2 groups can rotate)
- [ ] Prompt Library handout printed or shared as Google Doc
- [ ] "Spot the AI" slides ready (10 slide deck — generate from sample pairs)
- [ ] Whiteboard markers × 4 colours
- [ ] Bell / timer for rotations
- [ ] Feedback form QR code printed A4
- [ ] Backup: ChatGPT free account for those whose Ollama fails

---

## 🆘 If you run short on time — drop in this order

1. Drop "Spot the AI" → keep showcase (commitment > game)
2. Drop closing decision tree → keep ethics one-liners
3. **Never drop the showcase.** It's the takeaway.
