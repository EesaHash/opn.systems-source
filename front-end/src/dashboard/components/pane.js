import React from "react";
import "../style/pane.css";
import { businessDashboard } from "../../business/components/businessDashboard";

export const Pane = (props) => {
    if(props.businesses.length === 0)
        return emptyPane(props.user)
    else
        return filledPane(props.activeLink, props.activeLink2, props.createNewBusinessForm, props.businesses, props.setBusinesses, props.activeLink3, props.setActiveLink3, props.user)
};

const emptyPane = (user) => {
    return(
        <div className="mainpane">
            <div className="nameheader">
                <div className="profilepicture">
                    <img src="./images/blank_profile_picture.png" alt="logo"/> 
                </div>
                <div className="nametitle">
                    <h1>{user.username}</h1>
                    <div className="email">
                        <text>{user.email}</text>
                    </div>
                </div>
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

            <div className="people">
                <div className="businesstitle">
                    <text>People</text>
                </div>

                <div className="teammember">
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                </div>
                <div className="teammember">
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                    {peopleTemplate("male")}
                    {peopleTemplate("female")}
                </div>

                <div className="collaborate">
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
const filledPane = (activeLink, activeLink2, createNewBusinessForm, businesses, setBusinesses, activeLink3, setActiveLink3, user) => {
    switch(activeLink){
        case "business":
            if(activeLink2)
                return businessDashboard(activeLink2, businesses, activeLink3, setActiveLink3);
            else{
                return emptyPane(user);
            }
        default:
            return emptyPane(user);
    }
};