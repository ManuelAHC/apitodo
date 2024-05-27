from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
import enum

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/todo_app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class TaskStatus(enum.Enum):
    pending = 'pending'
    in_process = 'in process'
    completed = 'completed'

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(Enum(TaskStatus), default=TaskStatus.pending)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/api_en_python/create', methods=['POST'])
def create_task():
    data = request.get_json()

    if not data or not 'title' in data:
        return jsonify({"message": "Incomplete data."}), 400

    new_task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'pending')
    )

    try:
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task was created."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Unable to create task.", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
