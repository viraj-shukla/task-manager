import React from 'react';
import api from './api'
import './App.css';
import EditAddHeader from './EditAddHeader';
import TasksNavBar from './TasksNavBar'
import SubjectForm from './SubjectForm'

class EditSubject extends React.Component {
    state = {
        projectId: '',
        subjectId: '',
        name: ''
    }

    componentDidMount() {
        if (!this.props.location.projectId) {
            this.props.history.push('/login')
        }
        this.setState({
            projectId: this.props.location.projectId,
            subjectId: this.props.location.subjectId,
            name: this.props.location.name
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSave = () => {
        fetch(`${api}/edit-subject`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: this.state.projectId,
                subjectId: this.state.subjectId,
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
        fetch(`${api}/delete-subject`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                projectId: this.state.projectId,
                subjectId: this.state.subjectId
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

    render() {
        return (
            <div>
                <TasksNavBar handleLogout={this.handleLogout} />
            
                <div class="edit-add-container">
                    <EditAddHeader 
                        saveBtnText="Save Changes" 
                        deleteBtnText="Delete Subject"
                        handleSave={this.handleSave}
                        handleDelete={this.handleDelete} 
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
/*
<span class="buttons-container">
    <Link to='/project'>
        <FontAwesomeIcon id="back-icon" icon={faAngleLeft} size="1x" />
    </Link>
    <button class="btn submit-btn" onClick={this.handleSave}>
        Save Changes
    </button>
    <button class="btn delete-btn" onClick={this.handleDelete}>
        Delete Subject
    </button>
</span>*/

export default EditSubject;