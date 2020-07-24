import React from 'react';
import './App.css';

class SubjectForm extends React.Component {
    render() {
        return (
            <div class="edit-details-container">
                <div class="input-container">
                    <input
                        type="text"
                        id="name-input"
                        name="name"
                        placeholder="Add a subject name..."
                        value={this.props.name}
                        onChange={this.props.handleChange}
                    />
                </div>
            </div>
        )
    }
}

export default SubjectForm;