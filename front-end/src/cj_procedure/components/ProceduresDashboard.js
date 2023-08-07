import React, { useEffect, useState } from 'react';
import "../style/procedure.css";
import { FolderList } from '../../table/components/Folder/FolderList';
import { openAccessLimitForm } from '../../dashboard/page/dashboard_main';
import { ListTable4 } from '../../table/components/List/ListTable4';
import { FolderList2 } from '../../table/components/Folder/FolderList2';
import { ListTable3 } from '../../table/components/List/ListTable3';
import { stages } from '../../client_journey/components/originalStages';
import { UpdateConfirmation } from '../../public_components/UpdateConfirmation';

export const ProceduresDashboard = (props) => {
    const [index, setIndex] = useState(-1);
    const [journey, setJourney] = useState({});
    const [procedure, setProcedure] = useState({});
    const [procedureIdx, setProcedureIdx] = useState(-1);
    const [procedures, setProcedures] = useState([]);
    const [stage, setStage] = useState("");
    const [updateConfirmation, setUpdateConfirmation] = useState(-1);
    const [deleteConfirmation, setDeleteConfirmation] = useState(-1);
    const stages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];
    
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

    // Create New Journey (Folder from First Page)
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
    const openProcedureDetail = (param, index) => {
        const thirdTable = document.getElementById("procedure-third-table");
        const fourthTable = document.getElementById("procedure-fourth-table");
        if(thirdTable && fourthTable) {
            thirdTable.style.display = "none";
            setProcedure(param);
            setProcedureIdx(index);
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
            setProcedureIdx(-1);
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
            setProcedureIdx(-1);
            thirdTable.style.display = "block";
        }
    };

    // Save Changes
    const openUpdateConfirmation = _ => {
        document.getElementById("procedure-update-confirm").style.display = "block";
    };
    useEffect(() => {
        const saveChanges = _ => {
            try{
                fetch("/api/sop/update_single", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: procedure.id,
                        customSop: procedure
                    })
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(data.status){
                            const temp = [...procedures.filter(obj => obj.id !== procedure.id), procedure];
                            temp.sort((a, b) => a.id - b.id);
                            setProcedures(temp);
                        }
                        setUpdateConfirmation(-1);
                    })
            }catch(error){
                console.log(error);
            }
        };
        const discardChanges = _ => {
            setProcedure(procedures[procedureIdx]);
            setUpdateConfirmation(-1);
        };
        if(updateConfirmation === 1){
            saveChanges();
        }else if(updateConfirmation === 0){
            discardChanges();
        }
        // eslint-disable-next-line
    }, [updateConfirmation]);
    const updateResposibility = (list) => {
        if(list.length <= 0)
            return;
        let temp = {...procedure};
        let result = "[";
        list.forEach((data, index) => {
            result += toString(data);
            if(index < list.length - 1 || data.item.length > 0)
                result += ",";
            data.item.forEach((item, index2) => {
                result += toString(item);
                if(index2 !== data.item.length - 1 || index < list.length - 1)
                    result += ",";
            });
        });
        result += "]";
        console.log(result);
        temp.responsibility = result;
        setProcedure(temp);
    };
    const updateProcedure = (list) => {
        if(list.length <= 0)
            return;
        let temp = {...procedure};
        let result = "[";
        list.forEach((data, index) => {
            result += toString(data);
            if(index < list.length - 1 || data.item.length > 0)
                result += ",";
            data.item.forEach((item, index2) => {
                result += toString(item);
                if(index2 !== data.item.length - 1 || index < list.length - 1)
                    result += ",";
            });
        });
        result += "]";
        console.log(result);
        temp.procedure = result;
        setProcedure(temp);
    };
    const updateDocumentation = (list) => {
        if(list.length <= 0)
            return;
        let temp = {...procedure};
        let result = "[";
        list.forEach((data, index) => {
            result += toString(data);
            if(index < list.length - 1 || data.item.length > 0)
                result += ",";
            data.item.forEach((item, index2) => {
                result += toString(item);
                if(index2 !== data.item.length - 1 || index < list.length - 1)
                    result += ",";
            });
        });
        result += "]";
        console.log(result);
        temp.documentation = result;
        setProcedure(temp);
    };
    const toString = (data) => {
        let hyphen;
        switch(data.pattern){
            case "number":
                hyphen = `${data.hyphen}. `;
                break;
            case "step":
                hyphen = `Step ${data.hyphen}: `;
                break;
            case "letter":
                hyphen = `${data.hyphen}. `;
                break;
            case "dash":
                hyphen = ` ${data.hyphen} `;
                break;
            default:
                hyphen = ``;
                break;
        };
        return (`"${hyphen}${data.data}"`);
    };
    // Generate SOP
    const openGenerateProcedureForm = _ => {
        document.getElementById("generateProcedureForm").style.display = "block";
    };
    const closeGenerateProcedureForm = _ => {
        document.getElementById("generateProcedureForm").style.display = "none";
    };
    const generateProcedure = async _ => {
        const filteredProcedures = procedures.filter(obj => obj.stage !== stages[index]);
        setProcedures(filteredProcedures);
        openGenerateProcedureForm();
        
        // const steps = JSON.parse(journey[stages[index]]).steps;
        // for(let i = 0; i < steps.length; ++i){
        //     // await generateSingleSOP(steps[i]);
        //     console.log(steps[i]);
        // }
        
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
                closeGenerateProcedureForm();
            }); 
    };
    const generateSingleSOP = async (step) => {
        try {
            const response = await fetch("/api/sop/generate_single_for_stage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientJourneyID: journey.id,
                    statement: step
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.status) {
                console.log(data.sop);
            }
        } catch (error) {
            console.log(error);
        }
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
        try{
            setLoading(true);
            fetch("/api/sop/regenerate_sop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sop: procedure,
                    prompt
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    console.log(data);
                    if(data.status){
                        setProcedure({...procedure, ...data.sop});
                        console.log({...procedure, ...data.sop});
                        setLoading(false);
                    }
                });
        }catch(error){
            console.log(error);
        }
    };

    // Regenerate SOP per Item
    const automaticallyRegenerateForItem = (setLoading) => {
        regenerateSOPForItem(null, setLoading);
    };
    const regenerateByPromptForItem = (prompt, setLoading) => {
        if(prompt){
            regenerateSOPForItem(prompt, setLoading);
        }
    };
    const regenerateSOPForItem = (prompt, setLoading) => {
        try{

        }catch(error){
            console.log(error);
        }
    };

    // Delete SOP
    const confirmDelete = (data) => {
        setDeleteConfirmation(data.id);
    };
    useEffect(() => {
        const deleteSOP = _ => {
            try{
                fetch("/api/sop/delete_single", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: deleteConfirmation
                    })
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(data.status){
                            setProcedures([...procedures.filter(obj => obj.id !== deleteConfirmation)]);
                        }
                        setDeleteConfirmation(-1);
                    })
            }catch(error){
                console.log(error);
            }
        };
        if(deleteConfirmation !== -1)
            deleteSOP();
        // eslint-disable-next-line
    }, [deleteConfirmation]);

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
                setDeleteConfirmation = {confirmDelete}
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
                setData = {setProcedure}

                list1Title = "Responsibility"
                list1 = {procedure.responsibility ? JSON.parse(procedure.responsibility) : []}
                updateList1 = {updateResposibility}

                list2Title = "Procedure"
                list2 = {procedure.procedure ? JSON.parse(procedure.procedure) : []}
                updateList2 = {updateProcedure}

                list3Title = "Documentation"
                list3 = {procedure.documentation ? JSON.parse(procedure.documentation) : []}
                updateList3 = {updateDocumentation}

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
