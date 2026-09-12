"""
Local LLM Chat Demo
-------------------
A simple chat box powered by an open LLM running locally via Ollama.
Use this to show faculty that we can use AI without any cloud cost or
data leaving the laptop.

You can also upload a file (PDF / TXT / MD / DOCX / CSV) and ask
questions about it — just like ChatGPT, but fully on your laptop.

Setup (one-time):
1. Install Ollama from https://ollama.com  (Windows installer available)
2. Open a terminal and pull a small model:
       ollama pull gemma2:2b
   (Alternatives that run well on CPU: phi3:mini, llama3.2:3b, qwen2.5:1.5b)
3. Install Python deps:
       pip install streamlit ollama pypdf python-docx

Run the demo:
       streamlit run local_llm_chat.py
"""

import io
import streamlit as st
import ollama

# ---------------- File reading helpers ----------------
# Approx chars we send to the model. Small models (2-3B) have ~4-8k token
# context windows; 1 token ~ 4 chars, so 12000 chars ~ 3000 tokens leaves
# room for the conversation. Adjust if you use a bigger model.
MAX_DOC_CHARS = 12000


def read_pdf(file) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        return "[ERROR] pypdf not installed. Run: pip install pypdf"
    reader = PdfReader(file)
    pages = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(f"--- Page {i} ---\n{text}")
    return "\n\n".join(pages)


def read_docx(file) -> str:
    try:
        from docx import Document
    except ImportError:
        return "[ERROR] python-docx not installed. Run: pip install python-docx"
    doc = Document(file)
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def read_text(file) -> str:
    raw = file.read()
    if isinstance(raw, bytes):
        for enc in ("utf-8", "utf-16", "latin-1"):
            try:
                return raw.decode(enc)
            except UnicodeDecodeError:
                continue
        return raw.decode("utf-8", errors="ignore")
    return str(raw)


def extract_file_text(uploaded_file) -> str:
    """Return extracted text from a Streamlit UploadedFile, by extension."""
    name = uploaded_file.name.lower()
    data = uploaded_file.read()
    buf = io.BytesIO(data)
    if name.endswith(".pdf"):
        return read_pdf(buf)
    if name.endswith(".docx"):
        return read_docx(buf)
    # txt, md, csv, log, json, py, etc. — treat as text
    return read_text(io.BytesIO(data))

# ---------------- Page setup ----------------
st.set_page_config(page_title="Local LLM Chat", page_icon="💻", layout="centered")
st.title("💻 Local LLM Chat")
st.caption("Running fully on your laptop — no internet, no API key, no cost.")

# ---------------- Sidebar controls ----------------
with st.sidebar:
    st.header("Settings")

    # List models already pulled in Ollama; fall back to a sensible default.
    try:
        installed = [m["name"] for m in ollama.list().get("models", [])]
    except Exception:
        installed = []

    default_models = ["gemma2:2b", "phi3:mini", "llama3.2:3b", "qwen2.5:1.5b"]
    options = installed if installed else default_models
    model_name = st.selectbox("Model", options, index=0)

    system_prompt = st.text_area(
        "System prompt",
        value="You are a helpful assistant for college faculty. Be concise and clear.",
        height=100,
    )
    temperature = st.slider("Temperature", 0.0, 1.5, 0.7, 0.1)

    if st.button("🗑️ Clear chat"):
        st.session_state.messages = []
        st.session_state.pop("doc_text", None)
        st.session_state.pop("doc_name", None)
        st.rerun()

    st.markdown("---")
    st.subheader("📎 Attach a file")
    uploaded = st.file_uploader(
        "PDF / TXT / MD / DOCX / CSV",
        type=["pdf", "txt", "md", "docx", "csv", "log", "json", "py"],
        accept_multiple_files=False,
    )
    if uploaded is not None:
        # Only re-extract when the file changes
        if st.session_state.get("doc_name") != uploaded.name:
            with st.spinner(f"Reading {uploaded.name}..."):
                text = extract_file_text(uploaded)
            if len(text) > MAX_DOC_CHARS:
                st.warning(
                    f"File is large ({len(text):,} chars). "
                    f"Sending only the first {MAX_DOC_CHARS:,} chars to the model."
                )
                text = text[:MAX_DOC_CHARS]
            st.session_state.doc_text = text
            st.session_state.doc_name = uploaded.name
            st.success(f"Loaded **{uploaded.name}** ({len(text):,} chars).")
        else:
            st.success(f"Using **{uploaded.name}** ({len(st.session_state.doc_text):,} chars).")

    if "doc_name" in st.session_state:
        if st.button("❌ Remove attached file"):
            st.session_state.pop("doc_text", None)
            st.session_state.pop("doc_name", None)
            st.rerun()

    st.markdown("---")
    st.markdown(
        "**Why local?**\n"
        "- No API cost\n"
        "- Data stays on device\n"
        "- Works offline\n"
        "- Great for prototyping"
    )

# ---------------- Chat state ----------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# Show which file (if any) is currently attached
if st.session_state.get("doc_name"):
    st.info(f"📎 Attached: **{st.session_state.doc_name}** — ask questions about this file.")

# Render history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ---------------- Chat input ----------------
user_input = st.chat_input("Ask me anything...")

if user_input:
    # Show user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Build the system prompt — append the document if one is attached
    effective_system = system_prompt
    if st.session_state.get("doc_text"):
        effective_system = (
            f"{system_prompt}\n\n"
            f"The user has attached a reference file named '{st.session_state.doc_name}'. "
            f"Its contents are provided below for your reference ONLY.\n\n"
            f"Guidelines:\n"
            f"- If the user's question is clearly about this file (e.g. 'summarise this', "
            f"'what does the document say about X', 'from the file...'), use the file content.\n"
            f"- If the user asks a general question that is NOT about this file "
            f"(e.g. general knowledge, coding help, casual chat), answer normally from your "
            f"own knowledge and IGNORE the file.\n"
            f"- Do not force-fit answers from the file when the question is unrelated.\n"
            f"- Never mention the file unless the user's question is about it.\n\n"
            f"--- BEGIN REFERENCE FILE: {st.session_state.doc_name} ---\n"
            f"{st.session_state.doc_text}\n"
            f"--- END REFERENCE FILE ---"
        )

    # Build message list with (possibly augmented) system prompt
    chat_payload = [{"role": "system", "content": effective_system}] + st.session_state.messages

    # Stream the assistant response
    with st.chat_message("assistant"):
        placeholder = st.empty()
        full_response = ""
        try:
            stream = ollama.chat(
                model=model_name,
                messages=chat_payload,
                options={"temperature": temperature},
                stream=True,
            )
            for chunk in stream:
                token = chunk.get("message", {}).get("content", "")
                full_response += token
                placeholder.markdown(full_response + "▌")
            placeholder.markdown(full_response)
        except Exception as e:
            full_response = f"⚠️ Could not reach Ollama: `{e}`\n\nMake sure Ollama is running and the model is pulled."
            placeholder.markdown(full_response)

    st.session_state.messages.append({"role": "assistant", "content": full_response})
