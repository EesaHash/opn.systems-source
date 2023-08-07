// Import necessary libraries and components
import React from 'react';
import "../style/warning_pages.css";
import AccessLimitIcon from "../svg/accessLimitIcon";
import CloseButton from "../svg/closeButton";

/**
 * AccessLimit Component.
 *
 * @returns {JSX.Element} - The rendered access limit warning section.
 */
export const AccessLimit = _ => {
    /**
     * Closes the access limit form.
     */
    const closeForm = () => {
        document.getElementById("access-limit-form").style.display = "none";
    };

    return(
        <section id="access-limit-form" className="form-popup center form-container warning-pages" style={{display: "none"}}>
            <div>
                {/* Close button to close the access limit form */}
                <div className='close-button'>
                    <button onClick={closeForm}><CloseButton/></button>
                </div>
                {/* Warning icon */}
                <div className='warning-icon'>
                    <AccessLimitIcon/>
                </div>
                {/* Warning text */}
                <div className='upgrade-text'>
                    <h1>Oops, you can't access this feature!</h1>
                    <h3>You can access this feature by upgrading your plan.</h3>
                </div>
                {/* Button to join the waitlist for upgrading the plan */}
                <div className='upgrade-plan-btn' style={{position: "relative"}}>
                    <button >Join the Waitlist</button>
                </div>
            </div>
        </section>
    );
};
