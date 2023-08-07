// Import necessary libraries and components
import React from 'react';
import "../style/warning_pages.css";
import { motion } from "framer-motion";

/**
 * LoadingPage Component.
 *
 * @param {string} title - The title to display in the loading page.
 * @param {string} subTitle - The subtitle to display in the loading page.
 * @param {string} businessName - The business name to display in the loading page.
 * @returns {JSX.Element} - The rendered loading page.
 */
export const loadingPage = (title, subTitle, businessName) => {
    // Style for the spinning loading circle
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

    // Framer Motion settings for the spinning circle animation
    const spinTransition = {
        repeat: Infinity,
        ease: "linear",
        duration: 1
    };

    return(
        <div id="loading-page" className="content-form">
            {/* Display the title */}
            <h2>{title}</h2>
            <hr/>
            <div className='loading-page'>
                <div className='loading-message'>
                    {/* Loading icon */}
                    <img src="./images/loadingIcon.png" alt="icon"/>
                    {/* Display the subtitle */}
                    <h2>{subTitle}</h2>
                </div>
                {/* Display the business name in a read-only input field */}
                <input type='text' value={businessName} readOnly/>
                <div className='loading-circle'>
                    {/* Spinning circle using Framer Motion */}
                    <motion.span
                        style={circleStyle}
                        animate={{ rotate: 360 }}
                        transition={spinTransition}
                    />
                </div>
            </div>
        </div>
    );
};
