import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Priyanshu9",
    database="CareerSphereDB"
)

cursor = db.cursor()

def create_discussion():

    topic = input("Enter topic: ")
    message = input("Enter message: ")
    account_id = input("Enter account id: ")
    group_id = input("Enter group id: ")

    query = """
    INSERT INTO Discussions(topic,message,category,status,account_id,group_id)
    VALUES(%s,%s,'Question','Active',%s,%s)
    """

    cursor.execute(query,(topic,message,account_id,group_id))
    db.commit()

    print("Discussion created!")


def view_discussions():

    query = """
    SELECT d.topic, a.full_name
    FROM Discussions d
    JOIN Accounts a
    ON d.account_id = a.account_id
    """

    cursor.execute(query)

    results = cursor.fetchall()

    for row in results:
        print("Topic:",row[0]," | User:",row[1])


def book_session():

    service_id = input("Enter service id: ")
    date = input("Enter date (YYYY-MM-DD HH:MM:SS): ")

    query = """
    INSERT INTO MentorshipSessions
    (scheduled_datetime,duration_minutes,mode,session_status,service_id)
    VALUES(%s,60,'Online','Scheduled',%s)
    """

    cursor.execute(query,(date,service_id))
    db.commit()

    print("Session booked!")


def give_feedback():

    rating = input("Rating (1-5): ")
    comment = input("Comment: ")
    account_id = input("Account id: ")
    session_id = input("Session id: ")

    query = """
    INSERT INTO SessionFeedback
    (rating_score,review_comment,account_id,session_id)
    VALUES(%s,%s,%s,%s)
    """

    cursor.execute(query,(rating,comment,account_id,session_id))
    db.commit()

    print("Feedback saved!")


while True:

    print("\n--- MentorNet Menu ---")
    print("1 Create Discussion")
    print("2 View Discussions")
    print("3 Book Session")
    print("4 Give Feedback")
    print("5 Exit")

    choice = input("Choice: ")

    if choice == "1":
        create_discussion()

    elif choice == "2":
        view_discussions()

    elif choice == "3":
        book_session()

    elif choice == "4":
        give_feedback()

    elif choice == "5":
        break