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
            <div className="yourbusiness2">
                <div className="businesstitle">
                    <text style={{ fontSize: "2.2vw" }}>Welcome to Opn.Systems <PartyPopper /></text>

                </div>
                {/* <div className="Front">
                        <div className="Shape">
                      <Card/></div>
                      <div className="Frame2080"><OpnLogo/>
                        <div style={{marginTop:"3.5px"}}>Company Name <div class="tagline">Innovate . Inspire . Impact.</div>
                      </div>
                    </div>
                        <div className="YourNamePosition">
                            <div className="Position">Designer</div>
                            <div className="Name">
                            <span>John</span>
                            <span className="span"> </span>
                            <span className="doe">Doe</span>
                            </div>
                        </div>
                        <div className="Contract">
                            <div className="Address"><PHONE3_ADD/>  35 Toongabbie Road, Toongabbie</div>
                            <div className="Email"><PHONE2_EMAIL/>  {props.business.keyContact && (props.business.keyContact.email ? props.business.keyContact.email : props.business.keyContact.teamContactEmail)}</div>
                            <div className="Number"><PHONE/> {props.business.keyContact && props.business.keyContact.phoneNumber}</div>
                        </div>
                </div> */}


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
                </div>  */}
        </div>
        
    );
};