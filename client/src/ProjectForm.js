import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class ProjectForm extends React.Component {
    render() {
        return (
            <div class="edit-details-container">
                <div class="input-container">
                    <input
                        type="text"
                        id="name-input"
                        name="name"
                        placeholder="Add a project name..."
                        value={this.props.name}
                        onChange={this.props.handleChange}
                    />
                </div>
            </div>
        )
    }
}

export default ProjectForm;