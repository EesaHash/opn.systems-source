// Import necessary libraries and components
import React from 'react';
import "../style/warning_pages.css";
import BuiltFeatureIcon from "../svg/builtFeatureIcon";
import CloseButton from "../svg/closeButton";

/**
 * FutureFeature Component.
 *
 * @returns {JSX.Element} - The rendered future feature warning section.
 */
export const FutureFeature = _ => {
    /**
     * Closes the future feature warning form.
     */
    const closeForm = () => {
        document.getElementById("future-feature-warning-form").style.display = "none";
    };

    return(
        <section id="future-feature-warning-form" className="form-popup center form-container warning-pages" style={{display: "none"}}>
            <div>
                {/* Close button to close the future feature warning form */}
                <div className='close-button'>
                    <button onClick={closeForm}><CloseButton/></button>
                </div>
                {/* Warning icon */}
                <div className='warning-icon'>
                    <BuiltFeatureIcon/>
                </div>
                {/* Warning text */}
                <h1>This feature is still being built.</h1>
                <h3>We appreciate your interest and are working as quickly as we can!</h3>
            </div>
        </section>
    );
};
