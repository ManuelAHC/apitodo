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

@app.route('/api_en_python/read', methods=['GET'])
def read_tasks():
    tasks = Task.query.all()
    tasks_list = []
    for task in tasks:
        task_data = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status.value,
            'created_at': task.created_at
        }
        tasks_list.append(task_data)
    
    if len(tasks_list) > 0:
        return jsonify({"records": tasks_list}), 200
    else:
        return jsonify({"message": "No tasks found."}), 404

if __name__ == '__main__':
    app.run(debug=True)
