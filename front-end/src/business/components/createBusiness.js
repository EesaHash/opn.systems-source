import React, { useState } from 'react';
import "../style/business.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { getBusinessTypeList } from '../../App';

export const CreateBusiness = (props) => {
    const [teamList, setTeamList] = useState([]);
    const [businessOverviewInput, setBusinessOverviewInput] = useState({
        name: "",
        businessType: ""
    });

    const handleKeypress = e => {
        if(e.key === "Enter"){
            nextAction();
        }
    };
    // Next Action from Step 1 to Step 2
    const nextAction = _ => {
        try{
            document.getElementById("create-business-step1").style.display = "none";
            document.getElementById("create-business-step2").style.display = "block";
        }catch(error){
            alert(error);
        }
    };
    // Back Action from Step 2 to Step 1
    const backAction = _ => {
        document.getElementById("create-business-step1").style.display = "block";
        document.getElementById("create-business-step2").style.display = "none";
    };
    const handleKeypress2 = e => {
        if(e.key === "Enter"){
            addTeamMember();
        }
    };
    const addTeamMember = _ => {
        
    };
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
        document.getElementById("create-business-step1").style.display = "block";
        document.getElementById("create-business-step2").style.display = "none";
        document.getElementById("businessName").value = "";
        document.getElementById("createAccountForm").style.display = "none";
        closePopUpForm();
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
                <div className="pop-up-input">
                    <label>Nature of Business</label>
                    {businessTypeListDrowdown(businessOverviewInput, setBusinessOverviewInput)}
                </div>
                <div className="pop-up-input">
                    <label>Industry</label>
                    <input type="text" id="businessName" onKeyPress={handleKeypress} />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeCreateBusinessForm}>Cancel</button>
                    <button className='next-button' onClick={nextAction} >Next</button>
                </div>
            </div>
        );
    };
    const step2 = _ => {
        return(
            <div id="create-business-step2" className="content-form" style={{display: "none"}}>
                <h2>Create Business</h2>
                <hr/>
                <div className='title'>
                    <button type="button" onClick={backAction} >
                        <span aria-hidden="true">{"<"}</span>
                    </button>
                    <h3>Step 2 of 2</h3>
                </div>
                <h1>Team Members</h1>
                <div className="pop-up-input">
                    <div className="team-member-input">
                        <input 
                            type="text" 
                            id ="team-member-email" 
                            placeholder="Add team members' email or username"
                            className="email-input"
                            onKeyPress={handleKeypress2} 
                        />
                        <input 
                            type="text" 
                            id ="team-member-role" 
                            placeholder="Role" 
                            style={{marginLeft: "20px", width: "20%"}}
                            onKeyPress={handleKeypress2} 
                        />
                        <button>Add</button>
                    </div>
                </div>
                <div id="team-list" className="team-list" style={{display: "none"}}>
                    {teamList.map((data, index) => {
                        <div key={index}>
                            
                        </div>                        
                    })}
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeCreateBusinessForm}>Cancel</button>
                    <button onClick={createNewBusiness} >Create</button>
                </div>
            </div>
        );
    };
    return(
        <section id="createAccountForm" className="form-popup center form-container create-account">
            {step1()}
            {step2()}
        </section>
    );
};

const businessTypeListDrowdown = (businessOverviewInput, setBusinessOverviewInput) => {
    const getBusinesssType = _ => {
        let newType = [];
        getBusinessTypeList().forEach(type => {
            newType.push(
                <DropdownItem
                    key = {type}
                    onClick = {_=> {
                        let newSel = {
                            ...businessOverviewInput,
                            businessType: type
                        };
                        setBusinessOverviewInput(newSel);
                    }}
                >
                    {type}
                </DropdownItem>
            );
        });
        return newType;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{businessOverviewInput.businessType}</DropdownToggle>
            <DropdownMenu>{getBusinesssType()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};