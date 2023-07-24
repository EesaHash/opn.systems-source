import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { ListTable } from '../../table/components/List/ListTable';
import { openAccessLimitForm } from '../../dashboard/page/dashboard_main';
import { ListTable2 } from '../../table/components/List/ListTable2';
import { stages } from './originalStages';
import { UpdateConfirmation } from '../../public_components/UpdateConfirmation';

export const ClientJourneyDashboard = (props) => {
    const [index, setIndex] = useState(-1);
    const [journey, setJourney] = useState({});
    const [updateConfirmation, setUpdateConfirmation] = useState(-1);
    const [deleteConfirmation, setDeleteConfirmation] = useState(-1);

    useEffect(() => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            setIndex(-1);
            secondaryTable.style.display = "none";
        }
    }, [props.activeLink2]);

    // Create New Journey
    const openCreateJourneyForm = _ => {
        if(props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
    };

    // Going to Tab 2
    const openClientJourneyDetails = (param, index) => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };

    // Going back to Tab 1
    const showJourneyList = _ => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "block";
            setJourney({});
            setIndex(-1);
            secondaryTable.style.display = "none";
        }
    };

    // Save Changes
    const openUpdateConfirmation = _ => {
        document.getElementById("client-journey-update-confirm").style.display = "block";
    };
    useEffect(() => {
        const saveChanges = _ => {
            try{
                fetch("/api/clientjourney/save_regenerated_stage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        journey
                    })
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(data.status){
                            props.setJourneys([...props.journeys.filter(obj => obj.id !== journey.id), journey]);
                        }
                        setUpdateConfirmation(-1);
                    })
            }catch(error){
                console.log(error);
            }
        };
        const discardChanges = _ => {
            setJourney(props.journeys[index]);
            setUpdateConfirmation(-1);
        };
        if(updateConfirmation === 1)
            saveChanges();
        else if(updateConfirmation === 0)
            discardChanges();
        // eslint-disable-next-line
    }, [updateConfirmation]);

    // Regenerate Client Journey
    const automaticallyRegenerate = (setLoading) => {
        regenerateClientJourney(null, setLoading);
    };
    const regenerateByPrompt = (prompt, setLoading) => {
        if(prompt){
            regenerateClientJourney(prompt, setLoading);
        }
    };
    const regenerateClientJourney = (prompt, setLoading) => {
        try {
            setLoading(true);
            fetch("/api/clientjourney/regenerate_client_journey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientJourneyID: journey.id,
                    prompt
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    console.log(data);
                    if(data.status){
                        setJourney({...journey, ...data.clientJourney});
                        console.log(journey);
                        setLoading(false);
                    }
                });
        } catch (error) {
            alert(error);
        }
    };
    
    // Regenerate Client Journey for Stage
    const automaticallyRegenerateForStage = (index, setLoading) => {
        regenerateClientJourneyForStage(index, null, setLoading);
    };
    const regenerateByPromptForStage = (index, prompt, setLoading) => {
        if(prompt){
            regenerateClientJourneyForStage(index, prompt, setLoading);
        }
    };
    const regenerateClientJourneyForStage = (index, prompt, setLoading) => {
        try{
            const stage = stages[index];
            setLoading(true);
            fetch("/api/clientjourney/regenerate_stage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cj: journey,
                    businessId: journey.businessId,
                    stage: stage,
                    prompt: prompt
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(data.status){
                        const temp = {...journey};
                        switch(stage){
                            case "awareness":
                                temp.awareness = JSON.stringify(data.output);
                                break;
                            case "interest":
                                temp.interest = JSON.stringify(data.output);
                                break;
                            case "evaluation":
                                temp.evaluation = JSON.stringify(data.output);
                                break;
                            case "decision":
                                temp.decision = JSON.stringify(data.output);
                                break;
                            case "purchase":
                                temp.purchase = JSON.stringify(data.output);
                                break;
                            case "implementation":
                                temp.implementation = JSON.stringify(data.output);
                                break;
                            case "postPurchase":
                                temp.postPurchase = JSON.stringify(data.output);
                                break;
                            case "retention":
                                temp.retention = JSON.stringify(data.output);
                                break;
                            default: 
                                console.log("Unexisting column");
                                break;
                        }
                        setJourney(temp);
                        setLoading(false);
                    }
                });
        }catch(error){
            alert(error);
        }
    };

    // Delete Journey
    const confirmDelete = (data) => {
        setDeleteConfirmation(data.productID);
    };
    useEffect(() => {
        const deleteJourney = _ => {
            try{
                fetch("/api/clientjourney/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productID: deleteConfirmation
                    })
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(data.status){
                            props.setJourneys([...props.journeys.filter(obj => obj.productID !== deleteConfirmation)]);
                        }
                        setDeleteConfirmation(-1);
                    })
            }catch(error){
                console.log(error);
            }
        };
        if(deleteConfirmation !== -1)
            deleteJourney();
        // eslint-disable-next-line
    }, [deleteConfirmation]);

    return(
        <div className='client-journey'>
            <UpdateConfirmation
                id = "client-journey-update-confirm"
                documentName = {journey.title}
                setConfirmation = {setUpdateConfirmation}
            />
            <ListTable 
                id = "client-journey-main-table"
                title = "Client Journey" 
                list = {props.journeys}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openClientJourneyDetails}
                setDeleteConfirmation = {confirmDelete}
            />
            <ListTable2
                id = "client-journey-secondary-table"
                type = {"Client Journey"}
                title = {journey.title}
                description = {journey.overview ? JSON.parse(journey.overview).overview : ""}
                dataHeading = {journey.stages}
                data = {journey}
                button1 = {showJourneyList}
                saveBtn = {openUpdateConfirmation}
                automaticallyRegenerate = {automaticallyRegenerate}
                regenerateByPrompt = {regenerateByPrompt}
                automaticallyRegenerateForStep = {automaticallyRegenerateForStage}
                regenerateByPromptForStep = {regenerateByPromptForStage}
                loadingTitle = {"AI is regenerating the client journey for"}
            />
        </div>
    );
};
