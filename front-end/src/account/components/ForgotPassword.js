import React, {useState} from "react";
import "../style/account.css";
import { getUserID } from "../../App";
export const ForgotPassword = _ => {
    const [userID, setUserID] = useState("none");
    getUserID().then(res => setUserID(res));
    
    const handleKeypress = e => {
        if(e.key === "Enter"){
            forgetPassword();
        }
    };

    if(userID !== "none") return window.location.href = "/";
    return(
        <div className="page1"> 
            <div className="cover">
                <div className = "forgot-pass">
                    <div className="content">
                        <div className ="user-authentication">
                            <div>
                                <h1>Forgot Password</h1>
                                <div className="user-authentication-input" >
                                    <label>Recovery Email Address</label>
                                    <input type="text" placeholder="johndoe@gmail.com" id="email" onKeyPress={handleKeypress} />
                                </div>
                                <div>
                                    <button onClick={forgetPassword}>Send Email</button>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div>
            </div> 
        </div>
    );
};

const forgetPassword = _ => {
    try{
        const email = document.getElementById("email").value;
        fetch("/api/forgetpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then((res) => {return res.json(); })
            .then((data) => {
                alert(data.message);
                if(data.status)
                    return window.location.href = "/SignIn";
            });
    }catch(error){
        console.log(error);
    }
};