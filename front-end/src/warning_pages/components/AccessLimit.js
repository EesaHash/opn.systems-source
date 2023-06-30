import React from 'react';
import "../style/warning_pages.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';
import { Warning } from '@mui/icons-material';

export const AccessLimit = _ => {
    const closeForm = _ => {
        document.getElementById("access-limit-form").style.display = "none";
        closePopUpForm();
    };
    return(
        <section id="access-limit-form" className="form-popup center form-container warning-pages">
            <div className="content-form">
                <div className='close-button'>
                    <button onClick={closeForm}>X</button>
                </div>
                <div className='warning-icon'>
                    <Warning/>
                </div>
            </div>
        </section>
    );
};