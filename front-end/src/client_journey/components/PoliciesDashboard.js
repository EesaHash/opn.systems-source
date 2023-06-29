import React from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTableTitle';

export const PoliciesDashboard = _ => {
    return(
        <div className='policies'>
            <MainTableHeader title = "Policies" list = {[]}/>
        </div>
    );
};
