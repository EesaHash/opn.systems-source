import React, { useState } from 'react';
import "../style/procedure.css";
import { loadingPage } from '../../warning_pages/components/loadingPage';

/**
 * CreateProcedure functional component.
 * This component renders a form to create a new procedure.
 *
 * @param {Object} props - The props object for the component (unused in this implementation).
 * @returns {JSX.Element} - The CreateProcedure component's UI.
 */
export const CreateProcedure = (props) => {
    const [loading, setLoading] = useState(false);
    const titlePage = "Create Procedure";

    // Function to close the procedure form and reset input fields.
    const closeForm = _ => {
        document.getElementById("procedure-title").value = "";
        document.getElementById("create-procedure-step1").style.display = "block";
        setLoading(false);
        document.getElementById("createProcedureForm").style.display = "none";
    };

    // Function to generate the procedure file.
    const generate = _ => {
        const title = document.getElementById("procedure-title").value;
        if (!title)
            return alert("Please fill in all fields!");

        document.getElementById("create-procedure-journey-step1").style.display = "none";
        setLoading(true);
    };

    // Function to handle "Enter" keypress event.
    const handleKeypress = e => {
        if (e.key === "Enter") {
            generate();
        }
    };

    // Function to render step 1 of the procedure creation form.
    const step1 = _ => {
        return (
            <div id="create-procedure-step1" className="content-form">
                <h2>{titlePage}</h2>
                <hr />
                <div className='pop-up-input'>
                    <label>Procedure Title</label>
                    <input
                        id="procedure-title"
                        type='text'
                        onKeyPress={handleKeypress}
                    />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button className='next-button' onClick={generate}>Generate File</button>
                </div>
            </div>
        );
    };

    return (
        <section id="createProcedureForm" className="form-popup center form-container create-form">
            {/* Render step 1 of the procedure creation form */}
            {step1()}
            {/* Render loadingPage component when loading is true */}
            {loading && loadingPage(titlePage, "AI is writing procedures for", document.getElementById("procedure-title").value)}
        </section>
    );
};
