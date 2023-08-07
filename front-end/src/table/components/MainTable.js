import React from 'react';
import "../style/table.css";
import { TableHeader } from './TableHeader';
import { EmptyTableContent } from './EmptyTableContent';
import { TableContent1 } from './TableContent1';

/**
 * Component for Main Table Header.
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the main table
 * @param {string} props.id - ID of the main table
 * @param {Array} props.list - Array of items to be displayed in the table
 * @param {Function} props.addNewBtn - Function to handle the "Add New" button click event
 * @param {Function} props.itemActionBtn - Function to handle the item action button click event
 * @returns {JSX.Element} - JSX element for Main Table Header
 */
export const MainTableHeader = (props) => {
    return (
        <div className='main-table' id={props.id}>
            {/* Main Table Title */}
            <div className='main-table-title'>
                <h1>{props.title}</h1>
                {/* Right header with "Add New" button */}
                <div className='main-table-right-header'>
                    <button onClick={props.addNewBtn}>+ Add New</button>
                </div>
            </div>
            {/* Table Header */}
            <TableHeader list={props.list} />
            {/* Check if the list is empty, if so, display EmptyTableContent, else display TableContent1 */}
            {props.list.length <= 0 ?
                <EmptyTableContent addNewBtn={props.addNewBtn} /> :
                <TableContent1 list={props.list} itemActionBtn={props.itemActionBtn} />
            }
        </div>
    );
};
