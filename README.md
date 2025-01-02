# TaskManager

## A full-stack task management system with nested task capabilities, drag-and-drop functionality, and user authentication.

[View Project Demo](https://www.loom.com/share/074b5e0650e84b55b6bdf797f256fc25?sid=6479f2f7-f561-4ced-832a-ef0ab1c6dc45)

[GitHub Repository](https://github.com/Sameerzahidd/TaskManager)

## Features
- User authentication and authorization
- Create, read, update, and delete tasks
- Nested subtasks with unlimited depth
- Drag-and-drop task organization
- Real-time task status updates
- Secure password hashing
- Cross-Origin Resource Sharing (CORS) support
- Session management with Flask-Login

## Prerequisites
- Python 3.8+
- Node.js 14+
- Git
- SQLite (default) or PostgreSQL

## Technology Stack
### Backend
- Flask
- Flask-Login (authentication)
- Flask-SQLAlchemy (ORM)
- Flask-CORS
- Werkzeug (password hashing)

### Frontend
- React
- React DnD (drag-and-drop)
- React Router
- Axios
- Tailwind CSS

## Project Structure
```
TaskManager/
├── backend/
│   ├── auth.py          # Authentication routes
│   ├── tasks.py         # Task management routes
│   ├── models.py        # Database models
│   ├── server.py        # Main Flask application
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   └── App.js
    └── package.json
```

## Setup & Installation

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Sameerzahidd/TaskManager.git
cd TaskManager/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (create .env file)
echo "DATABASE_URI=sqlite:///database.db
SECRET_KEY=your_secret_key_here" > .env

# Run the server
python server.py
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/current_user` - Get current user info

### Tasks
- `GET /api/GetLists` - Retrieve all lists
- `GET /api/GetTasks/<list_id>` - Get tasks for specific list
- `POST /api/AddTask/<list_id>` - Create new task
- `POST /api/AddSubtasks` - Add subtask to existing task
- `DELETE /api/DeleteTask/<task_id>` - Delete task
- `PUT /api/EditTask/<task_id>` - Update task details
- `PUT /api/TaskCompleted/<task_id>` - Toggle task completion
- `PUT /api/moveTask/<task_id>` - Move task between lists
