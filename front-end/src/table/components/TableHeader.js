import React from 'react';
import "../style/table.css";
import { FilterAlt, MoreHoriz, Search, Sort } from '@mui/icons-material';
import { openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

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
                        <button onClick={openFutureFeatureWarningForm}><Search/> Search</button>
                    </div>
                    <div className='table-header-item'>
                        <button onClick={openFutureFeatureWarningForm}><FilterAlt/> Filter</button>
                    </div>
                    <div className='table-header-item'>
                        <button onClick={openFutureFeatureWarningForm}><Sort/> Sort</button>
                    </div>
                    <div className='table-header-item'>
                        <button onClick={openFutureFeatureWarningForm}><MoreHoriz/></button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
};