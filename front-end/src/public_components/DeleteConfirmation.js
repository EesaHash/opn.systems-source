import React from 'react';

export const DeleteConfirmation = (props) => {
    // Function to handle the "Delete" button click
    const deleteBtn = _ => {
        props.setConfirmation(props.data);
        closeForm();
    };

    // Function to handle the "Cancel" button click
    const discardChanges = _ => {
        closeForm();
    };

    // Function to close the popup form
    const closeForm = _ => {
        document.getElementById(props.id).style.display = "none";
    };

    // The component renders a section with a unique ID passed as props, which represents the popup form
    // The form has a title "Delete File", and a description "You're about to delete a file"
    // It displays the name of the file to be deleted using the props "documentName"
    // The form has two buttons "Cancel" and "Delete", each associated with a click handler
    return (
        <section id={props.id} className='form-popup center form-container confirmation'>
            <div classList="content-form" className='content-form'>
                <h2>Delete File</h2>
                <hr/>
                <div className='title'>
                    <h1>Are you sure?</h1>
                    <h3>You're about to delete a file</h3>
                </div>
                <div className='pop-up-input'>
                    <img src="./images/DocumentIcon/tokenFile.png" alt="icon"/>
                    <input type='text' value={`${props.documentName}`} readOnly/>
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={discardChanges}>Cancel</button>
                    <button className='delete-button' onClick={deleteBtn}>Delete</button>
                </div>
            </div>
        </section>
    );
};
