import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home'
import Project from './Project'
import Signup from './Signup'
import Login from './Login'
import AddProject from './AddProject'
import AddSubject from './AddSubject'
import AddTask from './AddTask'
import EditProject from './EditProject'
import EditSubject from './EditSubject'
import EditTask from './EditTask'
import ListProjects from './ListProjects'
import Settings from './Settings'
import TaskChart from './TaskChart'

// https://us-central1-task-manager-ed416.cloudfunctions.net/api

/*
  TODO:
  - Create daily tasks
  - Create list-projects page & route
  - Create settings page & routes
  - Handle logout in navbar
  - Setup home page
  - Add due dates to task view
  - Set due date reminders
  - Auto-change priority by due date
*/

function App() {
  return (
    <Router>
        <div class="app">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/project" component={Project} />
            <Route path="/add-project" component={AddProject} />
            <Route path="/add-subject" component={AddSubject} />
            <Route path="/add-task" component={AddTask} />
            <Route path="/edit-project" component={EditProject} />
            <Route path="/edit-subject" component={EditSubject} />
            <Route path="/edit-task" component={EditTask} />
            <Route path="/list-projects" component={ListProjects} />
            <Route path="/settings" component={Settings} />
            <Route path="/task-chart" component={TaskChart} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
