import React from 'react';
import "../style/table.css";
import { motion } from "framer-motion";

/**
 * Component for Loading Table Item.
 * @param {Object} props - Component props
 * @param {string} props.title - Title for the loading message
 * @param {string} props.documentName - Name of the document being loaded
 * @returns {JSX.Element} - JSX element for Loading Table Item
 */
export const LoadingTableItem = (props) => {
    // Style for the spinning circle
    const circleStyle = {
        display: "block",
        width: "30px",
        height: "30px",
        border: "5px solid transparent",
        borderTop: "5px solid #2173DF",
        borderRadius: "50%",
        boxSizing: "border-box"
    };

    // Transition properties for spinning animation
    const spinTransition = {
        repeat: Infinity,
        ease: "linear",
        duration: 1
    };

    return (
        <div className='loading-table-item'>
            {/* Loading Message */}
            <div className='loading-message'>
                <img src="./images/loadingIcon.png" alt="icon" />
                <h2>{props.title}</h2>
            </div>
            {/* Input field to show the document name */}
            <input type='text' value={props.documentName} readOnly />
            {/* Spinning Circle */}
            <div className='loading-circle'>
                <motion.span
                    style={circleStyle}
                    animate={{ rotate: 360 }}
                    transition={spinTransition}
                />
            </div>
        </div>
    );
};
