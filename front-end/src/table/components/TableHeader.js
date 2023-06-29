import React from 'react';
import "../style/table.css";
import { FilterAlt, MoreHoriz, Search, Sort } from '@mui/icons-material';

export const TableHeader = (props) => {
    return(
        <div className='table-header'>
            <div style={{display: "flex"}}>
                <div className='left-header'>
                    <div className='table-header-item'>
                        <input type="checkbox"/>
                        <label>count</label>
                        <h3>{props.list.length}</h3>
                    </div>
                </div>
                <div className='right-header'>
                    <div className='table-header-item'>
                        <button><Search/> Search</button>
                    </div>
                    <div className='table-header-item'>
                        <button><FilterAlt/> Filter</button>
                    </div>
                    <div className='table-header-item'>
                        <button><Sort/> Sort</button>
                    </div>
                    <div className='table-header-item'>
                        <button><MoreHoriz/></button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
};