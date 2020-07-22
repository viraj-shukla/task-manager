import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class HomeHavBar extends React.Component {
    render() {
        return (
            <span class="nav">

                <Link to={'/signup'}>
                    <div class="right">
                    Sign Up
                    </div>
                </Link>
                
                <Link to={'/login'}>
                    <div class="right">
                        Log In
                    </div>
                </Link>
                
            </span>
        )
    }
}

export default HomeHavBar;