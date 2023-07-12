import React, { useState } from 'react';
import "../style/client_journey.css";
import { loadingPage } from '../../warning_pages/components/loadingPage';
import { closePopUpForm } from '../../dashboard/page/dashboard_main';

export const CreateProcedure = (props) => {
    const [loading, setLoading] = useState(false);
    const titlePage = "Create Procedure";
    const closeForm = _ => {
        document.getElementById("procedure-title").value = "";
        document.getElementById("create-procedure-step1").style.display = "block";
        setLoading(false);
        document.getElementById("createProcedureForm").style.display = "none";
        closePopUpForm();
    };
    const generate = _ => {
        const title = document.getElementById("procedure-title").value;
        if(!title)
            return alert("Please fill in all fields!");
        document.getElementById("create-procedure-journey-step1").style.display = "none";
        setLoading(true);
        
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            generate();
        }
    };
    const step1 = _ => {
        return(
            <div id="create-procedure-step1" className="content-form">
                <h2>{titlePage}</h2>
                <hr/>
                <div className='pop-up-input'>
                    <label>Procedure Title</label>
                    <input 
                        id = "procedure-title"
                        type='text'
                        onKeyPress={handleKeypress} 
                    />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button className='next-button' onClick={generate} >Generate File</button>
                </div>
            </div>
        );
    };
    return(
        <section id="createProcedureForm" className="form-popup center form-container create-form">
            {step1()}
            {loading && loadingPage(titlePage, "AI is writing procedures for", document.getElementById("procedure-title").value)}
        </section>
    );
};