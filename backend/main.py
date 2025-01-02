# main.py

from flask import Blueprint, jsonify, request
from models import List
from db_init import db
from flask_login import current_user, login_required

# Initialize the Blueprint for main application routes related to Lists
main = Blueprint("main", __name__)

@main.route("/GetLists", methods=["GET"])
@login_required
def get_lists():
    """
    Retrieve all to-do lists associated with the currently authenticated user.

    Returns:
        JSON response containing a success message and a list of the user's to-do lists with HTTP status 200.
        If an error occurs, returns an error message with HTTP status 400.
    """
    success_message = "Successfully retrieved user's lists from the database."
    failure_message = "Failed to retrieve user's lists from the database."
    success_status = 200

    user_id = current_user.id

    try:
        # Query all lists belonging to the current user
        lists = List.query.filter_by(user_id=user_id).all()
        print(f"Lists for user {user_id}: {lists}")
        return (
            jsonify(
                {
                    "message": success_message,
                    "lists": [lst.to_dict() for lst in lists],
                }
            ),
            success_status,
        )
    except Exception as e:
        # Handle exceptions and return an error message
        return jsonify({"message": f"{failure_message}. Error is {e}"}), 400


@main.route("/Addlists", methods=["POST"])
@login_required
def add_list():
    """
    Add a new to-do list for the currently authenticated user.

    Expects:
        JSON payload with the 'name' of the new list.

    Returns:
        JSON response with a success message and HTTP status 200 on successful addition.
        If an error occurs, returns an error message with an appropriate HTTP status code.
    """
    try:
        data = request.get_json()
        list_name = data.get("name")

        if not list_name:
            return jsonify({"message": "List name is required!"}), 400

        # Create a new List instance
        new_list = List(name=list_name, user_id=current_user.id)

        # Add and commit the new list to the database
        db.session.add(new_list)
        db.session.commit()
        return jsonify({"message": "List added successfully!"}), 200
    except Exception as e:
        # Handle exceptions and return an error message
        return jsonify({"message": f"Error adding list: {e}"}), 400


@main.route("/DeleteList/<int:list_id>", methods=["DELETE"])
@login_required
def delete_list(list_id):
    """
    Delete a specific to-do list based on its ID.

    Args:
        list_id (int): The unique identifier of the list to be deleted.

    Returns:
        JSON response indicating successful deletion with HTTP status 200.
        If the list is not found, returns an error message with HTTP status 404.
    """
    try:
        # Query the list to delete, ensuring it belongs to the current user
        list_to_delete = List.query.filter_by(id=list_id, user_id=current_user.id).first()

        if not list_to_delete:
            return jsonify({"message": "List not found!"}), 404

        # Delete the list from the database
        db.session.delete(list_to_delete)
        db.session.commit()
        return jsonify({"message": "List deleted successfully!"}), 200
    except Exception as e:
        # Handle exceptions and return an error message
        return jsonify({"message": f"Error deleting list: {e}"}), 400


@main.route("/EditList/<int:list_id>", methods=["PUT"])
@login_required
def edit_list(list_id):
    """
    Edit the name of a specific to-do list.

    Args:
        list_id (int): The unique identifier of the list to be edited.

    Expects:
        JSON payload with the new 'name' for the list.

    Returns:
        JSON response indicating the successful update with HTTP status 200.
        If the list is not found, returns an error message with HTTP status 404.
    """
    try:
        data = request.get_json()
        new_name = data.get("name")

        if not new_name:
            return jsonify({"message": "New list name is required!"}), 400

        # Query the list to edit, ensuring it belongs to the current user
        list_to_edit = List.query.filter_by(id=list_id, user_id=current_user.id).first()

        if not list_to_edit:
            return jsonify({"message": "List not found!"}), 404

        # Update the list's name
        list_to_edit.name = new_name

        # Commit the changes to the database
        db.session.commit()
        return jsonify({"message": "List updated successfully!"}), 200
    except Exception as e:
        # Handle exceptions and return an error message
        return jsonify({"message": f"Error editing list: {e}"}), 400
