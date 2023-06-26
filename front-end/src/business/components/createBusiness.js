import React, { useState } from 'react';
import "../style/business.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { getBusinessTypeList, getCompanySizeList } from '../../App';

export const CreateBusiness = (props) => {
    const [teamList, setTeamList] = useState([]);
    const [businessOverviewInput, setBusinessOverviewInput] = useState({
        businessName: "",
        businessType: "",
        industry: "",
        companySize: "",
        businessObjective: "",
        coreServices: "",
        targetMarket: "",
        isProduct: "",
        productOrServiceDescription: "",
        fundingStrategy: "",
        email: props.userID
    });

    const handleKeypress = e => {
        if(e.key === "Enter"){
            nextAction();
        }
    };
    // Next Action from Step 1 to Step 2
    const nextAction = _ => {
        try{
            if(!businessOverviewInput.businessName || !businessOverviewInput.businessType || !businessOverviewInput.industry || !businessOverviewInput.companySize || !businessOverviewInput.businessObjective)
                return alert("Please fill in all fields!");
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
            nextAction2();
        }
    };
    // Next Action from Step 2 to Step 3
    const nextAction2 = _ => {
        try{
            if(!businessOverviewInput.coreServices || !businessOverviewInput.targetMarket || !businessOverviewInput.isProduct || !businessOverviewInput.productOrServiceDescription || !businessOverviewInput.fundingStrategy)
                return alert("Please fill in all fields!");
            document.getElementById("create-business-step2").style.display = "none";
            document.getElementById("create-business-step3").style.display = "block";
        }catch(error){
            alert(error);
        }
    };
    // Back Action from Step 3 to Step 2
    const backAction2 = _ => {
        document.getElementById("create-business-step2").style.display = "block";
        document.getElementById("create-business-step3").style.display = "none";
    };
    const handleKeypress3 = e => {
        if(e.key === "Enter"){
            addTeamMember();
        }
    };
    const addTeamMember = _ => {
        try{
            const email = document.getElementById("team-member-email").value;
            const role = document.getElementById("team-member-role").value;
            if(!email || !role)
                return alert("Please fill in all fields!");
            if(teamMemberExist(email, role) === 1)
                return alert("Team member already exists with the same role!");
            setTeamList([...teamList, { email: email, role: role }]);
            document.getElementById("team-member-email").value = "";
            document.getElementById("team-member-role").value = "";
        }catch(error){
            alert(error);
        }
    };
    // Check if the team member already exists and has the same role as before
    const teamMemberExist = (email, role) => {
        let res = 0;
        teamList.every((item, index) => {
            if(String(item.email).toLowerCase() === String(email).toLowerCase() && String(item.role).toLowerCase() === String(role).toLowerCase()){
                res = 1;
                return false;
            }
            return true;
        });
        return res;
    };
    const removeTeamMember = (index) => {
        const list = [...teamList];
        list.splice(index, 1);
        setTeamList(list);
    };
    const createNewBusiness = _ => {
        try{
            fetch("/api/business/addNewBusiness", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...businessOverviewInput, teamList: teamList})
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        const business = {
                            ...businessOverviewInput,
                            id: data.business.id,
                            teamMember: teamList
                        };
                        props.setBusinesses([...props.businesses, business]);
                    }
                });
            closeCreateBusinessForm();
        }catch(error){
            alert(error);
        }
    };
    const closeCreateBusinessForm = _ => {
        setBusinessOverviewInput({
            businessName: "",
            businessType: "",
            industry: "",
            companySize: "",
            businessObjective: "",
            coreServices: "",
            targetMarket: "",
            isProduct: "",
            productOrServiceDescription: "",
            fundingStrategy: "",
            email: props.userID
        });
        setTeamList([]);
        document.getElementById("create-business-step1").style.display = "block";
        document.getElementById("create-business-step2").style.display = "none";
        document.getElementById("create-business-step3").style.display = "none";
        document.getElementById("createAccountForm").style.display = "none";
        closePopUpForm();
    };
    const step1 = _ => {
        return(
            <div id="create-business-step1" className="content-form">
                <h2>Create Business</h2>
                <hr/>
                <h3>Step 1 of 3</h3>
                <h1>Company Overview</h1>
                <div className="pop-up-input">
                    <label>Business Name</label>
                    <input 
                        type="text" 
                        value={businessOverviewInput.businessName}
                        onKeyPress={handleKeypress} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Nature of Business</label>
                    {businessTypeListDrowdown(businessOverviewInput, setBusinessOverviewInput)}
                </div>
                <div className="pop-up-input">
                    <label>Industry</label>
                    <input 
                        type="text"
                        value={businessOverviewInput.industry}
                        onKeyPress={handleKeypress} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, industry: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Company Size</label>
                    {companySizeDropdown(businessOverviewInput, setBusinessOverviewInput)}
                </div>
                <div className="pop-up-input">
                    <label>Business Objective</label>
                    <textarea 
                        type="text"
                        value={businessOverviewInput.businessObjective}
                        onKeyPress={handleKeypress} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessObjective: event.target.value})}
                    />
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
                    <h3>Step 2 of 3</h3>
                </div>
                <h1>Business Details</h1>
                <div className="pop-up-input">
                    <label>Core Services</label>
                    <textarea 
                        type="text" 
                        value={businessOverviewInput.coreServices}
                        onKeyPress={handleKeypress2} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, coreServices: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Target Market</label>
                    <input 
                        type="text" 
                        value={businessOverviewInput.targetMarket}
                        onKeyPress={handleKeypress2} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, targetMarket: event.target.value})}
                    />
                </div>
                <div id="manufacture-input" className="pop-up-input">
                    <label>Is it a product or service</label>
                    {manufactureDropdown(businessOverviewInput, setBusinessOverviewInput)}
                </div>
                <div className="pop-up-input">
                    <label>Product/Service Description</label>
                    <textarea 
                        type="text" 
                        value={businessOverviewInput.productOrServiceDescription}
                        onKeyPress={handleKeypress2} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, productOrServiceDescription: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Funding Strategy</label>
                    <textarea 
                        type="text" 
                        value={businessOverviewInput.fundingStrategy}
                        onKeyPress={handleKeypress2} 
                        onChange={event => setBusinessOverviewInput({...businessOverviewInput, fundingStrategy: event.target.value})}
                    />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeCreateBusinessForm}>Cancel</button>
                    <button className='next-button' onClick={nextAction2} >Next</button>
                </div>
            </div>
        );
    };
    const step3 = _ => {
        return(
            <div id="create-business-step3" className="content-form" style={{display: "none"}}>
                <h2>Create Business</h2>
                <hr/>
                <div className='title'>
                    <button type="button" onClick={backAction2} >
                        <span aria-hidden="true">{"<"}</span>
                    </button>
                    <h3>Step 3 of 3</h3>
                </div>
                <h1>Team Members</h1>
                <div className="pop-up-input">
                    <div className="team-member-input">
                        <input 
                            type="email" 
                            id ="team-member-email" 
                            placeholder="Add team member's email"
                            className="email-input"
                            onKeyPress={handleKeypress3} 
                        />
                        <input 
                            type="text" 
                            id ="team-member-role" 
                            placeholder="Role" 
                            style={{marginLeft: "20px", width: "20%"}}
                            onKeyPress={handleKeypress3} 
                        />
                        <button onClick={addTeamMember}>Add</button>
                    </div>
                    {teamList.map((data, index) => (
                        teamMemberInputElements(teamList, setTeamList, index, removeTeamMember)
                    ))}
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
            {step3()}
        </section>
    );
};

