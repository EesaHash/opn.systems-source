import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { Delete, DensityMedium, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EditPrompt } from '../EditPrompt';

export const ExpandMinimisedTableItem2 = (props) => {
    const [itemClassName, setItemClassName] = useState(props.itemClassName);

    useEffect(() => {
        setItemClassName(props.itemClassName);
    }, [props.itemClassName]);
    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };

    const handleDragStart = (index) => {
        props.setDragItemIndex(index)
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleDrop = _ => {
        // Make a copy of the original list
        const _list = [...props.list];
        // Remove the dragged item from the original position and store it in dragItem
        const dragItem = _list.splice(props.dragItemIndex, 1)[0]; // Make sure to get the first item from the splice result.
        // Insert the dragged item into the new position in the copied list
        _list.splice(props.dragOverItemIndex, 0, dragItem);
        // Update the state with the new list
        props.setList(_list);
    };
    const handleDragEnter = (index) => {
        props.setDragOverItemIndex(index);
    };
    const handleDragEnd = (event) => {
        props.setDragItemIndex(undefined);
        props.setDragOverItemIndex(undefined);
    };
    const deleteItem = _ => {
        const _list = [...props.list];
        _list.splice(props.index, 1);
        props.setList(_list);

    };

    return(
        <li 
            key={props.index} 
            draggable = {props.editStatus}
            onDragStart={() => handleDragStart(props.index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(props.index)}
            onDragEnter={() => handleDragEnter(props.index)}
            onDragLeave={() => handleDragEnter(props.index)}
            onDragEnd={handleDragEnd}
        >
            {props.editStatus && <div className='edit-icon'><DensityMedium/></div> }
            <div className={`list-table4-list-item${props.isEditSelected(props.index) ? " active" : ""}`} onClick={() => itemClassName === "minimised" && expandMinimisedBtn()} >
                <h3>{props.data.hyphen}</h3>
                <div className='list-table4-list-item-content'>
                    <div style={{marginBottom: props.isEditSelected(props.index) ? "15px" : "0"}} onClick={() => props.setSelectedStep(props.index)}>
                        <div style={{display: "flex"}} className={props.data.item.length > 0 ? "heading" : ""}>
                            {/* <text>{props.data.heading}</text> */}
                            <div className='table-input text' contentEditable = {props.isEditSelected(props.index)}>{props.data.heading}</div>
                            {props.data.item.length > 0 &&
                                <button onClick={expandMinimisedBtn} >
                                    {itemClassName === "minimised" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                                </button>
                            }
                        </div>
                        {itemClassName !== "minimised" &&
                            props.data.item.map((item, index) => (
                                <div className='sub-items'>
                                    {index > 0 && <hr/>}
                                    <div className='sub-items-content'>
                                        <h3>{item.hyphen}</h3>
                                        <div className='table-input text' contentEditable = {props.isEditSelected(props.index)}>{item.data}</div>
                                        {/* <text>{item.data}</text> */}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {/* {props.isEditSelected(props.index) && <EditPrompt index = {props.index}/>} */}
                </div>
            </div>
            {props.editStatus && <div className='edit-icon' onClick={deleteItem}><Delete/></div> }
        </li>
    );
};