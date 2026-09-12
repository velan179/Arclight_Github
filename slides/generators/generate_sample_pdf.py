"""
Generates a sample 'Faculty_Handbook.pdf' for the RAG live demo.
Run once:  py generate_sample_pdf.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.colors import HexColor

styles = getSampleStyleSheet()
H1 = ParagraphStyle('H1', parent=styles['Heading1'],
                    textColor=HexColor("#0B2A4A"), spaceAfter=10)
H2 = ParagraphStyle('H2', parent=styles['Heading2'],
                    textColor=HexColor("#009B9E"), spaceAfter=6)
BODY = ParagraphStyle('Body', parent=styles['BodyText'],
                      alignment=TA_JUSTIFY, fontSize=11, leading=15)

sections = [
    ("Greenwood Institute — Faculty Handbook 2026", H1, [
        "This handbook contains the official policies for all teaching faculty "
        "at Greenwood Institute of Technology. It is updated annually by the "
        "Office of Academic Affairs. In case of any conflict between this "
        "document and a departmental circular, this handbook takes precedence."
    ]),
    ("1. Leave Policy", H2, [
        "Every full-time faculty member is entitled to 12 days of Casual Leave "
        "(CL) per calendar year. Unused CL does not carry forward to the next "
        "year and is not encashable on resignation.",
        "Faculty are also entitled to 15 days of Earned Leave (EL) per year. "
        "Up to 30 days of EL may be accumulated. EL must be applied for at "
        "least one week in advance and requires HOD approval.",
        "Medical Leave (ML) of up to 10 days per year is provided. A medical "
        "certificate from a registered practitioner is required for any "
        "medical leave exceeding 3 consecutive days.",
        "Maternity leave of 26 weeks is granted as per the Maternity Benefit "
        "Act. Paternity leave of 15 days is available to male faculty within "
        "6 months of the child's birth.",
        "Visiting and adjunct faculty are entitled to leave on a pro-rata "
        "basis depending on contract duration. All leave applications must "
        "be submitted through the HR portal at hr.greenwood.edu.",
    ]),
    ("2. Attendance and Working Hours", H2, [
        "Faculty are expected to be present on campus from 9:00 AM to 5:00 PM "
        "on all working days. A minimum of 32 contact hours per week is "
        "required, including teaching, tutorials, and consultation hours.",
        "Biometric attendance is mandatory. Faculty must mark attendance both "
        "at entry and exit. Three late arrivals (after 9:15 AM) in a month "
        "will be counted as one day of leave.",
        "Work-from-home is permitted for a maximum of 4 days per month, "
        "subject to HOD approval and only for non-teaching days.",
    ]),
    ("3. Research and Publications", H2, [
        "Every faculty member is expected to publish at least 2 papers per "
        "academic year in Scopus or SCI indexed journals. Publications in "
        "predatory journals will not be counted toward this requirement.",
        "The institute provides an annual research grant of INR 50,000 per "
        "faculty for purchase of books, software, and conference travel. "
        "Unspent funds do not carry forward.",
        "Faculty are encouraged to file at least one patent every three years. "
        "The institute bears 100% of patent filing costs for inventions made "
        "during the course of employment.",
        "International conference travel is supported up to INR 1,50,000 per "
        "year, subject to paper acceptance in a recognized venue.",
    ]),
    ("4. Examination and Evaluation Duties", H2, [
        "Setting and moderation of question papers must be completed at least "
        "10 days before the scheduled examination date. Question papers must "
        "follow the Outcome-Based Education framework with mapping to course "
        "outcomes and Bloom's taxonomy levels.",
        "Answer scripts must be evaluated within 7 working days of the "
        "examination. Marks must be uploaded to the academic portal within "
        "10 days of the last examination.",
        "Re-evaluation requests from students must be processed within 15 "
        "working days. Faculty assigned re-evaluation duties receive an "
        "honorarium of INR 15 per script.",
    ]),
    ("5. Student Mentoring", H2, [
        "Every faculty member is assigned approximately 20 students as "
        "mentees. A minimum of one formal mentoring meeting per month is "
        "required, with notes uploaded to the mentor portal.",
        "Faculty must flag any student whose attendance falls below 75% or "
        "whose internal assessment marks drop below 40%. These cases are "
        "reviewed by the Student Welfare Committee.",
        "Parents must be informed of any sustained underperformance through "
        "an official email from the mentor, with the HOD in copy.",
    ]),
    ("6. Code of Conduct", H2, [
        "All faculty are expected to maintain the highest standards of "
        "academic integrity. Plagiarism in research, falsification of data, "
        "or misuse of institute funds will result in disciplinary action up "
        "to and including termination.",
        "Faculty must not engage in private tutoring of students currently "
        "enrolled in their courses. Outside consulting is permitted up to "
        "8 hours per week, with prior written approval from the Dean.",
        "Any form of harassment will be dealt with strictly under the "
        "Internal Complaints Committee guidelines. Reports may be made "
        "confidentially to icc@greenwood.edu.",
    ]),
    ("7. Promotion and Performance Review", H2, [
        "Annual Performance Appraisal Reviews (APAR) are conducted every "
        "March. Reviews consider teaching effectiveness, research output, "
        "student mentoring, administrative contributions, and adherence to "
        "the code of conduct.",
        "Promotion from Assistant Professor to Associate Professor requires "
        "a minimum of 4 years of service, a PhD, and at least 6 Scopus "
        "indexed publications. Promotion to Professor additionally requires "
        "PhD supervision of at least 2 scholars.",
        "Outstanding performers are eligible for the Vice Chancellor's "
        "Excellence Award, which carries a cash prize of INR 1,00,000.",
    ]),
    ("8. IT Resources and Data Privacy", H2, [
        "Each faculty member is provided an institute laptop, refreshed "
        "every 4 years. Lost or damaged equipment will be charged to the "
        "individual unless covered by insurance.",
        "Student data must not be shared with any third party or uploaded "
        "to public cloud services. All student grades, attendance, and "
        "personal information are confidential under institute policy and "
        "the DPDP Act 2023.",
        "Faculty are encouraged to use the institute's AI assistant tools, "
        "but must not paste confidential student information into public "
        "language models such as ChatGPT.",
    ]),
]

doc = SimpleDocTemplate("Faculty_Handbook.pdf", pagesize=A4,
                        leftMargin=2*cm, rightMargin=2*cm,
                        topMargin=2*cm, bottomMargin=2*cm)
story = []
for i, (title, style, paras) in enumerate(sections):
    story.append(Paragraph(title, style))
    story.append(Spacer(1, 6))
    for p in paras:
        story.append(Paragraph(p, BODY))
        story.append(Spacer(1, 6))
    story.append(Spacer(1, 12))

doc.build(story)
print("Saved: Faculty_Handbook.pdf")
