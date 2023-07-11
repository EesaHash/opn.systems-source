import React from 'react';
//import "../style/business.css";
import "../style/businessOverview.css"



export const businessOverview = (business) => {
    return(
        <div className="businesses-overview">
                <div className="yourbusiness">
                    <div className="businesstitle">
                        <text>Welcome to Opn.Systems </text>
                        <img src='./images/partypopper.png' alt="icon"/>
                        <p style={{fontSize:"16px",fontFamily:"Inter", fontWeight:"lighter"}}>Here's some tips to get started</p>    
                    </div>
                    <button className="editB">How to edit your files</button>
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