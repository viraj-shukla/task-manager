import React from 'react';
import api from './api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './App.css';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
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
        fetch(`${api}/login`, {
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
                else {
                    let errorMsg = ''
                    switch (data.error) {
                        case "field-empty":
                            errorMsg = 'Fields cannot be empty'
                            break
                        case 'auth/invalid-email':
                            errorMsg = 'Email is invalid'
                            break
                        case 'auth/user-not-found':
                            errorMsg = 'Incorrect email and/or password'
                            break
                        case 'auth/wrong-password':
                            errorMsg = 'Incorrect email and/or password'
                            break
                        default:
                            errorMsg = 'Login failed'
                    }
                    this.setState({
                        error: errorMsg
                    })
                }
            })
            .catch(error => {
                this.setState({
                    error: error
                })
            })

        event.preventDefault()
    }


    render() {
        return (
            <div>
                <h1 class="login-center-text">Lazuli Task Manager</h1>
                <h2 class="login-center-text">Log In</h2>
            
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
                            {this.state.loading && 
                                <FontAwesomeIcon class="btn-spinner" icon={faSpinner} size="1x" />
                            } Log In
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;