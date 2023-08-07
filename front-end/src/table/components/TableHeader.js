// Import necessary libraries and components
import React from 'react';
import "../style/table.css";
import { FilterAlt, MoreHoriz, Search, Sort } from '@mui/icons-material';
import { openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

/**
 * TableHeader Component.
 *
 * @param {Object} props - Props passed to the component.
 * @param {Array} props.list - Array of data items to be displayed in the table.
 * @returns {JSX.Element} - The rendered table header.
 */
export const TableHeader = (props) => {
    return(
        <div className='table-header'>
            <div style={{display: "flex"}}>
                {/* Left part of the header */}
                <div className='left-header'>
                    <div className='table-header-item'>
                        {/* Checkbox for selecting all items (commented out) */}
                        {/* <input type="checkbox"/> */}
                        <label>count</label>
                        {/* Display the number of items in the table */}
                        <h3>{props.list.length}</h3>
                    </div>
                </div>
                {/* Right part of the header */}
                <div className='right-header'>
                    <div className='table-header-item'>
                        {/* Button for search feature */}
                        <button onClick={openFutureFeatureWarningForm}><Search/> Search</button>
                    </div>
                    <div className='table-header-item'>
                        {/* Button for filter feature */}
                        <button onClick={openFutureFeatureWarningForm}><FilterAlt/> Filter</button>
                    </div>
                    <div className='table-header-item'>
                        {/* Button for sort feature */}
                        <button onClick={openFutureFeatureWarningForm}><Sort/> Sort</button>
                    </div>
                    <div className='table-header-item'>
                        {/* Button for additional options (more options) */}
                        <button onClick={openFutureFeatureWarningForm}><MoreHoriz/></button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
};
