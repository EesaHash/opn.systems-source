import React from 'react';
//import "../style/business.css";
import "../style/businessOverview.css"
import ChatIcon from '../svg/chatIcon';
import PeopleIcon from '../svg/peopleIcon';


export const businessOverview = (business) => {
    return(
        <div className="businesses-overview">
        <div className="yourbusiness">
            <div className="businesstitle">
                <text>Welcome to Opn.Systems </text>
                <img className="party" src="./images/partypopper.png" alt="party"/>
                <p style={{fontSize:"14px"}}>Here's some tips to get you started</p>
                <div style={{justifyContent:"center", alignItems:"center", display:"inline-flex", gap:"8px"}}>
                <button className="howToButtons"><ChatIcon/> How to edit your files</button>
                <button className="howToButtons"><ChatIcon/> How to connect other apps</button>
                
                </div>
            
                <div className="container">
                    <div className="message-container">
                        <div className="message">
                        <div className="text"><PeopleIcon/> You’ve reached your business limit (1/1)</div>
                        </div>
                    </div>
                    <div className="upgrade-container">
                        <div className="upgrade-text">
                        When you upgrade to Premium, you can create unlimited business, roles, and invite your team members.
                        </div>
                    </div>
                    </div>
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
    );
};