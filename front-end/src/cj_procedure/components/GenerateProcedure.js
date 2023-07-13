import React from 'react';
import "../style/procedure.css";
import { loadingPage } from '../../warning_pages/components/loadingPage';

export const GenerateProcedure = (props) => {
    const titlePage = "Generate Procedures";
    return(
        <section id = "generateProcedureForm" className='form-popup center form-container generate-procedure-form'>
            {loadingPage(titlePage, "AI is writing procedures for", props.documentName)}
        </section>
    );
};