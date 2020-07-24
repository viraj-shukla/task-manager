import React from 'react';
import { Link } from 'react-router-dom';
import api from './api'
import './App.css';

class TasksNavBar extends React.Component {
    
    handleLogout = (event) => {
        fetch(`${api}/logout`, {
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
            .catch(error => { this.props.history.push('/') })
    }

    render() {
        return (
            <span class="nav">
                <Link to={'/edit-project'}>
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