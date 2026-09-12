# 🎓 Facilitator Cheat Sheet — Day 1, Part 1: Intro to AI

**Mantra:** Every 8–10 mins → leave the slides, do something LIVE.
**Goal:** Faculty *discover* concepts. They don't just hear them.

---

## ⏱️ Flow at a glance

| # | Slide | Time | Mode | What you do |
|---|---|---|---|---|
| 1 | Title | 1m | Slide | Welcome + 1 personal line |
| 2 | Agenda | 1m | Slide | Promise: *"You'll know how AI thinks"* |
| 3 | What is AI? | 4m | **🎤 One-word round** | "AI in one word" |
| 4 | AI/ML/DL/GenAI | 7m | **✍️ BOARD** | Draw nested boxes live |
| 5 | How LLMs think | 5m | **🎯 Predict-the-word** | "The cat sat on the ___" |
| 6 | How it got smart | 3m | **🎲 Guess + reveal** | Books / data scale |
| 7 | Why now? | 3m | **✋ Finger vote** | Algo / data / GPU |
| 8 | What it's great at | 5m | **👥 Pair-share** | "3 tasks AI can help with" |
| 9 | Prompts | 5m | **✏️ Rewrite game** | Fix a bad prompt |
| 10 | Tokens & context | 3m | **🔢 Hand-count tokens** | Sentence on board |
| 11 | Use cases | 2m | Slide | Echo back pair-share answers |
| 12 | Mindset shift | 3m | **❓ Calculator question** | Calculators ≠ lazy |
| 13 | Bridge to demo | 2m | Slide | Hand off |

---

## ✍️ THE BIG BOARD MOMENT — Slide 4 (AI / ML / DL / GenAI)

> **Say first:** *"Close your laptops. Don't look at the screen. Let's build this together on the board."*

### Draw exactly this — use 4 different colour markers:

```
   ┌──────────────────────────────────────────────────────┐
   │  AI  — any machine doing something "smart"           │  ← BLUE
   │                                                      │
   │     ┌──────────────────────────────────────────┐     │
   │     │  ML  — AI that LEARNS from data          │     │  ← GREEN
   │     │                                          │     │
   │     │     ┌──────────────────────────────┐     │     │
   │     │     │  DL  — ML with brain-like    │     │     │  ← PURPLE
   │     │     │       layers (neural nets)   │     │     │
   │     │     │                              │     │     │
   │     │     │     ┌────────────────────┐   │     │     │
   │     │     │     │  GenAI             │   │     │     │  ← RED/ORANGE
   │     │     │     │  CREATES new       │   │     │     │
   │     │     │     │  text/image/code   │   │     │     │
   │     │     │     │                    │   │     │     │
   │     │     │     │  ⭐ ChatGPT here   │   │     │     │
   │     │     │     └────────────────────┘   │     │     │
   │     │     └──────────────────────────────┘     │     │
   │     └──────────────────────────────────────────┘     │
   └──────────────────────────────────────────────────────┘
```

### The script while you draw — DO IT IN THIS ORDER

| Draw | Say | Ask the room |
|---|---|---|
| 🟦 Outer box → **AI** | *"AI is the umbrella. ANY machine doing something 'smart'."* | *"One AI thing you used TODAY?"* — collect: Maps, autocorrect, Netflix, YouTube |
| 🟩 Inner → **ML** | *"Some AI is hand-coded rules. ML is AI that LEARNS from examples."* | *"How does Gmail know what's spam?"* → "It learned from millions of marked emails" |
| 🟪 Inside → **DL** | *"ML stacked in layers like the brain — edges → shapes → faces."* | *"What unlocks your phone?"* → Face recognition = DL |
| 🟧 Innermost → **GenAI** | *"DL that doesn't just CLASSIFY — it CREATES. Text, images, code, music."* | *"What's NEW about ChatGPT vs spam filter?"* → "It generates" |
| Step back. Tap each box. | *"So… is ChatGPT AI? Is it ML? Is it Deep Learning? Is it GenAI?"* | *(Wait. Pause. Let them figure it out.)* |
| **Punchline** | *"It's ALL FOUR. Nested. That's why people use the words interchangeably — not wrong, just imprecise."* | |

