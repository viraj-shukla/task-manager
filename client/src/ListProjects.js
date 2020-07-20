import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './App.css';
import EditAddHeader from './EditAddHeader';
import TasksNavBar from './TasksNavBar'

class EditTask extends React.Component {
    state = {
        projects: []
    }

    componentDidMount() {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/list-projects', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                foo: "bar"
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                console.log(data)
                if (!data.error) {
                    this.setState({
                        projects: data.projects
                    })
                }
            })
            .catch(error => console.log(`Error: ${error}`))
    }

    handleAddProject = () => {
        this.props.history.push('/add-project')
    }

    handleDelete = (event) => {
        console.log(event.currentTarget.id)
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/delete-project', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: event.currentTarget.id
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                console.log(data)
                if (!data.error) {
                    this.props.history.go(0)
                }
            })
            .catch(error => console.log(`Error: ${error}`))
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
                                    projectId={project.id}
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