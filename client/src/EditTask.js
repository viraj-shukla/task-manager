import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import EditAddHeader from './EditAddHeader';
import TasksNavBar from './TasksNavBar'
import TaskForm from './TaskForm';

class EditTask extends React.Component {
    state = {
        taskId: '',
        subjectId: '',
        projectId: '',
        name: '',
        priority: '',
        description: '',
        due: null
    }

    componentDidMount() {
        this.setState({
            taskId: this.props.location.state.taskId,
            subjectId: this.props.location.state.subjectId,
            projectId: this.props.location.state.projectId,
            name: this.props.location.state.name,
            priority: this.props.location.state.priority,
            description: this.props.location.state.description,
            due: this.props.location.state.due
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSave = () => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/edit-task', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                taskId: this.state.taskId,
                projectId: this.state.projectId,
                subjectId: this.state.subjectId,
                name: this.state.name,
                priority: this.state.priority,
                description: this.state.description,
                due: this.state.due
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                console.log(data)
                if (!data.error) {
                    this.props.history.push('/project')
                }
            })
            .catch(error => console.log(`Error: ${error}`))
    }

    handleDelete = () => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/delete-task', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                taskId: this.state.taskId,
                projectId: this.state.projectId,
                subjectId: this.state.subjectId
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                console.log(data)
                if (!data.error) {
                    this.props.history.push('/project')
                }
            })
            .catch(error => console.log(`Error: ${error}`))
    }

    render() {
        return (
            <div>
                <TasksNavBar handleLogout={this.handleLogout} />
            
                <div class="edit-add-container">
                    <EditAddHeader 
                        saveBtnText="Save Changes" 
                        deleteBtnText="Delete Task"
                        handleSave={this.handleSave}
                        handleDelete={this.handleDelete}
                    />

                    <TaskForm
                        name={this.state.name}
                        priority={this.state.priority}
                        due={this.state.due}
                        description={this.state.description}
                        handleChange={this.handleChange}
                    /> 
                </div>
            </div>
        )
    }
}

export default EditTask;