### 🎁 Backup analogies (if room is energetic):

- **AI is the city. ML is a neighbourhood. DL is a street. GenAI is the famous café on that street.**
- **Russian dolls.** Each one fits inside the bigger one.
- **A square is a rectangle is a quadrilateral is a shape.** Same logic.
- **Animal → Mammal → Dog → Labrador.** Every Labrador is a dog, a mammal, an animal.

### 🧠 What "nested" really means — the killer one-liner

> *"Every GenAI is Deep Learning. Every Deep Learning is ML. Every ML is AI."*
> *"But NOT every AI is GenAI. The chess engine that beat Kasparov was AI, but no GenAI."*

---

### 📺 ⭐ THE YOUTUBE EXAMPLE — use this, faculty will NEVER forget

> **Open line:** *"You all use YouTube, right? Let me show you ALL FOUR types of AI hiding inside ONE app."*

Draw a phone outline on the board with a YouTube logo. Then point to each thing as you say it:

| Where it shows up in YouTube | Which type? | Why |
|---|---|---|
| 🔴 **Auto-generated captions / subtitles** | **AI** (speech recognition) | A "smart" machine task — could be old-school rules + ML |
| 📊 **Recommendations on your home feed** | **ML** | Learned from billions of watch patterns. *"Why does YouTube know you love cricket clips?"* — it learned. |
| 🎯 **Thumbnail selection / auto-detect inappropriate content** | **DL** | Neural networks looking at images frame-by-frame |
| ✨ **"AI-generated summary" of long videos, auto-dubbing into Hindi** | **GenAI** | Creating NEW text & speech that didn't exist before |

### 📜 The full script — say this exactly:

> *"You open YouTube. Four AIs hit you in 4 seconds."*
>
> *"1. The home feed shows YOUR videos — not mine. That's **ML**. It LEARNED your taste from what you clicked, paused, skipped."*
>
> *"2. You tap a video. Captions appear automatically — even for Tamil, Hindi, English. That's **AI** doing speech-to-text."*
>
> *"3. The thumbnail you saw? YouTube tested 5 thumbnails using **Deep Learning** to pick the one most likely to make YOU click."*
>
> *"4. Now there's a button that says 'Summarise this video' or 'Dub into Hindi'. That's **GenAI** — creating something NEW."*
>
> *"All four. One app. You've been using all four AI types without knowing the names."*

### 🎯 Make it interactive — questions to ask the room:

| Ask | Expected answer | Your follow-up |
|---|---|---|
| *"Why does YouTube recommend cricket to me but cooking to my wife?"* | "It learned from us." | *"Exactly. That's ML."* |
| *"How does YouTube auto-add captions even for accents?"* | "Some AI listens" | *"Yes — deep learning trained on millions of hours of audio."* |
| *"What's NEW that wasn't possible 2 years ago on YouTube?"* | "AI summaries / Hindi dub / Shorts auto-edit" | *"That's GenAI. It CREATES, not just classifies."* |

### 🔥 The closing punch:

> *"Next time someone says 'AI is the future' — tell them: it's already in your pocket, in YouTube, doing 4 jobs simultaneously. We're just now learning the names."*

### 💡 Other "ONE app, ALL four" examples (if you want variety):

| App | AI | ML | DL | GenAI |
|---|---|---|---|---|
| **YouTube** | Auto-captions | Recommendations | Thumbnail/content detection | Summaries, dubbing |
| **Google Maps** | Route logic | Traffic prediction | Lane detection from satellite | "Hey, draft directions for me" |
| **WhatsApp** | Read receipts logic | Suggested replies | Photo enhancement | Meta AI chat |
| **Instagram** | Hashtag suggestions | Feed ranking | Face filters | Image generation in Stories |
| **Gmail** | Spam folder | Priority inbox | Phishing image detection | "Help me write" |

