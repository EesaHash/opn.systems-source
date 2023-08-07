import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { Delete, DensityMedium, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { setTextAreaHeight, updateListItem, updateListSubItem } from '../PublicTableComponents';
// import { EditPrompt } from '../EditPrompt';

/**
 * @param {Object} props - Component props
 * @param {string} props.itemClassName - Class name for the table item
 * @param {number} props.index - Index of the table item
 * @param {Object} props.data - Data to display for the table item
 * @param {boolean} props.editStatus - Flag to indicate if the table is in edit mode
 * @param {function} props.isEditSelected - Function to check if the item is in edit mode
 * @param {function} props.setSelectedStep - Function to set the selected step
 * @param {function} props.setDragItemIndex - Function to set the index of the dragged item
 * @param {function} props.setDragOverItemIndex - Function to set the index of the item over which dragging is occurring
 * @param {Array} props.list - The list of items
 * @param {function} props.setList - Function to set the list of items
 * @param {function} props.updateList - Function to update the list of items
 */
export const ExpandMinimisedTableItem2 = (props) => {
    const [itemClassName, setItemClassName] = useState(props.itemClassName);

    // useEffect to set the text area height when the props.list changes
    useEffect(() => {
        setTextAreaHeight(".text");
    }, [props.list]);

    // useEffect to update itemClassName when props.itemClassName changes
    useEffect(() => {
        setItemClassName(props.itemClassName);
    }, [props.itemClassName]);

    /**
     * Function to toggle between expanded and minimised view of the table item
     */
    const expandMinimisedBtn = () => {
        if (itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };

    /**
     * Event handler for drag start event
     * @param {number} index - The index of the dragged item
     */
    const handleDragStart = (index) => {
        props.setDragItemIndex(index);
    };

    /**
     * Event handler for drag over event
     * @param {Event} event - The drag over event
     */
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    /**
     * Event handler for drop event
     */
    const handleDrop = () => {
        // Make a copy of the original list
        const _list = [...props.list];
        // Remove the dragged item from the original position and store it in dragItem
        const dragItem = _list.splice(props.dragItemIndex, 1)[0]; // Make sure to get the first item from the splice result.
        // Insert the dragged item into the new position in the copied list
        _list.splice(props.dragOverItemIndex, 0, dragItem);
        // Update the state with the new list
        console.log(_list);
        props.setList(_list);
        // Update the original list
        props.updateList(_list);
    };

    /**
     * Event handler for drag enter event
     * @param {number} index - The index of the item where dragging is occurring
     */
    const handleDragEnter = (index) => {
        props.setDragOverItemIndex(index);
    };

    /**
     * Event handler for drag end event
     * @param {Event} event - The drag end event
     */
    const handleDragEnd = (event) => {
        props.setDragItemIndex(undefined);
        props.setDragOverItemIndex(undefined);
    };

    /**
     * Function to update the content of the main item
     * @param {string} newValue - The new value for the main item
     */
    const updateItemContent = (newValue) => {
        const result = updateListItem(props.list, props.index, newValue);
        props.setList(result);
        props.updateList(result);
    };

    /**
     * Function to update the content of a sub-item
     * @param {number} index - The index of the sub-item
     * @param {string} newValue - The new value for the sub-item
     */
    const updateSubItemContent = (index, newValue) => {
        const result = updateListSubItem(props.list, props.index, index, newValue);
        props.setList(result);
        props.updateList(result);
    };

    /**
     * Function to delete the main item
     */
    const deleteItem = () => {
        const _list = [...props.list];
        _list.splice(props.index, 1);
        props.setList(_list);
        props.updateList(_list);
    };

    /**
     * Function to delete a sub-item
     * @param {number} index - The index of the sub-item to delete
     */
    const deleteSubItem = (index) => {
        const _item = [...props.list[props.index].item];
        if (_item.length > 1)
            _item.splice(index, 1);
        else
            _item[0].data = "";
        const _list = [...props.list];
        _list[props.index].item = _item;
        props.setList(_list);
        props.updateList(_list);
    };

    return (
        <li
            key={props.index}
            draggable={props.editStatus}
            onDragStart={() => handleDragStart(props.index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(props.index)}
            onDragEnter={() => handleDragEnter(props.index)}
            onDragLeave={() => handleDragEnter(props.index)}
            onDragEnd={handleDragEnd}
        >
            {props.editStatus && <div className='edit-icon'><DensityMedium /></div>}
            <div className={`list-table4-list-item${props.isEditSelected(props.index) ? " active" : ""}`} onClick={() => itemClassName === "minimised" && expandMinimisedBtn()} >
                <h3>{props.data.hyphen}</h3>
                <div className='list-table4-list-item-content'>
                    <div style={{ marginBottom: props.isEditSelected(props.index) ? "15px" : "0" }} onClick={() => props.setSelectedStep(props.index)}>
                        <div style={{ display: "flex" }} className={props.data.item.length > 0 ? "heading" : ""}>
                            <textarea className='table-input text' type="text" value={props.data.data} onChange={(event) => updateItemContent(event.target.value)} readOnly={!props.isEditSelected(props.index)} />
                            {props.data.item.length > 0 &&
                                <button onClick={expandMinimisedBtn} >
                                    {itemClassName === "minimised" ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                                </button>
                            }
                        </div>
                        {itemClassName !== "minimised" &&
                            props.data.item.map((item, index) => (
                                <div className='sub-items'>
                                    {index > 0 && <hr />}
                                    <div className='sub-items-content'>
                                        <h3>{item.hyphen}</h3>
                                        <textarea className='table-input text' type="text" value={item.data} onChange={(event) => updateSubItemContent(index, event.target.value)} readOnly={!props.isEditSelected(props.index)} />
                                        {props.isEditSelected(props.index) && <div className='edit-icon' onClick={(event) => deleteSubItem(index)}><Delete /></div>}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {/* {props.isEditSelected(props.index) && <EditPrompt index={props.index} />} */}
                </div>
            </div>
            {props.editStatus && <div className='edit-icon' onClick={deleteItem}><Delete /></div>}
        </li>
    );
};
