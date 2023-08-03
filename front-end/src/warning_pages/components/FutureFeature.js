import React from 'react';
import "../style/warning_pages.css";
import BuiltFeatureIcon from "../svg/builtFeatureIcon";
import CloseButton from "../svg/closeButton";

export const FutureFeature = _ => {
    const closeForm = _ => {
        document.getElementById("future-feature-warning-form").style.display = "none";
    };
    return(
        <section id="future-feature-warning-form" className="form-popup center form-container warning-pages" style={{display: "none"}}>
            <div>
                <div className='close-button'>
                    <button onClick={closeForm}><CloseButton/></button>
                </div>
                <div className='warning-icon'>
                    <BuiltFeatureIcon/>
                </div>
                <h1>This feature is still being built.</h1>
                <h3>We appreciate your interest and are working as quickly as we can!</h3>
            </div>
        </section>
    );
};