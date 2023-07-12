import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';
import { openAccessLimitForm, openPopUpForm } from '../../dashboard/page/dashboard_main';
import { SecondaryTable } from '../../table/components/SecondaryTable';

export const ClientJourneyDashboard = (props) => {
    const [journey, setJourney] = useState({});

    useEffect(() => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");
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

    // Going to Tab 2
    const openClientJourneyDetails = (param) => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");
        if(mainTable && secondaryTable){
            mainTable.style.display = "none";
            setJourney(param);
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
            secondaryTable.style.display = "none";
        }
    };
    
    const automaticallyRegenerate = (stage) => {
        regenerateClientJourney(stage, null);
    };
    const regenerateByPrompt = (stage, prompt) => {
        if(prompt){
            regenerateClientJourney(stage, prompt);
        }
    };
    const regenerateClientJourney = (stage, prompt) => {
        try{
            fetch("/api/clientjourney/regenerate_stage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: journey.id,
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
                    }
                });
        }catch(error){
            alert(error);
        }
    };

    return(
        <div className='client-journey'>
            <MainTableHeader 
                id = "client-journey-main-table"
                title = "Client Journey" 
                list = {props.journeys}
                addNewBtn = {openCreateJourneyForm}
                itemActionBtn = {openClientJourneyDetails}
            />
            <SecondaryTable
                id = "client-journey-secondary-table"
                type = {"Client Journey"}
                title = {journey.title}
                description = {journey.overview ? JSON.parse(journey.overview).overview : ""}
                dataHeading = {journey.stages}
                data = {journey}
                button1 = {showJourneyList}
                automaticallyRegenerate = {automaticallyRegenerate}
                regenerateByPrompt = {regenerateByPrompt}
            />
        </div>
    );
};
