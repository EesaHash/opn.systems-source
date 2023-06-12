import React, {useState} from "react";
import { getUserID } from "../../App";

export const SignUp = _ => {
    const [userID, setUserID] = useState("none");
    const invitationList = [];

    getUserID().then(res => setUserID(res));

    const nextAction = _ => {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    };
    const createAccount = _ => {
        try{
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Check if the required fields are filled
            if(!email || !username || !password){
                return alert("Please fill in all non-optional fields!");
            }

            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(!data.status){
                        alert(data.message);
                    }else{
                        alert("Please check your email inbox and verify your email to activate your account via the link sent in your email!");
                        window.location.href = '/signin';
                    }
                });
        }catch(error){
            return alert(error);
        }
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            createAccount();
        }
    };
    const signUpStep1 = _ => {
        return(
            <div className = "sign-up" id ="step1">
                <div className="content">
                    <div className="user-authentication" style={{height: "100%"}} >
                        <div className="user-authentication-input">
                            <h3>Step 1 of 2</h3>
                        </div>
                        <h1>Create Account</h1>
                        <div className="user-authentication-input">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id ="email" placeholder="johndoe@gmail.com" onKeyPress={handleKeypress} />
                        </div>
                        <div className="user-authentication-input">
                            <label htmlFor="username">Username</label>
                            <input type ="text" id="username" placeholder="John Doe" onKeyPress={handleKeypress} />
                        </div>
                        <div className="user-authentication-input">
                            <label htmlFor="password">Password</label>
                            <input type="password" id ="password" onKeyPress={handleKeypress} />
                        </div>
                        <div className="pass">
                            <label style={{marginRight: "150px"}}>Minimum of 8 characters</label>
                        </div>
                        <div>
                            <button onClick={nextAction}> Next</button>
                        </div>
                        <div>
                            <label style={{marginRight: "5px"}} >Have an account? </label>
                            <a href="/signin">Sign In</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const signUpStep2 = _ => {
        return(
            <div className = "sign-up2" id ="step2" style={{display: "none"}}>
                <div className="content">
                    <div className="user-authentication">
                        <div className="user-authentication-input">
                            <h3>Step 2 of 2</h3>
                        </div>
                        <h1>Invite Team Members</h1>
                        <div className="user-authentication-input">
                            <label htmlFor="email">Email Address</label>
                            <div className="inviteInput">
                                <input type="email" id ="invitation-email" placeholder="johndoe@gmail.com" onKeyPress={handleKeypress} />
                                <button onClick={addInvitation} >Invite</button>
                            </div>
                        </div>
                        <div id="invitation-list" className="invitation-label"> <br/> </div>
                        <div >
                            <button onClick={nextAction}> Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const addInvitation = _ => {
        const node = document.createElement("button");
        const email = document.getElementById("invitation-email").value;
        node.textContent = email;
        invitationList.push(email);
        document.getElementById("invitation-list").appendChild(node);
    };

    if(userID !== "none") return window.location.href = "/";
    return(
        <div className = "page1">
            <div className = "cover">
                {signUpStep1()}
                {signUpStep2()}
            </div>
        </div>
    );
};

const emailInvitationLabel = (email) => {
    return(
        <div className="invitation-label">
            <button>{email}</button>
        </div>
    );
};