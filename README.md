# CampusConnect — Student Task & Event Manager

## 1. Project Overview

CampusConnect is a full-stack web application designed to help college students organize their academic tasks, track deadlines, and manage their work efficiently. It provides a simple interface for creating, viewing, updating, and deleting tasks in one place.

## 2. Problem Statement

College students often manage multiple assignments, examinations, project deadlines, and academic activities simultaneously. Keeping track of these activities manually can lead to missed deadlines and poor time management.

CampusConnect addresses this problem by providing a centralized digital platform to manage student tasks and monitor their progress.

## 3. Objectives

- To provide an easy-to-use student task management system.
- To create, view, update, and delete tasks.
- To track task priorities, due dates, and completion status.
- To develop a responsive user interface.
- To integrate a React frontend with a Node.js and Express backend.
- To store task information persistently using MongoDB.

## 4. Features

- Add new academic tasks.
- View saved tasks.
- Update task details and status.
- Delete tasks.
- Set task priorities and due dates.
- Track task progress using task statuses.
- Store task data in MongoDB.
- Access the application through a web browser.

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Application logic |
| React.js | Frontend user interface |
| Node.js | JavaScript runtime for the backend |
| Express.js | REST API development |
| MongoDB | Database for storing tasks |
| Mongoose | MongoDB object modeling |
| Vite | Frontend development and build tool |
| Vercel | Application deployment |
| Git and GitHub | Version control and source code hosting |

## 6. Application Architecture

The application follows a client-server architecture.

1. The React frontend provides the user interface.
2. The frontend sends HTTP requests to the Express REST API.
3. The backend processes requests and communicates with MongoDB through Mongoose.
4. MongoDB stores task information.
5. The backend returns responses to the frontend, which updates the displayed task list.

## 7. CRUD Operations

The application demonstrates the following database operations:

- **Create:** Add a new task.
- **Read:** Retrieve and display saved tasks.
- **Update:** Modify task details or status.
- **Delete:** Remove a task.

These operations are implemented through REST API endpoints and connected to MongoDB.

## 8. Project Structure

```text
CampusConnect/
├── client/
│   ├── src/
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── index.js
│   ├── Task.js
│   └── package.json
├── api/
│   └── [...path].js
├── package.json
├── vercel.json
└── .gitignore
```

## 9. Installation and Setup

### Prerequisites

Install Node.js and npm, and create a MongoDB database.

### Clone the repository

```bash
git clone https://github.com/jasmitasri9-lgtm/CampusConnect.git
cd CampusConnect
```

### Install dependencies

```bash
npm install
npm --prefix client install
npm --prefix server install
```

### Configure environment variables

Create a `.env` file inside the `server` directory and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
```

Replace the example value with your own MongoDB connection string. Do not commit credentials or environment files to GitHub.

### Run the backend

```bash
npm --prefix server start
```

### Run the frontend

Open a second terminal and run:

```bash
npm --prefix client run dev
```

Open the local URL displayed by Vite in your browser.

## 10. Deployment

The application is deployed using Vercel, with MongoDB Atlas providing cloud database storage.

- **GitHub Repository:** https://github.com/jasmitasri9-lgtm/CampusConnect
- **Live Application:** https://campusconnect-lyart-zeta.vercel.app/

## 11. Testing

The deployed application was tested for the main CRUD workflow:

- Creating a task.
- Viewing saved tasks after refreshing the page.
- Updating a task's status.
- Deleting a temporary test task and confirming that the deletion persisted after refreshing.
- Checking the dashboard in a mobile-sized browser preview.

## 12. Future Enhancements

- Student registration and login.
- Calendar integration and deadline reminders.
- Event creation and registration.
- Search, filtering, and sorting.
- Notifications for approaching deadlines.

## 13. Conclusion

CampusConnect demonstrates the development and deployment of a full-stack web application using React.js, Node.js, Express.js, and MongoDB. It provides a practical solution for organizing academic tasks while demonstrating responsive UI design, REST API integration, and persistent CRUD operations.
