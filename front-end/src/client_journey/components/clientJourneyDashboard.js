import React from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';
import { openPopUpForm } from '../../dashboard/page/dashboard_main';

export const ClientJourneyDashboard = (props) => {
    const openCreateJourneyForm = _ => {
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
