import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import tasks from './sampleTasks'
import TasksNavBar from './TasksNavBar'
import autosize from 'autosize'

class Project extends React.Component {
    state = {
        project: {
            id: '',
            subjects: []
        },
        quickTasks: '',
        editingQuickTasks: false
    }

    sortTasks = (task1, task2) => {
        return task1.priority.localeCompare(task2.priority)
    }

    beginEditingQuickTasks = () => {
        this.setState({
            editingQuickTasks: true
        })
    }

    handleQuickTaskChange = (event) => {
        this.setState({
            quickTasks: event.target.value,
            editingQuickTasks: true
        })
    }

    getNumLines = (text = this.state.quickTasks) => {
        let lines = text.split("\n")
        console.log(lines.length)
        return lines.length
    }

    endEditingQuickTasks = (event) => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/edit-quicktask', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: this.state.project.id,
                quickTasks: this.state.quickTasks
            })
        })
        .then(res => res.text())
        .then(dataJSON => {
            let data = JSON.parse(dataJSON)
            if (!data.error) {
                this.setState({
                    editingQuickTasks: false
                })
            }
        })
    }

    handleLogout = () => {
        console.log('logout')
    }

    componentDidMount() {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/get-project', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                foo: 'bar'
            })
        })
        .then(res => res.text())
        .then(dataJSON => {
            let data = JSON.parse(dataJSON)
            console.log(JSON.stringify(data.project))
            if (!data.error) {
                this.setState({
                    project: data.project,
                    quickTasks: data.project.quickTasks
                })
            }
            if (data.error == "invalid user") {
                this.props.history.push('/')
            }
        })
    }

    render() {
        let subjects = this.state.project.subjects
        autosize(this.textarea)
        return (
            <div class="content">
                <TasksNavBar 
                        projectId={this.state.project.id}
                        name={this.state.project.name}
                    />

                <div class="content-container">
                    
                
                    <ul class="cols-container">
                        <li>
                            <span class="col">
                                <div class="subject-name">
                                    <span>
                                        Quick Tasks

                                        {this.state.editingQuickTasks ?
                                            (
                                                <button 
                                                    class="btn-quicktask"
                                                    onClick={this.endEditingQuickTasks}
                                                >
                                                    Save
                                                </button>
                                            ) :
                                            null
                                        } 
                                    </span>
                                </div>

                                <div class="quicktask-container">
                                    <textarea 
                                        ref={c => {this.textarea = c}}
                                        id="quicktask-area"
                                        name="quickTasks"
                                        rows={this.getNumLines(this.state.quickTasks)}
                                        value={this.state.quickTasks}
                                        onChange={this.handleQuickTaskChange}
                                    />
                                </div>
                            </span>
                        </li>


                        {subjects.map(subject => (
                            <li>
                                <span class="col">
                                    <Link to={{
                                        pathname:'/edit-subject',
                                        projectId: this.state.project.id,
                                        subjectId: subject.id,
                                        name: subject.name
                                    }}>
                                        <div class="subject-name">
                                            {subject.name}
                                        </div>
                                    </Link>
                                    <div class="tasks-background">
                                        <div class="tasks-container">
                                            {subject.tasks.sort(this.sortTasks).map(task => (
                                                <Link to={{
                                                    pathname: '/edit-task',
                                                    state: {
                                                        taskId: task.id,
                                                        subjectId: subject.id,
                                                        projectId: this.state.project.id,
                                                        name: task.name,
                                                        priority: task.priority,
                                                        description: task.description,
                                                        due: task.due
                                                    }
                                                }}>
                                                    <div class={`task priority${task.priority}`}>
                                                        {task.name}
                                                    </div>
                                                </Link>
                                                
                                            ))}
                                                <Link to={{
                                                    pathname:'/add-task',
                                                    projectId: this.state.project.id,
                                                    subjectId: subject.id
                                                }}>
                                                    <div class="task add-task">
                                                        + New task
                                                    </div>
                                                </Link>
                                        </div>
                                    </div>
                                </span>
                            </li>
                        ))}
                        
                            <li class="subject-add">
                                <span class="col">
                                    <Link to={{
                                        pathname:'/add-subject',
                                        projectId: this.state.project.id
                                    }}>
                                        <div class="subject-name">
                                            + New subject:
                                        </div>
                                    </Link>
                                </span>
                            </li>
                        

                    </ul>
                </div>
            </div>
            
        )
    }
}

export default Project;