import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { ThirdlyTable } from '../../table/components/ThirdlyTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { FourthTable } from '../../table/components/FourthTable';
import { FifthTable, FifthTableDescAsList, FifthTableDescAsNumberList, FifthTableDescItem } from '../../table/components/FifthTable';
import { AssignmentInd, FolderCopy, FormatAlignLeft } from '@mui/icons-material';

export const ProceduresDashboard = (props) => {
    const [journey, setJourney] = useState({});
    const [procedure, setProcedure] = useState({});
    const [index, setIndex] = useState(-1);
    useEffect(() => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(mainTable && secondaryTable && thirdTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
            thirdTable.style.display = "none";
        }
        // eslint-disable-next-line
    }, [props.activeLink2]);
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };
    const openProcedureList = (param, index) => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };
    const showJourneyList = _ => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(mainTable && secondaryTable && thirdTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
            thirdTable.style.display = "none";
        }
    };
    const openCreateProcedureForm = _ => {
        document.getElementById("createProcedureForm").style.display = "block";
        openPopUpForm();
    };
    const openProcedureDetail = (param) => {
        const secondTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(secondTable && thirdTable) {
            secondTable.style.display = "none";
            setProcedure(param);
            thirdTable.style.display = "block";
        }
    };
    const showProcedureList = _ => {
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(thirdTable && secondaryTable){
            thirdTable.style.display = "none";
            setProcedure({});
            secondaryTable.style.display = "block";
        }
    };
    
    const descList = [
        FifthTableDescItem(<FormatAlignLeft/>, "Objective", procedure.objective),
        FifthTableDescAsNumberList(<FormatAlignLeft/>, "Definitions", procedure.definitions),
        FifthTableDescAsNumberList(<AssignmentInd/>, "Responsibility", procedure.responsibility),
        FifthTableDescAsList(<FolderCopy/>, "Documentation", procedure.documentation)
    ];

    return(
        <div className='procedure'>
            <ThirdlyTable 
                id = "procedure-main-table"
                title = "Procedures"
                list = {props.journeys}
                list2 = {props.procedures.length > 0 ? props.procedures : [[]]}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openProcedureList}
            />
            <FourthTable
                id = "procedure-secondary-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                list = {(props.procedures.length > 0 && index >= 0) ? props.procedures[index] : []}
                button1 = {showJourneyList}
                addNewBtn = {openCreateProcedureForm}
                itemActionBtn = {openProcedureDetail}
            />
            <FifthTable
                id = "procedure-third-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                sub_title = {procedure.title}
                button1 = { showJourneyList }
                button2 = { showProcedureList }
                data = { procedure }
                desc = { descList }
                list1Title = "Procedure"
                list1 = {procedure.procedure ? procedure.procedure.split("\n\n") : []}
            />
        </div>
    );
};
