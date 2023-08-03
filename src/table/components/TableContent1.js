import React, { useState } from 'react';
import "../style/table.css";
import { MoreHoriz } from '@mui/icons-material';
import { MoreOption } from './MoreOption';
import { DeleteConfirmation } from '../../public_components/DeleteConfirmation';

export const TableContent1 = (props) => {
    const [editHover, setEditHover] = useState(-1);

    return(
        <div className='table-content-1'>
            {props.list.map((data, index) => (
                item(data, index, props.itemActionBtn, editHover, setEditHover, props.setDeleteConfirmation)
            ))}
        </div>
    );
};
const item = (data, index, itemActionBtn, editHover, setEditHover, setDeleteConfirmation) => {
    const editBtn = _ => {
        itemActionBtn(data, index);
        setEditHover(-1);
    };
    const openDeletConfirmation = _ => {
        document.getElementById(`client-journey-delete-confirm-${index}`).style.display = "block";
    };
    return(
        <div 
            key = {index} 
            className='table-content-1-item' 
            onMouseEnter = {() => document.getElementById(`table-content-1-item-more${index}`).style.display = "block"}
            onMouseLeave={() => {if(editHover !== index) document.getElementById(`table-content-1-item-more${index}`).style.display = "none"}}
        >
            <DeleteConfirmation 
                id = {`client-journey-delete-confirm-${index}`}
                documentName = {data.title}
                setConfirmation = {setDeleteConfirmation}
                data = {data}
            />
            <div className='table-content-1-item-content' onClick={editBtn}>
                <img src="./images/documentIcon.png" alt="icon"/>
                {data.title}
            </div>
            <button id={`table-content-1-item-more${index}`} style={{display: "none"}} className={`${editHover === index ? "active" : ""}`} onClick={() => setEditHover(editHover === index ? -1 : index)} ><MoreHoriz/></button>
            {editHover === index &&
                <MoreOption index={index} editBtn = {editBtn} openDeletConfirmation = {openDeletConfirmation} />
            }
        </div>
    );
};