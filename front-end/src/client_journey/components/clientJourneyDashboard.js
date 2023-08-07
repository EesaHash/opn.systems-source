import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { ListTable } from '../../table/components/List/ListTable';
import { openAccessLimitForm } from '../../dashboard/page/dashboard_main';
import { ListTable2 } from '../../table/components/List/ListTable2';
import { stages } from './originalStages';
import { UpdateConfirmation } from '../../public_components/UpdateConfirmation';

// The ClientJourneyDashboard component
export const ClientJourneyDashboard = (props) => {
    // State variables for the component
    const [index, setIndex] = useState(-1);
    const [journey, setJourney] = useState({});
    const [updateConfirmation, setUpdateConfirmation] = useState(-1);
    const [deleteConfirmation, setDeleteConfirmation] = useState(-1);

    // Effect hook to handle the initial display of main and secondary tables.
    useEffect(() => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");

        if (mainTable && secondaryTable) {
            mainTable.style.display = "block";
            setJourney({});
            setIndex(-1);
            secondaryTable.style.display = "none";
        }
    }, [props.activeLink2]);

    // Function to open the Create Journey Form.
    const openCreateJourneyForm = _ => {
        if (props.journeys.length > 0)
            return openAccessLimitForm();
        document.getElementById("createClientJourney").style.display = "block";
    };

    // Function to switch to Tab 2 (Client Journey Details).
    const openClientJourneyDetails = (param, index) => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");

        if (mainTable && secondaryTable) {
            mainTable.style.display = "none";
            setJourney(param);
            setIndex(index);
            secondaryTable.style.display = "block";
        }
    };

    // Function to show the Journey List (Back to Tab 1).
    const showJourneyList = _ => {
        const mainTable = document.getElementById("client-journey-main-table");
        const secondaryTable = document.getElementById("client-journey-secondary-table");

        if (mainTable && secondaryTable) {
            mainTable.style.display = "block";
            setJourney({});
            setIndex(-1);
            secondaryTable.style.display = "none";
        }
    };

    // Function to handle update confirmation and save changes.
    const openUpdateConfirmation = _ => {
        document.getElementById("client-journey-update-confirm").style.display = "block";
    };

    useEffect(() => {
        const saveChanges = _ => {
            try {
                fetch("/api/clientjourney/save_regenerated_stage", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        journey
                    })
                })
                    .then((res) => { return res.json(); })
                    .then((data) => {
                        if (data.status) {
                            props.setJourneys([...props.journeys.filter(obj => obj.id !== journey.id), journey]);
                        }
                        setUpdateConfirmation(-1);
                    });
            } catch (error) {
                console.log(error);
            }
        };
        const discardChanges = _ => {
            setJourney(props.journeys[index]);
            setUpdateConfirmation(-1);
        };
        if (updateConfirmation === 1)
            saveChanges();
        else if (updateConfirmation === 0)
            discardChanges();
        // eslint-disable-next-line
    }, [updateConfirmation]);

    // Function to automatically regenerate the client journey
    const automaticallyRegenerate = (setLoading) => {
        regenerateClientJourney(null, setLoading);
    };

    // Function to regenerate the client journey by providing a prompt
    const regenerateByPrompt = (prompt, setLoading) => {
        if (prompt) {
            regenerateClientJourney(prompt, setLoading);
        }
    };

    // Function to regenerate the client journey
    const regenerateClientJourney = (prompt, setLoading) => {
        try {
            setLoading(true);
            // Sending a request to the server to regenerate the client journey
            fetch("/api/clientjourney/regenerate_client_journey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientJourneyID: journey.id, // The ID of the client journey to regenerate
                    prompt // The optional prompt for regeneration
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    console.log(data);
                    if (data.status) {
                        // Update the client journey with the regenerated data
                        setJourney({ ...journey, ...data.clientJourney });
                        setLoading(false);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    // Regenerate Client Journey for Stage
    const automaticallyRegenerateForStage = (index, setLoading) => {
        regenerateClientJourneyForStage(index, null, setLoading);
    };
    const regenerateByPromptForStage = (index, prompt, setLoading) => {
        if (prompt) {
            regenerateClientJourneyForStage(index, prompt, setLoading);
        }
    };
    // Function to regenerate a specific stage of the client journey
    const regenerateClientJourneyForStage = (index, prompt, setLoading) => {
        try {
            const stage = stages[index]; // Get the stage name based on the index
            setLoading(true);
            // Sending a request to the server to regenerate the specified stage
            fetch("/api/clientjourney/regenerate_stage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cj: journey, // The client journey object to regenerate
                    businessId: journey.businessId, // The business ID associated with the journey
                    stage: stage, // The specific stage to regenerate
                    prompt: prompt // The optional prompt for regeneration
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        const temp = { ...journey };
                        // Update the corresponding stage data in the client journey based on the regenerated output
                        switch (stage) {
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
                        // Update the journey state with the updated stage data
                        setJourney(temp);
                        setLoading(false);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };


    // Function to prompt user for confirmation before deleting a journey
    const confirmDelete = (data) => {
        setDeleteConfirmation(data.productID); // Set the productID of the journey to be deleted
    };

    useEffect(() => {
        // Function to delete the journey when deleteConfirmation is not -1 (i.e., user confirmed deletion)
        const deleteJourney = _ => {
            try {
                // Sending a POST request to the server to delete the specified journey
                fetch("/api/clientjourney/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productID: deleteConfirmation // The productID of the journey to be deleted
                    })
                })
                    .then((res) => { return res.json(); })
                    .then((data) => {
                        if (data.status) {
                            // Update the journeys state by removing the deleted journey from the list
                            props.setJourneys([...props.journeys.filter(obj => obj.productID !== deleteConfirmation)]);
                        }
                        // Reset deleteConfirmation to -1 after the journey is deleted or action is canceled
                        setDeleteConfirmation(-1);
                    })
            } catch (error) {
                console.log(error);
            }
        };

        // Call deleteJourney when deleteConfirmation changes (i.e., user confirms or cancels deletion)
        if (deleteConfirmation !== -1)
            deleteJourney();
        // eslint-disable-next-line
    }, [deleteConfirmation]);


    return (
        <div className='client-journey'>
            {/* UpdateConfirmation component to handle updates */}
            <UpdateConfirmation
                id="client-journey-update-confirm"
                documentName={journey.title}
                setConfirmation={setUpdateConfirmation}
            />
            {/* First ListTable to display the list of client journeys */}
            <ListTable
                id="client-journey-main-table"
                title="Client Journey"
                list={props.journeys}
                addNewBtn={openCreateJourneyForm}
                itemActionBtn={openClientJourneyDetails}
                setDeleteConfirmation={confirmDelete}
            />
            {/* Second ListTable to display the details of a selected client journey */}
            <ListTable2
                id="client-journey-secondary-table"
                type={"Client Journey"}
                title={journey.title}
                description={journey.overview ? JSON.parse(journey.overview).overview : ""}
                dataHeading={journey.stages}
                data={journey}
                button1={showJourneyList}
                saveBtn={openUpdateConfirmation}
                automaticallyRegenerate={automaticallyRegenerate}
                regenerateByPrompt={regenerateByPrompt}
                automaticallyRegenerateForStep={automaticallyRegenerateForStage}
                regenerateByPromptForStep={regenerateByPromptForStage}
                loadingTitle={"AI is regenerating the client journey for"}
            />
        </div>
    );
};
