import sqlite3

conn = sqlite3.connect('chronic_care.db')
cursor = conn.cursor()

insert_sql = """
PRAGMA foreign_keys = ON;

INSERT INTO hospitals (hospital_name, location, latitude, longitude, phone, email, other_info)
VALUES
('City Care Hospital','Downtown',28.6139,77.2090,'+911234567890','contact@citycare.com','24/7 Emergency'),
('Green Valley Medical','Suburbs',28.7041,77.1025,'+911112223334','info@greenvalley.com','Specialized in Chronic Care'),
('Sunrise Health Centre','East End',28.5355,77.3910,'+911122334455','admin@sunrise.com','Home collection available');

INSERT INTO doctors (hospital_id, doctor_name, specialization, qualification, experience_years, phone, email, other_info)
VALUES
(1,'Dr. Rajesh Sharma','Endocrinology','MD',12,'+911234111111','rajesh@citycare.com','Focus on diabetes'),
(1,'Dr. Anita Mehra','Nephrology','MD',10,'+911234111112','anita@citycare.com','Kidney care expert'),
(1,'Dr. Vikram Singh','Cardiology','DM',15,'+911234111113','vikram@citycare.com','Heart diseases specialist'),
(2,'Dr. Sunita Roy','Endocrinology','MD',8,'+911122111111','sunita@greenvalley.com','Diabetes management'),
(2,'Dr. Karan Gupta','Pulmonology','MD',11,'+911122111112','karan@greenvalley.com','Focus on COPD'),
(2,'Dr. Meera Joshi','Nephrology','MD',9,'+911122111113','meera@greenvalley.com','Kidney care'),
(3,'Dr. Arjun Kumar','Endocrinology','MD',14,'+911133111111','arjun@sunrise.com','Diabetes and thyroid'),
(3,'Dr. Priya Nair','Cardiology','DM',12,'+911133111112','priya@sunrise.com','Heart failure specialist'),
(3,'Dr. Rohit Verma','Pulmonology','MD',13,'+911133111113','rohit@sunrise.com','Asthma and COPD care');

INSERT INTO patients (doctor_id, patient_name, age, gender, phone, email, address, outreach_type, has_smartphone, next_of_kin_name, next_of_kin_phone, other_info)
VALUES
(1,'Amit Kumar',55,'M','+911234000001','amit.kumar@email.com','123 Downtown St','WhatsApp',1,'Suresh Kumar','+911234000101','Diabetic for 10 years'),
(1,'Pooja Singh',48,'F','+911234000002','pooja.singh@email.com','124 Downtown St','SMS',1,'Ramesh Singh','+911234000102','Hypertension patient'),
(1,'Rohit Sharma',62,'M','+911234000003','rohit.sharma@email.com','125 Downtown St','WhatsApp',1,'Anita Sharma','+911234000103','CKD stage 2'),
(2,'Neha Gupta',50,'F','+911122000001','neha.gupta@email.com','201 Suburb Lane','SMS',1,'Sunil Gupta','+911122000101','Diabetic'),
(2,'Vikram Mehta',60,'M','+911122000002','vikram.mehta@email.com','202 Suburb Lane','WhatsApp',1,'Manish Mehta','+911122000102','Heart patient'),
(2,'Sanya Roy',45,'F','+911122000003','sanya.roy@email.com','203 Suburb Lane','SMS',1,'Ravi Roy','+911122000103','Hypothyroidism'),
(3,'Anil Kumar',58,'M','+911133000001','anil.kumar@email.com','301 East End','WhatsApp',1,'Rakesh Kumar','+911133000101','Diabetic'),
(3,'Priya Sharma',52,'F','+911133000002','priya.sharma@email.com','302 East End','SMS',1,'Sunita Sharma','+911133000102','CKD patient'),
(3,'Siddharth Nair',63,'M','+911133000003','siddharth.nair@email.com','303 East End','WhatsApp',1,'Arjun Nair','+911133000103','Hypertension'),
(1,'Kiran Joshi',49,'F','+911234000004','kiran.joshi@email.com','126 Downtown St','WhatsApp',1,'Pradeep Joshi','+911234000104','Diabetic'),
(2,'Rohan Verma',55,'M','+911122000004','rohan.verma@email.com','204 Suburb Lane','SMS',1,'Siddharth Verma','+911122000104','Heart patient'),
(3,'Deepa Nair',47,'F','+911133000004','deepa.nair@email.com','304 East End','WhatsApp',1,'Rajesh Nair','+911133000104','Hypothyroidism'),
(1,'Manish Kapoor',59,'M','+911234000005','manish.kapoor@email.com','127 Downtown St','SMS',1,'Anjali Kapoor','+911234000105','CKD stage 1'),
(2,'Ananya Mehta',53,'F','+911122000005','ananya.mehta@email.com','205 Suburb Lane','WhatsApp',1,'Rohit Mehta','+911122000105','Diabetic'),
(3,'Prateek Sharma',61,'M','+911133000005','prateek.sharma@email.com','305 East End','SMS',1,'Vikram Sharma','+911133000105','Heart patient');

INSERT INTO patient_test_results (patient_id, test_date, HbA1c, blood_pressure, serum_creatinine, eGFR, TSH, FreeT4, LDL_cholesterol, ALT_AST, spirometry_FEV1, troponin_BNP)
VALUES
(1,'2026-02-20',9.2,'140/90',1.4,55,3.2,1.1,160,40,3.2,0.02),
(2,'2026-02-21',7.5,'150/95',1.1,65,2.5,1.2,140,35,3.5,0.01),
(3,'2026-02-19',6.8,'130/85',1.8,50,3.5,1.0,150,38,3.1,0.03),
(4,'2026-02-22',8.0,'145/92',1.3,60,2.8,1.1,135,36,3.4,0.01),
(5,'2026-02-18',7.2,'135/88',1.0,70,3.0,1.2,145,33,3.6,0.02),
(6,'2026-02-20',8.5,'138/90',1.5,58,2.7,1.1,155,37,3.3,0.01),
(7,'2026-02-21',7.8,'142/89',1.2,62,3.1,1.1,150,34,3.5,0.01),
(8,'2026-02-23',6.9,'130/85',1.3,66,2.9,1.2,140,35,3.6,0.02),
(9,'2026-02-22',8.2,'148/94',1.4,59,3.2,1.1,155,36,3.3,0.01),
(10,'2026-02-20',9.0,'140/90',1.5,55,3.4,1.2,160,38,3.2,0.03),
(11,'2026-02-21',7.6,'145/92',1.2,61,3.0,1.1,150,36,3.4,0.02),
(12,'2026-02-22',6.7,'132/86',1.1,68,2.9,1.0,135,34,3.5,0.01),
(13,'2026-02-19',8.3,'150/95',1.4,57,3.1,1.2,155,37,3.3,0.02),
(14,'2026-02-20',7.1,'138/88',1.0,64,2.8,1.1,140,33,3.6,0.01),
(15,'2026-02-21',8.0,'145/90',1.3,60,3.3,1.2,150,35,3.4,0.02);

INSERT INTO care_protocols (disease_name, checkup_frequency_days, relevant_info)
VALUES
('Diabetes',90,'HbA1c every 3 months, monitor LDL and ALT/AST'),
('Hypertension',90,'BP monitoring every 3 months'),
('Chronic Kidney Disease',180,'Serum creatinine and eGFR check every 6 months'),
('Hypothyroidism',180,'TSH and FreeT4 every 6 months'),
('Heart Disease',90,'Troponin/BNP every 3 months, LDL monitoring'),
('COPD',180,'Spirometry (FEV1) every 6 months'),
('Asthma',180,'Spirometry and clinical evaluation every 6 months');

INSERT INTO patient_diagnosis (patient_id,disease_id,disease_name,risk_level,relevant_info)
VALUES
(1,1,'Diabetes','HIGH','HbA1c 9.2%, uncontrolled'),
(2,2,'Hypertension','MEDIUM','BP 150/95'),
(3,3,'Chronic Kidney Disease','HIGH','Serum Creatinine 1.8, eGFR 50'),
(4,1,'Diabetes','MEDIUM','HbA1c 8.0%'),
(5,5,'Heart Disease','LOW','Troponin normal'),
(6,4,'Hypothyroidism','MEDIUM','TSH 2.7'),
(7,1,'Diabetes','MEDIUM','HbA1c 7.8%'),
(8,3,'Chronic Kidney Disease','LOW','eGFR 66'),
(9,2,'Hypertension','HIGH','BP 148/94'),
(10,1,'Diabetes','HIGH','HbA1c 9.0%'),
(11,5,'Heart Disease','MEDIUM','Troponin normal'),
(12,4,'Hypothyroidism','LOW','TSH normal'),
(13,3,'Chronic Kidney Disease','HIGH','eGFR 57'),
(14,1,'Diabetes','LOW','HbA1c 7.1%'),
(15,5,'Heart Disease','MEDIUM','Troponin normal');

INSERT INTO appointments (patient_id, doctor_id, previous_appointment_date, next_scheduled_appointment_date, appointment_missed, subject, status, other_info)
VALUES
(1,1,'2026-01-10','2026-03-10',0,'Routine Diabetes Check','scheduled','Home collection available'),
(2,1,'2026-01-15','2026-03-15',0,'BP Check','scheduled','Clinic visit'),
(3,1,'2026-01-12','2026-03-12',1,'CKD follow-up','scheduled','Home collection'),
(4,2,'2026-01-20','2026-03-20',0,'Diabetes review','scheduled','Clinic visit'),
(5,2,'2026-01-18','2026-03-18',0,'Heart check','scheduled','Home visit'),
(6,2,'2026-01-22','2026-03-22',0,'Thyroid review','scheduled','Home collection'),
(7,3,'2026-01-25','2026-03-25',0,'Diabetes follow-up','scheduled','Clinic visit'),
(8,3,'2026-01-28','2026-03-28',1,'CKD review','scheduled','Clinic visit'),
(9,3,'2026-01-30','2026-03-30',0,'Hypertension review','scheduled','Clinic visit'),
(10,1,'2026-02-01','2026-04-01',0,'Diabetes follow-up','scheduled','Home collection'),
(11,2,'2026-02-03','2026-04-03',0,'Heart check','scheduled','Home visit'),
(12,3,'2026-02-05','2026-04-05',0,'Thyroid follow-up','scheduled','Clinic visit'),
(13,1,'2026-02-07','2026-04-07',0,'CKD review','scheduled','Home collection'),
(14,2,'2026-02-09','2026-04-09',0,'Diabetes review','scheduled','Clinic visit'),
(15,3,'2026-02-11','2026-04-11',0,'Heart check','scheduled','Home visit');

INSERT INTO care_gaps (patient_id, overdue_days, missed_appointments, risk_tier)
VALUES
(1,20,0,'HIGH'),
(2,10,0,'MEDIUM'),
(3,30,1,'HIGH'),
(4,15,0,'MEDIUM'),
(5,5,0,'LOW'),
(6,12,0,'MEDIUM'),
(7,8,0,'MEDIUM'),
(8,0,1,'LOW'),
(9,25,0,'HIGH'),
(10,18,0,'HIGH'),
(11,7,0,'MEDIUM'),
(12,0,0,'LOW'),
(13,22,0,'HIGH'),
(14,3,0,'LOW'),
(15,6,0,'MEDIUM');

INSERT INTO chat_messages (session_id, patient_id, doctor_id, sender, message_text, message_time)
VALUES
(0,1,1,'agent','Your HbA1c test is overdue. Shall we schedule a home collection?','2026-03-05 10:00'),
(0,1,1,'patient','Yes, please schedule the test.','2026-03-05 10:05'),
(1,1,1,'doctor','Scheduled your home collection for tomorrow.','2026-03-05 10:15'),

(0,2,2,'agent','Please check your BP. Would you like a clinic visit next week?','2026-03-05 11:00'),
(0,2,2,'patient','I will come on Monday.','2026-03-05 11:05'),
(1,2,2,'doctor','Clinic visit confirmed for Monday.','2026-03-05 11:10'),

(0,3,3,'agent','Your eGFR test is overdue. Home collection available.','2026-03-06 09:00'),
(0,3,3,'patient','I am not available this week.','2026-03-06 09:05'),
(1,3,3,'doctor','We will reschedule for next week.','2026-03-06 09:10'),

(0,4,4,'agent','TSH test due. Would you like clinic appointment?','2026-03-06 09:30'),
(0,4,4,'patient','Yes, please book it.','2026-03-06 09:35'),
(1,4,4,'doctor','Appointment confirmed for Friday.','2026-03-06 09:40'),

(0,5,5,'agent','Your HbA1c is critical. Schedule home collection urgently?','2026-03-07 10:00'),
(0,5,5,'patient','I cannot do it this week.','2026-03-07 10:05'),
(1,5,5,'doctor','Please try to arrange next week.','2026-03-07 10:10');
"""

cursor.executescript(insert_sql)

conn.commit()
conn.close()

print("All data inserted successfully into chronic_care.db")