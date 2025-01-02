#tasks.py

from flask import Blueprint, jsonify, request, make_response
from models import List, Task
from db_init import db
from flask_login import current_user, login_required

# Initialize the Blueprint for task-related routes
tasks = Blueprint("tasks", __name__)

@tasks.route("/GetLists", methods=["GET"])
@login_required
def get_lists():
    """
    Retrieve all lists for the authenticated user.

    Returns:
        JSON response with a list of lists associated with the current user.
        HTTP status 200 on success, 500 on error.
    """
    try:
        # Fetch all lists for the current user
        lists = List.query.filter_by(user_id=current_user.id).all()
        # Return the lists in JSON format
        return jsonify({"lists": [list.to_dict() for list in lists]}), 200
    except Exception as e:
        # Log and handle exceptions
        print(f"Error fetching lists: {e}")
        return jsonify({"error": "Failed to fetch lists."}), 500

@tasks.route("/GetTasks/<int:list_id>", methods=["GET"])
@login_required
def get_tasks(list_id):
    """
    Retrieve all tasks associated with a given list ID for the authenticated user,
    including subtasks for each task.

    Args:
        list_id (int): The ID of the list to retrieve tasks for.

    Returns:
        JSON response containing a success message and a list of tasks with HTTP status 200.
        If an error occurs, returns an error message with HTTP status 500.
    """
    try:
        # Ensure the list belongs to the current user
        task_list = List.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"error": "List not found or unauthorized access."}), 404

        # Retrieve all tasks for the specified list
        tasks = Task.query.filter_by(list_id=list_id, parent_id=None).all()
        success_message = "Successfully retrieved all tasks from the database."
        success_status = 200

        # Convert tasks and their subtasks to dictionaries
        return jsonify({
            "message": success_message,
            "tasks": [task.to_dict() for task in tasks],
        }), success_status

    except Exception as e:
        # Log the exception and return an error response
        print(str(e))
        return make_response(
            jsonify({"error": "An error occurred while fetching the tasks."}),
            500,
        )

@tasks.route("/GetListDetails/<int:list_id>", methods=["GET"])
@login_required
def get_list_details(list_id):
    """
    Retrieve details of a specific list for the authenticated user.

    Args:
        list_id (int): The ID of the list to retrieve details for.

    Returns:
        JSON response with the list's details, including its name, with HTTP status 200.
        If the list is not found or access is unauthorized, returns an error message with HTTP status 404.
    """
    try:
        # Ensure the list belongs to the current user
        task_list = List.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"error": "List not found or unauthorized access."}), 404

        # Return the list details
        return jsonify({"listName": task_list.name}), 200

    except Exception as e:
        # Log the exception and return an error response
        print(f"Error fetching list details: {e}")
        return jsonify({"error": "An error occurred while fetching list details."}), 500

@tasks.route("/AddTask/<int:list_id>", methods=["POST"])
@login_required
def add_task(list_id):
    """
    Add a new task to a specified to-do list for the authenticated user.

    Args:
        list_id (int): The ID of the to-do list to add the task to.

    Expects:
        JSON payload with the 'name' of the new task.

    Returns:
        JSON response containing a success message with HTTP status 200.
        If an error occurs, returns an error message with an appropriate HTTP status code.
    """
    try:
        data = request.json  # Parse JSON data from the request body
        task_name = data.get("name")

        if not task_name:
            return jsonify({"error": "Task name is required."}), 400

        # Ensure the list belongs to the current user
        task_list = List.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"error": "List not found or unauthorized access."}), 404

        # Create and add the task with initial depth
        task = Task(name=task_name, list_id=list_id, depth=0)
        db.session.add(task)
        db.session.commit()

        return jsonify({"message": "Task added successfully!"}), 200

    except Exception as e:
        # Log the error and return an error response
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while adding the task."}), 500

@tasks.route("/AddSubtasks", methods=["POST"])
@login_required
def add_subtask():
    """
    Add a subtask to an existing task within a to-do list for the authenticated user.

    Expects:
        JSON payload with 'parent_id', 'name', and 'list_id'.

    Returns:
        JSON response containing a success message with HTTP status 200.
        If an error occurs, returns an error message with an appropriate HTTP status code.
    """
    try:
        data = request.json  # Parse JSON data from the request body
        parent_id = data.get("parent_id")
        subtask_name = data.get("name")
        subtask_list_id = data.get("list_id")

        # Validate required fields
        if not all([parent_id, subtask_name, subtask_list_id]):
            return jsonify({"error": "parent_id, name, and list_id are required."}), 400

        # Ensure the parent task exists and belongs to the current user
        parent_task = Task.query.filter_by(id=parent_id, list_id=subtask_list_id).first()
        if not parent_task:
            return jsonify({"error": "Parent task not found or unauthorized access."}), 404

        # Create and add the subtask
        subtask = Task(
            name=subtask_name,
            list_id=subtask_list_id,
            parent_id=parent_id
        )
        db.session.add(subtask)
        db.session.commit()

        # Calculate and update the depth of the subtask
        subtask.depth = subtask.calculate_depth()
        db.session.commit()

        return jsonify({"message": "Subtask added successfully!"}), 200

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while adding the subtask."}), 500

