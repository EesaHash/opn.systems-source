// Import necessary libraries and modules
import React, {useEffect, useState} from "react";
import "../style/account.css";
import { getUserID } from "../../App";

export const SignIn = _ => {
    const [userID, setUserID] = useState("none");
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    let rememberMe = false;

    /* Fetch the user ID and set it in the state on component mount */
    getUserID().then(res => setUserID(res));

    /* Update the "Sign In" button's background color based on email and password input validation */
    useEffect(() => {
        if(input.email && input.password.length >= 8)
            document.getElementById("sign-in-btn").style.backgroundColor = "#5D5FEF";
        else
            document.getElementById("sign-in-btn").style.backgroundColor = "#A2ABBA";
    }, [input]);
    /* Function to handle the sign-in process */
    const signIn = _ => {
        try{
            // Check if the required fields are filled
            if(!input.email || !input.password){
                return alert("Please fill in all non-optional fields!");
            }
            // Send a POST request to the server to validate the login credentials
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: input.email,
                    password: input.password,
                    rememberMe: rememberMe
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    // If login is successful, store the login token and redirect to the dashboard
                    if(data.status){
                        localStorage.setItem("rememberMe", rememberMe);
                        if(rememberMe)
                            localStorage.setItem("u", data.loginToken);
                        else
                            sessionStorage.setItem("u", data.loginToken);
                        window.location.href = '/dashboard';
                    }else{
                        alert(data.message);
                    }
                });
        }catch(error){
            return alert(error);
        }
    };
    /* Function to handle changes in the "Remember Me" checkbox */
    const handleChange = (e) => {
        rememberMe = e.target.checked;
    };
    /* Function to handle Enter key press event for the sign-in process */
    const handleKeypress = e => {
        if(e.key === "Enter"){
            signIn();
        }
    };

    /* If the user is already authenticated (has a userID), redirect to the dashboard */
    if(userID !== "none") return window.location.href = "/";
    return(
        <div className = "page1">
            <div className = "cover">
                <div className = "sign-in">
                    <div className="content">
                        <div className ="user-authentication">
                            <h1>Login</h1>
                            <div className="user-authentication-input">
                                <label html="email">Email Address/Username</label>
                                <input type="text" value={input.email} placeholder="johndoe@gmail.com" onChange={event => setInput({...input, email: event.target.value})} onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <div>
                                    <label html="password">Password</label>
                                    <a className="forgot-password" href="/forgotpassword" >Forgot your password?</a>
                                </div>
                                <input type="password" value={input.password} onChange={event => setInput({...input, password: event.target.value})} onKeyPress={handleKeypress} />
                            </div>
                            <div>
                            <button id="sign-in-btn" onClick={signIn}> Sign In</button>
            
                            </div>
                            <div>
                                <label style={{marginRight: "5px"}} >New to Opn.Systems?</label>
                                <a href="/signup">Sign Up</a>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox" value="remember-me" onChange={handleChange}/> Remember me for the next 7 days
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    );
};