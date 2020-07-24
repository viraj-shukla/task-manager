import React from 'react';
import api from './api'
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
        fetch(`${api}/get-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                foo: 'bar'
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.setState({
                        projectId: data.project.id,
                        name: data.project.name
                    })
                }
                if (data.error == "invalid user") {
                    this.props.history.push('/login')
                }
            })
            .catch(error => console.log(error))
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSave = () => {
        fetch(`${api}/edit-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                projectId: this.state.projectId,
                name: this.state.name
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

    handleDelete = () => {
        fetch(`${api}/delete-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                projectId: this.state.projectId
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    if (data.status == 'no recent projects') {
                        this.props.history.push('/add-project')
                    }
                    else {
                        this.props.history.push('/project')
                    }
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <TasksNavBar />
            
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