const businessTypeListDrowdown = (businessOverviewInput, setBusinessOverviewInput) => {
    const getBusinessType = _ => {
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
            <DropdownMenu>{getBusinessType()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};
const companySizeDropdown = (businessOverviewInput, setBusinessOverviewInput) => {
    const getCompanySize = _ => {
        let newRes = [];
        getCompanySizeList().forEach(res => {
            newRes.push(
                <DropdownItem
                    key = {res}
                    onClick = {_=> {
                        let newSel = {
                            ...businessOverviewInput,
                            companySize: res
                        };
                        setBusinessOverviewInput(newSel);
                    }}
                >
                    {res}
                </DropdownItem>
            );
        });
        return newRes;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{businessOverviewInput.companySize}</DropdownToggle>
            <DropdownMenu>{getCompanySize()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};
const manufactureDropdown = (businessOverviewInput, setBusinessOverviewInput) => {
    const list = ["Product", "Service"];
    const getManufacture = _ => {
        let newRes = [];
        list.forEach(res => {
            newRes.push(
                <DropdownItem
                    key = {res}
                    onClick = {_=> {
                        let newSel = {
                            ...businessOverviewInput,
                            isProduct: res
                        };
                        setBusinessOverviewInput(newSel);
                    }}
                >
                    {res}
                </DropdownItem>
            );
        });
        return newRes;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{businessOverviewInput.isProduct}</DropdownToggle>
            <DropdownMenu>{getManufacture()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};
const teamMemberInputElements = (teamList, setTeamList, index, removeTeamMember) => {
    const modifyEmail = (value) => {
        let newList = [...teamList];
        newList[index] = {
            ...newList[index],
            email: value
        };
        setTeamList(newList);
    };
    const modifyRole = (value) => {
        let newList = [...teamList];
        newList[index] = {
            ...newList[index],
            role: value
        };
        setTeamList(newList);
    };
    return(
        <div key = {index} className="team-member-input">
            <input 
                type="email" 
                placeholder = "Add team member's email"
                className = "email-input"
                value = {teamList[index].email}
                onChange={event => modifyEmail(event.target.value)}
            />
            <input 
                type = "text" 
                placeholder = "Role" 
                style = {{marginLeft: "20px", width: "20%"}}
                value = {teamList[index].role}
                onChange={event => modifyRole(event.target.value)}
            />
            <button style={{backgroundColor: "rgba(157, 6, 6, 0.807)"}} onClick={event => removeTeamMember(index)}>Remove</button>
        </div>
    );
};