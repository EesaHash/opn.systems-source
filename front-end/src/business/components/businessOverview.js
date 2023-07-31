import React from 'react';
//import "../style/business.css";
import "../style/businessOverview.css"
import ChatIcon from '../svg/chatIcon';
import PeopleIcon from '../svg/peopleIcon';
import WavingWoman from '../svg/wavingWoman';
import PhoneIcon from '../svg/phoneIcon';
import EmailIcon from '../svg/emailIcon';
import PartyPopper from '../svg/partyPopper';



export const businessOverview = (business) => {
    const { name, email, phoneNumber } = business;

    return(
        <div className="businesses-overview">
        <div className="yourbusiness">
            <div className="businesstitle">
                <text style={{fontSize:"2.2vw"}}>Welcome to Opn.Systems <PartyPopper/></text>
                <p style={{fontSize:"2vh"}}>Here's some tips to get you started</p>
                <div style={{justifyContent:"center", alignItems:"center", display:"inline-flex", gap:"8px"}}>
                <button className="howToButtons"><ChatIcon/> How to edit your files</button>
                <button className="howToButtons"><ChatIcon/> What are your next steps</button>
            </div>
            <div className="container">
                    <div className="message-container">
                        <div className="text"><WavingWoman/> Key Contact Information</div>
                    </div>
                    <div className="contact-block">
                        <div className="contact-icon"><PeopleIcon />{name} omkar bodas</div>
                        <div className="contact-icon"><PhoneIcon/>{phoneNumber}0493020494</div>
                        <div className="contact-icon"><EmailIcon/>{email}</div>
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