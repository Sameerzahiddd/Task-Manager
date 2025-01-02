# server.py

from flask import Flask, jsonify
from flask_cors import CORS
from db_init import db
from models import User
from main import main
from tasks import tasks
from auth import auth_bp
from flask_login import LoginManager
import os
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) with support for credentials
CORS(app, supports_credentials=True)

# Configuration settings for SQLAlchemy and session cookies
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "sqlite:///database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "your_default_secret_key")  # Replace with a strong secret key

# Register Blueprints for different route groups
app.register_blueprint(main, url_prefix="/api")
app.register_blueprint(tasks, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

# Initialize SQLAlchemy with the Flask app
db.init_app(app)

# Initialize Flask-Login for managing user sessions
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """
    Load a user from the database by their user ID.

    Args:
        user_id (str): The unique identifier of the user.

    Returns:
        User: The user object if found, else None.
    """
    return User.query.get(int(user_id))


# Create all database tables before the first request
with app.app_context():
    db.create_all()


# **Add the Root Route Here**
@app.route("/", methods=["GET"])
def home():
    """
    Root route to confirm that the Flask app is running.

    Returns:
        JSON response with a confirmation message.
    """
    return jsonify({"message": "Flask app is running successfully!"}), 200


if __name__ == "__main__":
    # Run the Flask development server
    app.run(port=8000, debug=True)
