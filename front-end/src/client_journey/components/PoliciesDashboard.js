import React, { useState } from 'react';
import "../style/client_journey.css";
import { ThirdlyTable } from '../../table/components/ThirdlyTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { FourthTable } from '../../table/components/FourthTable';

export const PoliciesDashboard = (props) => {
    const [journey, setJourney] = useState({});
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    const openPilicyList = (param) => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            secondaryTable.style.display = "block";
        }
    };
    const showJourneyList = _ => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
        }
    };
    const openCreatePolicyForm = _ => {
        openAccessLimitForm();
    };
    const openPolicyDetail = _ => {
        openAccessLimitForm();
    };

    return(
        <div className='policies'>
            <ThirdlyTable 
                id = "policies-main-table"
                title = "Policies"
                list = {props.journeys}
                list2 = {props.policies}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openPilicyList}
            />
            <FourthTable
                id = "policies-secondary-table"
                type = "Policies"
                title = {`${journey.title}'s Policies`}
                list = {props.policies}
                button1 = {showJourneyList}
                addNewBtn = {openCreatePolicyForm}
                itemActionBtn = {openPolicyDetail}
            />
        </div>
    );
};
