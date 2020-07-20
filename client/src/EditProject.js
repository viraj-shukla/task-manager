import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import EditAddHeader from './EditAddHeader';
import TasksNavBar from './TasksNavBar'
import ProjectForm from './ProjectForm';

class EditProject extends React.Component {
    state = {
        projectId: '',
        name: ''
    }

    componentDidMount() {
        this.setState({
            projectId: this.props.location.projectId,
            name: this.props.location.name
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSave = () => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/edit-project', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: this.state.projectId,
                name: this.state.name
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
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/delete-project', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: this.state.projectId
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                console.log(data)
                if (!data.error) {
                    if (data.status == 'no recent projects') {
                        this.props.history.push('/add-project')
                    }
                    else {
                        this.props.history.push('/project')
                    }
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
                        deleteBtnText="Delete Project"
                        handleSave={this.handleSave}
                        handleDelete={this.handleDelete} 
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

export default EditProject;