import React from 'react';
import "../../style/table.css";
import { TableHeader } from '../TableHeader';
import { EmptyTableContent } from '../EmptyTableContent';
import { TableContent1 } from '../TableContent1';

/**
 * Component to display a list table.
 * @param {Object} props - Component props
 * @param {string} props.id - ID for the list table
 * @param {string} props.title - Title for the list table
 * @param {Array} props.list - List data for the list table
 * @param {function} props.itemActionBtn - Function for item action button
 * @param {function} props.addNewBtn - Function for add new button
 * @param {function} props.setDeleteConfirmation - Function to set delete confirmation
 * @returns {JSX.Element} - JSX element for ListTable
 */
export const ListTable = (props) => {
    return (
        <div className='main-table' id={props.id}>
            <div className='main-table-title'>
                <h1>{props.title}</h1>
                <div className='main-table-right-header'>
                    <button onClick={props.addNewBtn}>+ Add New</button>
                </div>
            </div>
            <TableHeader list={props.list} />
            {props.list.length <= 0 ?
                <EmptyTableContent addNewBtn={props.addNewBtn} buttonTitle="+ Add New" /> :
                <TableContent1 list={props.list} itemActionBtn={props.itemActionBtn} setDeleteConfirmation={props.setDeleteConfirmation} />
            }
        </div>
    );
};
