import React from "react";
import "../style/pane.css";
import { BusinessDashboard } from "../../business/components/businessDashboard";
import EmailIcon from '../svg/emailIcon';
import ChatIcon from '../svg/chatIcon';
import CreateIcon from '@mui/icons-material/Create';
import PartyPopper from '../svg/partyPopper';
import WorkflowThing from '../svg/workflowThing';

// Function to open the account setting form
const openAccountSettingForm = _ => {
    document.getElementById("account-setting-Form").style.display = "block";
};

/**
 * Component that renders the main pane of the application based on active links and user data.
 * @param {Object} props - The properties passed to the component.
 *   @prop {Array} businesses - An array of businesses.
 *   @prop {string} activeLink - The active link.
 *   @prop {Object} user - The user object containing user information.
 *   @prop {Function} setBusiness - Function to set the current business.
 *   @prop {Function} setBusinesses - Function to set the list of businesses.
 *   @prop {string} activeLink2 - The second active link.
 *   @prop {Function} setActiveLink2 - Function to set the second active link.
 *   @prop {string} activeLink3 - The third active link.
 *   @prop {Function} setActiveLink3 - Function to set the third active link.
 *   @prop {Array} journeys - An array of journeys.
 *   @prop {Function} setJourneys - Function to set the list of journeys.
 *   @prop {Array} procedures - An array of procedures.
 *   @prop {Function} setProcedures - Function to set the list of procedures.
 *   @prop {Array} policies - An array of policies.
 *   @prop {Function} setPolicies - Function to set the list of policies.
 */
export const Pane = (props) => {
    // Function to render an empty pane when no businesses are available
    const emptyPane = (user) => {
        return (
            <div className="mainpane">
                {/* User information header */}
                <div className="nameheader">
                    {/* Display user initials and account setting edit button */}
                    {user && user.username && (
                        <>
                            <div className="initials">{`${user.first_name.charAt(0)}${user.last_name ? user.last_name.charAt(0) : ""}`}</div>
                            <button onClick={openAccountSettingForm} className="editbutton"> <CreateIcon className="icon" /></button>

                            {/* Display user name and email */}
                            <div className="nametitle" style={{ marginLeft: "30px" }}>
                                <h1 >{`${user.first_name} ${user.last_name ? user.last_name : ""}`}</h1>
                                <div className="email" >
                                    <EmailIcon className="icon" />
                                    <span className="email-text">{user.email}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {/* Business overview section */}
                <div className="businesses-overview">
                    <div className="yourbusiness">
                        <div className="businesstitle">
                            {/* Display welcome message with a party popper */}
                            <text style={{ fontSize: "2.2vw" }}>Welcome to Opn.Systems <PartyPopper /></text>
                            <p style={{ fontSize: "0.90vw" }}>Here's some tips to get you started</p>
                        </div>
                        {/* Display "How to use Opn.Systems" and "What are your next steps" buttons */}
                        <div style={{ marginTop: "-2vh", display: "flex", justifyContent: "center", alignItems: "center", alignSelf: "stretch", gap: "1vh" }}>
                            <button className="howToButtons"><ChatIcon /> How to use Opn.Systems</button>
                            <button className="howToButtons"><ChatIcon /> What are your next steps</button>
                        </div>
                    </div>
                    {/* Recent updates section */}
                    <div className="updates">
                        <img className="updateslogo" src="./images/notificationlogo.png" alt="logo" />
                        <div className="updatestitle">
                            <text>Recent Updates</text>
                        </div>
                        <div className="uptext">
                            <text>Want to view the most recent updates </text>
                            <text>to your business?</text>
                        </div>
                        {/* Button to upgrade the plan */}
                        <div>
                            <button className="updatesbutton">Upgrade your plan</button>
                        </div>
                    </div>
                </div>

                {/* Main dashboard people section */}
                <div className="main-dashboard-people">
                    <div className="businesstitle">
                        <text style={{ fontSize: "2.3vw" }}>Process</text>
                    </div>
                    {/* WorkflowThing component to display a workflow */}
                    <div className="work" style={{ padding: "0 10% 0 9%" }}>
                        <WorkflowThing />
                    </div>
                    {/* Placeholder code for displaying team members and invite button */}
                    {/* <div className="teammember" style={{ margin: "0 auto 0 auto" }}>
                        {peopleTemplate("male")}
                        {peopleTemplate("female")}
                        {peopleTemplate("male")}
                        {peopleTemplate("female")}
                    </div>
                    <div className="teammember" style={{ margin: "5vh auto 0 auto" }}>
                        {peopleTemplate("male")}
                        {peopleTemplate("female")}
                        {peopleTemplate("male")}
                        {peopleTemplate("female")}
                    </div>

                    <div className="collaborate" style={{ margin: "2vh 0 2vh 0" }}>
                        <text>Invite your team members to collaborate.</text>
                    </div>

                    <div className="invite-button">
                        <button>+ Invite team members</button>
                    </div> */}
                </div>
            </div>
        );
    };

    // Check if businesses array is empty, if not, render BusinessDashboard or emptyPane
    if (props.businesses.length === 0) {
        return emptyPane(props.user);
    } else {
        switch (props.activeLink) {
            case "business":
                if (props.activeLink2) {
                    // Render BusinessDashboard component if the second active link exists
                    return <BusinessDashboard
                        business={props.business} setBusiness={props.setBusiness}
                        businesses={props.businesses} setBusinesses={props.setBusinesses}
                        activeLink2={props.activeLink2} setActiveLink2={props.setActiveLink2}
                        activeLink3={props.activeLink3} setActiveLink3={props.setActiveLink3}
                        journeys={props.journeys} setJourneys={props.setJourneys}
                        procedures={props.procedures} setProcedures={props.setProcedures}
                        policies={props.policies} setPolicies={props.setPolicies}
                    />;
                } else {
                    // Render emptyPane if the second active link does not exist
                    return emptyPane(props.user);
                }
            default:
                // Render emptyPane for any other active link
                return emptyPane(props.user);
        }
    }
};
