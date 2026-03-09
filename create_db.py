import sqlite3

conn = sqlite3.connect("chronic_care.db")
cursor = conn.cursor()
cursor.execute("PRAGMA foreign_keys = ON;")

cursor.execute("""
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name TEXT NOT NULL,
    location TEXT,
    latitude REAL,
    longitude REAL,
    phone TEXT,
    email TEXT,
    other_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    doctor_name TEXT NOT NULL,
    specialization TEXT,
    qualification TEXT,
    experience_years INTEGER,
    phone TEXT,
    email TEXT,
    other_info TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL,
    patient_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    outreach_type TEXT,
    has_smartphone INTEGER,
    next_of_kin_name TEXT,
    next_of_kin_phone TEXT,
    other_info TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS patient_test_results (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    test_date DATE DEFAULT CURRENT_DATE,
    HbA1c REAL,
    blood_pressure TEXT,
    serum_creatinine REAL,
    eGFR REAL,
    TSH REAL,
    FreeT4 REAL,
    LDL_cholesterol REAL,
    ALT_AST REAL,
    spirometry_FEV1 REAL,
    troponin_BNP REAL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS care_protocols (
    disease_id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_name TEXT NOT NULL,
    checkup_frequency_days INTEGER,
    relevant_info TEXT
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS patient_diagnosis (
    diagnosis_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    disease_id INTEGER NOT NULL,
    disease_name TEXT,
    risk_level TEXT,
    relevant_info TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (disease_id) REFERENCES care_protocols(disease_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    previous_appointment_date DATE,
    next_scheduled_appointment_date DATE,
    appointment_missed INTEGER DEFAULT 0,
    subject TEXT,
    status TEXT DEFAULT 'scheduled',
    other_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS care_gaps (
    gap_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    overdue_days INTEGER,
    missed_appointments INTEGER,
    risk_tier TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER DEFAULT 0,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER,
    sender TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
""")

conn.commit()
conn.close()
print("All tables created successfully in chronic_care.db!")