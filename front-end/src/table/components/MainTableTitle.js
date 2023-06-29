import React from 'react';
import "../style/table.css";
import { TableHeader } from './TableHeader';
import { EmptyTableContent } from './EmptyTableContent';

export const MainTableHeader = (props) => {
    return(
        <div className='main-table'>
            <div className='main-table-title'>
                <h1>{props.title}</h1>
                <div className='main-table-right-header'>
                    <button>+ Add New</button>
                </div>
            </div>
            <TableHeader list = {[]}/>
            {props.list.length <= 0 ?
                <EmptyTableContent/> :
                null
            }
        </div>
    );
};