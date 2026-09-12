# 🚀 Setup & Run Guide — AI Faculty Assistant Workshop

A simple, copy-paste guide to install and run all the demos.
No virtual environment needed. Tested on Windows + PowerShell.

---

## 🔧 One-time setup

```powershell
# 1. Install Python 3.10+ from https://www.python.org/downloads/
#    ✅ Tick "Add Python to PATH" during install

# 2. Open the project folder
cd "C:\Projects\AI Faculty Assistant"

# 3. Install all Python packages
py -m pip install streamlit openai ollama python-pptx pypdf chromadb sentence-transformers langchain langchain-community python-dotenv reportlab

# 4. Install Ollama from https://ollama.com/download

# 5. Pull a small local model
ollama pull gemma2:2b
```

---

## 🔑 API key (only for cloud demos)

Create a `.env` file in the project folder with this single line:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

Quick way:

```powershell
notepad .env
```

---

## ▶️ Run each demo

```powershell
# Demo 1 — AI Faculty Assistant (Day 1, Part 2)
py -m streamlit run app.py

# Demo 2 — PolicyBot / RAG (Day 1, Part 3)
py -m streamlit run policybot.py

# Demo 3 — Local LLM Chat (Day 2 — fully offline, no API key)
py -m streamlit run local_llm_chat.py

# Demo 4 — Faculty Agent / Agentic AI (Day 2)
py -m streamlit run faculty_agent.py
```

Each command opens the demo in your browser at **http://localhost:8501**.
Press **Ctrl + C** in the terminal to stop.

---

## 🧰 Extras

```powershell

# Check installed Ollama models
ollama list

# Try other small local models
ollama pull phi3:mini
ollama pull llama3.2:3b
```

---

## 🛑 Common fixes

| Problem | Fix |
|---|---|
| `streamlit not found` | `py -m pip install streamlit` |
| `ollama` demo can't connect | Run `ollama serve` in another terminal |
| Port 8501 already in use | `py -m streamlit run app.py --server.port 8502` |
| `OPENAI_API_KEY` missing | Check the `.env` file exists in the project folder |
| Stop a running demo | Press **Ctrl + C** in the terminal |

---

✅ **You're ready.** Open the demo URL in any browser and start exploring.