@tasks.route("/DeleteTask/<int:task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id):
    """
    Delete a specific task based on its ID for the authenticated user.

    Args:
        task_id (int): The unique identifier of the task to be deleted.

    Returns:
        JSON response indicating successful deletion with HTTP status 200.
        If the task is not found, returns an error message with HTTP status 404.
    """
    try:
        # Query the task to delete, ensuring it belongs to the current user
        task_to_delete = Task.query.join(List).filter(
            Task.id == task_id,
            List.user_id == current_user.id
        ).first()

        if not task_to_delete:
            return jsonify({"message": "Task not found or unauthorized access!"}), 404

        # Delete the task and its subtasks due to cascade
        db.session.delete(task_to_delete)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully!"}), 200

    except Exception as e:
        # Log the exception and return an error response
        print(str(e))
        return jsonify({"error": "An error occurred while deleting the task."}), 500

@tasks.route("/EditTask/<int:task_id>", methods=["PUT"])
@login_required
def edit_task(task_id):
    """
    Edit the details of a specific task for the authenticated user.

    Args:
        task_id (int): The unique identifier of the task to be edited.

    Expects:
        JSON payload with optional 'name' and 'completed' fields.

    Returns:
        JSON response indicating the successful update with HTTP status 200.
        If the task is not found, returns an error message with HTTP status 404.
    """
    try:
        data = request.json  # Parse JSON data from the request body
        task_to_edit = Task.query.join(List).filter(
            Task.id == task_id,
            List.user_id == current_user.id
        ).first()

        if not task_to_edit:
            return jsonify({"error": "Task not found or unauthorized access!"}), 404

        # Update the task's name if provided
        new_name = data.get("name")
        if new_name:
            task_to_edit.name = new_name

        # Update the task's completion status if provided
        if "completed" in data:
            task_to_edit.completed = data["completed"]

        db.session.commit()
        return jsonify({"message": "Task edited successfully!"}), 200

    except Exception as e:
        # Handle unexpected errors
        print(str(e))
        return jsonify({"error": "An error occurred while editing the task."}), 500

@tasks.route("/TaskCompleted/<int:task_id>", methods=["PUT"])
@login_required
def task_completed(task_id):
    """
    Toggle the completion status of a specific task for the authenticated user.

    Args:
        task_id (int): The unique identifier of the task to toggle.

    Returns:
        JSON response indicating the successful toggle with HTTP status 200.
        If the task is not found, returns an error message with HTTP status 404.
    """
    try:
        # Query the task to toggle, ensuring it belongs to the current user
        task_to_edit = Task.query.join(List).filter(
            Task.id == task_id,
            List.user_id == current_user.id
        ).first()

        if task_to_edit is None:
            return jsonify({"error": "Task not found or unauthorized access!"}), 404

        # Toggle the 'completed' status of the task
        task_to_edit.completed = not task_to_edit.completed

        db.session.commit()
        return jsonify({"message": "Task completion status toggled successfully!"}), 200

    except Exception as e:
        # Handle unexpected errors
        print(str(e))
        return jsonify({"error": "An error occurred while editing the task."}), 500

@tasks.route("/getUserIdByListId/<int:list_id>", methods=["GET"])
@login_required
def get_user_id_by_list_id(list_id):
    """
    Retrieve the user ID associated with a given list ID for the authenticated user.

    Args:
        list_id (int): The ID of the list to retrieve the user ID for.

    Returns:
        JSON response containing the user ID with HTTP status 200.
        If the list is not found, returns an error message with HTTP status 404.
    """
    try:
        # Query the list, ensuring it belongs to the current user
        lst = List.query.filter_by(id=list_id, user_id=current_user.id).first()
        if lst is None:
            return jsonify({"error": "List not found or unauthorized access!"}), 404

        user_id = lst.user_id
        return jsonify({"userId": user_id}), 200

    except Exception as e:
        # Log the exception and return an error response
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while retrieving the user ID."}), 500


@tasks.route("/moveTask/<int:task_id>", methods=["PUT"])
@login_required
def move_task_with_subtasks(task_id):
    """
    Move a task and its subtasks to a new list for the authenticated user.

    Args:
        task_id (int): The ID of the task to be moved.

    Expects:
        JSON payload with 'new_list_id' indicating the target list.

    Returns:
        JSON response indicating the successful move with HTTP status 200.
        If the task or target list is not found, returns an error message with appropriate HTTP status.
        If an error occurs, returns an error message with HTTP status 500.
    """
    try:
        data = request.json
        new_list_id = data.get("new_list_id")

        if new_list_id is None:
            return jsonify({"error": "New list ID is required."}), 400

        # Ensure the target list belongs to the current user
        target_list = List.query.filter_by(id=new_list_id, user_id=current_user.id).first()
        if not target_list:
            return jsonify({"error": "Target list not found or unauthorized access."}), 404

        # Retrieve the task to be moved, ensuring it belongs to the current user
        task_to_move = Task.query.join(List).filter(
            Task.id == task_id,
            List.user_id == current_user.id
        ).first()
        if task_to_move is None:
            return jsonify({"error": "Task not found or unauthorized access."}), 404

        # If this is a subtask being moved to a new list, update its parent relationship
        if task_to_move.parent_id is not None:
            task_to_move.parent_id = None  # Remove parent relationship when moving to new list
            task_to_move.depth = 0  # Reset depth since it's now a top-level task

        # Move the task and all its subtasks recursively to the new list
        move_task_recursively(task_to_move, new_list_id)

        db.session.commit()
        return jsonify({"message": "Task and all subtasks moved successfully!"}), 200

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred while moving the task: {e}")
        db.session.rollback()  # Rollback changes in case of error
        return jsonify({"error": "An error occurred while moving the task."}), 500

def move_task_recursively(task, new_list_id):
    """
    Recursively move a task and all its subtasks to a new list.

    Args:
        task (Task): The task to be moved.
        new_list_id (int): The ID of the target list.
    """
    task.list_id = new_list_id
    
    # Update depths for all subtasks
    for subtask in task.subtasks:
        subtask.list_id = new_list_id
        # Recalculate depth after move
        subtask.depth = subtask.calculate_depth()
        move_task_recursively(subtask, new_list_id)