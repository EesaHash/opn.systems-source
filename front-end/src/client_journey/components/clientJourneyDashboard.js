import React from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTableTitle';

export const ClientJourneyDashboard = _ => {
    return(
        <div className='client-journey'>
            <MainTableHeader title = "Client Journey" list = {[]}/>
        </div>
    );
};
