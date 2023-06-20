import React from 'react';
import "../style/business.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';

export const CreateBusiness = (props) => {

    const createNewBusiness = _ => {
        const name = document.getElementById("businessName").value;
        const business = {
            title: name,
            link: name
        };
        props.setBusinesses([...props.businesses, business]);
        closeCreateBusinessForm();
    };
    const closeCreateBusinessForm = _ => {
        document.getElementById("businessName").value = "";
        document.getElementById("createAccountForm").style.display = "none";
        closePopUpForm();
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            createNewBusiness();
        }
    };
    const step1 = _ => {
        return(
            <div id="create-business-step1" className="content-form">
                <h2>Create Business</h2>
                <hr/>
                <h3>Step 1 of 2</h3>
                <h1>Company Overview</h1>
                <div className="pop-up-input">
                    <label>Business Name</label>
                    <input type="text" id="businessName" onKeyPress={handleKeypress} />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeCreateBusinessForm}>Cancel</button>
                    <button className='submit-button' onClick={createNewBusiness} >Next</button>
                </div>
            </div>
        );
    };
    const step2 = _ => {
        return(
            <div id="create-business-step2" className="content-form" style={{display: "none"}}>
                <h2>Create Business</h2>
                <hr/>
                <h3>Step 2 of 2</h3>
                <h1>Team Members</h1>
            </div>
        );
    }
    return(
        <section id="createAccountForm" className="form-popup center form-container create-account">
            {step1()}
            {step2()}
        </section>
    );
};