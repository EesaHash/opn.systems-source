import React, { useState } from 'react';
import "../style/acc_set.css";


export const ModifyAccountDetails = (props) => {
    const [accountDetailsInput, setAccountDetailsInput] = useState({
        username: "",
        fullName: "",
    });

    const accountPanel = _ => {
        return(
            <div id="create-business-step1" className="content-form">
                <h2>Account Settings</h2>
                <hr/>
                <h3>Step 1 of 2</h3>
         
                <div className="pop-up-input">
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={accountDetailsInput.username}
                        // onKeyPress={handleKeypress} 
                        // onChange={event => setBusinessOverviewInput({...businessOverviewInput, businessName: event.target.value})}
                    />
                </div>
                <div className="pop-up-input">
                    <label>Full Name</label>
                    {/* {businessTypeListDrowdown(businessOverviewInput, setBusinessOverviewInput)} */}
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
                <div className='pop-up-button'>
                    {/* <button className='cancel-button' onClick={closeCreateBusinessForm}>Cancel</button>
                    <button className='next-button' onClick={nextAction} >Next</button> */}
                </div>
            </div>
        );
    };


    return (<>
            <section id="createAccountForm" className="form-popup center form-container create-account">
            {accountPanel()}
        </section></>);
}