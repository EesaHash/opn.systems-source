import React from 'react';
import "../../style/table.css";
import { TableHeader } from '../TableHeader';
import { EmptyTableContent } from '../EmptyTableContent';
import { TableContent1 } from '../TableContent1';
import { ArrowBack } from '@mui/icons-material';

export const ListTable3 = (props) => {
    return(
        <div className='fourth-table' id = {props.id}>
            <div className='fourth-table-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button2}><ArrowBack/></button>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button onClick={props.button2}>{`${props.title}`}</button>
                        <h3>/</h3>
                        <button >{`${props.sub_title}`}</button>
                    </div>
                </div>
                <div className='fourth-table-title'>
                    <h1>{props.title}</h1>
                    <div className='fourth-table-right-header'>
                        <button onClick={props.addNewBtn}>Generate</button>
                    </div>
                </div>
                <TableHeader list = {props.list}/>
                {props.list.length <= 0 ?
                    <EmptyTableContent addNewBtn = {props.addNewBtn} buttonTitle = "Generate"/> :
                    <TableContent1 list = {props.list} itemActionBtn = {props.itemActionBtn} />
                }
            </div>
        </div>
    );
};