import React from 'react';

export const DeleteConfirmation = (props) => {
    const deleteBtn = _ => {
        props.setConfirmation(props.data);
        closeForm();
    };
    const discardChanges = _ => {
        closeForm();
    };
    const closeForm = _ => {
        document.getElementById(props.id).style.display = "none";
    };
    return(
        <section id={props.id} className='form-popup center form-container confirmation'>
            <div classList="content-form" className='content-form'>
                <h2>Delete File</h2>
                <hr/>
                <div className='title'>
                    <h1>Are you sure?</h1>
                    <h3>You're about to delete a file</h3>
                </div>
                <div className='pop-up-input' >
                    <img src="./images/DocumentIcon/tokenFile.png" alt="icon"/>
                    <input type='text' value={`${props.documentName}`} readOnly/>
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={discardChanges}>Cancel</button>
                    <button className='delete-button' onClick={deleteBtn} >Delete</button>
                </div>
            </div>
        </section>
    );
};