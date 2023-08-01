import React, { useEffect, useState } from 'react';
import "../style/acc_set.css";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { passwordInputItem, readOnlyInput, textInputItem } from '../../public_components/popupInput';

export const ModifyAccountDetails = (props) => {
    // Update Profile
    const [accountDetailsInput, setAccountDetailsInput] = useState(props.user);
    useEffect(() => {
        if(!accountDetailsInput.username || !accountDetailsInput.first_name || !accountDetailsInput.last_name)
            document.getElementById("update-profile-btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("update-profile-btn").style.backgroundColor = "#5D5FEF";
    }, [accountDetailsInput]);
    const accountPanel = _ => {
        return (
            <div id="setup_acc" className="content-form" style={{ justifyContent: "center" }}>
                <div className='header'>
                    <h2><SettingsIcon /> Account Setting</h2>
                    <button className='close-button' onClick={closeForm}><CloseIcon /></button>
                </div>
                <hr />
                <div>
                    <div className="cover" style={{ display: "flex" }}>
                        {props.user && props.user.first_name && (
                            <div className="initial">{`${props.user.first_name.charAt(0)}${props.user.last_name ? props.user.last_name.charAt(0) : ""}`}</div>
                        )}

                        <div className="pop-up-input" style={{ position: "absolute" }}>
                            <label>Username</label>
                            <input
                                type="text"
                                value={accountDetailsInput.username}
                                onChange={event => updateUsername(event.target.value)}
                                onKeyPress={handleKeypress}
                            />
                        </div>
                    </div>
                    {textInputItem("First Name", accountDetailsInput.first_name, updateFirstName, handleKeypress)}
                    {textInputItem("Last Name", accountDetailsInput.last_name, updateLastName, handleKeypress)}
                    {readOnlyInput("Email", accountDetailsInput.email, "email")}
                    <div className="pop-up-input">
                        <label>Password</label>
                        <button className='change-pass-button' onClick={changePassword}>Change Password</button>
                    </div>
                    <div className='pop-up-button'>
                        <button className='cancel-button' onClick={closeForm}>Cancel</button>
                        <button id="update-profile-btn" className='save-button' onClick={updateProfile} >Save</button>
                    </div>
                </div>
            </div>


        );
    };
    const handleKeypress = e => {
        if(e.key === "Enter")
            updateProfile();
    };
    const updateProfile = _ => {
        try {
            if(!accountDetailsInput.username || !accountDetailsInput.first_name || !accountDetailsInput.last_name)
                return alert("Please fill in all fields!");
            fetch("/api/updateuserdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userData: accountDetailsInput
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(data.status){
                        props.setUser(accountDetailsInput);
                        resetForm();
                    }
                    alert(data.message);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const updateUsername = (value) => {
        setAccountDetailsInput({...accountDetailsInput, username: value});
    };
    const updateFirstName = (value) => {
        setAccountDetailsInput({...accountDetailsInput, first_name: value});
    };
    const updateLastName = (value) => {
        setAccountDetailsInput({...accountDetailsInput, last_name: value});
    };
    const backAction = _ => {
        // Close the change password form
        document.getElementById("change_pass").style.display = "none";
        // Open the account panel form
        document.getElementById("setup_acc").style.display = "block";
    };

    // Update Password
    const [passwordInput, setPasswordInput] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    useEffect(() => {
        if(passwordInput.oldPassword && passwordInput.newPassword.length >= 8 && passwordInput.newPassword === passwordInput.confirmPassword)
            document.getElementById("change-pass-btn").style.backgroundColor = "#5D5FEF";
        else
            document.getElementById("change-pass-btn").style.backgroundColor = "#A2ABBA";
    }, [passwordInput]);
    const changePasswordForm = _ => {
        return (
            <div id="change_pass" className="content-form" style={{ justifyContent: "center", display: "none" }}>
                <div className='header'>
                    <h2><button className="back-button" onClick={backAction}><ArrowBackIcon /></button> Account Setting</h2>
                    <button className='close-button' onClick={closeForm}><CloseIcon /></button>
                </div>
                <hr />
                <div className='change-password-content'>
                    {passwordInputItem("Old Password", passwordInput.oldPassword, updateOldPassword, handleKeypress2)}
                    {passwordInputItem("New Password", passwordInput.newPassword, updateNewPassword, handleKeypress2)}
                    {passwordInputItem("Confirm Password", passwordInput.confirmPassword, updateConfirmPassword, handleKeypress2)}
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button id="change-pass-btn" className='save-button' onClick={updatePassword} >Save</button>
                </div>
            </div>
        );
    };
    const handleKeypress2 = e => {
        if(e.key === "Enter")
            updatePassword();
    };
    const updatePassword = _ => {
        try {
            if(!passwordInput.oldPassword || !passwordInput.newPassword)
                return alert("Please fill in all fields!");
            if(passwordInput.newPassword.length < 8)
                return alert("Password must be at least 8 characters long!");
            if(!(passwordInput.newPassword === passwordInput.confirmPassword))
                return alert("Confirm password does not match with new password!");
            fetch("/api/updatepassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: props.user.email,
                    passwordInput: passwordInput
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(data.status){
                        props.setUser(accountDetailsInput);
                        resetForm();
                    }
                    alert(data.message);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const updateOldPassword = (value) => {
        setPasswordInput({...passwordInput, oldPassword: value});
    };
    const updateNewPassword = (value) => {
        setPasswordInput({...passwordInput, newPassword: value});
    };
    const updateConfirmPassword = (value) => {
        setPasswordInput({...passwordInput, confirmPassword: value});
    };
    const changePassword = _ => {
        document.getElementById("setup_acc").style.display = "none";
        document.getElementById("change_pass").style.display = "block";
    };

    // Close Form
    const closeForm = _ => {
        // Reset the input fields
        setAccountDetailsInput(props.user);
        resetForm();
    };
    const resetForm = _ => {
        // Reset Password Input
        setPasswordInput({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        // Reset the form to step 1
        // document.getElementById("setup_acc").style.display = "block";
        // Close the form
        document.getElementById("setup_acc").style.display = "block";
        document.getElementById("change_pass").style.display = "none";
        document.getElementById("account-setting-Form").style.display = "none";
    };

    return (
        <section id="account-setting-Form" className="form-popup center form-container account-setting" >
            {accountPanel()}
            {changePasswordForm()}
        </section>
    );
}