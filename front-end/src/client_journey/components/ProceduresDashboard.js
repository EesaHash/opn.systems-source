import React, { useState } from 'react';
import "../style/client_journey.css";
import { ThirdlyTable } from '../../table/components/ThirdlyTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { FourthTable } from '../../table/components/FourthTable';

export const ProceduresDashboard = (props) => {
    const [journey, setJourney] = useState({});
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    const openProcedureList = (param) => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            secondaryTable.style.display = "block";
        }
    };
    const showJourneyList = _ => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
        }
    };
    const openCreateProcedureForm = _ => {
        document.getElementById("createProcedureForm").style.display = "block";
        openPopUpForm();
    };
    const openProcedureDetail = _ => {
        
    };
    return(
        <div className='procedure'>
            <ThirdlyTable 
                id = "procedure-main-table"
                title = "Procedures"
                list = {props.journeys}
                list2 = {props.procedures}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openProcedureList}
            />
            <FourthTable
                id = "procedure-secondary-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                list = {props.procedures}
                button1 = {showJourneyList}
                addNewBtn = {openCreateProcedureForm}
                itemActionBtn = {openProcedureDetail}
            />
        </div>
    );
};
