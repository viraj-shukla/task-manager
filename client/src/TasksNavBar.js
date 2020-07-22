import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class TasksNavBar extends React.Component {
    
    handleLogout = (event) => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/logout', {
            method: 'GET',
            mode: 'cors',
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.push('/')
                }
            })
            .catch(error => console.log(`Error: ${error}`))
    }

    render() {
        return (
            /*<ul class="nav">
                <Link to={'/'}><li>Settings</li></Link>
                <Link to={'/'} onClick={this.props.handleLogout}><li>Log Out</li></Link>                
            </ul>*/
            <span class="nav">
                <Link to={{
                    pathname: '/edit-project',
                    projectId: this.props.projectId,
                    name: this.props.name
                }}>
                    <div class="left">
                        Edit Project
                        </div>
                </Link>
            
                <Link to={'/list-projects'}>
                    <div class="left">
                        Your Projects
                    </div>
                </Link>

                <Link to={'/task-chart'}>
                    <div class="left">
                        View Chart
                    </div>
                </Link>
            


                <Link to={'/'} onClick={this.handleLogout}>
                    <div class="right">
                        Log Out
                    </div>
                </Link>

                <Link to={'/settings'}>
                    <div class="right">
                        Settings
                    </div>
                </Link>
                
            </span>
        )
    }
}

export default TasksNavBar;

//<li><Link to={'/login'}>Log In</Link></li>
//<li><Link to={'/signup'}>Sign Up</Link></li>