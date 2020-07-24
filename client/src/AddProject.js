import React from 'react';
import api from './api'
import './App.css';
import TasksNavBar from './TasksNavBar'
import EditAddHeader from './EditAddHeader';
import ProjectForm from './ProjectForm';

class AddProject extends React.Component {
    state = {
        name: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        fetch(`${api}/add-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                name: this.state.name
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.push('/project')
                }
                if (data.error == "invalid user") {
                    this.props.history.push('/login')
                }
            })
            .catch(error => console.log(error))

        event.preventDefault()
    }

    render() {
        return (
            <div>
                <TasksNavBar />

                <div class="edit-add-container">
                    <EditAddHeader 
                        saveBtnText="Add Project" 
                        handleSave={this.handleSubmit}
                    />

                    <ProjectForm
                        name={this.state.name}
                        handleChange={this.handleChange}
                    />
                </div>
            </div>
            
        )
    }
}

export default AddProject;