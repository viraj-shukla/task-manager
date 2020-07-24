import React from 'react';
import './App.css';

class TaskForm extends React.Component {
    render() {
        let priorityKeys = Object.keys(this.props.priorityColors)
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
                            class="priority-select"
                            value={`${this.props.priority}`}
                            onChange={this.props.handleChange}
                            style={{
                                backgroundColor: this.props.priorityColors[`${this.props.priority}`].color
                            }}
                    >
                        {priorityKeys.map(priority => (
                            <option 
                                id={priority}
                                class="priority-option"
                                value={`${priority}`}
                                style={{
                                    backgroundColor: this.props.priorityColors[priority].color
                                }}
                            >
                                {this.props.priorityColors[priority].name}
                            </option>
                        ))}

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