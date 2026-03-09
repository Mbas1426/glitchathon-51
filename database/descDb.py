import sqlite3

db_path = "./database/chronic_care.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("""
SELECT name 
FROM sqlite_master 
WHERE type='table' AND name NOT LIKE 'sqlite_%'
""")

tables = cursor.fetchall()

for table in tables:
    table_name = table[0]

    cursor.execute("""
    SELECT sql
    FROM sqlite_master
    WHERE type='table' AND name=?
    """, (table_name,))

    schema = cursor.fetchone()[0]

    print(schema)
    print()

conn.close()