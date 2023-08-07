import React from 'react';

// Component to show an update confirmation popup.
// @param {Object} props - The props passed to the component.
export const UpdateConfirmation = (props) => {
    // Function to handle saving changes and close the confirmation popup.
    const save = _ => {
        props.setConfirmation(1); // Call the parent component's function to set the confirmation state to 1.
        closeForm(); // Close the confirmation popup.
    };

    // Function to handle discarding changes and close the confirmation popup.
    const discardChanges = _ => {
        props.setConfirmation(0); // Call the parent component's function to set the confirmation state to 0.
        closeForm(); // Close the confirmation popup.
    };

    // Function to close the confirmation popup by hiding the corresponding DOM element.
    const closeForm = _ => {
        document.getElementById(props.id).style.display = "none"; // Hide the confirmation popup by setting its display property to "none".
    };

    return (
        <section id={props.id} className='form-popup center form-container confirmation'>
            <div classList="content-form" className='content-form'>
                <h2>Update File</h2>
                <hr/>
                <div className='title'>
                    <h1>Are you sure?</h1>
                    <h3>Your changes will be lost if you don't save them</h3>
                </div>
                <div className='pop-up-input' >
                    <img src="./images/DocumentIcon/tokenFile.png" alt="icon"/>
                    <input type='text' value={`${props.documentName}`} readOnly/>
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={discardChanges}>Discard</button>
                    <button className='save-button' onClick={save}>Save</button>
                </div>
            </div>
        </section>
    );
};
