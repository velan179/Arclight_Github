# 📦 Packaging — Build LocalLLMChat.exe

This folder builds a standalone Windows .exe of [`apps/local_llm_chat.py`](../apps/local_llm_chat.py)
that faculty can download and run **without installing Python**.

> They still need to install **Ollama** (one-time) for the actual LLM runtime.
> `Setup_Ollama.bat` handles that automatically.

---

## 🔨 How to build

```powershell
# from the repo root
py -m pip install pyinstaller
cd packaging
py build.py
```

Build takes 3–7 minutes and produces:

```
packaging/dist/LocalLLMChat/
├── LocalLLMChat.exe        ← the entry point
├── Setup_Ollama.bat        ← one-click Ollama install + model pull
├── README_Faculty.md       ← user instructions
└── _internal/              ← bundled Python + libraries (~300 MB)
```

---

## 📤 How to share with faculty

1. **Zip** the `dist/LocalLLMChat/` folder
2. Upload to a shared drive / Releases tab on GitHub
3. Faculty: download → unzip → run `Setup_Ollama.bat` (once) → run `LocalLLMChat.exe` (every time)

---

## 🗂 Files in this folder

| File | Purpose |
|---|---|
| `launcher.py` | Programmatically starts Streamlit + opens the browser. PyInstaller bundles this. |
| `build.py` | The build orchestrator. Copies the app, runs PyInstaller, drops auxiliary files into `dist/`. |
| `Setup_Ollama.bat` | Faculty-facing: installs Ollama (or opens download page) and pulls the model. |
| `README_Faculty.md` | Faculty-facing: 3-step quick start. |
| `README.md` | This file. |
| `local_llm_chat.py` | **Auto-generated** copy of `../apps/local_llm_chat.py` during build (do not edit). |

---

## ⚠️ Known issues

- **Antivirus false positives** — PyInstaller binaries sometimes trip Windows Defender. Tell faculty to "Allow on device" if prompted, or [sign the exe](https://learn.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools) for distribution at scale.
- **First launch is slow** (10–20 s) — PyInstaller `--onedir` startup. Acceptable for a tool you launch once a day.
- **No GPU acceleration** — Ollama auto-detects GPU separately from this app. The .exe just talks to the local Ollama service over HTTP, so faculty get whatever Ollama provides.

---

## 🔄 Updating

Whenever `apps/local_llm_chat.py` changes:

```powershell
cd packaging
py build.py
```

The build script always pulls the latest from `apps/local_llm_chat.py`.
