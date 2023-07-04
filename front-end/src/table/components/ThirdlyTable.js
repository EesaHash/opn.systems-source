import React from 'react';
import "../style/table.css";
import { FilterAlt, Search, Sort } from '@mui/icons-material';
import { openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';
import { EmptyTableContent } from './EmptyTableContent';

export const ThirdlyTable = (props) => {
    return(
        <div id = {props.id} className='thirdly-table'>
            <div className='thirdly-table-title'>
                <h1>{props.title}</h1>
                <div className='thirdly-table-right-header'>
                    <button onClick={openFutureFeatureWarningForm}><Search/> Search</button>
                    <button onClick={openFutureFeatureWarningForm}><FilterAlt/> Filter</button>
                    <button onClick={openFutureFeatureWarningForm}><Sort/> Sort</button>
                    <hr/>
                    <button onClick={props.addNewBtn} className='add-btn'>+ Add New</button>
                </div>
            </div>
            <div className='thirdly-table-content'>
                {props.list.length <= 0 ? 
                    <EmptyTableContent addNewBtn = {props.addNewBtn}/> :
                    props.list.map((data, index) => (
                        item(data, index, props.list2, props.itemActionBtn)
                    ))
                }
            </div>
        </div>
    );
};

const item = (data, index, list2, itemActionBtn) => {
    return(
        <div key={index} className='thirdly-table-content-item' onClick={() => itemActionBtn(data)}>
            <img src="./images/folder_icon.png" alt="icon"/>
            <div className='thirdly-table-item-desc'>
                <h2>{data.title}</h2>
                <h3>{list2.length} files</h3>
            </div>
        </div>
    )
};