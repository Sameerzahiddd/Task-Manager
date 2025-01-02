# PrimeTodo List Application API Documentation

## Overview
PrimeTodo is a Flask-based web application designed for managing hierarchical to-do lists. It offers user authentication, allowing each user to create, edit, and manage their own lists and tasks. The application supports up to three levels of task hierarchy, enabling users to organize tasks and subtasks efficiently.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
    - [POST `/api/signup`](#post-apisignup)
    - [POST `/api/login`](#post-apilogin)
    - [POST `/api/logout`](#post-apilogout)
  - [Lists](#lists)
    - [GET `/api/GetLists`](#get-apigetlsts)
    - [POST `/api/Addlists`](#post-apiaddlists)
    - [DELETE `/api/DeleteList/<list_id>`](#delete-apideletelistlist_id)
    - [PUT `/api/EditList/<list_id>`](#put-apieditlistlist_id)
  - [Tasks](#tasks)
    - [GET `/api/GetTasks/<list_id>`](#get-apigettaskslist_id)
    - [POST `/api/AddTask/<list_id>`](#post-apiaddtasklist_id)
    - [POST `/api/AddSubtasks`](#post-apiaddsubtasks)
    - [DELETE `/api/DeleteTask/<task_id>`](#delete-apideletasktask_id)
    - [PUT `/api/EditTask/<task_id>`](#put-apiedittasktask_id)
    - [PUT `/api/TaskCompleted/<task_id>`](#put-apitaskcompletedtask_id)
    - [GET `/api/getUserIdByListId/<list_id>`](#get-apigetuseridbylist_id)
    - [PUT `/api/moveTask/<task_id>`](#put-apimovetasktask_id)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication:** Secure registration and login system ensuring each user manages their own data.
- **CRUD Operations:** Create, read, update, and delete functionality for both lists and tasks.
- **Hierarchical Task Management:** Organize tasks with up to three levels of subtasks for better task organization.
- **Task Completion:** Mark tasks as complete to track progress.
- **Task Movement:** Move tasks between different lists seamlessly.
- **Secure API:** Ensures users cannot access or modify other users' data.

## Technologies Used
- **Backend:** Flask, Flask-Login, Flask-CORS, Flask-SQLAlchemy, Werkzeug, Python-dotenv
- **Database:** SQLite (for development purposes)
- **Environment Management:** python-dotenv for handling environment variables

## Installation


