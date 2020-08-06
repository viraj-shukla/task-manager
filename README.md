# Lazuli Task Manager

A card-style task manager built in React.js, with an Express + Node.js backend and Firebase hosting.

View here: https://task-manager-ed416.web.app

Features easily viewable priority properties of tasks, quick tasks function for projects, and time charts for projects.
- Tasks color-coded by priority to easily see importance.
- Quick notes function to keep project-related notes in one place.
- Chart of all deadlines in one easily viewable display.
- Automatically incrementing priorities by due date.
- Customization of name, due date, priority, and description for tasks.
- Multiple projects per user, with ability to switch between them.
- User authentication and email/password/name reset.

To run in test mode:
- Set run mode from production to test in ```client/api.js``` and ```functions/index.js```.
- Run the React frontend:
```
$ cd client
client$ npm start
```
- Run the Firebase backend:
```
$ firebase serve
```