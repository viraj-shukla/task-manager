import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Signup extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/signup', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
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
                console.log(data)
                if (!data.error) {
                    this.props.history.push('/add-project')
                }
            })
            .catch(error => console.log(`Error: ${error}`))

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
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Signup;