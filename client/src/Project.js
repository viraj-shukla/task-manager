import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment'
import autosize from 'autosize'
import api from './api'
import './App.css';
import TasksNavBar from './TasksNavBar'

class Project extends React.Component {
    state = {
        project: {
            id: '',
            subjects: []
        },
        quickTasks: '',
        editingQuickTasks: false,
        loaded: false
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
        return lines.length
    }

    endEditingQuickTasks = (event) => {
        fetch(`${api}/edit-quicktask`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
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
            .catch(error => console.log(error))
    }

    handleMoveSubject = (event) => {
        let btnId = event.currentTarget.id
        btnId = btnId.split(" ")
        let id = btnId[0]
        let dir = btnId[1]

        let newProject = this.state.project
        let newSubject = newProject.subjects
        let searchFunc = (subject) => {
            return subject.id == id
        }
        let index = newSubject.findIndex(searchFunc)
        if (dir == "left") {
            if (index != 0) {
                [newSubject[index-1], newSubject[index]] = [newSubject[index], newSubject[index-1]]
            }
        }
        else {
            if (index != newSubject.length-1) {
                [newSubject[index+1], newSubject[index]] = [newSubject[index], newSubject[index+1]]
            }
        }
        newProject.subjects = newSubject
        this.setState({
            project: newProject
        })

        fetch(`${api}/edit-subject-order`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                projectId: this.state.project.id,
                subjects: newSubject
            })
        })
            .catch(error => console.log(error))
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
                        project: data.project,
                        quickTasks: data.project.quickTasks,
                        loaded: true
                    })
                }
                if (data.error == "invalid user") {
                    this.props.history.push('/login')
                }
            })
            .catch(error => console.log(error))
    }

    quickTasksContent = () => (
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
    )

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
                            {this.state.loaded ? this.quickTasksContent() : null}
                        </li>


                        {subjects.map(subject => (
                            <li>
                                <span class="col">
                                    <div class="subject-name-container">
                                        <span class="subject-move-span">
                                            <button 
                                                id={`${subject.id} left`}
                                                class="subject-move-btn subject-move-btn-left"
                                                onClick={this.handleMoveSubject}
                                            >
                                                {String.fromCharCode(8592)}
                                            </button>
                                            <button 
                                                id={`${subject.id} right`}
                                                class="subject-move-btn subject-move-btn-right"
                                                onClick={this.handleMoveSubject}
                                            >
                                                {String.fromCharCode(8594)}
                                            </button>
                                        </span>
                                        <Link class="subject-name-link" to={{
                                            pathname:'/edit-subject',
                                            projectId: this.state.project.id,
                                            subjectId: subject.id,
                                            name: subject.name
                                        }}>
                                            <div class="subject-name">
                                                {subject.name}
                                            </div>
                                        </Link>
                                    </div>
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
                                                    },
                                                    priorityColors: this.state.project.priorityColors
                                                }}>
                                                    <div 
                                                        class={`task`}
                                                        style={{
                                                            backgroundColor: this.state.project.priorityColors[task.priority].color
                                                        }}
                                                    >
                                                        <span class="task-span">
                                                            <div class="task-span-name">
                                                                {task.name}
                                                            </div>
                                                            <div class="task-span-due">
                                                                <Moment format="M/D">
                                                                    {task.due}
                                                                </Moment>
                                                            </div>
                                                        </span>
                                                        
                                                    </div>
                                                </Link>
                                                
                                            ))}
                                                <Link to={{
                                                    pathname:'/add-task',
                                                    projectId: this.state.project.id,
                                                    priorityColors: this.state.project.priorityColors,
                                                    subjectId: subject.id
                                                }}>
                                                    <div class="task add-task">
                                                        + New task:
                                                    </div>
                                                </Link>
                                        </div>
                                    </div>
                                </span>
                            </li>
                        ))}
                        
                            <li class="subject-add">
                                <span class="col">
                                    <Link class="subject-name-link" to={{
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