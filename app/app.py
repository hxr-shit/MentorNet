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
    cursor.execute("SELECT * FROM User")
    rows = cursor.fetchall()
    return jsonify([shape_user(r) for r in rows])

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM User WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Not found"}), 404
    return jsonify(shape_user(row))

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO User (name, email, user_type) VALUES (%s, %s, %s)",
        (data["name"], data["email"], data.get("user_type", "student"))
    )
    db.commit()
    return jsonify({"message": "User created", "id": cursor.lastrowid}), 201

def shape_user(row):
    name = row.get("name", "")
    return {
        "id": row["user_id"],
        "username": name.lower().replace(" ", "_"),
        "email": row.get("email", ""),
        "role": map_role(row.get("user_type", "student")),
        "industry": "Technology",
        "bio": "",
        "avatar": name[:2].upper() if name else "??",
        "grade": None,
        "interests": None,
        "created_at": str(row.get("created_at", ""))[:10],
    }

def map_role(user_type):
    mapping = {"student": "student", "counselor": "professional", "moderator": "admin"}
    return mapping.get(user_type, "student")

# ─── COMMUNITIES ─────────────────────────────────────────

@app.route("/communities", methods=["GET"])
def get_communities():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Community")
    rows = cursor.fetchall()
    return jsonify([shape_community(r) for r in rows])

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

def shape_community(row):
    return {
        "id": row["community_id"],
        "name": row.get("name", ""),
        "description": row.get("description", ""),
        "icon": "💬",
        "members": 0,
        "posts": [],
    }

# ─── POSTS (mapped to Questions) ─────────────────────────

@app.route("/posts", methods=["GET"])
def get_posts():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, u.name AS author_name, c.name AS community_name
        FROM Post p
        LEFT JOIN User u ON p.user_id = u.user_id
        LEFT JOIN Community c ON p.community_id = c.community_id
        ORDER BY p.created_at DESC
    """)
    rows = cursor.fetchall()
    return jsonify([shape_post(r) for r in rows])

@app.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.*, u.name AS author_name
        FROM Post p
        LEFT JOIN User u ON p.user_id = u.user_id
        WHERE p.post_id = %s
    """, (post_id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Not found"}), 404
    # get comments
    cursor.execute("""
        SELECT c.*, u.name AS author_name
        FROM Comment c
        LEFT JOIN User u ON c.user_id = u.user_id
        WHERE c.post_id = %s
        ORDER BY c.created_at ASC
    """, (post_id,))
    comments = cursor.fetchall()
    post = shape_post(row)
    post["answers"] = [shape_comment(c) for c in comments]
    return jsonify(post)

@app.route("/posts", methods=["POST"])
def create_post():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Post (title, content, user_id, community_id) VALUES (%s, %s, %s, %s)",
        (data["title"], data["content"], data["user_id"], data.get("community_id", 1))
    )
    db.commit()
    return jsonify({"message": "Post created", "id": cursor.lastrowid}), 201

def shape_post(row):
    name = row.get("author_name", "Unknown")
    return {
        "id": row["post_id"],
        "title": row.get("title", ""),
        "content": row.get("content", ""),
        "author_id": row.get("user_id"),
        "author": {
            "id": row.get("user_id"),
            "username": name.lower().replace(" ", "_"),
            "avatar": name[:2].upper() if name else "??",
        },
        "tags": [],
        "upvotes": 0,
        "upvoted_by": [],
        "answerCount": 0,
        "created_at": str(row.get("created_at", ""))[:10],
    }

# ─── COMMENTS (mapped to Answers) ────────────────────────

@app.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.*, u.name AS author_name
        FROM Comment c
        LEFT JOIN User u ON c.user_id = u.user_id
        WHERE c.post_id = %s
        ORDER BY c.created_at ASC
    """, (post_id,))
    rows = cursor.fetchall()
    return jsonify([shape_comment(r) for r in rows])

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

def shape_comment(row):
    name = row.get("author_name", "Unknown")
    return {
        "id": row["comment_id"],
        "question_id": row.get("post_id"),
        "author_id": row.get("user_id"),
        "author": {
            "id": row.get("user_id"),
            "username": name.lower().replace(" ", "_"),
            "avatar": name[:2].upper() if name else "??",
        },
        "content": row.get("content", ""),
        "upvotes": 0,
        "upvoted_by": [],
        "is_top": False,
        "created_at": str(row.get("created_at", ""))[:10],
    }

# ─── SESSIONS ────────────────────────────────────────────

@app.route("/sessions", methods=["GET"])
def get_sessions():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT cs.*, s.svc_type, s.user_id AS mentor_id, u.name AS mentor_name
        FROM Counselling_Sess cs
        LEFT JOIN Counselling_Svc s ON cs.svc_id = s.svc_id
        LEFT JOIN User u ON s.user_id = u.user_id
        ORDER BY cs.scheduled_time DESC
    """)
    rows = cursor.fetchall()
    return jsonify([shape_session(r) for r in rows])

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

def shape_session(row):
    name = row.get("mentor_name", "Unknown")
    return {
        "id": row["session_id"],
        "mentor_id": row.get("mentor_id"),
        "mentor": {
            "id": row.get("mentor_id"),
            "username": name.lower().replace(" ", "_"),
            "avatar": name[:2].upper() if name else "??",
        },
        "title": row.get("svc_type", "Session"),
        "description": f"{row.get('mode', 'Online')} session",
        "date": str(row.get("scheduled_time", ""))[:10],
        "capacity": 20,
        "attendees": [],
    }

# ─── SERVICES ────────────────────────────────────────────

@app.route("/services", methods=["GET"])
def get_services():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT s.*, u.name AS counselor_name
        FROM Counselling_Svc s
        LEFT JOIN User u ON s.user_id = u.user_id
    """)
    rows = cursor.fetchall()
    return jsonify(rows)

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

# ─── FEEDBACK ────────────────────────────────────────────

@app.route("/feedback", methods=["GET"])
def get_feedback():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.*, u.name AS user_name
        FROM Feedback f
        LEFT JOIN User u ON f.user_id = u.user_id
    """)
    rows = cursor.fetchall()
    return jsonify([shape_feedback(r) for r in rows])

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

def shape_feedback(row):
    return {
        "id": row["feedback_id"],
        "session_id": row.get("session_id"),
        "user_id": row.get("user_id"),
        "rating": row.get("rating"),
        "comment": row.get("comment", ""),
        "created_at": str(row.get("created_at", ""))[:10],
    }

# ─── STATS ───────────────────────────────────────────────

@app.route("/stats", methods=["GET"])
def get_stats():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) AS total FROM User")
    users = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) AS total FROM Post")
    posts = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) AS total FROM Counselling_Sess")
    sessions = cursor.fetchone()["total"]
    cursor.execute("SELECT COUNT(*) AS total FROM Feedback")
    feedbacks = cursor.fetchone()["total"]
    cursor.execute("SELECT AVG(rating) AS avg FROM Feedback")
    avg = cursor.fetchone()["avg"]
    return jsonify({
        "totalUsers": users,
        "totalQuestions": posts,
        "totalSessions": sessions,
        "totalFeedbacks": feedbacks,
        "avgRating": round(float(avg), 1) if avg else "N/A",
    })

# ─── RUN ─────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True)
