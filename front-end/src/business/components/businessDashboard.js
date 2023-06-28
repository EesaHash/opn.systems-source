import React from 'react';
import { AccountTree, Assignment, Badge, DeleteForever, FolderCopy, Group, Home, ModeEdit, ViewHeadline } from "@mui/icons-material";
import "../style/business.css";
import { businessDetails } from './businessDetails';
import { openPopUpForm } from '../../dashboard/page/dashboard_main';
import { businessOverview } from './businessOverview';

export const businessDashboard = (activeLink2, businesses, activeLink3, setActiveLink3) => {
    const business = businesses[activeLink2 - 1];
    return(
        <div className='business-dashboard'>
            {title(business, activeLink2 - 1)}
            {body(business, activeLink3, setActiveLink3)}
        </div>
    );
};
const title = (business, businessIndex) => {
    const openEditBusinessForm = _ => {
        document.getElementById("editBusinessForm").style.display = "block";
        openPopUpForm();
    };
    const deleteBusiness = _ => {
        try{
            if(!window.confirm("Are you sure to delete this business?"))
                return;
            fetch("/api/business/removeBusiness", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: business.id})
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    
                });
        }catch(error){
            alert(error);
        }
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
const body = (business, activeLink3, setActiveLink3) => {
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
                        null :
                    activeLink3 === "Procedures" ?
                        null :
                    activeLink3 === "Policies" ?
                        null :
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