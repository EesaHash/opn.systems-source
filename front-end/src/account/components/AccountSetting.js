// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import "../style/acc_set.css";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { passwordInputItem, readOnlyInput, textInputItem } from '../../public_components/popupInput';
import { logOut } from '../../App';

export const AccountSetting = (props) => {
    /* =================================== UPDATE PROFILE =================================== */
    /* State to store user account details */
    const [accountDetailsInput, setAccountDetailsInput] = useState(props.user);
    /* Update the background color of "Save" button based on user details input */
    useEffect(() => {
        if (!accountDetailsInput.username || !accountDetailsInput.first_name || !accountDetailsInput.last_name)
            document.getElementById("update-profile-btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("update-profile-btn").style.backgroundColor = "#5D5FEF";
    }, [accountDetailsInput]);
    /* Render the form for edditing account/profile */
    const accountPanelForm = _ => {
        return (
            <div id="setup_acc" className="content-form" style={{ justifyContent: "center" }}>
                {/* Header */}
                <div className='header'>
                    <h2><SettingsIcon /> Account Setting</h2>
                    <button className='close-button' onClick={closeForm}><CloseIcon /></button>
                </div>
                <hr />
                
                {/* Body: Account details form */}
                <div>
                    {/* Display username and profile picture */}
                    <div className="cover" style={{ display: "flex" }}>
                        {props.user && props.user.first_name && (
                            <div className="initial">{`${props.user.first_name.charAt(0)}${props.user.last_name ? props.user.last_name.charAt(0) : ""}`}</div>
                        )}
                        <div className="pop-up-input" style={{ position: "absolute" }}> {/* Input field for username */}
                            <label>Username</label>
                            <input
                                type="text"
                                value={accountDetailsInput.username}
                                onChange={event => updateUsername(event.target.value)}
                                onKeyPress={handleKeypress}
                            />
                        </div>
                    </div>

                    {/* Other input fields for first name, last name, and email */}
                    {textInputItem("First Name", accountDetailsInput.first_name, updateFirstName, handleKeypress)}
                    {textInputItem("Last Name", accountDetailsInput.last_name, updateLastName, handleKeypress)}
                    {readOnlyInput("Email", accountDetailsInput.email, "email")}

                    {/* Hyperlink to change password */}
                    <div className="pop-up-input">
                        <label>Password</label>
                        <button className='change-pass-button' onClick={changePassword}>Change Password</button>
                    </div>
                    
                    {/* Buttons to cancel or save changes */}
                    <div className='pop-up-button'>
                        <button className='cancel-button' onClick={closeForm}>Cancel</button>
                        <button id="update-profile-btn" className='save-button' onClick={updateProfile} >Save</button>
                    </div>
                </div>
            </div>
        );
    };
    /* Function to handle the Enter key press event for form submission on accountPanelForm */
    const handleKeypress = e => {
        if (e.key === "Enter")
            updateProfile();
    };
    /* Function to update the user profile details */
    const updateProfile = _ => {
        try {
            // Validate user input (no empty input)
            if (!accountDetailsInput.username || !accountDetailsInput.first_name || !accountDetailsInput.last_name)
                return alert("Please fill in all fields!");

            // Send a POST request to update the user data
            fetch("/api/updateuserdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userData: accountDetailsInput
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        // Update the user state with new account details
                        props.setUser(accountDetailsInput);
                        resetForm();
                    }
                    alert(data.message);
                });
        } catch (error) {
            console.log(error);
        }
    };
    /* Function to update the username input */
    const updateUsername = (value) => {
        setAccountDetailsInput({ ...accountDetailsInput, username: value });
    };
    /* Function to update the first name input */
    const updateFirstName = (value) => {
        setAccountDetailsInput({ ...accountDetailsInput, first_name: value });
    };
    /* Function to update the last name input */
    const updateLastName = (value) => {
        setAccountDetailsInput({ ...accountDetailsInput, last_name: value });
    };
    /* Function to display the change password form and hide the account details form */
    const changePassword = _ => {
        document.getElementById("setup_acc").style.display = "none";
        document.getElementById("change_pass").style.display = "block";
    };
    /* Function to navigate back from password change form to account details form */
    const backAction = _ => {
        // Close the change password form
        document.getElementById("change_pass").style.display = "none";
        // Open the account panel form
        document.getElementById("setup_acc").style.display = "block";
    };
    /* ========================================================================================== */

    /* =================================== UPDATE PASSWORD =================================== */
    /* State to store password input fields */
    const [passwordInput, setPasswordInput] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    /* Update the background color of "Save" button based on password input validation */
    useEffect(() => {
        if (passwordInput.oldPassword && passwordInput.newPassword.length >= 8 && passwordInput.newPassword === passwordInput.confirmPassword)
            document.getElementById("change-pass-btn").style.backgroundColor = "#5D5FEF";
        else
            document.getElementById("change-pass-btn").style.backgroundColor = "#A2ABBA";
    }, [passwordInput]);
    /* Function to render the change password form */
    const changePasswordForm = _ => {
        return (
            <div id="change_pass" className="content-form" style={{ justifyContent: "center", display: "none" }}>
                {/* Header */}
                <div className='header'>
                    <h2><button className="back-button" onClick={backAction}><ArrowBackIcon /></button> Account Setting</h2>
                    <button className='close-button' onClick={closeForm}><CloseIcon /></button>
                </div>
                <hr />

                {/* Change Password form */}
                <div className='change-password-content'>
                    {/* Input fields for old password, new password, and confirm password */}
                    {passwordInputItem("Old Password", passwordInput.oldPassword, updateOldPassword, handleKeypress2)}
                    {passwordInputItem("New Password", passwordInput.newPassword, updateNewPassword, handleKeypress2)}
                    {passwordInputItem("Confirm Password", passwordInput.confirmPassword, updateConfirmPassword, handleKeypress2)}
                    {/* Hyperlink to handle forgot password */}
                    <div className="pop-up-input">
                        <button className='change-pass-button' onClick={forgotPassword}>Forgot Password?</button>
                    </div>
                </div>

                {/* Buttons to cancel or save password changes */}
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button id="change-pass-btn" className='save-button' onClick={updatePassword} >Save</button>
                </div>
            </div>
        );
    };
    /* Function to handle the Enter key press event for form submission on changePasswordForm */
    const handleKeypress2 = e => {
        if (e.key === "Enter")
            updatePassword();
    };
    /* Function to update the user password */
    const updatePassword = _ => {
        try {
            // Check if old and new password fields are filled
            if (!passwordInput.oldPassword || !passwordInput.newPassword)
                return alert("Please fill in all fields!");

            // Check if the new password meets the minimum length requirement
            if (passwordInput.newPassword.length < 8)
                return alert("Password must be at least 8 characters long!");

            // Check if the new password matches the confirmed password
            if (!(passwordInput.newPassword === passwordInput.confirmPassword))
                return alert("Confirm password does not match with new password!");

            // Send a POST request to update the user's password
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
                .then((res) => { return res.json(); })
                .then((data) => {
                    // If the password update was successful, update the user state and reset the form
                    if (data.status) {
                        props.setUser(accountDetailsInput); // Update the user state with new account details
                        resetForm(); // Reset the form and state variables for account settings and password change forms
                    }
                    alert(data.message); // Show the response message from the server
                });
        } catch (error) {
            console.log(error); // Log any errors that may occur during the password update process
        }
    };
    /* Function to update the old password input */
    const updateOldPassword = (value) => {
        setPasswordInput({ ...passwordInput, oldPassword: value });
    };
    /* Function to update the new password input */
    const updateNewPassword = (value) => {
        setPasswordInput({ ...passwordInput, newPassword: value });
    };
    /* Function to update the confifm password input */
    const updateConfirmPassword = (value) => {
        setPasswordInput({ ...passwordInput, confirmPassword: value });
    };
    /* Function to handle the forgot password action */
    const forgotPassword = _ => {
        logOut(); // Log out the user
        window.location.href = '/forgotpassword'; // Direct the user to the forgotpassword page
    };
    /* ========================================================================================== */

    /* =================================== CLOSE THE FORM =================================== */
    const closeForm = _ => {
        // Reset the input fields
        setAccountDetailsInput(props.user);
        resetForm();
    };
    /* Function to reset the form and state variables for account settings and password change forms */
    const resetForm = _ => {
        // Reset Password Input
        setPasswordInput({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        // Reset the form to step 1
        backAction();
        // Close the form
        document.getElementById("account-setting-Form").style.display = "none";
    };
    /* ========================================================================================== */

    return (
        <section id="account-setting-Form" className="form-popup center form-container account-setting" >
            {accountPanelForm()}
            {changePasswordForm()}
        </section>
    );
}