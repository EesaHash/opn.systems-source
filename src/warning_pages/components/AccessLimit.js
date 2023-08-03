import React from 'react';
import "../style/warning_pages.css";
import AccessLimitIcon from "../svg/accessLimitIcon";
import CloseButton from "../svg/closeButton";

export const AccessLimit = _ => {
    const closeForm = _ => {
        document.getElementById("access-limit-form").style.display = "none";
    };
    return(
        <section id="access-limit-form" className="form-popup center form-container warning-pages" style={{display: "none"}}>
            <div className="content-form">
                <div className='close-button'>
                    <button onClick={closeForm}><CloseButton/></button>
                </div>
                <div className='warning-icon'>
                    <AccessLimitIcon/>
                </div>
                <div className='upgrade-text'>
                <h1>Oops, you can't access this feature!</h1>
                <h3>You can access this feature by upgrading your plan.</h3>
                </div>
                <div className='upgrade-plan-btn' style={{position: "relative"}}>
                    <button >Join the Waitlist</button>
                </div>
            </div>
        </section>
    );
};