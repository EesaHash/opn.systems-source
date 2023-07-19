import React from 'react';

export const UpdateConfirmation = (props) => {
    const save = _ => {
        props.setConfirmation(1);
        closeForm();
    };
    const discardChanges = _ => {
        props.setConfirmation(0);
        closeForm();
    };
    const closeForm = _ => {
        document.getElementById(props.id).style.display = "none";
    };
    return(
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
                    <button className='save-button' onClick={save} >Save</button>
                </div>
            </div>
        </section>
    );
};