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
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="firstName">First Name</label><br/>
                    <input 
                        type="text" 
                        id="firstName"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                    /><br/><br/>

                    <label htmlFor="lastName">Last Name</label><br/>
                    <input 
                        type="text" 
                        id="lastName"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                    /><br/><br/>

                    <label htmlFor="email">Email</label><br/>
                    <input 
                        type="text" 
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    /><br/><br/>

                    <label htmlFor="password">Password</label><br/>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    /><br/><br/>

                    <label htmlFor="confirmPassword">Confirm Password</label><br/>
                    <input 
                        type="password" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    /><br/><br/>

                    <button type="submit">
                        Sign Up
                    </button>
                </form>
            </div>
        )
    }
}

export default Signup;