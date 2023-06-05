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
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const contactNumber = document.getElementById("contactNumber").value;
            const dob = document.getElementById("dob").value;

            // Check if the required fields are filled
            if(!email || !username || !password || !firstName || !contactNumber || !dob){
                return alert("Please fill in all non-optional fields!");
            }
            // Check if the contact number input is in valid format
            if(!(/^(\+?\d{1,3}|0\d{1,4})\d{8}$/).test(contactNumber)){
                return alert("Invalid Contact Number!");
            }

            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    contactNumber: contactNumber,
                    dob: dob
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
        <div className = "page">
            <div className = "cover">
                <div className = "sign-up">
                    <div className="content">
                        <div className ="user-authentication" style={{height: "80%", width: "100%", overflow: "scroll"}}>
                            <h1>Create Account</h1>
                            <div className="user-authentication-input">
                                <label htmlFor="username">Username</label>
                                <input type ="text" id="username" placeholder="" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id ="email" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="password">Password</label>
                                <input type="password" id ="password" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id ="firstName" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="lastName">Last Name (optional)</label>
                                <input type="text" id ="lastName" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="contactNumber">Contact Number</label>
                                <input type="tel" id ="contactNumber" onKeyPress={handleKeypress} />
                            </div>
                            <div className="user-authentication-input">
                                <label htmlFor="dob">Date of Birth</label>
                                <input type="date" id ="dob" onKeyPress={handleKeypress} />
                            </div>
                            <div>
                                <button onClick={createAccount} > Sign Up</button>
                            </div>
                            <div>
                                <label style={{marginRight: "5px"}} >Already have an account? </label>
                                <a href="/signin">Sign In</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}