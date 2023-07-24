import React from 'react';
import "../style/table.css";
import { EditIcon } from '../../public_icons/EditIcon';
import { DeleteIcon } from '../../public_icons/DeleteIcon'

export const MoreOption = (props) => {
    return(
        <div id={`moreoption${props.index}`} className='edit-pop-up more-option'>
            <div className='edit-pop-up-content'>
                <div className="pop-up-item" onClick={props.editBtn}>
                    <EditIcon/>
                    <button>Edit</button>
                </div>
                <div className="pop-up-item">
                    <DeleteIcon/>
                    <button onClick={props.openDeletConfirmation}>Delete</button>
                </div>
            </div>
        </div>
    );
};