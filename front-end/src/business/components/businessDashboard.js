import React from 'react';
import { AccountTree, Assignment, Badge, DeleteForever, FolderCopy, Group, Home, ModeEdit, ViewHeadline } from "@mui/icons-material";
import "../style/business.css";
import { businessDetails } from './businessDetails';
import { openPopUpForm } from '../../dashboard/page/dashboard_main';
import { businessOverview } from './businessOverview';
import { ClientJourneyDashboard } from '../../client_journey/components/clientJourneyDashboard';
import { ProceduresDashboard } from '../../client_journey/components/ProceduresDashboard';
import { PoliciesDashboard } from '../../client_journey/components/PoliciesDashboard';

export const BusinessDashboard = (props) => {
    const deleteBusiness = _ => {
        try{
            if(!window.confirm("Are you sure to delete this business?"))
                return;
            fetch("/api/business/removeBusiness", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: props.business.id})
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    alert(data.message);
                });
            removeBusiness();
        }catch(error){
            alert(error);
        }
    };
    const removeBusiness = _ => {
        let index = props.activeLink2 - 1;
        // Remove it from businesses
        const list = [...props.businesses];
        list.splice(index, 1);
        props.setBusinesses(list);
        // Change activeLink3 to Overview
        props.setActiveLink3("Overview");
        // Change activeLink2 to previous/next index. If empty, set activeLink2 to 0
        if(list.length <= 0){
            props.setActiveLink2(0);
        }else{
            if(index !== 0)
                props.setActiveLink2(props.activeLink2 - 1);
            // Change business variable to previous/next index
            props.setBusiness(props.businesses[index]);
        }
    };

    return(
        <div className='business-dashboard'>
            {title(props.business, (props.activeLink2 - 1), deleteBusiness)}
            {body(
                props.business, props.activeLink2,
                props.activeLink3, props.setActiveLink3, 
                props.journeys, props.setJourneys, 
                props.procedures, props.setProcedures, 
                props.policies, props.setPolicies
            )}
        </div>
    );
};
const title = (business, businessIndex, deleteBusiness) => {
    const openEditBusinessForm = _ => {
        document.getElementById("editBusinessForm").style.display = "block";
        openPopUpForm();
    };
    return(
        <div className='business-dashboard-title'>
            <div className='business-dashboard-title-content'>
                <div className='business-title'>
                    <img src={`./images/businessIcon/businessIcon${(businessIndex%6)+1}.png`} alt="logo"/>
                    <h1>{business.businessName}</h1>
                    <div className='dropdown-arrow-area'>
                        <div className='dropdown-arrow'>
                            <div className="dropdown-content">
                                <button onClick={openEditBusinessForm}><ModeEdit/>Edit Business Details</button>
                                <button onClick={deleteBusiness} style={{color: "#EB5757"}} ><DeleteForever/>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <h3>{`${business.industry} - ${business.companySize}`}</h3>
            </div>
        </div>
    );
};
const body = (  business, activeLink2, 
                activeLink3, setActiveLink3, 
                journeys, setJourneys, 
                procedures, setProcedures, 
                policies, setPolicies   ) => {
    return(
        <div className='business-dashboard-body'>
            <div className='business-dashboard-body-content'>
                <div className='business-dashboard-navbar'>
                    {navbarItem(<Home/>, "Overview", activeLink3, setActiveLink3)}
                    {navbarItem(<ViewHeadline/>, "Details", activeLink3, setActiveLink3)}
                    {navbarItem(<AccountTree/>, "Client Journey", activeLink3, setActiveLink3)}
                    {navbarItem(<Assignment/>, "Procedures", activeLink3, setActiveLink3)}
                    {navbarItem(<FolderCopy/>, "Policies", activeLink3, setActiveLink3)}
                    {navbarItem(<Group/>, "Team Members", activeLink3, setActiveLink3)}
                    {navbarItem(<Badge/>, "Department & Roles", activeLink3, setActiveLink3)}
                </div>
                <hr/>
                {
                    activeLink3 === "Overview" ?
                        businessOverview(business) :
                    activeLink3 === "Details" ?
                        businessDetails(business) :
                    activeLink3 === "Client Journey" ?
                        <ClientJourneyDashboard
                            activeLink2 = {activeLink2}
                            journeys = {journeys} setJourneys = {setJourneys}
                        /> :
                    activeLink3 === "Procedures" ?
                        <ProceduresDashboard
                            activeLink2 = {activeLink2}
                            journeys = {journeys}
                            procedures = {procedures} setProcedures = {setProcedures}
                        /> :
                    activeLink3 === "Policies" ?
                        <PoliciesDashboard
                            activeLink2 = {activeLink2}
                            journeys = {journeys}
                            policies = {policies} setPolicies = {setPolicies}
                        /> :
                    activeLink3 === "Team Members" ?
                        null :
                    activeLink3 === "Department & Roles" &&
                        null
                }
            </div>
        </div>
    );
};

const navbarItem = (icon, title, activeLink3, setActiveLink3) => {
    return(
        <li>
            <div className={`business-dashboard-navbar-item ${activeLink3 === title ? 'active' : ''}`} onClick={() => setActiveLink3(title)}>
                <div className='business-dashboard-navbar-item-content'>
                    <div className='icon'>{icon}</div>
                    <div className='title'>{title}</div>
                </div>
            </div>
        </li>
    );
};