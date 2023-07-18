import React from 'react';
import "../style/warning_pages.css";
import { SettingsSuggest } from '@mui/icons-material';

export const FutureFeature = _ => {
    const closeForm = _ => {
        document.getElementById("future-feature-warning-form").style.display = "none";
    };
    return(
        <section id="future-feature-warning-form" className="form-popup center form-container warning-pages" style={{display: "none"}}>
            <div className="content-form">
                <div className='close-button'>
                    <button onClick={closeForm}>X</button>
                </div>
                <div className='warning-icon'>
                    <SettingsSuggest/>
                </div>
                <h1>This feature is still being built.</h1>
                <h3>We appreciate your interest and are working as quickly as we can!</h3>
            </div>
        </section>
    );
};