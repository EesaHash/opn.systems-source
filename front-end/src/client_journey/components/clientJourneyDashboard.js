import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { SecondaryTable } from '../../table/components/SecondaryTable';

export const ClientJourneyDashboard = (props) => {
    const [journey, setJourney] = useState({});
    useEffect(() => {
        if(document.getElementById("client-journey-main-table") && document.getElementById("client-journey-secondary-table")){
            document.getElementById("client-journey-main-table").style.display = "block";
            setJourney({});
            document.getElementById("client-journey-secondary-table").style.display = "none";
        }
    }, [props.activeLink2]);

    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    const openClientJourneyDetails = (param) => {
        if(document.getElementById("client-journey-main-table") && document.getElementById("client-journey-secondary-table")){
            document.getElementById("client-journey-main-table").style.display = "none";
            setJourney(param);
            document.getElementById("client-journey-secondary-table").style.display = "block";
        }
    };
    return(
        <div className='client-journey'>
            <MainTableHeader 
                id = "client-journey-main-table"
                title = "Client Journey" 
                list = {props.journeys}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openClientJourneyDetails}
            />
            <SecondaryTable
                id = "client-journey-secondary-table"
                type = {"Client Journey"}
                title = {journey.title}
                description = {journey.overview ? JSON.parse(journey.overview).overview : ""}
                data = {journey}
            />
        </div>
    );
};
