# Chronic Care Engagement Agent

## Overview

Chronic diseases such as *Diabetes, Hypertension, Chronic Kidney Disease (CKD), and Hypothyroidism* are long-term conditions that often progress silently. Patients may not experience obvious symptoms while the disease gradually worsens.

For example, a diabetic patient who has *not taken an HbA1c test for several months* may unknowingly be developing serious complications such as kidney damage, neuropathy, or cardiovascular disease.

Although hospitals and healthcare providers usually possess the relevant patient data, *there is often no proactive system that monitors this information and initiates timely interventions* before the patient’s condition becomes critical.

The *Chronic Care Engagement Agent* is designed to solve this problem by introducing an intelligent system that continuously monitors patient care gaps, prioritizes high-risk patients, communicates proactively, and assists healthcare providers in maintaining active engagement with their patients.

This project demonstrates how *AI agents and intelligent healthcare workflows* can be used to support:

- Preventive healthcare
- Population health management
- Proactive patient engagement
- Clinical decision support

# Background

Chronic disease management requires *regular monitoring and testing* to ensure that the disease remains under control.

Examples include:

- *Diabetes:* HbA1c test every 3 months
- *Chronic Kidney Disease:* Creatinine test every 6 months
- *Hypertension:* Regular blood pressure monitoring
- *Hypothyroidism:* Thyroid function tests

However, healthcare systems often operate in a *reactive manner*, where action is only taken when patients actively seek care or when symptoms become severe.

This leads to several problems:

- Missed monitoring tests
- Delayed detection of complications
- Increased hospital admissions
- Higher healthcare costs
- Reduced patient quality of life

Studies estimate that *approximately 20% of avoidable hospitalizations are directly linked to poor chronic disease monitoring*.

This highlights the need for a system that *actively tracks patient care gaps and intervenes before the disease escalates*.

# Problem Statement

Preventive care systems today face multiple limitations:

- Patient monitoring is often *manual and inconsistent*
- Outreach messages are *generic and impersonal*
- Healthcare providers lack *visibility into patient compliance*
- High-risk patients are *not prioritized effectively*
- Care gap closure is *not systematically tracked*

As a result, healthcare systems lack a reliable way to:

- Identify patients who are overdue for monitoring tests
- Prioritize patients based on clinical risk
- Communicate with patients in a meaningful and personalized manner
- Track whether patients complete recommended tests
- Escalate high-risk situations to physicians

# Core Concepts

The Chronic Care Engagement Agent is built around several key healthcare and AI concepts:

### Population Health Management
Managing the health outcomes of a group of individuals by monitoring and improving care across the entire population.

### Risk Stratification
Identifying patients with higher risk levels and prioritizing them for intervention.

### Care Gap Identification
Detecting when patients are overdue for required tests or treatments.

### Personalized Patient Engagement
Communicating with patients in a way that explains the importance of their care in simple, understandable language.

### Care Gap Closure Tracking
Ensuring that identified care gaps are followed up and resolved.


# Solution Overview

The *Chronic Care Engagement Agent* functions as an intelligent healthcare assistant that continuously monitors patient records and initiates proactive engagement.

The system performs the following tasks:


## 1. Identify Overdue Patients

The agent scans the patient database and identifies individuals who have *missed their recommended monitoring tests*.

Example protocols:

| Disease | Test | Frequency |
|------|------|------|
| Diabetes | HbA1c | Every 3 months |
| CKD | Creatinine | Every 6 months |
| Hypothyroidism | TSH | Every 6 months |

Patients whose last test date exceeds the threshold are flagged as *overdue*.


## 2. Risk Stratification

Once overdue patients are identified, the system calculates a *risk score* based on:

- Diagnosis
- Last test result value
- Time since last test
- Clinical thresholds

Example:

| HbA1c Value | Risk Level |
|------|------|
| < 7% | Low |
| 7 – 8.5% | Moderate |
| > 8.5% | High |

Patients with abnormal historical values are prioritized first for outreach.


## 3. Personalized Patient Outreach

Instead of generic reminders, the agent composes *personalized messages* that:

- Explain why the test is important
- Inform the patient about potential risks
- Provide an easy way to schedule a test

Example message:

> "Hi Sarah, we noticed that your HbA1c test is overdue. Your last reading suggested that your blood sugar may need closer monitoring. Taking this test helps prevent complications like kidney damage or nerve problems. We can arrange a convenient home sample collection for you."

Messages are delivered via:

- SMS
- WhatsApp

## 4. Autonomous Reply Handling

The agent can interpret and respond to different patient replies.

### Scenario 1: Patient agrees

- Agent schedules home sample collection
- Confirmation message sent
- Care gap marked as *in progress*

### Scenario 2: Patient asks questions

Example:
> "Is this urgent?"

The agent provides contextual explanation based on their previous test results.

### Scenario 3: Patient declines

