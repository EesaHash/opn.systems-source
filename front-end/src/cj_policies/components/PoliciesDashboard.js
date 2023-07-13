import React, { useEffect, useState } from 'react';
import "../style/policies.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { ListTable3 } from '../../table/components/List/ListTable3';

export const PoliciesDashboard = (props) => {
    const [journey, setJourney] = useState({});
    const [index, setIndex] = useState(-1);
    useEffect(() => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
        }
    }, [props.activeLink2]);
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    const openPilicyList = (param, index) => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
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
            <FolderList 
                id = "policies-main-table"
                title = "Policies"
                list = {props.journeys}
                list2 = {props.policies.length > 0 ? props.policies : [[]]}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openPilicyList}
            />
            <ListTable3
                id = "policies-secondary-table"
                type = "Policies"
                title = {`${journey.title}'s Policies`}
                list = {(props.policies.length > 0 && index >= 0) ? props.policies[index] : []}
                button1 = {showJourneyList}
                addNewBtn = {openCreatePolicyForm}
                itemActionBtn = {openPolicyDetail}
            />
        </div>
    );
};
