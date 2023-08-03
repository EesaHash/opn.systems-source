// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import "../style/account.css";
import { getUserID } from "../../App";

export const ForgotPassword = _ => {
    const [userID, setUserID] = useState("none");
    getUserID().then(res => setUserID(res));

    /* =================================== FORGOT PASSWORD (enter email) =================================== */
    /* Update the "Send Email" button background color based on email input */
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(0);
    useEffect(() => {
        if (!emailInput)
            document.getElementById("forgot-pass-btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("forgot-pass-btn").style.backgroundColor = "#5D5FEF";
    }, [emailInput]);
    /* Function to render the first step of forgot password (enter email) form */
    const forgotPasswordForm = _ => {
        return (
            <div id="forgot-pass-form" className="user-authentication">
                <div>
                    <h1>Forgot Password</h1>
                    <div className="user-authentication-input" >
                        <label>Recovery Email Address</label>
                        <input type="email" placeholder="johndoe@gmail.com" value={emailInput} onChange={event => setEmailInput(event.target.value)} onKeyPress={handleKeypress} />
                    </div>
                    <div>
                        <button id="forgot-pass-btn" onClick={forgetPassword}>Send Email</button>
                    </div>
                </div>
            </div>
        );
    };
    /* Function to handle Enter key press event for the first step of forgot password (enter email) */
    const handleKeypress = e => {
        if (e.key === "Enter") {
            forgetPassword();
        }
    };
    /* Function to handle the forgot password action (send email) */
    const forgetPassword = _ => {
        try {
            // Validate email input
            if (!emailInput)
                return alert("Email address cannot be empty!");
            
            // Generate a random OTP
            const OTP = Math.floor(Math.random() * 9000 + 1000);

            // Send a POST request to the server to initiate password recovery
            fetch("/api/forgetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailInput,
                    OTP
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    alert(data.message); // Show the response message from the server
                    // If the password recovery request is successful, set the OTP and show the OTP input form
                    if (data.status) {
                        setCode(OTP);
                        document.getElementById("forgot-pass-form").style.display = "none";
                        document.getElementById("otp-code-form").style.display = "block";
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };
    /* ========================================================================================== */

   /* =================================== OTP CODE =================================== */
    const [codeInput, setCodeInput] = useState([0, 0, 0, 0]);
    const otpCode = _ => {
        return (
            <div id="otp-code-form" className="user-authentication" style={{ display: "none" }}>
                <div style={{ marginTop: "-50px" }}>
                    <h1>Email Verification</h1>
                    <div className="user-authentication-input" >
                        <label>We have sent a code to your email</label>
                        <div className="otp-code">
                            <input type="text" className="otp-code-input" value={codeInput[0]} onChange={event => inputCodeAction(event, 0)} onKeyPress={handleKeypress2} />
                            <input type="text" className="otp-code-input" value={codeInput[1]} onChange={event => inputCodeAction(event, 1)} onKeyPress={handleKeypress2} />
                            <input type="text" className="otp-code-input" value={codeInput[2]} onChange={event => inputCodeAction(event, 2)} onKeyPress={handleKeypress2} />
                            <input type="text" className="otp-code-input" value={codeInput[3]} onChange={event => inputCodeAction(event, 3)} onKeyPress={handleKeypress2} />
                        </div>
                    </div>
                    <div>
                        <button id="forgot-pass-btn" onClick={verifyOtpCode}>Verify Account</button>
                    </div>
                </div>
            </div>
        );
    };
    /* Function to handle Enter key press event for the OTP code input form */
    const handleKeypress2 = e => {
        if (e.key === "Enter") {
            verifyOtpCode();
        }
    };
    /* Function to verify the OTP code entered by the user */
    const verifyOtpCode = _ => {
        try {
            // Convert the input OTP code into a single integer value
            const inputNumber = parseInt(codeInput.join(''), 10);
            // Check if the entered OTP code matches the generated OTP
            if (inputNumber !== code)
                return alert("Incorrect code, please check your inbox again!");
            // If OTP code is verified successfully, hide the OTP input form and show the password reset form
            document.getElementById("otp-code-form").style.display = "none";
            document.getElementById("reset-password-form").style.display = "block";
        } catch (error) {
            console.log(error);
        }
    };
    /* Function to handle changes in the OTP code input fields */
    const inputCodeAction = (event, index) => {
        const newValue = event.target.value.replace(/[^0-9]/g, ''); // Only allow numeric characters in the OTP code input fields
        const temp = [...codeInput];
        temp[index] = newValue;
        setCodeInput(temp);
    };
    /* ========================================================================================== */

    /* =================================== RESET PASSWORD =================================== */
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    /* Update the "Reset Password" button background color based on password input validation */
    useEffect(() => {
        if (password.length >= 8 && confirmPassword && password === confirmPassword)
            document.getElementById("reset-pass-btn").style.backgroundColor = "#5D5FEF";
        else
            document.getElementById("reset-pass-btn").style.backgroundColor = "#A2ABBA";
    }, [password, confirmPassword]);
    const resetPasswordForm = _ => {
        return (
            <div id="reset-password-form" className="user-authentication" style={{ display: "none" }}>
                <div>
                    <h1>Reset Password</h1>
                    <div className="user-authentication-input" >
                        <label>Password</label>
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)} onKeyPress={handleKeypress3} />
                    </div>
                    <div className="user-authentication-input" >
                        <label>Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} onKeyPress={handleKeypress3} />
                    </div>
                    <div>
                        <button id="reset-pass-btn" onClick={updatePassword}>Reset Password</button>
                    </div>
                </div>
            </div>
        );
    };
    /* Function to handle Enter key press event for the password reset form */
    const handleKeypress3 = e => {
        if (e.key === "Enter") {
            updatePassword();
        }
    };
    /* Function to reset the user's password on the server */
    const updatePassword = _ => {
        // Check if the new password meets the minimum length requirement
        if (password.length < 8)
            return alert("Password must be at least 8 characters long!");
        // Check if the new password matches the confirmed password
        if (!(password === confirmPassword))
            return alert("Confirm password does not match with new password!");
        // Send a POST request to the server to update the user's password    
        fetch("/api/resetpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput,
                password: password
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                alert(data.message); // Show the response message from the server
                // If password reset is successful, redirect the user to the sign-in page
                if (data.status) {
                    window.location.href = '/signin';
                }
            });
    };
    /* ========================================================================================== */

    // Check if the user is already logged in, and if yes, redirect to the home page
    if (userID !== "none") return window.location.href = "/";
    return (
        <div className="page1">
            <div className="cover">
                <div className="forgot-pass">
                    <div className="content">
                        {forgotPasswordForm()}
                        {otpCode()}
                        {resetPasswordForm()}
                    </div>
                </div>
            </div>
        </div>
    );
};