from app import app, db, Task
from flask import request, jsonify

@app.route('/api/create', methods=['POST'])
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
