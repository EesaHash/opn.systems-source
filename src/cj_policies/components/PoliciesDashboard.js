import React, { useEffect, useState } from 'react';
import "../style/policies.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

export const PoliciesDashboard = (props) => {
    const [setJourney] = useState({});
    const [setIndex] = useState(-1);
    useEffect(() => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
        }
        // eslint-disable-next-line
    }, [props.activeLink2]);
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
    };
    const openPilicyList = (param, index) => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        openFutureFeatureWarningForm();
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };

    return(
        <div className='policies'>
            <FolderList 
                id = "policies-main-table"
                title = "Policies"
                list = {props.journeys}
                list2 = {props.policies.length > 0 ? props.policies : [[]]}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openPilicyList}
            />
        </div>
    );
};
