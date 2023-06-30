import React, { useState } from 'react';
import "../style/acc_set.css";
import { closePopUpForm } from '../page/dashboard_main';


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
                <h2>Account Settings</h2>
                <hr/>
                <h3>Step 1 of 2</h3>
         
                <div className="pop-up-input">
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={accountDetailsInput.username}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Last Name</label>
                    <input 
                        type="text" 
                        value={accountDetailsInput.lastname}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Email Id</label>
                    <input 
                        type="text"
                        // value={businessOverviewInput.industry}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, industry: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <href>Forgot Password</href>

                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button className='next-button' onClick={null} >Next</button>
                </div>
            </div>
        );
    };


    return (<>
        <section id="account-setting-Form" className="form-popup center form-container account-setting" >
            {accountPanel()}
        </section></>);
}