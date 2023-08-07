import React from 'react';
import "../style/table.css";

/**
 * Component for Empty Table Content.
 * @param {Object} props - Component props
 * @param {function} props.addNewBtn - Function to handle add new button click
 * @param {string} props.buttonTitle - Title for the add new button
 * @returns {JSX.Element} - JSX element for Empty Table Content
 */
export const EmptyTableContent = (props) => {
    return (
        <div className='empty-table'>
            {/* Empty Table Content */}
            <div className='empty-table-content'>
                <img src="./images/emptyListIcon.png" alt="icon" />
                <h2>Oops, it's empty</h2>
                {/* Add New Button */}
                <button onClick={props.addNewBtn}>{props.buttonTitle}</button>
            </div>
        </div>
    );
};
