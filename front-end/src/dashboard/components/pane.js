import React from "react";
import "../style/pane.css";
import { BusinessDashboard } from "../../business/components/businessDashboard";
//import { FormatAlignJustify } from "@mui/icons-material";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
export const Pane = (props) => {
    if(props.businesses.length === 0)
        return emptyPane(props.user)
    else{
        // return filledPane(
        //     props.activeLink, 
        //     props.activeLink2, props.setActiveLink2, 
        //     props.createNewBusinessForm, 
        //     props.businesses, props.setBusinesses, 
        //     props.business, props.setBusiness,
        //     props.activeLink3, props.setActiveLink3, 
        //     props.user)
        switch(props.activeLink){
            case "business":
                if(props.activeLink2){
                    return BusinessDashboard(props.business, props.setBusiness, props.businesses, props.setBusinesses, props.activeLink2, props.setActiveLink2, props.activeLink3, props.setActiveLink3);
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
            <div className="nameheader" style={{display: "flex", alignItems: 'center'}}>
                {user && user.username && (
                    <>
                    <div className="initials">{user.username.charAt(0)}</div>
                    <div className="nametitle" style={{marginLeft:"30px"}}>
                        <h1 >{user.username}</h1>
                        <div className="email">
                        <MailOutlineIcon className="icon"/>
                        <span className="email-text">{user.email}</span>
                        </div>
                    </div>
                    </>
                )}
                </div>
                 <div className="businesses-overview">
                <div className="yourbusiness">
                    <div className="businesstitle">
                        <text>Your Businesses</text>
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

            <div className="main-dashboard-people" style={{height:"auto"}}>
                <div className="businesstitle">
                    <text>People</text>
                </div>

                <div className="teammember" style={{margin:"0 auto 0 auto"}}>
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
                </div>

            </div>
        </div>
    );
};
const peopleTemplate = (gender) => {
    return(
        <div className="team-member-icon">
            <img src={`./images/${gender}_profile.png`} alt="femicon"/>
            <div className="emptyname"></div>
        </div>
    );
};
const filledPane = (activeLink, activeLink2, setActiveLink2, createNewBusinessForm, businesses, setBusinesses, business, setBusiness, activeLink3, setActiveLink3, user) => {
    switch(activeLink){
        case "business":
            if(activeLink2){
                return BusinessDashboard(business, setBusiness, businesses, setBusinesses, activeLink2, setActiveLink2, activeLink3, setActiveLink3);
            }else{
                return emptyPane(user);
            }
        default:
            return emptyPane(user);
    }
};