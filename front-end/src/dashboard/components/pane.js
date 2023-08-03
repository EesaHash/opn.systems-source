import React from "react";
import "../style/pane.css";
import { BusinessDashboard } from "../../business/components/businessDashboard";
import EmailIcon from '../svg/emailIcon';
import ChatIcon from '../svg/chatIcon';
import BusinessIcon2 from '../svg/businessIcon2';
import CreateIcon from '@mui/icons-material/Create';
import PartyPopper from '../svg/partyPopper';
import WorkflowThing from '../svg/workflowThing'

const openAccountSettingForm = _ => {
    document.getElementById("account-setting-Form").style.display = "block";
  }
export const Pane = (props) => {
    if(props.businesses.length === 0)
        return emptyPane(props.user)
    else{
        switch(props.activeLink){
            case "business":
                if(props.activeLink2){
                    return <BusinessDashboard
                                business = {props.business}   setBusiness = {props.setBusiness}
                                businesses = {props.businesses} setBusinesses = {props.setBusinesses}
                                activeLink2 = {props.activeLink2}   setActiveLink2 = {props.setActiveLink2}
                                activeLink3 = {props.activeLink3}   setActiveLink3 = {props.setActiveLink3}
                                journeys = {props.journeys} setJourneys = {props.setJourneys}
                                procedures = {props.procedures} setProcedures = {props.setProcedures}
                                policies = {props.policies} setPolicies = {props.setPolicies}
                            />
                }else{
                    return emptyPane(props.user);
                }
            default:
                return emptyPane(props.user);
        }
    }
};

const emptyPane = (user) => {
    return(
        <div className="mainpane">
            <div className="nameheader">
                {user && user.username && (
                    <>
                    <div className="initials">{`${user.first_name.charAt(0)}${user.last_name ? user.last_name.charAt(0) : ""}`} </div>                
                    <button onClick={openAccountSettingForm} className="editbutton"> <CreateIcon className="icon"/></button>
                    
                    <div className="nametitle" style={{marginLeft:"30px"}}>
                        <h1 >{`${user.first_name} ${user.last_name ? user.last_name : ""}`}</h1>
                        <div className="email" >
                        <EmailIcon className="icon"/>
                        <span className="email-text">{user.email}</span>
                        </div>
                    </div>
                    </>
                )}
                </div>
                <div className="businesses-overview">
                <div className="yourbusiness">
                    <div className="businesstitle">
                        <text style={{fontSize:"2.2vw"}}>Welcome to Opn.Systems <PartyPopper/></text>
                        <p style={{fontSize:"0.90vw"}}>Here's some tips to get you started</p>
                    </div>
                        <div style={{marginTop: "-2vh", display:"flex", justifyContent:"center", alignItems:"center",alignSelf: "stretch",  gap:"1vh"}}>
                        <button className="howToButtons"><ChatIcon/> How to use Opn.Systems</button>
                        <button className="howToButtons"><ChatIcon/> What are your next steps</button>
                        </div>
                    
                       
                        </div>
                    
                <div className="updates">
                    <img className="updateslogo" src="./images/notificationlogo.png" alt="logo"/>
                    <div className="updatestitle">
                        <text>Recent Updates</text>
                    </div>
                    <div className="uptext">
                    <text>Want to view the most recent updates </text>
                    <text>to your business?</text>
                    </div>
                    <div>
                        <button className="updatesbutton">Upgrade your plan</button>
                    </div>
                </div>
            </div>

            <div className="main-dashboard-people">
                <div className="businesstitle">
                    <text style={{fontSize:"2.3vw"}}>Process</text>
                </div>
                <div className="work" style={{ padding: "0 10% 0 9%" }}>
                <WorkflowThing/>
                </div>
                {/* <div className="teammember" style={{margin:"0 auto 0 auto"}}>
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                </div>
                <div className="teammember"style={{margin:"5vh auto 0 auto"}}>
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                </div>

                <div className="collaborate" style={{margin:"2vh 0 2vh 0"}}>
                <text>Invite your team members to collaborate.</text>
                </div>

                <div className="invite-button">
                    <button >+ Invite team members</button>
                </div> */}

            </div>
        </div>
    );
};