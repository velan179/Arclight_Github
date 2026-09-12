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

st.title("🎓 AI Faculty Assistant")

uploaded_file = st.file_uploader("Upload Student Excel File", type=["xlsx"])

if uploaded_file:
    df = pd.read_excel(uploaded_file)

    st.subheader("Student Data")
    st.dataframe(df)

    user_question = st.text_input("Ask a question about students")

    if user_question:

        data_text = df.to_string(index=False)

        prompt = f"""
        You are an AI Faculty Assistant.

        Here is the student data:

        {data_text}

        Answer this question:
        {user_question}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        answer = response.choices[0].message.content

        st.subheader("AI Response")
        st.write(answer)

    if st.button("Generate Faculty Insights"):

        insights_prompt = f"""
        Analyze the following student data and provide:
        - Top performers
        - Weak students
        - Attendance concerns
        - Faculty recommendations

        Student Data:
        {df.to_string(index=False)}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": insights_prompt}
            ]
        )

        insights = response.choices[0].message.content

        st.subheader("Faculty Insights")
        st.write(insights)