import React, { useState } from 'react';
import "../style/acc_set.css";
import { closePopUpForm } from '../page/dashboard_main';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

export const ModifyAccountDetails = (props) => {
    const [accountDetailsInput, setAccountDetailsInput] = useState({
        username: "",
        firstname: "",
        lastname:  ""
    });

    const closeForm = _ => {
        // Reset the input fields
        setAccountDetailsInput({
            username: "",
            firstname: "",
            lastname:  ""
        });
        // Reset the form to step 1
        // document.getElementById("setup_acc").style.display = "block";
        // Close the form
        document.getElementById("account-setting-Form").style.display = "none";
        closePopUpForm();
    };

    const accountPanel = _ => {
        return(
            <div id="setup_acc" className="content-form" style={{justifyContent:"center"}}>
                <h2><SettingsIcon/> Account Settings
                        <button className='close-button' onClick={closeForm}><CloseIcon/></button>
                </h2>         
            <hr/> 
            <div>
                <div className="cover" style={{display:"flex"}}>
                {props.user && props.user.first_name && (
                    <div className="initial">{`${props.user.first_name.charAt(0)}${props.user.last_name ? props.user.last_name.charAt(0) : ""}`}</div>
                )}
          
                <div className="pop-up-input" style={{position:"absolute"}}>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={accountDetailsInput.username}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusine
                        //ssOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
             </div>
            </div>
                <div className="pop-up-input">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        value={accountDetailsInput.lastname}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Email</label>
                    <input className='email-placeholder'
                        type="text" value={props.user.email} readOnly
                        // value={businessOverviewInput.industry}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, industry: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Password</label>
                    <button className='change-pass-button' onClick={null}>Change Password</button>

                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button className='next-button' onClick={null} >Save</button>
                </div>
            </div>

         
        );
    };

    return (<>
        <section id="account-setting-Form" className="form-popup center form-container account-setting" >
            {accountPanel()}
        </section></>);
}