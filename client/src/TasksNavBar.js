import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class TasksNavBar extends React.Component {    
    render() {
        return (
            /*<ul class="nav">
                <Link to={'/'}><li>Settings</li></Link>
                <Link to={'/'} onClick={this.props.handleLogout}><li>Log Out</li></Link>                
            </ul>*/
            <span class="nav">
                <div class="left">
                    <Link to={{
                        pathname: '/edit-project',
                        projectId: this.props.projectId,
                        name: this.props.name
                    }}>
                        Edit Project
                    </Link>
                </div>
                <div class="left">
                    <Link to={'/list-projects'}>Your Projects</Link>
                </div>
                <div class="center-separator">

                </div>
                <div class="right">
                    <Link to={'/settings'}>Settings</Link>
                </div>
                <div class="right">
                    <Link to={'/logout'} onClick={this.props.handleLogout}>Log Out</Link>
                </div>
            </span>
        )
    }
}

export default TasksNavBar;

//<li><Link to={'/login'}>Log In</Link></li>
//<li><Link to={'/signup'}>Sign Up</Link></li>