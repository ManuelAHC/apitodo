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

@app.route('/api/update', methods=['PUT'])
def update_task():
    data = request.get_json()

    if not data or not 'id' in data:
        return jsonify({"message": "Incomplete data."}), 400

    task = Task.query.get(data['id'])

    if not task:
        return jsonify({"message": "Task not found."}), 404

    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data and data['status'] in TaskStatus.__members__:
        task.status = TaskStatus[data['status']]

    db.session.commit()

    return jsonify({"message": "Task was updated."}), 200

if __name__ == '__main__':
    app.run(debug=True)
