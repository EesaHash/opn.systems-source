import React from 'react';
import "../style/table.css";
import { motion } from "framer-motion";

export const LoadingTableItem = (props) => {
    const circleStyle = {
        display: "block",
        width: "30px",
        height: "30px",
        border: "5px solid transparent",
        borderTop: "5px solid #2173DF",
        borderRadius: "50%",
        boxSizing: "border-box"
    };
    const spinTransition = {
        repeat: Infinity,
        ease: "linear",
        duration: 1
    };
    return(
        <div className='loading-table-item'>
            <div className='loading-message'>
                <img src="./images/loadingIcon.png" alt="icon"/>
                <h2>{props.title}</h2>
            </div>
            <input type='text' value={props.documentName} readOnly/>
            <div className='loading-circle'>
                <motion.span
                    style = {circleStyle}
                    animate= {{ rotate: 360 }}
                    transition = { spinTransition } 
                />
            </div>
        </div>
    );
};