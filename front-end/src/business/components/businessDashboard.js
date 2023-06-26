import React from 'react';
import { AccountTree, Assignment, Badge, FolderCopy, Group, Home, ViewHeadline } from "@mui/icons-material";
import "../style/business.css";
import { businessDetails } from './businessDetails';

export const businessDashboard = (activeLink2, businesses, activeLink3, setActiveLink3) => {
    const businessIndex = getSelectedBusinessIndex(activeLink2, businesses);
    const business = businesses[businessIndex];
    return(
        <div className='business-dashboard'>
            {title(business, businessIndex)}
            {body(business, activeLink3, setActiveLink3)}
        </div>
    );
};
const title = (business, businessIndex) => {
    return(
        <div className='business-dashboard-title'>
            <div className='business-dashboard-title-content'>
                <div className='business-title'>
                    <img src={`./images/businessIcon/businessIcon${(businessIndex%6)+1}.png`} alt="logo"/>
                    <h1>{business.businessName}</h1>
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
                        null :
                    activeLink3 === "Details" ?
                        businessDetails(business) :
                    null
                }
            </div>
        </div>
    );
};
const getSelectedBusinessIndex = (activeLink2, businesses) => {
    let result;
    businesses.every((item, index) => {
        if(item.id === activeLink2){
            result = index;
            return false;
        }
        return true;
    });
    return result;
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