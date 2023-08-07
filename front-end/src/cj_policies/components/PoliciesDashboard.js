import React, { useEffect, useState } from 'react';
import "../style/policies.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

/**
 * PoliciesDashboard functional component.
 * This component renders a dashboard for managing policies.
 *
 * @param {Object} props - The props object for the component.
 * @param {Array} props.journeys - An array containing the list of journeys.
 * @param {Array} props.policies - An array containing the list of policies.
 * @param {string} props.activeLink2 - The active link for the secondary table (unused in this implementation).
 * @returns {JSX.Element} - The PoliciesDashboard component's UI.
 */
export const PoliciesDashboard = (props) => {
    const [setJourney] = useState({});
    const [setIndex] = useState(-1);

    // useEffect hook to handle display of main and secondary tables.
    useEffect(() => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");

        if (mainTable && secondaryTable) {
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
        }
        // eslint-disable-next-line
    }, [props.activeLink2]);

    // Function to open the form for creating a new journey.
    const openCreateJourneyForm = _ => {
        if (props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
    };

    // Function to open the policy list for a specific journey.
    const openPilicyList = (param, index) => {
        const mainTable = document.getElementById("policies-main-table");
        const secondaryTable = document.getElementById("policies-secondary-table");

        openFutureFeatureWarningForm();

        if (mainTable && secondaryTable) {
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };

    return (
        // Main container for the policies dashboard.
        <div className='policies'>
            {/* 
                FolderList component renders a table with folders (journeys) and their associated policies.
                
                @param {string} id - ID for the main table element.
                @param {string} title - Title displayed above the table.
                @param {Array} list - An array containing the list of journeys.
                @param {Array} list2 - An array containing the list of policies, or an empty array if no policies exist.
                @param {function} addNewBtn - Function to be called when the "Add New" button is clicked. 
                                             It opens a form for creating a new journey or shows access limit form.
                @param {function} itemActionBtn - Function to be called when an item (journey) is clicked. 
                                                  It opens the policy list for the clicked journey (not fully implemented here).
            */}
            <FolderList 
                id="policies-main-table"
                title="Policies"
                list={props.journeys}
                list2={props.policies.length > 0 ? props.policies : [[]]}
                addNewBtn={openCreateJourneyForm}
                itemActionBtn={openPilicyList}
            />
        </div>
    );
};
