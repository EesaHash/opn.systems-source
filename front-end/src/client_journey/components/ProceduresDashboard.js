import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { FourthTable } from '../../table/components/FourthTable';
import { FifthTable, FifthTableDescAsList, FifthTableDescItem } from '../../table/components/FifthTable';
import { FormatAlignLeft } from '@mui/icons-material';
import { FolderList2 } from '../../table/components/Folder/FolderList2';

export const ProceduresDashboard = (props) => {
    const [index, setIndex] = useState(-1);
    const [journey, setJourney] = useState({});
    const [procedure, setProcedure] = useState({});
    const [stage, setStage] = useState("");
    
    useEffect(() => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(mainTable && secondaryTable && thirdTable && fourthTable){
            mainTable.style.display = "block";
            setJourney({});
            secondaryTable.style.display = "none";
            thirdTable.style.display = "none";
            fourthTable.style.display = "none";
        }
        // eslint-disable-next-line
    }, [props.activeLink2]);

    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
        openPopUpForm();
    };

    // Going to Tab 2
    const openStagesList = (param, index) => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };

    // Going to Tab 3
    const openProcedureList = (param) => {
        const secondTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(secondTable && thirdTable) {
            secondTable.style.display = "none";
            setStage(param);
            thirdTable.style.display = "block";
        }
    };

    // Going to Tab 4
    const openProcedureDetail = (param) => {
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(thirdTable && fourthTable) {
            thirdTable.style.display = "none";
            setProcedure(param);
            fourthTable.style.display = "block";
        }
    };

    // Going back to Tab 1
    const showJourneyList = _ => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(mainTable && secondaryTable && thirdTable && fourthTable){
            mainTable.style.display = "block";
            setProcedure({});
            setStage("");
            setJourney({});
            secondaryTable.style.display = "none";
            thirdTable.style.display = "none";
            fourthTable.style.display = "none";
        }
    };

    // Going back to Tab 2
    const showStagesList = _ => {
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(secondaryTable && thirdTable && fourthTable){
            thirdTable.style.display = "none";
            fourthTable.style.display = "none";
            setStage("");
            secondaryTable.style.display = "block"
        }
    };

    // Going back to Tab 3
    const showProcedureList = _ => {
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(thirdTable && fourthTable){
            fourthTable.style.display = "none";
            setProcedure({});
            thirdTable.style.display = "block";
        }
    };
    
    const openCreateProcedureForm = _ => {
        document.getElementById("createProcedureForm").style.display = "block";
        openPopUpForm();
    };
    
    const descList = [
        FifthTableDescItem(<FormatAlignLeft/>, "Objective", procedure.purpose),
        FifthTableDescAsList(<FormatAlignLeft/>, "Definitions", procedure.definitions)
    ];

    return(
        <div className='procedure'>
            <FolderList 
                id = "procedure-main-table"
                title = "Procedures"
                list = {props.journeys}
                list2 = {props.journeys.length > 0 ? props.journeys.map(obj => obj.stages) : [[]]}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openStagesList}
            />
            <FolderList2
                id = "procedure-secondary-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                list = {journey.stages ? journey.stages : []}
                list2 = {props.procedures.length > 0 ? props.procedures : [[]]}
                button1 = {showJourneyList}
                itemActionBtn = {openProcedureList}
            />
            <FourthTable
                id = "procedure-third-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                sub_title = {stage}
                button1 = {showJourneyList}
                button2 = {showStagesList}
                list = {(props.procedures.length > 0 && index >= 0) ? props.procedures[index] : []}
                addNewBtn = {openCreateProcedureForm}
                itemActionBtn = {openProcedureDetail}
            />
            <FifthTable
                id = "procedure-fourth-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                sub_title = {stage}
                sub_title2 = {procedure.title}
                button1 = { showJourneyList }
                button2 = { showStagesList }
                button3 = { showProcedureList }
                data = { procedure }
                desc = { descList }
                list1Title = "Procedure"
                list1 = {procedure.procedure ? procedure.procedure.split("\n\n") : []}
                list2Title = "Responsibility"
                list2 = {procedure.responsibility ? procedure.responsibility.split("\n") : []}
                list3Title = "Documentation"
                list3 = {procedure.documentation ? procedure.documentation.split("\n") : []}
            />
        </div>
    );
};
