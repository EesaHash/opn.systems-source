import React from 'react';
import "../style/procedure.css";
import { loadingPage } from '../../warning_pages/components/loadingPage';

/**
 * GenerateProcedure functional component.
 * This component renders a form to display the generation progress of procedures.
 *
 * @param {Object} props - The props object for the component.
 * @param {string} props.documentName - The name of the document being generated.
 * @returns {JSX.Element} - The GenerateProcedure component's UI.
 */
export const GenerateProcedure = (props) => {
    const titlePage = "Generate Procedures";

    return (
        <section id="generateProcedureForm" className='form-popup center form-container generate-procedure-form'>
            {/* Render the loadingPage component to show the generation progress */}
            {loadingPage(titlePage, "AI is writing procedures for", props.documentName)}
        </section>
    );
};
