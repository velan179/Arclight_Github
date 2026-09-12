# 🎓 AI Faculty Assistant — Workshop Kit

A 2-day hands-on workshop for college faculty on Generative AI, RAG, Agents, and
running Open-source LLMs locally. Includes Streamlit demo apps, ready-to-present
slide decks, facilitator cheat-sheets, prompt libraries, and lab scripts.

> Everything you need to **run the workshop end-to-end** — code, slides, scripts,
> and the talk-track.

---

## 📁 Repository layout

```
AI-Faculty-Assistant/
├── apps/                ← Streamlit demo apps faculty interact with
│   ├── app.py                       — basic GPT chat over an uploaded Excel
│   ├── psg_result_analysis.py       — result-analysis dashboard + GPT insights
│   ├── hits_leave_app.py            — policy bot (leave policy assistant)
│   ├── policybot_rag.py             — RAG over a policy PDF
│   ├── local_llm_chat.py            — Local LLM chat + file upload (Ollama)
│   └── faculty_multiagent.py        — Multi-agent demo (Analyst→Mentor→Scheduler)
│
├── data/                ← Sample data used by the apps
│   ├── students.xlsx
│   ├── students_advanced_sample.xlsx
│   └── Faculty_Handbook.pdf
│
├── slides/              ← Ready-to-present PowerPoint decks
│   ├── Day1_Part1_Intro_to_AI.pptx
│   ├── AI_Faculty_Assistant_Day1_Part2.pptx
│   ├── Day1_Part3_RAG.pptx
│   ├── Day2_Agentic_AI.pptx
│   └── generators/                  — Python scripts that build the decks
│
├── facilitator/         ← Talk-track, prompts, lab scripts
│   ├── Facilitator_Cheatsheet_Day1_Part1.md
│   ├── Facilitator_Cheatsheet_Day2.md
│   ├── LAB_ROLLOUT_LOCAL_LLM.md
│   ├── Day2_Prompt_Library.md
│   ├── Day2_Petting_Zoo_Stations.md
│   └── Day2_Spot_The_AI.md
│
├── SETUP.md             ← Environment setup (Python, Ollama, OpenAI key)
├── requirements.txt
├── LICENSE              ← MIT
└── README.md
```

---

## 🚀 Quick start

### 1. Clone and set up Python

```powershell
git clone <your-repo-url>
cd AI-Faculty-Assistant

py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. (Cloud demos) Set your OpenAI key

```powershell
$env:OPENAI_API_KEY = "sk-..."
```

### 3. (Local demos) Install Ollama and pull a model

Download Ollama from <https://ollama.com>, then:

```powershell
ollama pull llama3.2:3b      # ~2 GB, runs on CPU
# Optional alternatives
ollama pull gemma2:2b
ollama pull qwen2.5:3b
```

### 4. Run any demo

```powershell
py -m streamlit run apps\local_llm_chat.py
py -m streamlit run apps\psg_result_analysis.py
py -m streamlit run apps\policybot_rag.py
py -m streamlit run apps\faculty_multiagent.py
py -m streamlit run apps\hits_leave_app.py
py -m streamlit run apps\app.py
```

Each app opens at <http://localhost:8501>.

---

## 🎯 Demo-by-demo guide

| App | What it shows | Needs |
|---|---|---|
| [apps/app.py](apps/app.py) | Upload Excel → ask questions in English | OpenAI |
| [apps/psg_result_analysis.py](apps/psg_result_analysis.py) | Upload student marks → charts + GPT insights | OpenAI |
| [apps/hits_leave_app.py](apps/hits_leave_app.py) | Policy assistant (prompted GPT, no RAG) | OpenAI |
| [apps/policybot_rag.py](apps/policybot_rag.py) | RAG over `Faculty_Handbook.pdf` | OpenAI |
| [apps/local_llm_chat.py](apps/local_llm_chat.py) | **Local** chat + upload PDF/DOCX/TXT and ask | Ollama |
| [apps/faculty_multiagent.py](apps/faculty_multiagent.py) | Analyst → Mentor → Scheduler multi-agent loop | OpenAI |

> Sample data lives in [data/](data/) — point each app's file-uploader to it.

---

## 🗓️ Workshop flow

### Day 1 — Foundations
- **Part 1:** Intro to AI / ML / DL / GenAI — [slides](slides/Day1_Part1_Intro_to_AI.pptx) · [cheatsheet](facilitator/Facilitator_Cheatsheet_Day1_Part1.md)
- **Part 2:** Live demos on faculty data — [slides](slides/AI_Faculty_Assistant_Day1_Part2.pptx)
- **Part 3:** RAG explained + live — [slides](slides/Day1_Part3_RAG.pptx)
- **Part 4 (bonus):** Open LLMs & cost reality — [slides](slides/Day2_Agentic_AI.pptx) §15.x

### Day 2 — Hands-on & Application
- **Morning:** Local LLM lab ([script](facilitator/LAB_ROLLOUT_LOCAL_LLM.md)) + multi-agent demo
- **Afternoon:** Build-your-prompt-library, "Spot the AI" game, "AI in My Subject" showcase
- See: [Day 2 cheatsheet](facilitator/Facilitator_Cheatsheet_Day2.md)

---

## 🔄 Regenerating slide decks

The `.pptx` files are reproducible from Python:

```powershell
cd slides\generators
py generate_intro_ai.py
py generate_rag.py
py generate_agentic_ai.py
py generate_presentation.py
py generate_sample_pdf.py   # rebuilds data\Faculty_Handbook.pdf
```

Outputs land next to the generator scripts; move them up to `slides/` as needed.

---

## 🔐 Privacy & safety notes for faculty

- **Cloud apps (OpenAI)** — do *not* paste student names + roll numbers + marks together
- **Local apps (Ollama)** — fully offline, safe for sensitive data
- See [Day2_Prompt_Library.md → "What NOT to paste"](facilitator/Day2_Prompt_Library.md)

---

## 📜 License

MIT — see [LICENSE](LICENSE). Slides, code, and facilitator material are free to
adapt and reuse for educational purposes. Attribution appreciated.

---

## 🤖 ResolveFlow — Hackathon Application

> **PS5 — Autonomous Customer Resolution Agent**
>
> ResolveFlow is a hackathon project built on top of this workshop kit.
> It lives in an isolated subdirectory and does **not** affect the workshop materials above.

See → **[resolveflow/README.md](resolveflow/README.md)** for full setup and development instructions.
