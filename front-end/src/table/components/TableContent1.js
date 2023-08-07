// Import necessary libraries and components
import React, { useState } from 'react';
import "../style/table.css";
import { MoreHoriz } from '@mui/icons-material';
import { MoreOption } from './MoreOption';
import { DeleteConfirmation } from '../../public_components/DeleteConfirmation';

/**
 * TableContent1 Component.
 *
 * @param {Object} props - Props passed to the component.
 * @param {Array} props.list - Array of data items to display in the table.
 * @param {Function} props.itemActionBtn - Function to handle item action button clicks.
 * @param {Function} props.setDeleteConfirmation - Function to set delete confirmation state.
 * @returns {JSX.Element} - The rendered table content.
 */
export const TableContent1 = (props) => {
    // State to track the index of the item being hovered for edit
    const [editHover, setEditHover] = useState(-1);

    return(
        <div className='table-content-1'>
            {/* Render each item using the 'item' function */}
            {props.list.map((data, index) => (
                item(data, index, props.itemActionBtn, editHover, setEditHover, props.setDeleteConfirmation)
            ))}
        </div>
    );
};

/**
 * Item Component for each row in the table.
 *
 * @param {Object} data - The data for the current item.
 * @param {number} index - The index of the current item in the list.
 * @param {Function} itemActionBtn - Function to handle item action button clicks.
 * @param {number} editHover - Index of the item being hovered for edit.
 * @param {Function} setEditHover - Function to set the index of the item being hovered for edit.
 * @param {Function} setDeleteConfirmation - Function to set delete confirmation state.
 * @returns {JSX.Element} - The rendered item component.
 */
const item = (data, index, itemActionBtn, editHover, setEditHover, setDeleteConfirmation) => {
    /**
     * Handles the edit button click for the current item.
     */
    const editBtn = () => {
        itemActionBtn(data, index);
        setEditHover(-1);
    };

    /**
     * Opens the delete confirmation dialog for the current item.
     */
    const openDeletConfirmation = () => {
        document.getElementById(`client-journey-delete-confirm-${index}`).style.display = "block";
    };

    return(
        <div 
            key={index} 
            className='table-content-1-item' 
            onMouseEnter={() => document.getElementById(`table-content-1-item-more${index}`).style.display = "block"}
            onMouseLeave={() => {if(editHover !== index) document.getElementById(`table-content-1-item-more${index}`).style.display = "none"}}
        >
            {/* DeleteConfirmation Component */}
            <DeleteConfirmation 
                id={`client-journey-delete-confirm-${index}`}
                documentName={data.title}
                setConfirmation={setDeleteConfirmation}
                data={data}
            />
            <div className='table-content-1-item-content' onClick={editBtn}>
                <img src="./images/documentIcon.png" alt="icon"/>
                {data.title}
            </div>
            <button id={`table-content-1-item-more${index}`} style={{display: "none"}} className={`${editHover === index ? "active" : ""}`} onClick={() => setEditHover(editHover === index ? -1 : index)} ><MoreHoriz/></button>
            {/* Render 'MoreOption' component when the edit button is clicked */}
            {editHover === index &&
                <MoreOption index={index} editBtn={editBtn} openDeletConfirmation={openDeletConfirmation} />
            }
        </div>
    );
};
