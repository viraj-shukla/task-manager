import React from 'react';
import api from './api'
import './App.css';
import TasksNavBar from './TasksNavBar'
import EditAddHeader from './EditAddHeader';
import SubjectForm from './SubjectForm'

class AddSubject extends React.Component {
    state = {
        projectId: '',
        name: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        fetch(`${api}/add-subject`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            credentials: 'include',
            body: JSON.stringify({
                name: this.state.name,
                projectId: this.state.projectId
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

        event.preventDefault()
    }

    componentDidMount() {
        if (!this.props.location.projectId) {
            this.props.history.push('/login')
        }
        else {
            this.setState({
                projectId: this.props.location.projectId
            })
        }
    }

    render() {
        return (
            <div>
                <TasksNavBar />

                <div class="edit-add-container">
                    <EditAddHeader 
                        saveBtnText="Add Subject" 
                        handleSave={this.handleSubmit}
                    />

                    <SubjectForm
                        name={this.state.name}
                        handleChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

export default AddSubject;