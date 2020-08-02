import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from './api'
import './App.css';

class Signup extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        loading: false
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        this.setState({
            loading: true
        })
        fetch(`${api}/signup`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
        })
            .then(res => res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.push('/add-project')
                }
                else {
                    let errorMsg = ''
                    switch (data.error) {
                        case "field-empty":
                            errorMsg = 'Fields cannot be empty'
                            break
                        case 'passwords-unmatched':
                            errorMsg = 'Passwords do not match'
                            break
                        case 'auth/email-already-in-use':
                            errorMsg = 'Email is already in use'
                            break
                        case 'auth/invalid-email':
                            errorMsg = 'Email is invalid'
                            break
                        case 'auth/weak-password':
                            errorMsg = 'Password is too weak'
                        default:
                            errorMsg = 'Signup failed'
                    }
                    this.setState({
                        error: errorMsg
                    })
                }
            })
            .catch(error => {
                this.setState({
                    error
                })
            })

        event.preventDefault()
    }

    handleError = (errors) => {
        this.errors = errors
    }

    render() {
        return (
            <div>
                <h1 class="login-center-text">Lazuli Task Manager</h1>
                <h2 class="login-center-text">Sign Up</h2>

                <div class="login-form">
                    <form onSubmit={this.handleSubmit}>
                        {this.state.error != '' ? 
                            (
                            <>
                                <label htmlFor="error" class="form-label form-label-error">{this.state.error}</label>
                                <br/>
                            </>
                            ) :
                            null
                        }

                        <label htmlFor="firstName" class="form-label">First name:</label><br/>
                        <input 
                            type="text" 
                            class="input-text"
                            id="firstName"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                        /><br/>

                        <label htmlFor="lastName" class="form-label">Last name:</label><br/>
                        <input 
                            type="text"
                            class="input-text"
                            id="lastName"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                        /><br/>

                        <label htmlFor="email" class="form-label">Email:</label><br/>
                        <input 
                            type="text"
                            class="input-text"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        /><br/>

                        <label htmlFor="password" class="form-label">Password:</label><br/>
                        <input 
                            type="password"
                            class="input-text"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        /><br/>

                        <label htmlFor="confirmPassword" class="form-label">Confirm Password:</label><br/>
                        <input 
                            type="password"
                            class="input-text"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                        /><br/>

                        <label class="form-label">Already have an account? <Link to='/login'>Log in</Link></label><br/>

                        <button type="submit" class="form-btn">
                            {this.state.loading && 
                                <FontAwesomeIcon class="btn-spinner" icon={faSpinner} size="1x" />
                            } Sign Up
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Signup;