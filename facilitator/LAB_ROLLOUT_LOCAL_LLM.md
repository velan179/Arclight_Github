# 🚀 Run `local_llm_chat.py` on Your Lab PC

Follow these steps on your own Windows machine.

---

## 1. Install Ollama

- Download: <https://ollama.com/download/windows>
- Run `OllamaSetup.exe` → Install.
- A **llama icon** appears in the system tray.

## 2. Open PowerShell and pull the model

Press **Windows key** → type `PowerShell` → Enter. Then run:

```powershell
ollama pull gemma2:2b
```

Wait until you see `success`.

## 3. Install the Python packages

```powershell
py -m pip install --upgrade streamlit ollama
```

## 4. Copy `local_llm_chat.py` to your PC

Place the file in any folder, e.g. `Desktop\local-llm-chat\local_llm_chat.py`.

## 5. Run the app

```powershell
cd $HOME\Desktop\local-llm-chat
py -m streamlit run local_llm_chat.py
```

Your browser opens at **<http://localhost:8501>**. Start chatting.

---

## To stop

Close the browser tab → in PowerShell press **`Ctrl+C`**.

## To run again later

```powershell
cd $HOME\Desktop\local-llm-chat
py -m streamlit run local_llm_chat.py
```
