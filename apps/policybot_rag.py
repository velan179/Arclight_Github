"""
📚 PolicyBot — a tiny RAG demo for the workshop.

Faculty uploads a PDF. App chunks it, embeds it, stores it in Chroma,
and answers questions using only the retrieved chunks.

Run:  py -m streamlit run policybot.py
"""

import os
import streamlit as st
from pypdf import PdfReader
from openai import OpenAI
import chromadb
from chromadb.utils import embedding_functions

# ---------- Config ----------
import os
OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
CHUNK_SIZE = 500          # words per chunk
CHUNK_OVERLAP = 50        # words of overlap
TOP_K = 3                 # how many chunks to retrieve

if not OPENAI_KEY:
    st.error("Set the OPENAI_API_KEY environment variable before running.")
    st.stop()
client = OpenAI(api_key=OPENAI_KEY)

st.set_page_config(page_title="PolicyBot — RAG Demo", page_icon="📚")
st.title("📚 PolicyBot")
st.caption("RAG demo  •  Ask questions over your own PDF.")


# ---------- Helpers ----------
def read_pdf(file) -> str:
    reader = PdfReader(file)
    return "\n".join(page.extract_text() or "" for page in reader.pages)

def chunk_text(text: str, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    words = text.split()
    chunks, i = [], 0
    while i < len(words):
        chunks.append(" ".join(words[i:i + size]))
        i += size - overlap
    return chunks

@st.cache_resource
def get_collection():
    chroma_client = chromadb.Client()
    embed_fn = embedding_functions.OpenAIEmbeddingFunction(
        api_key=OPENAI_KEY, model_name="text-embedding-3-small"
    )
    # Reset on each app start so re-uploads work cleanly
    try: chroma_client.delete_collection("policybot")
    except Exception: pass
    return chroma_client.create_collection("policybot", embedding_function=embed_fn)


# ---------- Step 1: Upload & index ----------
st.subheader("1. Upload a PDF")
pdf = st.file_uploader("Drop a policy / handbook / syllabus", type=["pdf"])

if pdf and st.session_state.get("indexed_name") != pdf.name:
    with st.spinner("Reading PDF, chunking, embedding, storing…"):
        text = read_pdf(pdf)
        chunks = chunk_text(text)
        coll = get_collection()
        # Wipe any previously indexed PDF
        if coll.count() > 0:
            coll.delete(ids=coll.get()["ids"])
        coll.add(
            documents=chunks,
            ids=[f"chunk_{i}" for i in range(len(chunks))],
        )
        st.session_state["indexed_name"] = pdf.name
        st.session_state["num_chunks"] = len(chunks)
    st.success(f"Indexed **{pdf.name}** → {st.session_state['num_chunks']} chunks.")
elif "indexed_name" in st.session_state:
    st.info(f"Currently indexed: **{st.session_state['indexed_name']}** "
            f"({st.session_state['num_chunks']} chunks)")


# ---------- Step 2: Ask ----------
st.subheader("2. Ask a question")
question = st.text_input("e.g. What's the leave policy for faculty?")

if question and "indexed_name" in st.session_state:
    coll = get_collection()

    with st.spinner("Retrieving relevant chunks…"):
        results = coll.query(query_texts=[question], n_results=TOP_K)
        retrieved = results["documents"][0]
        distances = results["distances"][0]

    # Build the grounded prompt
    context = "\n\n---\n\n".join(retrieved)
    prompt = (
        "You are a helpful assistant. Answer the user's question using ONLY "
        "the context below. If the answer isn't in the context, say so honestly.\n\n"
        f"CONTEXT:\n{context}\n\nQUESTION: {question}"
    )

    with st.spinner("Asking the LLM…"):
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
        )
    answer = resp.choices[0].message.content

    # ---------- Step 3: Show answer + sources ----------
    st.subheader("✅ Answer")
    st.write(answer)

    st.subheader("📄 Retrieved chunks (what the AI actually looked at)")
    for i, (chunk, dist) in enumerate(zip(retrieved, distances), 1):
        preview = (chunk[:80] + "…") if len(chunk) > 80 else chunk
        with st.expander(
            f"Chunk {i}  •  distance: {dist:.3f}  •  {len(chunk)} chars  •  {preview}"
        ):
            st.text(chunk)
