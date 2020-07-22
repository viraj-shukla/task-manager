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
  ** Fix content height from navbar
  ** Shift subjects sideways
  ** Quick tasks - fix height issue
  ** Fix list-projects project deletion
  ** Test settings page
  ** Style task forms (name, priority)
  ** Handle non-authentication in backend
  ** Handle logout in navbar
  ** Add due dates to task view
  ** Login/signup error handling
  * Make priority values/colors dynamic, and changeable in project edit
  * Add sign up button to home page
  * Set due date reminders
  * Auto-change priority by due date
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
