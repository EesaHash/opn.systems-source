import React from 'react';
import "../../style/table.css";
import { ArrowBack } from '@mui/icons-material';

/**
 * @param {Object} props - Component props
 * @param {string} props.id - ID for the folder list
 * @param {string} props.title - Title of the folder list
 * @param {string} props.type - Type of the folder list
 * @param {Array} props.list - List of data items for the folder list
 * @param {Array} props.list2 - Additional list of data items (used in the item function)
 * @param {Array} props.stages - Stages for the folder list
 * @param {function} props.button1 - Function to handle the click on the first button
 * @param {function} props.itemActionBtn - Function to handle the click on an item in the folder list
 */
export const FolderList2 = (props) => {
    return (
        <div id={props.id} className='folder-list2'>
            <div className='table-directory'>
                <div className='table-directory-left-header'>
                    <button onClick={props.button1}><ArrowBack /></button>
                    <button onClick={props.button1}>{`${props.type}`}</button>
                    <h3>/</h3>
                    <button>{`${props.title}`}</button>
                </div>
            </div>
            <div className='folder-list-title'>
                <h1>{props.title}</h1>
            </div>
            <div className='folder-list-content'>
                {props.list.length > 0 &&
                    props.list.map((data, index) => (
                        item(data, index, props.list2.filter(obj => obj.stage === props.stages[index]), props.itemActionBtn)
                    ))
                }
            </div>
        </div>
    );
};

/**
 * Function to render an item in FolderList2
 * @param {Object} data - Data for the item
 * @param {number} index - Index of the item
 * @param {Array} list2 - Additional list of data items
 * @param {function} itemActionBtn - Function to handle the click on an item in the folder list
 * @returns {JSX.Element} - JSX element for the item
 */
const item = (data, index, list2, itemActionBtn) => {
    return (
        <div key={index} className='folder-list-content-item' onClick={() => itemActionBtn(data, index)}>
            <img src="./images/folder_icon.png" alt="icon" />
            <div className='folder-list-item-desc'>
                <h2>{data}</h2>
                <h3>{list2.length} files</h3>
            </div>
        </div>
    );
};
