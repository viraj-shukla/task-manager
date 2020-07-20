import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class TaskForm extends React.Component {
    render() {
        return (
            <div class="edit-details-container">
                <div class="input-container">
                    <input
                        type="text"
                        id="name-input"
                        name="name"
                        placeholder="Add a task name..."
                        value={this.props.name}
                        onChange={this.props.handleChange}
                    />
                </div>

                <div class="priority-container">
                    <select id="priority" 
                            name="priority" 
                            value={this.props.priority}
                            onChange={this.props.handleChange}
                    >
                        <option id="priority1" value={"1"}>High Priority</option>
                        <option id="priority2" value={"2"}>Medium Priority</option>
                        <option id="priority3" value={"3"}>Low Priority</option>
                        <option id="priority4" value={"4"}>None Priority</option>
                    </select>
                </div>
                
                <div class="datetime-container">
                    <input
                        type="datetime-local"
                        id="due"
                        name="due"
                        value={this.props.due}
                        onChange={this.props.handleChange}
                    />
                </div>

                <div class="description-container">
                    <textarea id="description-area" name="description" rows="10" cols="50"
                        value={this.props.description} onChange={this.props.handleChange}
                        placeholder="Add a description..."
                    />
                </div>
            </div>
        )
    }
}

export default TaskForm;