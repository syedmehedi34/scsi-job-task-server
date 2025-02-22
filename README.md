# Task Management Server

## Overview

This is the backend server for the Job Portal application, built using **Node.js**, **Express.js**, and **MongoDB**. The server provides RESTful APIs for task management and user authentication.

## Features

- User authentication and registration.
- Task management (CRUD operations).
- Secure CORS configuration.
- MongoDB integration using `mongodb` package.
- Error handling and proper response status codes.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Cors**
- **Dotenv**
- **Jsonwebtoken**

## Installation

### Prerequisites

Ensure you have **Node.js** and **MongoDB** installed on your system.

### Steps

1.  Clone this repository:

    ```sh
    git clone https://github.com/syedmehedi34/scsi-job-task-server

    ```

2.  Install dependencies:

    ```sh
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following:

    ```env
    DB_USER=replace_your
    DB_PASS=replace_your
    ACCESS_TOKEN_SECRET=replace_your
    ```

4.  Start the server:

    ```sh
    npm start
    ```

    The server will be running at `http://localhost:5001`.

## API Endpoints

### User Endpoints

- **POST** `/users` - Create a new user.
- **GET** `/user?email=<email>` - Retrieve user details by email.

### Task Endpoints

- **GET** `/tasks?email=<email>` - Retrieve tasks by user email.
- **PATCH** `/tasks` - Update or insert a task.
- **PATCH** `/drag_tasks` - Update task category (Drag & Drop feature).
- **DELETE** `/tasks` - Remove a task.

### Root Endpoint

- **GET** `/` - Check if the server is running.

## Dependencies

```json
{
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.11.0"
}
```

## License

This project is licensed under the **ISC License**.

## Author

Syed Mehedi Hasan

---

Feel free to update the repository link and author details as needed!
