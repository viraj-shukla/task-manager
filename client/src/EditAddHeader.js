import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './App.css';

class EditAddHeader extends React.Component {    
    state = {
        loadingSave: false,
        loadingDelete: false
    }

    clickSave = (event) => {
        this.setState({
            loadingSave: true
        })
        this.props.handleSave(event)
    }

    clickDelete = (event) => {
        this.setState({
            loadingDelete: true
        })
        this.props.handleDelete(event)
    }

    render() {
        return (
            <span class="below-navbar buttons-container">
                <Link to='/project'>
                    <FontAwesomeIcon id="back-icon" icon={faAngleLeft} size="1x" />
                </Link>
                {this.props.saveBtnText ?
                    (
                        <button class="btn submit-btn" onClick={this.clickSave}>
                            {this.state.loadingSave && 
                                <FontAwesomeIcon class="btn-spinner" icon={faSpinner} size="1x" />
                            } {this.props.saveBtnText}
                        </button>
                    ) :
                    null
                }
                {this.props.deleteBtnText ?
                    (
                        <button class="btn delete-btn" onClick={this.clickDelete}>
                            {this.state.loadingDelete && 
                                <FontAwesomeIcon class="btn-spinner" icon={faSpinner} size="1x" />
                            } {this.props.deleteBtnText}
                        </button>
                    ) : 
                    null
                }
            </span>
        )
    }
}

export default EditAddHeader;