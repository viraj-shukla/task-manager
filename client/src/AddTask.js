import React from 'react';
import api from './api'
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
        due: null,
        loaded: false
    }

    componentDidMount() {
        if (!this.props.location.projectId) {
            this.props.history.push('/login')
        }
        else {
            this.setState({
                projectId: this.props.location.projectId,
                subjectId: this.props.location.subjectId,
                due: new Date(),
                loaded: true
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = () => {
        fetch(`${api}/add-task`, {
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
                if (!data.error) {
                    this.props.history.push('/project')
                }
            })
            .catch(error => console.log(error))
    }

    content = () => (
        <div class="edit-add-container">
            <EditAddHeader 
                saveBtnText="Add Task" 
                handleSave={this.handleSubmit}
            />

            <TaskForm
                name={this.state.name}
                priority={this.state.priority}
                priorityColors={this.props.location.priorityColors}
                due={this.state.due}
                description={this.state.description}
                handleChange={this.handleChange}
            /> 
        </div>
    )

    render() {
        return (
            <div>
                <TasksNavBar />

                {this.state.loaded ? this.content() : null}
            </div>
            
        )
    }
}

export default AddTask;