import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './App.css';

class EditAddHeader extends React.Component {    
    render() {
        return (
            <span class="buttons-container">
                <Link to='/project'>
                    <FontAwesomeIcon id="back-icon" icon={faAngleLeft} size="1x" />
                </Link>
                <button class="btn submit-btn" onClick={this.props.handleSave}>
                    {this.props.saveBtnText}
                </button>
                {this.props.deleteBtnText ?
                    (
                        <button class="btn delete-btn" onClick={this.props.handleDelete}>
                            {this.props.deleteBtnText}
                        </button>
                    ) : 
                    null
                }
            </span>
        )
    }
}

export default EditAddHeader;