Pick the one your audience uses most.

---

## 🎤 Other interactive moments — full scripts

### Slide 3 — One-word round
> *"In ONE word — what does AI mean to you? Let's go around. No wrong answers."*

Write all words on board → circle the patterns (learn / predict / generate / automate).
> *"Your definitions, put together, ARE the textbook definition."*

---

### Slide 5 — Predict-the-word (the BEST 5 minutes of the session)

Write on the board, one at a time:

```
1.  "The cat sat on the ____"               →  take 5 answers
2.  "The professor walked into the ____"    →  totally different answers
3.  "ROI calculation in Excel uses the ____" →  finance folks fill in
```

> *"Why did your brains predict DIFFERENTLY each time?"*

Answer they'll give: **CONTEXT.**
> *"That's literally what an LLM does. A context-aware next-word predictor — trained on the entire internet."*

🔥 **Killer follow-up:** *"Now imagine doing this for the next 500 words in a row. That's how ChatGPT writes an essay."*

---

### Slide 6 — Guess + reveal (scale shock)

Take guesses BEFORE revealing:

| Question | Answer |
|---|---|
| How many books does GPT-4 "know"? | ~ every book ever published, multiple times |
| How long would a human take to read GPT's training data? | ~ 22,000+ years non-stop |
| GPUs to train it? | ~ 25,000 H100s for months. **$100M+ in compute** |

Punchline: *"That's why YOU can't train one. But you CAN use one. That's the gift."*

---

### Slide 7 — Finger vote (Why now?)

> *"Three things caused the AI boom. Vote with fingers — which one?"*

On count of 3, raise:
- ☝️  1 = better algorithms (Transformer, 2017)
- ✌️  2 = more data (the internet)
- 🤟  3 = faster GPUs (NVIDIA)

Count hands. → Reveal: **all three multiplied together.**
> *"Take away ONE and ChatGPT doesn't exist. That's why 'why now?' is the right question."*

---

### Slide 8 — Pair-share

> *"Turn to the person next to you. 2 minutes. List 3 tasks in YOUR weekly work involving: writing, summarizing, explaining, or organizing."*

Set a real timer. Then:
> *"4 pairs — share your favourite."*

You now have a *room-specific* use-case list. Use these in Part 2.

---

### Slide 9 — Prompt rewrite game

Write on board:

```
BAD:   "Write something about AI"
GOOD:  "Write a 5-line intro to AI for first-year ECE
        students, simple English, with 1 analogy."
```

Then give them a bad prompt:
> *"Bad prompt: Make a quiz. Anyone — make it better. Shout it out."*

Take 2–3 improvements. Compare. Crown the winner.

**Teach the formula:** **Audience + Format + Constraint + Tone.**

---

### Slide 10 — Token hand-count

Write:
```
"Faculty members are amazing."
```

> *"How many tokens? Vote: 3, 4, 5, 6, 7?"*

Reveal: ~6.
> *"You're charged per token. This sentence ≈ ₹0.002. The whole Mahabharata ≈ ₹400."*

---

### Slide 12 — Calculator moment (the closer)

Stand still. Lower voice.
> *"When calculators arrived in classrooms — did they make mathematicians LAZY, or more POWERFUL?"*

Wait. Let answers come.
> *"Same question. AI and teachers."*

Pause. **Don't** fill the silence. Let it land. Move on.

---

## 🌟 BONUS interactive ideas (sprinkle anywhere)

### 1. **"Spot the AI"** — warm-up before Slide 3
Show 4 short text snippets. 2 human, 2 AI. Faculty vote which is which.
*Even experts get fooled. Sets up the entire session.*

### 2. **Live ChatGPT race** — between Slide 8 and 9
> *"Watch this. I'll ask AI for a 5-question MCQ on photosynthesis. Time it."*

