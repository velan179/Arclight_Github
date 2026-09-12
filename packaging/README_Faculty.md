# 💻 Local LLM Chat — Quick Start for Faculty

Run an AI chatbot **on your own laptop**. No internet. No subscription. No data leaves your machine.
You can also upload PDFs, Word docs, or text files and ask questions about them.

---

## ✅ One-time setup (5 minutes)

### Step 1 — Install Ollama (the LLM engine)

Double-click **`Setup_Ollama.bat`** in this folder.

- If Ollama is already installed, it skips to Step 2.
- If not, it opens the Ollama download page. Install it, then run `Setup_Ollama.bat` again.

> Ollama is a free, open-source tool that runs AI models on your computer.

### Step 2 — Download the model

`Setup_Ollama.bat` automatically downloads **llama3.2:3b** (~2 GB) when run.
This is a one-time download.

> Slower laptop? Edit `Setup_Ollama.bat` and change the model name to `gemma2:2b` (~1.5 GB) or `qwen2.5:1.5b` (~1 GB).

---

## 🚀 Every time you want to chat

Double-click **`Launch.bat`**.

- A black console window opens (don't close it — that's the app running).
- A browser tab opens at `http://localhost:8501` with the chat UI.
- Chat away. Optionally upload a PDF / Word / text file from the sidebar.

**To stop:** close the black console window.

> Power user: you can also double-click `LocalLLMChat.exe` directly, but `Launch.bat` keeps the window open if anything goes wrong so you can see the error.

---

## 📎 What you can upload

| File type | Examples |
|---|---|
| `.pdf` | Syllabus, research papers, textbook chapters |
| `.docx` | Question papers, lesson plans |
| `.txt` / `.md` | Notes, transcripts |
| `.csv` | Marks sheets, attendance |

Small files work best. For very long PDFs, only the first ~12,000 characters are sent to the model.

---

## 🆘 Troubleshooting

| Problem | Try this |
|---|---|
| Browser doesn't open | Open it yourself and go to <http://localhost:8501> |
| "Could not reach Ollama" error in chat | Make sure Ollama is running (you can run `ollama list` in a Command Prompt) |
| Replies are very slow | Use a smaller model — `ollama pull qwen2.5:1.5b` and pick it from the sidebar |
| Antivirus blocks the app | Allow `LocalLLMChat.exe` and `Launch.bat` in your antivirus / Windows Defender exclusions |
| Port 8501 already in use | Close other Streamlit apps, then try again |

---

## 🔐 Privacy

Everything happens on your laptop:

- The model file lives in `C:\Users\<you>\.ollama\`
- Your chats and uploaded files **never leave the machine**
- Safe for student data, unpublished research, internal documents

You can verify by **turning off Wi-Fi** — the app still works.

---

## 📞 Help

Built for the AI Faculty Assistant workshop.
Issues? Contact the workshop facilitator or open an issue at
<https://github.com/nirmaldce/agentic_ai>.
