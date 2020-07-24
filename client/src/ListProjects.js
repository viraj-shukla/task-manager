import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import api from './api'
import './App.css';
import TasksNavBar from './TasksNavBar'

class EditTask extends React.Component {
    state = {
        projects: []
    }

    componentDidMount() {
        fetch(`${api}/list-projects`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                foo: "bar"
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.setState({
                        projects: data.projects
                    })
                }
                if (data.error == "invalid user") {
                    this.props.history.push('/login')
                }
            })
            .catch(error => console.log(error))
    }

    handleAddProject = () => {
        this.props.history.push('/add-project')
    }

    handleSelect = (event) => {
        fetch(`${api}/select-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                projectId: event.currentTarget.id
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

    handleDelete = (event) => {
        fetch(`${api}/delete-project`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                projectId: event.currentTarget.id
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.go(0)
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <TasksNavBar handleLogout={this.handleLogout} />
            
                <div class="list-projects-container-div">
                    {this.state.projects.map(project => (
                        <div class="project-listing">
                            <span class="list-projects-container-span">
                                <b 
                                    class="project-name"
                                    id={project.id}
                                    onClick={this.handleSelect}
                                >
                                    {project.name}
                                </b>
                                <FontAwesomeIcon icon={faTrash}
                                    class="trash-icon"
                                    id={project.id}
                                    onClick={this.handleDelete}    
                                />
                            </span>
                        </div>
                    ))}
                        <div class="project-listing add-project">
                            <span class="list-projects-container-span">
                                <b 
                                    class="project-name project-name-add"
                                    onClick={this.handleAddProject}
                                >
                                <FontAwesomeIcon icon={faPlus}
                                    class="add-icon"
                                />
                                Add a project...
                                </b>
                            </span>
                        </div>

                </div>
            </div>
        )
    }
}

export default EditTask;