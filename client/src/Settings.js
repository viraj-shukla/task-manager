import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from './api'
import './App.css';
import TasksNavBar from './TasksNavBar'

class Settings extends React.Component {
    state = {
        oldFirstName: '',
        oldLastName: '',
        newFirstName: '',
        newLastName: '',
        oldEmail: '',
        newEmail: '',
        oldPassword: '',
        newPassword: '',
        nameFormStatus: '',
        emailFormStatus: '',
        passwordFormStatus: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitName = (event) => {
        fetch(`${api}/edit-user-name`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                oldFirstName: this.state.oldFirstName,
                oldLastName: this.state.oldLastName,
                newFirstName: this.state.newFirstName,
                newLastName: this.state.newLastName
            })
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.setState({
                        nameFormStatus: "Name successfully updated!"
                    })
                }
                else {
                    if (data.error == "invalid-old-names") {
                        this.setState({
                            nameFormStatus: "Old first or last name is invalid"
                        })
                    }
                }
            })
            .catch(error => console.log(error))

        event.preventDefault()
    }

    handleSubmitEmail = (event) => {
        fetch(`${api}/edit-user-email`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                oldEmail: this.state.oldEmail,
                newEmail: this.state.newEmail,
            })
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.setState({
                        emailFormStatus: "Email successfully updated!"
                    })
                }
                else {
                    if (data.error == "invalid-old-email") {
                        this.setState({
                            nameFormStatus: "Old email is invalid!"
                        })
                    }
                }
            })
            .catch(error => console.log(error))

        event.preventDefault()
    }

    handleSubmitPassword = (event) => {
        fetch(`${api}/edit-user-password`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
            })
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.setState({
                        passwordFormStatus: "Password successfully updated!"
                    })
                }
                else {
                    if (data.error == "invalid-old-password") {
                        this.setState({
                            nameFormStatus: "Old password is invalid!"
                        })
                    }
                }
            })
            .catch(error => console.log(error))

        event.preventDefault()
    }

    handleSubmitDelete = (event) => {
        fetch(`${api}/delete-user`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                foo: 'bar'
            })
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.push('/')
                }
            })
            .catch(error => console.log(error))

        event.preventDefault()
    }


    render() {
        return (
            <div>
                <TasksNavBar />

                <div class="below-navbar">
                    <span class="title-bar">
                        <Link to='/project' class="back-link-alone">
                            <FontAwesomeIcon id="back-icon-alone" icon={faAngleLeft} size="1x" />
                        </Link>
                    </span>

                    <div class="user-form-container">
                        <h2 class="login-center-text first-text"><b>Edit Name</b></h2>
                        <p class="login-center-text">{this.state.nameFormStatus}</p>
                        <div class="login-form">
                            <form onSubmit={this.handleSubmitName}>
                                <label htmlFor="oldFirstName" class="form-label">Old first name:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="oldFirstName"
                                    name="oldFirstName"
                                    value={this.state.oldFirstName}
                                    onChange={this.handleChange}
                                /><br/>

                                <label htmlFor="oldLastName" class="form-label">Old last name:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="oldLastName"
                                    name="oldLastName"
                                    value={this.state.oldLastName}
                                    onChange={this.handleChange}
                                /><br/>

                                <label htmlFor="newFirstName" class="form-label">New first name:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="newFirstName"
                                    name="newFirstName"
                                    value={this.state.newFirstName}
                                    onChange={this.handleChange}
                                /><br/>

                                <label htmlFor="newLastName" class="form-label">New last name:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="newLastName"
                                    name="newLastName"
                                    value={this.state.newLastName}
                                    onChange={this.handleChange}
                                /><br/>

                                <button type="submit" class="form-btn btn-below-input">
                                    Edit Name
                                </button>
                            </form>
                        </div>

                        <h2 class="login-center-text"><b>Edit Email</b></h2>
                        <p class="login-center-text">{this.state.emailFormStatus}</p>
                        <div class="login-form">
                            <form onSubmit={this.handleSubmitEmail}>
                                <label htmlFor="oldEmail" class="form-label">Old email:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="oldEmail"
                                    name="oldEmail"
                                    value={this.state.oldEmail}
                                    onChange={this.handleChange}
                                /><br/>

                                <label htmlFor="newEmail" class="form-label">New email:</label><br/>
                                <input 
                                    type="text"
                                    class="input-text"
                                    id="newEmail"
                                    name="newEmail"
                                    value={this.state.newEmail}
                                    onChange={this.handleChange}
                                /><br/>

                                <button type="submit" class="form-btn btn-below-input">
                                    Edit Email
                                </button>
                            </form>
                        </div>

                        <h2 class="login-center-text"><b>Reset Password</b></h2>
                        <p class="login-center-text">{this.state.passwordFormStatus}</p>
                        <div class="login-form">
                            <form onSubmit={this.handleSubmitPassword}>
                                <label htmlFor="oldPassword" class="form-label">Old password:</label><br/>
                                <input 
                                    type="password"
                                    class="input-text"
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={this.state.oldPassword}
                                    onChange={this.handleChange}
                                /><br/>

                                <label htmlFor="newPassword" class="form-label">New password:</label><br/>
                                <input 
                                    type="password"
                                    class="input-text"
                                    id="newPassword"
                                    value={this.state.newPassword}
                                    onChange={this.handleChange}
                                /><br/>

                                <button type="submit" class="form-btn btn-below-input">
                                    Reset Password
                                </button>
                            </form>
                        </div>

                        <h2 class="login-center-text"><b>Delete Account</b></h2>
                        <p class="login-center-text">Only proceed if you are sure you want your account removed!</p>
                        <div class="login-form-invisible">
                            <form onSubmit={this.handleSubmitDelete}>
                                <button type="submit" class="form-btn settings-delete-acct">
                                    Reset Password
                                </button>
                            </form>
                        </div>
                        
                    </div>
                </div>

                
            </div>
        )
    }
}

export default Settings;