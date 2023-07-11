import React from 'react';
import "../style/business.css";
import { motion } from "framer-motion";

export const loadingPage = (businessName) => {
    const circleStyle = {
        display: "block",
        width: "30px",
        height: "30px",
        border: "5px solid transparent",
        borderTop: "5px solid #2173DF",
        borderRadius: "50%",
        position: "absolute",
        boxSizing: "border-box"
    };
    const spinTransition = {
        repeat: Infinity,
        ease: "linear",
        duration: 1
    };
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
                <div className='loading-circle'>
                    <motion.span
                        style = {circleStyle}
                        animate= {{ rotate: 360 }}
                        transition = { spinTransition } 
                    />
                </div>
            </div>
        </div>
    );
};