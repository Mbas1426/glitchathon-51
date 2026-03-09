from fastapi import FastAPI, HTTPException
import sqlite3

DB_NAME = "../database/chronic_care.db"

app = FastAPI(title="Chronic Care Agent - API")
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/hospitals")
def get_hospitals():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM hospitals")
    rows = cur.fetchall()

    conn.close()
    return [dict(row) for row in rows]


@app.get("/hospitals/{hospital_id}")
def get_hospital(hospital_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM hospitals WHERE hospital_id=?", (hospital_id,))
    row = cur.fetchone()

    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Hospital not found")

    return dict(row)

@app.get("/doctors")
def get_doctors():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT d.*, h.hospital_name
        FROM doctors d
        JOIN hospitals h
        ON d.hospital_id = h.hospital_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM doctors WHERE doctor_id=?", (doctor_id,))
    row = cur.fetchone()

    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return dict(row)

@app.get("/patients")
def get_patients():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT p.*, d.doctor_name
        FROM patients p
        JOIN doctors d
        ON p.doctor_id = d.doctor_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT p.*, d.doctor_name
        FROM patients p
        JOIN doctors d
        ON p.doctor_id = d.doctor_id
        WHERE p.patient_id = ?
    """, (patient_id,))

    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")

    return dict(row)

@app.get("/diagnosis")
def get_all_diagnosis():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT pd.*, p.patient_name, cp.disease_name
        FROM patient_diagnosis pd
        JOIN patients p ON pd.patient_id = p.patient_id
        JOIN care_protocols cp ON pd.disease_id = cp.disease_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/patients/{patient_id}/diagnosis")
def get_patient_diagnosis(patient_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT pd.*, cp.disease_name
        FROM patient_diagnosis pd
        JOIN care_protocols cp
        ON pd.disease_id = cp.disease_id
        WHERE pd.patient_id = ?
    """, (patient_id,))

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/test-results")
def get_test_results():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT r.*, p.patient_name
        FROM patient_test_results r
        JOIN patients p
        ON r.patient_id = p.patient_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/patients/{patient_id}/test-results")
def get_patient_results(patient_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM patient_test_results
        WHERE patient_id = ?
        ORDER BY test_date DESC
    """, (patient_id,))

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/appointments")
def get_appointments():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT a.*, p.patient_name, d.doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/patients/{patient_id}/appointments")
def get_patient_appointments(patient_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM appointments
        WHERE patient_id = ?
        ORDER BY next_scheduled_appointment_date
    """, (patient_id,))

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]

@app.get("/care-gaps")
def get_care_gaps():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT cg.*, p.patient_name
        FROM care_gaps cg
        JOIN patients p
        ON cg.patient_id = p.patient_id
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/care-gaps/high-risk")
def get_high_risk_patients():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT cg.*, p.patient_name
        FROM care_gaps cg
        JOIN patients p ON cg.patient_id = p.patient_id
        WHERE cg.risk_tier = 'HIGH'
    """)

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/chat/{patient_id}")
def get_chat_messages(patient_id: int):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM chat_messages
        WHERE patient_id = ?
        ORDER BY message_time
    """, (patient_id,))

    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@app.get("/")
def root():
    return {"message": "AI Care Gap Assistant Backend Running"}