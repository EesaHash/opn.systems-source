import React, { useState } from 'react';
import "../style/client_journey.css";
import { loadingPage } from '../../business/components/loadingPage';
import { closePopUpForm } from '../../dashboard/page/dashboard_main';

export const CreateClientJourney = (props) => {
    const [loading, setLoading] = useState(false);
    const generate = _ => {
        const title = document.getElementById("client-journey-title").value;
        if(!title)
            return alert("Please fill in all fields!");
        document.getElementById("create-client-journey-step1").style.display = "none";
        setLoading(true);
        fetch("/api/clientjourney/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: props.business.id,
                title: title
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if(data.status){
                    props.setJourneys([...props.journeys, data.journey]);
                }
                closeForm();
                alert(data.message);
            }); 
    };
    const closeForm = _ => {
        document.getElementById("client-journey-title").value = "";
        document.getElementById("create-client-journey-step1").style.display = "block";
        setLoading(false);
        document.getElementById("createClientJourney").style.display = "none";
        closePopUpForm();
    };;
    const handleKeypress = e => {
        if(e.key === "Enter"){
            generate();
        }
    };
    const step1 = _ => {
        return(
            <div id="create-client-journey-step1" className="content-form">
                <h2>Add Client Journey</h2>
                <hr/>
                <div className='pop-up-input'>
                    <label>Client Journey Title</label>
                    <input 
                        id = "client-journey-title"
                        type='text'
                        onKeyPress={handleKeypress} 
                    />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button className='next-button' onClick={generate} >Generate File</button>
                </div>
            </div>
        );
    };
    return(
        <section id="createClientJourney" className="form-popup center form-container create-form">
            {step1()}
            {loading && loadingPage(document.getElementById("client-journey-title").value)}
        </section>
    );
};