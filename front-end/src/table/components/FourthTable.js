import React from 'react';
import "../style/table.css";
import { TableHeader } from './TableHeader';
import { EmptyTableContent } from './EmptyTableContent';
import { TableContent1 } from './TableContent1';

export const FourthTable = (props) => {
    return(
        <div className='fourth-table' id = {props.id}>
            <div className='fourth-table-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button >{`${props.title}`}</button>
                    </div>
                </div>
                <div className='fourth-table-title'>
                    <h1>{props.title}</h1>
                    <div className='fourth-table-right-header'>
                        <button onClick={props.addNewBtn}>+ Add New</button>
                    </div>
                </div>
                <TableHeader list = {props.list}/>
                {props.list.length <= 0 ?
                    <EmptyTableContent addNewBtn = {props.addNewBtn}/> :
                    <TableContent1 list = {props.list} itemActionBtn = {props.itemActionBtn} />
                }
            </div>
        </div>
    );
};