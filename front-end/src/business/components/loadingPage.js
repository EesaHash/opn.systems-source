import React from 'react';
import "../style/business.css";

export const loadingPage = (businessName) => {
    return(
        <div id="loading-page" className="content-form">
            <h2>Create Business</h2>
            <hr/>
            <div className='loading-page'>
                <div className='loading-message'>
                    <img src="./images/loadingIcon.png" alt="icon"/>
                    <h2>AI is writing client journeys for</h2>
                </div>
                <input type='text' value={businessName} readOnly/>
            </div>
        </div>
    );
}