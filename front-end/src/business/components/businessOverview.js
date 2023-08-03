import React from 'react';
//import "../style/business.css";
import "../style/businessOverview.css"
import PeopleIcon from '../svg/peopleIcon';
import WavingWoman from '../svg/wavingWoman';
import PhoneIcon from '../svg/phoneIcon';
import EmailIcon from '../svg/emailIcon';
import PartyPopper from '../svg/partyPopper';

export const BusinessOverview = (props) => {
    return (
        <div className="businesses-overview">
            <div className="yourbusiness">
                <div className="businesstitle">
                    <text style={{ fontSize: "2.2vw" }}>Welcome to Opn.Systems <PartyPopper /></text>

                </div>
                <div className="container">
                    <div className="message-container">
                        <div className="text"><WavingWoman /> Key Contact Information</div>
                    </div>
                    <div className="contact-block">
                        <div className="contact-icon"><PeopleIcon />{props.business.keyContact && props.business.keyContact.name}</div>
                        <div className="contact-icon"><PhoneIcon />{props.business.keyContact && props.business.keyContact.phoneNumber}</div>
                        <div className="contact-icon"><EmailIcon />{props.business.keyContact && (props.business.keyContact.email ? props.business.keyContact.email : props.business.keyContact.teamContactEmail)}</div>
                    </div>
                </div>

            </div>
            <div className="updates" style={{ height: "34vh" }}>
                <img className="updateslogo" src="./images/notificationlogo.png" alt="logo" />
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