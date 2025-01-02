# models.py

from db_init import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    """
    User model representing a registered user.

    Attributes:
        id (int): Primary key.
        username (str): Unique username for the user.
        email (str): Unique email address for the user.
        name (str): Full name of the user.
        password_hash (str): Hashed password for authentication.
        lists (List): Relationship to the user's to-do lists.
    """
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)  # New field for user's full name
    password_hash = db.Column(db.String(128), nullable=False)

    # Relationship to to-do lists
    lists = db.relationship("List", backref="user", lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.name}')"

    def to_dict(self):
        """
        Serialize the User object to a dictionary.

        Returns:
            dict: A dictionary containing user details.
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name,  # Include the name in the serialized output
            "lists": [lst.to_dict() for lst in self.lists],
        }


class List(db.Model):
    """
    List model representing a to-do list created by a user.

    Attributes:
        id (int): Primary key.
        name (str): Name of the list.
        user_id (int): Foreign key linking to the User who owns the list.
        tasks (Task): Relationship to tasks within the list.
    """
    __tablename__ = 'list'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Relationship to tasks
    tasks = db.relationship("Task", backref="list", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"List('{self.name}', User ID: '{self.user_id}')"

    def to_dict(self):
        """
        Serialize the List object to a dictionary.

        Returns:
            dict: A dictionary containing list details.
        """
        return {
            "id": self.id,
            "name": self.name,
            "tasks": [task.to_dict() for task in self.tasks],
        }


class Task(db.Model):
    """
    Task model representing a task within a to-do list, which can have subtasks.

    Attributes:
        id (int): Primary key.
        name (str): Name of the task.
        parent_id (int): Foreign key linking to the parent task, if any.
        list_id (int): Foreign key linking to the List the task belongs to.
        depth (int): Depth level of the task in the hierarchy (0 to 3).
        completed (bool): Status indicating if the task is completed.
        subtasks (Task): Relationship to subtasks.
    """
    __tablename__ = 'task'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("task.id"), nullable=True)
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"), nullable=True)
    depth = db.Column(db.Integer, nullable=False, default=0)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    # Relationship to subtasks
    subtasks = db.relationship(
        "Task",
        backref=db.backref("parent", remote_side=[id]),
        cascade="all, delete, delete-orphan",
        lazy=True
    )

    def calculate_depth(self):
        """
        Calculate the depth of the task in the hierarchy, ensuring it does not exceed 3.

        Returns:
            int: The calculated depth of the task.
        """
        def calculate_depth_recursive(task):
            if task.parent is None:
                return 0
            else:
                parent_depth = calculate_depth_recursive(task.parent)
                return parent_depth + 1 if parent_depth < 3 else 3

        if self.parent_id is not None:
            return calculate_depth_recursive(self)
        else:
            return 0

    def to_dict(self):
        """
        Serialize the Task object to a dictionary.

        Returns:
            dict: A dictionary containing task details, including subtasks.
        """
        return {
            "id": self.id,
            "name": self.name,
            "parent_id": self.parent_id,
            "list_id": self.list_id,
            "depth": self.depth,
            "completed": self.completed,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
        }
