import React from 'react';
import "../style/table.css";
import { TableHeader } from './TableHeader';
import { EmptyTableContent } from './EmptyTableContent';
import { TableContent1 } from './TableContent1';

export const MainTableHeader = (props) => {
    return(
        <div className='main-table' id = {props.id}>
            <div className='main-table-title'>
                <h1>{props.title}</h1>
                <div className='main-table-right-header'>
                    <button onClick={props.addNewBtn}>+ Add New</button>
                </div>
            </div>
            <TableHeader list = {props.list}/>
            {props.list.length <= 0 ?
                <EmptyTableContent addNewBtn = {props.addNewBtn}/> :
                <TableContent1 list = {props.list} itemActionBtn = {props.itemActionBtn} />
            }
        </div>
    );
};