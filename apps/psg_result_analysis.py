import os
import streamlit as st
import pandas as pd
from openai import OpenAI

# OpenAI Client — set OPENAI_API_KEY in your environment before running
OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_KEY:
    st.error("Set the OPENAI_API_KEY environment variable before running.")
    st.stop()
client = OpenAI(api_key=OPENAI_KEY)

st.set_page_config(page_title="PSG Result Analysis", page_icon="📊", layout="wide")
st.title("📊 PSG Result Analysis")
st.caption("Upload a results sheet and get instant performance insights.")

uploaded_file = st.file_uploader("Upload Result Excel File", type=["xlsx"])

if uploaded_file:
    df = pd.read_excel(uploaded_file)

    st.subheader("📋 Result Data")
    st.dataframe(df, use_container_width=True)

    # ---------- Basic statistics ----------
    numeric_cols = df.select_dtypes(include="number").columns.tolist()

    if numeric_cols:
        st.subheader("📈 Quick Statistics")

        col1, col2, col3, col4 = st.columns(4)
        total_students = len(df)
        avg_score = df[numeric_cols].mean(axis=1).mean()
        highest = df[numeric_cols].max(axis=1).max()
        lowest = df[numeric_cols].min(axis=1).min()

        col1.metric("Total Students", total_students)
        col2.metric("Average Score", f"{avg_score:.2f}")
        col3.metric("Highest Mark", f"{highest:.2f}")
        col4.metric("Lowest Mark", f"{lowest:.2f}")

        # Pass / Fail summary (pass mark = 40)
        pass_mark = st.slider("Pass mark", 0, 100, 40)
        df["_Total"] = df[numeric_cols].sum(axis=1)
        df["_Average"] = df[numeric_cols].mean(axis=1)
        df["_Status"] = df[numeric_cols].min(axis=1).apply(
            lambda x: "Pass" if x >= pass_mark else "Fail"
        )

        st.subheader("✅ Pass / Fail Summary")
        st.bar_chart(df["_Status"].value_counts())

        st.subheader("🏆 Top 5 Students")
        st.dataframe(
            df.sort_values("_Average", ascending=False).head(5),
            use_container_width=True,
        )

        st.subheader("⚠️ Bottom 5 Students")
        st.dataframe(
            df.sort_values("_Average", ascending=True).head(5),
            use_container_width=True,
        )

        st.subheader("📊 Subject-wise Average")
        st.bar_chart(df[numeric_cols].mean())

    # ---------- AI Q&A ----------
    st.subheader("🤖 Ask AI about the Results")
    user_question = st.text_input("Ask a question (e.g., Who needs improvement in Maths?)")

    if user_question:
        prompt = f"""
        You are an academic result analyst for PSG Institute.

        Here is the student result data:

        {df.to_string(index=False)}

        Answer the following question clearly and concisely:
        {user_question}
        """

        with st.spinner("Analyzing..."):
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
            )
            st.write(response.choices[0].message.content)

    # ---------- AI Insights ----------
    if st.button("Generate Full Result Analysis Report"):
        insights_prompt = f"""
        You are an academic result analyst for PSG Institute.
        Analyze the following result data and prepare a structured report covering:

        1. Overall class performance summary
        2. Top performers (with names and scores)
        3. Weak students who need attention
        4. Subject-wise strengths and weaknesses
        5. Pass / Fail observations
        6. Recommendations for faculty to improve results

        Result Data:
        {df.to_string(index=False)}
        """

        with st.spinner("Generating report..."):
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": insights_prompt}],
            )
            st.subheader("📑 Result Analysis Report")
            st.write(response.choices[0].message.content)
else:
    st.info("👆 Upload an Excel file (.xlsx) containing student results to begin.")
