import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        //event.preventDevault()

        console.log(JSON.stringify(this.state))

        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            credentials: 'include',
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(res =>  res.text())
            .then(dataJSON => {
                let data = JSON.parse(dataJSON)
                if (!data.error) {
                    this.props.history.push('/project')
                }
            })
            .catch(error => console.log(`Error: ${error}`))

        event.preventDefault()
    }


    render() {
        return (
            <div class="login-form">
                <h1>Task Manager</h1>
                <h2>Log In</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email" class="form-input">Email</label><br/>
                    <input 
                        type="text"
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    /><br/>

                    <label htmlFor="password" class="form-input">Password</label><br/>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    /><br/>

                    <button type="submit">
                        Log In
                    </button>
                </form>
            </div>
        )
    }
}

export default Login;