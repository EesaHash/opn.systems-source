import React, { useEffect, useState } from 'react';
import ClientjourneyIcon from '../svg/clientjourneyIcon';
import OverviewIcon from '../svg/overviewIcon';
import ProceduresIcon from '../svg/proceduresIcon';
import PoliciesIcon from '../svg/policiesIcon';
import TeammembersIcon from '../svg/teammembersIcon';
import DetailsIcon from '../svg/detailsIcon';
import DepartmentIcon from '../svg/departmentIcon';
import EditBusinessIcon from '../svg/editBusinessIcon';
import DeleteBusinessIcon from '../svg/deleteBusinessIcon';
import "../style/business.css";
import { businessDetails } from './businessDetails';
import { BusinessOverview } from './businessOverview';
import { ClientJourneyDashboard } from '../../client_journey/components/clientJourneyDashboard';
import { ProceduresDashboard } from '../../cj_procedure/components/ProceduresDashboard';
import { PoliciesDashboard } from '../../cj_policies/components/PoliciesDashboard';
import { TeamMembers } from '../../client_journey/components/TeamMembers';
import { DepartmentRolesDashboard } from '../../cj_department_roles/components/DepartmentRolesDashboard';
import { EditBusinessDetail } from './editBusinessDetail';
import { ArrowForwardIos, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { DeleteBusinesConfirmation } from './DeleteBusinessConfirmation';

export const BusinessDashboard = (props) => {
    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState(-1);
    useEffect(() => {
        const deleteBusiness = _ => {
            try {
                fetch("/api/business/removeBusiness", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: deleteConfirmation})
                })
                    .then((res) => {return res.json(); })
                    .then((data) => {
                        if(!data.status){
                            alert(data.message);
                        }
                    });
                removeBusiness();
            } catch (error) {
                console.log(error);
            }
        };
        if(deleteConfirmation !== -1)
            deleteBusiness();
        // eslint-disable-next-line
    }, [deleteConfirmation]);
    const openDeleteConfirmation = _ => {
        try{
            document.getElementById("delete-business-confirm").style.display = "block";
            setDropdownStatus(false);
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
            <EditBusinessDetail
                businesses = {props.businesses} setBusinesses = {props.setBusinesses} 
                index = {props.activeLink2 - 1}
                business = {props.business} setBusiness = {props.setBusiness}
            />
            <DeleteBusinesConfirmation
                id = "delete-business-confirm"
                documentName = {props.business.businessName}
                imgSrc = {`./images/businessIcon/businessIcon${((props.activeLink2 - 1)%6)+1}.png`}
                setConfirmation = {setDeleteConfirmation}
                data = {props.business.id}
            />
            {title(
                props.business, 
                (props.activeLink2 - 1), 
                openDeleteConfirmation, 
                dropdownStatus, setDropdownStatus,
                hoveredMenu, setHoveredMenu
            )}
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
const title = (business, businessIndex, openDeleteConfirmation, dropdownStatus, setDropdownStatus, hoveredMenu, setHoveredMenu) => {
    const editBusinessDetailDropdown = _ => {
        setDropdownStatus(!dropdownStatus);
    };
    const openEditBusinessForm = _ => {
        document.getElementById("editBusinessForm").style.display = "block";
        setDropdownStatus(false);
    };
    return(
        <div id="business-dashboard-title" className='business-dashboard-title'>
            <div className='business-dashboard-title-content'>
                <div className='business-title'>
                    <img src={`./images/businessIcon/businessIcon${(businessIndex%6)+1}.png`} alt="logo"/>
                    <h1>{business.businessName}</h1>
                    <button className="business-dropdown-menu" onClick={editBusinessDetailDropdown} >{dropdownStatus ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}</button>
                    { dropdownStatus &&
                        <div className="dropdown-content">
                            <button onClick={openEditBusinessForm} onMouseEnter={() => setHoveredMenu("edit-business-details")} onMouseLeave={() => setHoveredMenu("")} ><EditBusinessIcon/>  Edit Business Details{hoveredMenu === "edit-business-details" && <ArrowForwardIos className="hover-arrow"/> } </button>
                            <button onClick={openDeleteConfirmation} style={{color: "#EB5757"}} onMouseEnter={() => setHoveredMenu("delete-business")} onMouseLeave={() => setHoveredMenu("")}><DeleteBusinessIcon style={{color: "#EB5757"}}/>  Delete{hoveredMenu === "delete-business" && <ArrowForwardIos className="hover-arrow"/> }</button>
                        </div>
                    }
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
        <div id="business-dashboard-body" className='business-dashboard-body'>
            <div className='business-dashboard-body-content'>
                <div className='business-dashboard-navbar'>
                    {navbarItem(<OverviewIcon/>, "Overview", activeLink3, setActiveLink3)}
                    {navbarItem(<DetailsIcon/>, "Details", activeLink3, setActiveLink3)}
                    {navbarItem(<ClientjourneyIcon/>, "Client Journey", activeLink3, setActiveLink3)}
                    {navbarItem(<ProceduresIcon/>, "Procedures", activeLink3, setActiveLink3)}
                    {navbarItem(<PoliciesIcon/>, "Policies", activeLink3, setActiveLink3)}
                    {navbarItem(<TeammembersIcon/>, "Team Members", activeLink3, setActiveLink3)}
                    {navbarItem(<DepartmentIcon/>, "Department & Roles", activeLink3, setActiveLink3)}
                </div>
                <hr/>
                {
                    activeLink3 === "Overview" ?
                        <BusinessOverview
                            business = {business}
                        />
                        :
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
                        <TeamMembers
                                business = {business}
                                activeLink2 = {activeLink2}
                        /> :
                    activeLink3 === "Department & Roles" &&
                        <DepartmentRolesDashboard/>
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