import React from 'react';
import "../style/business.css";

export const DeleteBusinesConfirmation = (props) => {
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
                <h2>Delete Business</h2>
                <hr/>
                <div className='title'>
                    <h1>Are you sure?</h1>
                    <h3>You're about to delete a business</h3>
                </div>
                <div className='pop-up-input' >
                    <img src={props.imgSrc} alt="icon"/>
                    <div className='file-name'>
                        <input className='file-title' type='text' value={`${props.documentName}`} readOnly/>
                        <input className='file-desc' type='text' value="1 member" readOnly/>
                    </div>
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={discardChanges}>Cancel</button>
                    <button className='delete-button' onClick={deleteBtn} >Delete</button>
                </div>
            </div>
        </section>
    );
};