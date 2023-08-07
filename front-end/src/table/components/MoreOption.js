import React from 'react';
import "../style/table.css";
import { EditIcon } from '../../public_icons/EditIcon';
import { DeleteIcon } from '../../public_icons/DeleteIcon';

/**
 * Component for More Option Pop-up.
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the More Option Pop-up
 * @param {Function} props.editBtn - Function to handle the "Edit" button click event
 * @param {Function} props.openDeletConfirmation - Function to handle the "Delete" button click event
 * @returns {JSX.Element} - JSX element for More Option Pop-up
 */
export const MoreOption = (props) => {
    return (
        <div id={`moreoption${props.index}`} className='edit-pop-up more-option'>
            {/* More Option Pop-up Content */}
            <div className='edit-pop-up-content'>
                {/* Edit Option */}
                <div className="pop-up-item" onClick={props.editBtn}>
                    <EditIcon /> {/* Custom component for Edit Icon */}
                    <button>Edit</button>
                </div>
                {/* Delete Option */}
                <div className="pop-up-item">
                    <DeleteIcon /> {/* Custom component for Delete Icon */}
                    <button onClick={props.openDeletConfirmation}>Delete</button>
                </div>
            </div>
        </div>
    );
};
