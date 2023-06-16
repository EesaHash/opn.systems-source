import React, { useState } from "react";
import "../style/homepage.css";
import { getUserID } from "../../App";

export const Homepage = _ => {
    const [userID, setUserID] = useState("none");
    getUserID().then(res => setUserID(res));

    if(userID !== "none") return window.location.href = "/dashboard"
    return (
    <div className = "page" style={{overflow: "scroll"}}>
        <div className="ricky">
            <div className="header">
                <div className="circle"></div>
                <a href="#features" className="text">Features</a>
                <a href="#about" className="text">About OPN</a>
                <div className="buttons">
                    <a href="/SignUp" className="signup">Sign up</a>
                    <a href="/SignIn" className="login">Login</a>
                </div>
            </div>
            <div className="page_1">
                <div className="center_head">SOPs Optimized</div>
                <div className="mission">AI generated. Streamlined SOPs. Continuous improvement.<br />Your operations made Easy!</div>
                <div className="free-trial">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="floatingInput" placeholder="username"/>
                        <label for="floatingInput">Email Address</label>
                    </div>
                    <button>{`Start your free trial >`}</button>
                </div>
            </div>
            <div className="page_2">

            </div>
            <div className="page_3">

            </div>
            <div className="page_4">

            </div>
        </div>
    </div>
    );
};