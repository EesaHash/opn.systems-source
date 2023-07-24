import React, { useEffect, useState } from 'react';
import "../style/procedure.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm } from '../../dashboard/page/dashboard_main';
import { FifthTableDescAsList, FifthTableDescItem, ListTable4 } from '../../table/components/List/ListTable4';
import { FormatAlignLeft } from '@mui/icons-material';
import { FolderList2 } from '../../table/components/Folder/FolderList2';
import { ListTable3 } from '../../table/components/List/ListTable3';
import { stages } from '../../client_journey/components/originalStages';
import { UpdateConfirmation } from '../../public_components/UpdateConfirmation';

export const ProceduresDashboard = (props) => {
    const [index, setIndex] = useState(-1);
    const [journey, setJourney] = useState({});
    const [procedure, setProcedure] = useState({});
    const [procedures, setProcedures] = useState([]);
    const [stage, setStage] = useState("");
    const [updateConfirmation, setUpdateConfirmation] = useState(-1);
    
    useEffect(() => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(mainTable && secondaryTable && thirdTable && fourthTable){
            mainTable.style.display = "block";
            setJourney({});
            setProcedures([]);
            secondaryTable.style.display = "none";
            thirdTable.style.display = "none";
            fourthTable.style.display = "none";
        }
        // eslint-disable-next-line
    }, [props.activeLink2]);

    useEffect(() => {
        const saveChanges = _ => {
            try{
                fetch("/api/sop/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(data.status){
                            props.setProcedure([...props.procedures.filter(obj => obj.id !== procedure.id), procedure]);
                        }
                        setUpdateConfirmation(-1);
                    })
            }catch(error){
                console.log(error);
            }
        };
        const discardChanges = _ => {
            setUpdateConfirmation(-1);
        };
        if(updateConfirmation === 1)
            saveChanges();
        else
            discardChanges();
        // eslint-disable-next-line
    }, [updateConfirmation])

    useEffect(() => {
        const getSOPs = async _ => {
            const res = await fetch("/api/sop/getall", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientJourneyID: journey.id
                })
            });
            const data = await res.json();
            console.log(data);
            if(data.status){
                setProcedures(data.sops);
            }
        };
        setProcedures([]);
        if(journey.id){
            getSOPs();
        }
    }, [journey]);

    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
    };

    // Going to Tab 2
    const openStagesList = (param) => {
        const mainTable = document.getElementById("procedure-main-table");
        const secondaryTable = document.getElementById("procedure-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            secondaryTable.style.display = "block";
        }
    };

    // Going to Tab 3
    const openProcedureList = (param, index) => {
        const secondTable = document.getElementById("procedure-secondary-table");
        const thirdTable = document.getElementById("procedure-third-table");
        if(secondTable && thirdTable) {
            secondTable.style.display = "none";
            setStage(param);
            setIndex(index);
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
            setIndex(-1);
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
    
    // Generate Procedure
    const generateProcedure = _ => {
        const filteredProcedures = procedures.filter(obj => obj.stage !== stages[index]);
        setProcedures(filteredProcedures);
        openGenerateProcedureForm();
        
        fetch("/api/sop/generate_for_stage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientJourneyID: journey.id,
                stage: index
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                console.log(data);
                if(data.status){
                    setProcedures(data.sops);
                }
                closeGenerateProduceForm();
            }); 
    };
    const openGenerateProcedureForm = _ => {
        document.getElementById("generateProcedureForm").style.display = "block";
    };
    const closeGenerateProduceForm = _ => {
        document.getElementById("generateProcedureForm").style.display = "none";
    };

    const openUpdateConfirmation = _ => {
        document.getElementById("procedure-update-confirm").style.display = "block";
    };
    
    // Regenerate SOP
    const automaticallyRegenerate = (setLoading) => {
        regenerateSOP(null, setLoading);
    };
    const regenerateByPrompt = (prompt, setLoading) => {
        if(prompt){
            regenerateSOP(prompt, setLoading);
        }
    };
    const regenerateSOP = (prompt, setLoading) => {

    };

    const automaticallyRegenerateForItem = (setLoading) => {
        regenerateSOPForItem(null, setLoading);
    };
    const regenerateByPromptForItem = (prompt, setLoading) => {
        if(prompt){
            regenerateSOPForItem(prompt, setLoading);
        }
    };
    const regenerateSOPForItem = (prompt, setLoading) => {

    };
    
    const descList = [
        FifthTableDescItem(<FormatAlignLeft/>, "Objective", procedure.purpose),
        FifthTableDescAsList(<FormatAlignLeft/>, "Definitions", procedure.definitions)
    ];

    return(
        <div className='procedure'>
            <UpdateConfirmation
                id = "procedure-update-confirm"
                documentName = {procedure.title}
                setConfirmation = {setUpdateConfirmation}
            />
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
                list2 = {procedures}
                stages = {stages}
                button1 = {showJourneyList}
                itemActionBtn = {openProcedureList}
            />
            <ListTable3
                id = "procedure-third-table"
                type = "Procedures"
                title = {`${journey.title}'s Procedures`}
                sub_title = {stage}
                button1 = {showJourneyList}
                button2 = {showStagesList}
                list = {procedures.filter(obj => obj.stage === stages[index])}
                addNewBtn = {generateProcedure}
                itemActionBtn = {openProcedureDetail}
            />
            <ListTable4
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
                list1Title = "Responsibility"
                list1 = {procedure.responsibility ? JSON.parse(procedure.responsibility) : []}
                list2Title = "Procedure"
                list2 = {procedure.procedure ? JSON.parse(procedure.procedure) : []}
                list3Title = "Documentation"
                list3 = {procedure.documentation ? JSON.parse(procedure.documentation) : []}
                saveBtn = {openUpdateConfirmation}
                automaticallyRegenerate = {automaticallyRegenerate}
                regenerateByPrompt = {regenerateByPrompt}
                automaticallyRegenerateForItem = {automaticallyRegenerateForItem}
                regenerateByPromptForItem = {regenerateByPromptForItem}
                loadingTitle = {"AI is regenreating the procedure for"}
            />
        </div>
    );
};
