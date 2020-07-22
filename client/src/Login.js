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
            <div>
                <h1 class="login-center-text">Lazuli Task Manager</h1>
                <h2 class="login-center-text">Log In</h2>
            
                <div class="login-form">
                    
                    <form onSubmit={this.handleSubmit}>
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

                        <label class="form-label">Don't have an account? <Link to='/signup'>Sign up</Link></label><br/>

                        <button type="submit" class="form-btn">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;