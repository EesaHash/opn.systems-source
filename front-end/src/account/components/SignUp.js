import React, {useState} from "react";
import { getUserID } from "../../App";

export const SignUp = _ => {
    const [userID, setUserID] = useState("none");

    getUserID().then(res => setUserID(res));

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

    if(userID !== "none") return window.location.href = "/";
    return(
        <div className = "page1">
            <div className = "cover">
                <div className = "sign-up">
                    <div className="content">
                        <div className ="user-authentication">
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
                                <button onClick={createAccount} > Sign Up</button>
                            </div>
                            <div>
                                <label style={{marginRight: "5px"}} >Have an account? </label>
                                <a href="/signin">Sign In</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}