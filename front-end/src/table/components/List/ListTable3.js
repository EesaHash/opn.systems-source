import React from 'react';
import "../../style/table.css";
import { TableHeader } from '../TableHeader';
import { EmptyTableContent } from '../EmptyTableContent';
import { TableContent1 } from '../TableContent1';
import { ArrowBack } from '@mui/icons-material';

/**
 * Component to display a fourth table.
 * @param {Object} props - Component props
 * @param {string} props.id - ID for the fourth table
 * @param {string} props.title - Title for the fourth table
 * @param {string} props.type - Type for the fourth table
 * @param {string} props.sub_title - Subtitle for the fourth table
 * @param {Array} props.list - List for the fourth table
 * @param {function} props.button1 - Function for button 1
 * @param {function} props.button2 - Function for button 2
 * @param {function} props.addNewBtn - Function to add a new item
 * @param {function} props.itemActionBtn - Function for item action button
 * @param {function} props.setDeleteConfirmation - Function to set delete confirmation
 * @returns {JSX.Element} - JSX element for ListTable3
 */
export const ListTable3 = (props) => {
    return (
        <div className='fourth-table' id={props.id}>
            <div className='fourth-table-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button2}><ArrowBack /></button>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button onClick={props.button2}>{`${props.title}`}</button>
                        <h3>/</h3>
                        <button>{`${props.sub_title}`}</button>
                    </div>
                </div>
                <div className='fourth-table-title'>
                    <h1>{props.title}</h1>
                    <div className='fourth-table-right-header'>
                        <button onClick={props.addNewBtn}>Generate</button>
                    </div>
                </div>
                <TableHeader list={props.list} />
                {props.list.length <= 0 ?
                    <EmptyTableContent addNewBtn={props.addNewBtn} buttonTitle="Generate" /> :
                    <TableContent1 list={props.list} itemActionBtn={props.itemActionBtn} setDeleteConfirmation={props.setDeleteConfirmation} />
                }
            </div>
        </div>
    );
};
