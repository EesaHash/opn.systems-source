import React, {useEffect, useState} from "react";
import "../style/account.css";
import { getUserID } from "../../App";
export const ForgotPassword = _ => {
    const [userID, setUserID] = useState("none");
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(0);
    const [codeInput, setCodeInput] = useState("");
    getUserID().then(res => setUserID(res));

    useEffect(() => {
        if(!emailInput)
            document.getElementById("forgot-pass-btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("forgot-pass-btn").style.backgroundColor = "#5D5FEF";
    }, [emailInput]);
    
    const handleKeypress = e => {
        if(e.key === "Enter"){
            forgetPassword();
        }
    };
    const forgetPassword = _ => {
        try{
            if(!emailInput)
                return alert("Email address cannot be empty!");
            const OTP = Math.floor(Math.random() * 9000 + 1000);
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
                .then((res) => {return res.json(); })
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        setCode(OTP);
                        document.getElementById("forgot-pass-form").style.display = "none";
                        document.getElementById("otp-code-form").style.display = "block";
                    }
                });
        }catch(error){
            console.log(error);
        }
    };

    // Forgot password (enter email)
    const step1 = _ => {
        return(
            <div id="forgot-pass-form" className ="user-authentication">
                <div>
                    <h1>Forgot Password</h1>
                    <div className="user-authentication-input" >
                        <label>Recovery Email Address</label>
                        <input type="email" placeholder="johndoe@gmail.com" value = {emailInput} onChange={event => setEmailInput(event.target.value)} onKeyPress={handleKeypress} />
                    </div>
                    <div>
                        <button id="forgot-pass-btn" onClick={forgetPassword}>Send Email</button>
                    </div>
                </div>
            </div> 
        );
    };

    // Input OTP Code
    const otpCode = _ => {
        return(
            <div id="otp-code-form" className ="user-authentication" style={{display: "none"}}>
                <div style={{marginTop: "-50px"}}>
                    <h1>Email Verification</h1>
                    <div className="user-authentication-input" >
                        <label>We have sent a code to your email</label>
                        <div className="otp-code">
                            <input type="text" className="otp-code-input" onChange={event => inputCodeAction(event, 0)} />
                            <input type="text" className="otp-code-input" onChange={event => inputCodeAction(event, 1)} />
                            <input type="text" className="otp-code-input" onChange={event => inputCodeAction(event, 2)} />
                            <input type="text" className="otp-code-input" onChange={event => inputCodeAction(event, 3)} />
                        </div>
                    </div>
                    <div>
                        <button id="forgot-pass-btn" onClick={forgetPassword}>Verify Account</button>
                    </div>
                </div>
            </div>
        );
    };
    const verifyOtpCode = _ => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    };
    const inputCodeAction = (event, index) => {
        
    };

    // Reset Password
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    useEffect(() => {
        if(!password || !confirmPassword)
            document.getElementById("reset-pass-btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("reset-pass-btn").style.backgroundColor = "#5D5FEF";
    }, [password, confirmPassword]);
    const resetPassword = _ => {
        return(
            <div id="reset-password-form" className ="user-authentication" style={{display: "none"}}>
                <div>
                    <h1>Forgot Password</h1>
                    <div className="user-authentication-input" >
                        <label>Password</label>
                        <input type="password" value = {password} onChange={event => setPassword(event.target.value)} onKeyPress={null} />
                    </div>
                    <div className="user-authentication-input" >
                        <label>Confirm Password</label>
                        <input type="password" value = {confirmPassword} onChange={event => setConfirmPassword(event.target.value)} onKeyPress={null} />
                    </div>
                    <div>
                        <button id="reset-pass-btn" onClick={null}>Reset Password</button>
                    </div>
                </div>
            </div>
        );
    };

    if(userID !== "none") return window.location.href = "/";
    return(
        <div className="page1"> 
            <div className="cover">
                <div className = "forgot-pass">
                    <div className="content">
                        {step1()}
                        {otpCode()}
                        {resetPassword()}
                    </div> 
                </div>
            </div> 
        </div>
    );
};