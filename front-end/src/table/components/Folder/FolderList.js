import React from 'react';
import "../../style/table.css";
import { FilterAlt, Search, Sort } from '@mui/icons-material';
import { openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { EmptyTableContent } from '../EmptyTableContent';

/**
 * @param {Object} props - Component props
 * @param {string} props.id - ID for the folder list
 * @param {string} props.title - Title of the folder list
 * @param {Array} props.list - List of data items for the folder list
 * @param {Array} props.list2 - Additional list of data items (used in the item function)
 * @param {function} props.addNewBtn - Function to handle the "Add New" button click
 * @param {function} props.itemActionBtn - Function to handle the click on an item in the folder list
 */
export const FolderList = (props) => {
    return (
        <div id={props.id} className='folder-list'>
            <div className='folder-list-title'>
                <h1>{props.title}</h1>
                <div className='folder-list-right-header'>
                    <button onClick={openFutureFeatureWarningForm}><Search /> Search</button>
                    <button onClick={openFutureFeatureWarningForm}><FilterAlt /> Filter</button>
                    <button onClick={openFutureFeatureWarningForm}><Sort /> Sort</button>
                    <hr />
                    <button onClick={props.addNewBtn} className='add-btn'>+ Add New</button>
                </div>
            </div>
            <div className='folder-list-content'>
                {props.list.length <= 0 ?
                    <EmptyTableContent addNewBtn={props.addNewBtn} buttonTitle="+ Add New" /> :
                    props.list.map((data, index) => (
                        item(data, index, props.list2[index], props.itemActionBtn)
                    ))
                }
            </div>
        </div>
    );
};

/**
 * Function to render an item in the folder list
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
                <h2>{data.title}</h2>
                <h3>{list2.length} files</h3>
            </div>
        </div>
    );
};
