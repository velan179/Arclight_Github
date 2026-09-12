# 📚 Faculty Prompt Library — Starter Pack

> 10 prompts you can use **on Monday morning**. Copy → replace the `[SQUARE BRACKETS]` with your subject → paste into ChatGPT / Gemini / Claude / your local Llama.

**The Golden Rule of Prompts — CRISP:**
- **C**ontext: who are you, who are the students
- **R**ole: what role should the AI play
- **I**nstruction: what exactly do you want
- **S**pecifics: format, length, level, constraints
- **P**roof: ask for examples / show your reasoning

---

## ✏️ 1. Question Paper Generator

```
You are an experienced [SUBJECT] professor setting an end-semester exam
for [YEAR + BRANCH, e.g., 3rd year ECE] students.

Generate a question paper with:
- 2 marks × 10 questions (definitions, short answers)
- 6 marks × 5 questions (problem solving)
- 12 marks × 3 questions (long answer / design)

Topics to cover: [LIST 4-6 UNITS / TOPICS]
Bloom's taxonomy mix: 30% remember, 40% apply, 30% analyse.
Avoid repetition with last year (I'll paste it below if you ask).

Output as a clean exam paper with marks marked, total = 100, time = 3 hours.
```

---

## ✏️ 2. Rubric-Based Answer Evaluator

```
You are a strict but fair examiner for [SUBJECT].

Question: [PASTE THE QUESTION]
Maximum marks: [10]
Model answer / key points expected:
1. [POINT 1]
2. [POINT 2]
3. [POINT 3]

Student's answer:
"""
[PASTE STUDENT ANSWER]
"""

Evaluate using this rubric and respond in this format:
- Marks awarded: X / 10
- Breakdown: point-by-point with marks earned
- What was missing
- What was good
- 1-line feedback the student can act on
```

---

## ✏️ 3. Lesson Plan Generator

```
You are a curriculum designer. Build a 50-minute lesson plan on
[TOPIC] for [YEAR + BRANCH] students.

Constraints:
- They already know: [PREREQUISITE TOPICS]
- They struggle with: [COMMON DIFFICULTY]
- Resources available: blackboard, projector, [ANY LAB EQUIPMENT]

Output as a table:
| Time | Activity | What teacher does | What students do | Material |

Include:
- 1 hook / attention-grabber in the first 5 minutes
- 1 active learning moment (pair-share / poll / think-aloud)
- 1 real-world example from Indian context
- An exit-ticket question (1 min) to check understanding
```

---

## ✏️ 4. MCQ Generator from Notes

```
I'm pasting my lecture notes below. Generate 15 multiple-choice questions:
- 5 easy (recall)
- 7 medium (concept application)
- 3 hard (analysis / multi-step)

Each MCQ must have:
- 1 question stem (clear, no negatives)
- 4 options (only 1 correct; distractors must be plausible)
- Correct answer marked
- A 1-line explanation of why it's correct

Notes:
"""
[PASTE 1-2 PAGES OF NOTES]
"""
```

---

## ✏️ 5. "Explain Like I'm 12" — Concept Simplifier

```
Explain [CONCEPT] to a 12-year-old who is curious but has zero background.

Use:
- An everyday analogy from Indian student life (cricket, dosa, auto-rickshaw, etc.)
- No jargon. If you must use a technical word, define it inline.
- A short story (3-4 sentences) where the concept solves a real problem.
- End with: "So in one line, [CONCEPT] is …"
```

---

## ✏️ 6. Student Doubt Responder (Empathetic)

```
You are a patient [SUBJECT] tutor. A student has asked this doubt:

"""
[PASTE STUDENT DOUBT]
"""

Respond:
1. Acknowledge what they got right (always find something).
2. Identify the exact misconception in one sentence.
3. Give the correct explanation with a worked example.
4. End with a 1-question check: "Try this and tell me what you get: …"

Tone: encouraging, never condescending. Max 200 words.
```

---

## ✏️ 7. Lecture Summariser (for Absent Students)

```
Below are my raw lecture notes / transcript from today's [SUBJECT] class.

Produce a 1-page student handout with:
- 📌 Topics covered (bullets)
- 🔑 Key formulas / definitions (boxed)
- 💡 Worked example (1)
- ❓ 3 self-check questions
- 📚 What to read for next class

Tone: friendly, written for a student who missed class.

Notes:
"""
[PASTE NOTES OR TRANSCRIPT]
"""
```

---

## ✏️ 8. Project Idea Generator

```
Suggest 10 project ideas for [YEAR + BRANCH] students in [SUBJECT].

For each idea, give:
- Title (catchy, 5-8 words)
- 2-line problem statement
- Tech / tools required
- Difficulty: Beginner / Intermediate / Advanced
- Real-world impact (who benefits)
- Estimated duration

Mix: 4 beginner, 4 intermediate, 2 advanced.
Bias towards Indian local problems (rural health, agriculture, traffic, education).
Avoid clichés (no "Smart Mirror", no generic chatbot).
```

---

## ✏️ 9. Email Drafter (Parent / Student / Admin)

```
Draft an email from me (a [SUBJECT] faculty at [COLLEGE]) to a [parent / student / HOD]
about the following situation:

"""
[DESCRIBE IN 2-3 LINES — e.g., "Student has missed 6 classes, marks dropping,
need to inform parent and call them for a meeting"]
"""

Tone: professional, empathetic, action-oriented.
Length: 120-150 words.
Include: clear subject line, specific next step, my contact line.
Do NOT sound robotic or guilt-trip the reader.
```

---

## ✏️ 10. Research Paper Digest

```
I'll paste a research paper abstract / introduction below. Give me:

1. **In one sentence:** what this paper is really about
2. **Problem they're solving:** (2 lines)
3. **Their approach:** (3 bullets)
4. **Why it matters:** (1-2 lines)
5. **What I should read next:** suggest 2 related papers/topics
6. **Classroom angle:** how can I use this in a UG lecture?

Paper:
"""
[PASTE ABSTRACT / INTRO]
"""
```

---

## 🎯 Your Homework Before You Leave Today

Pick **3 prompts above**. Customise them for *your* subject. Run each one. Save the best output.

By 4 PM, share your **best prompt + best output** with your neighbour.

The 3 best ones get to share with the whole room.

---

## 🧠 Pro Tips (Learned the Hard Way)

| Tip | Why |
|---|---|
| **Give an example** in the prompt | "Few-shot" beats "zero-shot" almost always |
| **Specify the format** | "As a table" / "As markdown" / "150 words" — never leave it open |
| **Iterate, don't restart** | If output is 80% right, say *"Keep everything, change only the tone to formal"* |
| **Use Indian context** | AI defaults to American examples. Force it: *"Use Indian college examples"* |
| **Ask for reasoning** | Add *"Think step by step before answering"* for math/logic |
| **Never paste student PII** | No roll numbers, no full names, no marks linked to identity → into public AI |

---

## 🔐 What NOT to paste into public AI

- ❌ Student names, roll numbers, marks together
- ❌ Unpublished research / IP
- ❌ Confidential institutional documents
- ❌ Anything you wouldn't write on a public board

For these → use the **local Ollama** we installed this morning. 🦙
