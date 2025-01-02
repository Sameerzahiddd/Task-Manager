# auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from models import User, db

# Initialize the Blueprint for authentication routes
auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user by creating an account with a username, email, password, and name.

    Expects:
        JSON payload with 'username', 'email', 'password', and 'name'.

    Returns:
        JSON response with a success message and HTTP status 201 on successful registration.
        JSON response with an error message and appropriate HTTP status code on failure.
    """
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")

        # Validate required fields
        if not all([username, email, password, name]):
            return jsonify({"message": "All fields are required!"}), 400

        # Check for existing username
        if User.query.filter_by(username=username).first():
            return jsonify({"message": "Username already exists!"}), 400

        # Check for existing email
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists!"}), 400

        # Hash the password for security
        password_hash = generate_password_hash(password)

        # Create a new User instance
        new_user = User(
            username=username,
            email=email,
            name=name,
            password_hash=password_hash
        )

        # Add and commit the new user to the database
        db.session.add(new_user)
        db.session.commit()
        print(f"New user created: {new_user.username}")

        return jsonify({"message": "New user created!"}), 201
    except KeyError as e:
        # Handle missing fields in the JSON payload
        print(f"Missing field: {e}")
        return jsonify({"message": f"Missing field: {e}"}), 400
    except Exception as e:
        # Handle unexpected errors
        print(f"Error creating new user: {e}")
        return jsonify({"message": f"Error creating new user: {e}"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user by verifying their username/email and password.

    Expects:
        JSON payload with 'login' (username or email) and 'password'.

    Returns:
        JSON response with a success message, username, and HTTP status 200 on successful login.
        JSON response with an error message and appropriate HTTP status code on failure.
    """
    try:
        data = request.get_json()
        login = data.get("login")  # Can be either username or email
        password = data.get("password")

        # Validate required fields
        if not all([login, password]):
            return jsonify({"message": "Login and password are required!"}), 400

        # Attempt to find the user by username or email
        user = (
            User.query.filter_by(username=login).first()
            or User.query.filter_by(email=login).first()
        )

        # Verify the user's password
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"message": "Username or password is incorrect!"}), 400

        # Log the user in using Flask-Login
        login_user(user)
        print(f"User {user.username} logged in successfully! Session id: {user.id}")

        return jsonify({"message": "Logged in successfully!", "username": user.username}), 200 
    except KeyError as e:
        # Handle missing fields in the JSON payload
        print(f"Missing field: {e}")
        return jsonify({"message": f"Missing field: {e}"}), 400
    except Exception as e:
        # Handle unexpected errors
        print(f"Error logging in: {e}")
        return jsonify({"message": f"Error logging in: {e}"}), 400


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Log out the currently authenticated user.

    Returns:
        JSON response with a success message and HTTP status 200 on successful logout.
        JSON response with an error message and appropriate HTTP status code on failure.
    """
    try:
        print(f"User {current_user.username} logged out successfully!")
        logout_user()
        return jsonify({"message": "Logged out successfully!"}), 200
    except Exception as e:
        # Handle unexpected errors
        print(f"Error logging out: {e}")
        return jsonify({"message": f"Error logging out: {e}"}), 400
    

@auth_bp.route("/current_user", methods=["GET"])
@login_required
def current_user_route():
    """
    Fetch the currently logged-in user's information.

    Returns:
        JSON response with user details and HTTP status 200.
    """
    # Assuming your user object has fields like 'username' and 'email'
    user_info = {
        "username": current_user.username,
        "email": current_user.email,
        # Include any other fields you want to expose, if available
    }
    return jsonify(user_info), 200