- Reason logged
- Re-outreach scheduled after 30 days
- Physician notified if necessary

### Scenario 4: No response

- Second outreach attempt triggered
- If still unresponsive, escalate depending on risk level.


## 5. Care Gap Tracking

Every patient interaction updates the system's care gap records.

Clinical teams can generate reports including:

- Total overdue patients
- Gaps closed
- Pending responses
- Escalated cases


## 6. Physician Escalation

High-risk patients are escalated if:

- They fail to respond after multiple outreach attempts
- Their last test result indicates a critical condition

The system sends alerts to the *treating physician* for manual intervention.


# Extended Implementation (Our Hackathon Enhancement)

While the problem statement primarily focused on designing an *agent that assists patients in closing care gaps, our team expanded the concept to build a **comprehensive patient–physician engagement platform*.

Our implementation introduces a *dual-interface system*:

- *Patient Interface*
- *Physician Dashboard*

This ensures that both patients and healthcare providers can actively participate in the care process.


# Physician Dashboard

We designed a dedicated interface for physicians that allows them to manage and monitor their patients more effectively.

### Key capabilities include:

### Patient Monitoring

Doctors can view a list of their patients and track:

- Current diagnoses
- Monitoring test history
- Care gap status
- Risk level classification

This gives physicians *complete visibility into their patient population*.


### Personalized Doctor Messaging

Physicians can send personalized messages to patients regarding:

- Upcoming appointments
- Prescription reminders
- Follow-up instructions
- Lifestyle recommendations

This complements the automated outreach from the AI agent.


### Video-Enabled Voice Consultation

To improve patient–doctor interaction, physicians can initiate:

- *Real-time video consultations*
- *Voice-enabled communication*

This allows doctors to provide immediate guidance without requiring patients to visit the hospital physically.


### Treatment Monitoring

Doctors can monitor patients who are undergoing ongoing treatment, including:

- Test results
- Medication compliance
- Follow-up requirements

This ensures continuity of care even outside clinical visits.


### Critical Care Flagging (NOK)

Physicians can flag patients as *NOK (Needs Ongoing Knowledge / Critical Attention)* if they require special monitoring.

Flagged patients are:

- Prioritized by the system
- Monitored more frequently
- Highlighted in physician dashboards

This ensures that *high-risk patients receive immediate attention*.


# Simulated Tools

The agent interacts with the following simulated functions:


get_overdue_patients(test_name, overdue_days)


Returns list of patients overdue for a test.


get_patient_last_result(patient_id, test_name)


Returns last test value, date, and normal range.


calculate_risk_score(patient_id, diagnosis, last_result, overdue_days)


Returns risk tier for prioritization.


send_outreach_message(patient_id, message, channel)


Sends patient communication through SMS or WhatsApp.


get_patient_reply(patient_id)


Retrieves the latest reply from the patient.


book_home_test_collection(patient_id, preferred_date, test_name)


Schedules a home sample collection.


update_care_gap_status(patient_id, test_name, status, notes)


Updates patient care gap records.


notify_physician(doctor_id, patient_id, reason)


Sends escalation alerts to physicians.


# Inputs (Mock Data)

The system uses simulated datasets including:

### Patient Dataset

15 chronic disease patients including:

- Diagnosis
- Last test result
- Last test date
- Contact preference


### Care Protocol Table

Defines test frequency requirements for each condition.


### Patient Reply Scenarios

Four simulated patient responses:

- Agree
- Ask question
- Decline
- No response


### Risk Scoring Matrix

Maps diagnostic values to risk tiers.


# Bonus Feature

### Family Engagement Mode

For elderly patients without smartphone access:

- An SOS button incase of emergency to notify the Physician
- A shortest path to the nearest hospital in case of SOS
- Outreach is sent to the registered *next-of-kin*
- Family members receive explanation of urgency
- They can schedule tests on behalf of the patient

This ensures that vulnerable patients *do not fall through the cracks*.


# Project Setup

## Terminal 1

Install frontend dependencies:

```bash
npm install
```


## Terminal 2

Navigate to backend folder:

```bash
cd backend
npm install
```


# Environment Setup

In the .env file in backend folder, update api key with your own gemini api key.

```bash
API_KEY=your_api_key_here
```


# Running the Application

Start the backend server.

### Terminal 2

```bash
node server.js
```

Start the frontend application.

### Terminal 1

```bash
npm run dev
```

# Expected Outcome

The Chronic Care Engagement Agent transforms healthcare from a *reactive system to a proactive care ecosystem*.

Key benefits include:

- Early detection of chronic disease deterioration
- Reduced avoidable hospital admissions
- Improved patient engagement
- Better physician visibility into patient compliance
- Strengthened patient–doctor relationships


# Future Improvements

- Voice assistants for elderly patients
- Mobile health monitoring integration
- Advanced analytics for healthcare providers
