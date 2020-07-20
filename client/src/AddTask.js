import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import EditAddHeader from './EditAddHeader';
import TasksNavBar from './TasksNavBar'
import TaskForm from './TaskForm';

class AddTask extends React.Component {
    state = {
        projectId: '',
        subjectId: '',
        name: '',
        priority: "3",
        description: '',
        due: null
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = () => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/add-task', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
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

    componentDidMount() {
        this.setState({
            projectId: this.props.location.projectId,
            subjectId: this.props.location.subjectId,
            due: new Date()
        })
    }

    render() {
        return (
            <div>
                <TasksNavBar handleLogout={this.handleLogout} />

                <div class="edit-add-container">
                    <EditAddHeader 
                        saveBtnText="Add Task" 
                        handleSave={this.handleSubmit}
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

export default AddTask;