import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSwatchbook, faAlignLeft, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './App.css';
import HomeHavBar from './HomeNavBar';

class Home extends React.Component {
    render() {
        return (
            <div>
                <HomeHavBar />

                <div class="below-navbar">
                    <h1 class="home-center-text"><b>Welcome to the Lazuli Task Manager!</b></h1>
                    <p class="home-center-text"><b>A card-based task manager app with seamless, powerful features.</b></p>

                    <span class="home-features-container">
                        <div class="home-feature">
                            <FontAwesomeIcon class="home-icon" icon={faSwatchbook} size="1x" />
                            <p>See your highest priority tasks in easily viewable colors.</p>
                        </div> 
                        <div class="home-feature">
                            <FontAwesomeIcon class="home-icon" icon={faAlignLeft} size="1x" />
                            <p>Quick tasks for each project, for easy project-wide notes.</p>
                        </div> 
                        <div class="home-feature">
                            <FontAwesomeIcon class="home-icon" icon={faChartBar} size="1x" />
                            <p>See all your deadlines in a single chart.</p>
                        </div>
                        
                        
                    </span>
                </div>
            </div>
        )
    }
}

export default Home;