Type live. Stopwatch.
> *"15 seconds. How long would this take you? 20 minutes? That's the gift."*

### 3. **"Knows / Doesn't Know" sorting** — perfect bridge to RAG later
Two columns on board: **KNOWS** | **DOESN'T KNOW**

Throw items, they shout the column:
- Pythagoras theorem → KNOWS
- Today's news → DOESN'T KNOW
- Your college's exam dates → DOESN'T KNOW
- How to write a sonnet → KNOWS
- Your students' marks → DOESN'T KNOW

→ Beautifully sets up RAG (Day 1 Part 3) and Agents (Day 2).

### 4. **"Stump the AI"** — energy lift
> *"Anyone — give me a question you think AI will fail on."*

Try it live. Either it succeeds (wow) or fails (great teaching moment about limits).

### 5. **The 30-second silent demo**
After Slide 12, before bridge — open ChatGPT, type:
> *"Explain the LIC IPO to a 10-year-old using a story about a fruit shop."*

Read silently. No commentary. Close it. Say one word: *"Imagine."*

### 6. **Show your phone** — "AI is already here"
> *"My phone took this photo. It picked the best of 10 shots, blurred the background, identified my dog by name, and suggested where to send it. That was 4 AI models in 1 click."*

### 7. **Roleplay: "You are the LLM"**
Pick a friendly faculty. Whisper *"…on the mat."*
Ask the room: *"The cat sat on the…"* Volunteer says *"mat."*
> *"Congratulations, you're now ChatGPT-0.1."*

### 8. **The "AI Timeline Walk"** — physical activity
Stick 5 sticky notes across one wall: **1950, 1990, 2012, 2017, 2022**.
Ask faculty to walk to where they think these happened:
- "Spam filters first worked" → ~1990
- "AI beat humans at image recognition" → ~2012
- "The Transformer was invented" → ~2017
- "ChatGPT launched" → Nov 2022

Then walk through the timeline with them. Sets up "Why NOW?" beautifully.

### 9. **The "AI Confidence Meter"** — start AND end of session
Print or draw a 1–10 scale.
- Start: *"On a scale of 1–10, how comfortable are you with AI?"* — count hands.
- End: *Same question.* Watch the shift.
Tangible proof of impact. Great for feedback report too.

### 10. **One bold prediction** — closing ritual
> *"On a sticky note: write ONE way you'll use AI in your work this week. Stick it on the wall as you leave."*

You get artifacts. They get commitment.

---

## 🚨 Energy rescue kit

| If… | Do this |
|---|---|
| Eyes glazing | **Turn off projector.** Walk to board. |
| Silent room | Start with yes/no hand-raise — easiest entry |
| Too many questions | "Parking lot" on board, answer at end |
| One person dominating | *"Let's hear from someone who hasn't spoken yet"* |
| Running over time | Skip Slide 10 (tokens). Most skippable. |
| Energy crash post-lunch | **Roleplay (#7)** or **Stump the AI (#4)** |

---

## 💬 Quotables to drop naturally

- *"Don't take notes. I'll send slides. Just watch."*
- *"This field is 3 years old. Nobody is an expert."*
- *"You don't need to code. You need to think clearly."*
- *"AI doesn't replace teachers. It replaces teachers who don't use AI."*
- *"Today you'll go from confused → curious. That's enough."*
- *"The best prompt is the one that explains it to a smart intern."*
- *"Treat AI like a brilliant junior — capable, fast, sometimes wrong."*

---

## ✅ Pre-session checklist

- [ ] Whiteboard markers — **4 colours** (blue, green, purple, red/orange)
- [ ] Eraser within reach
- [ ] ChatGPT / Copilot tab open and logged in
- [ ] Stopwatch on phone
- [ ] Practiced the nested diagram once on paper
- [ ] Sticky notes for #10 (closing ritual)
- [ ] Printed this sheet
- [ ] Water bottle 💧

---

**Print this. Keep it on the podium. Glance, don't read.**
