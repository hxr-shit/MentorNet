from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306))
    )

# ─── USERS ───────────────────────────────────────────────

@app.route("/users", methods=["GET"])
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT user_id, name, email, user_type, verification_status, created_at FROM User")
    return jsonify(cursor.fetchall())

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO User (name, email, user_type) VALUES (%s, %s, %s)",
        (data["name"], data["email"], data["user_type"])
    )
    db.commit()
    return jsonify({"message": "User created", "id": cursor.lastrowid}), 201

# ─── COMMUNITIES ─────────────────────────────────────────

@app.route("/communities", methods=["GET"])
def get_communities():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Community")
    return jsonify(cursor.fetchall())

@app.route("/communities", methods=["POST"])
def create_community():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Community (name, description) VALUES (%s, %s)",
        (data["name"], data.get("description", ""))
    )
    db.commit()
    return jsonify({"message": "Community created", "id": cursor.lastrowid}), 201

# ─── POSTS ───────────────────────────────────────────────

@app.route("/posts", methods=["GET"])
def get_posts():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.post_id, p.title, p.content, p.created_at,
               u.name AS author, c.name AS community
        FROM Post p
        JOIN User u ON p.user_id = u.user_id
        JOIN Community c ON p.community_id = c.community_id
        ORDER BY p.created_at DESC
    """)
    return jsonify(cursor.fetchall())

@app.route("/posts", methods=["POST"])
def create_post():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Post (title, content, user_id, community_id) VALUES (%s, %s, %s, %s)",
        (data["title"], data["content"], data["user_id"], data["community_id"])
    )
    db.commit()
    return jsonify({"message": "Post created", "id": cursor.lastrowid}), 201

# ─── COMMENTS ────────────────────────────────────────────

@app.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.comment_id, c.content, c.created_at, u.name AS author
        FROM Comment c
        JOIN User u ON c.user_id = u.user_id
        WHERE c.post_id = %s
        ORDER BY c.created_at ASC
    """, (post_id,))
    return jsonify(cursor.fetchall())

@app.route("/posts/<int:post_id>/comments", methods=["POST"])
def create_comment(post_id):
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Comment (content, user_id, post_id) VALUES (%s, %s, %s)",
        (data["content"], data["user_id"], post_id)
    )
    db.commit()
    return jsonify({"message": "Comment added", "id": cursor.lastrowid}), 201

# ─── COUNSELLING SERVICES ────────────────────────────────

@app.route("/services", methods=["GET"])
def get_services():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT s.svc_id, s.svc_type, s.fee, s.availability, u.name AS counselor
        FROM Counselling_Svc s
        JOIN User u ON s.user_id = u.user_id
    """)
    return jsonify(cursor.fetchall())

@app.route("/services", methods=["POST"])
def create_service():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Counselling_Svc (svc_type, fee, availability, user_id) VALUES (%s, %s, %s, %s)",
        (data["svc_type"], data["fee"], data["availability"], data["user_id"])
    )
    db.commit()
    return jsonify({"message": "Service created", "id": cursor.lastrowid}), 201

# ─── SESSIONS ────────────────────────────────────────────

@app.route("/sessions", methods=["GET"])
def get_sessions():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT cs.session_id, cs.scheduled_time, cs.duration, cs.mode, cs.status,
               s.svc_type
        FROM Counselling_Sess cs
        JOIN Counselling_Svc s ON cs.svc_id = s.svc_id
        ORDER BY cs.scheduled_time DESC
    """)
    return jsonify(cursor.fetchall())

@app.route("/sessions", methods=["POST"])
def book_session():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """INSERT INTO Counselling_Sess (scheduled_time, duration, mode, status, svc_id)
           VALUES (%s, %s, %s, 'Scheduled', %s)""",
        (data["scheduled_time"], data.get("duration", 60), data.get("mode", "Online"), data["svc_id"])
    )
    db.commit()
    return jsonify({"message": "Session booked", "id": cursor.lastrowid}), 201

# ─── FEEDBACK ────────────────────────────────────────────

@app.route("/feedback", methods=["GET"])
def get_feedback():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.feedback_id, f.rating, f.comment, u.name AS user, f.session_id
        FROM Feedback f
        JOIN User u ON f.user_id = u.user_id
    """)
    return jsonify(cursor.fetchall())

@app.route("/feedback", methods=["POST"])
def give_feedback():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Feedback (rating, comment, user_id, session_id) VALUES (%s, %s, %s, %s)",
        (data["rating"], data["comment"], data["user_id"], data["session_id"])
    )
    db.commit()
    return jsonify({"message": "Feedback saved", "id": cursor.lastrowid}), 201

# ─── RUN ─────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True)
