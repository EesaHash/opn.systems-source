import React from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';

export const ClientJourneyDashboard = (props) => {
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    return(
        <div className='client-journey'>
            <MainTableHeader 
                title = "Client Journey" 
                list = {props.journeys}
                addNewBtn = {openCreateJourneyForm}
            />
        </div>
    );
};
