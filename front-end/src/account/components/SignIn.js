import React, {useState} from "react";
import "../style/account.css";
import { getUserID } from "../../App";

export const SignIn = _ => {
    const [userID, setUserID] = useState("none");
    let rememberMe = false;

    getUserID().then(res => setUserID(res));

    const signIn = _ => {
        try{
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // Check if the required fields are filled
            if(!email || !password){
                return alert("Please fill in all non-optional fields!");
            }
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                    rememberMe: rememberMe
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
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
    const handleChange = (e) => {
        rememberMe = e.target.checked;
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            signIn();
        }
    };

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
                                <input type="text" placeholder="johndoe@gmail.com" id ="email" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <div>
                                    <label html="password">Password</label>
                                    <a className="forgot-password" href="/forgotpassword" >Forgot your password?</a>
                                </div>
                                <input type="password" id ="password" onKeyPress={handleKeypress} />
                            </div>
                            <div>
                            <button onClick={signIn}> Sign In</button>
            
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