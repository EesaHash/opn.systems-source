// Import necessary libraries and modules
import React, {useEffect, useState} from "react";
import { getUserID } from "../../App";
import { useSearchParams } from "react-router-dom";
import { Error } from "@mui/icons-material";

export const SignUp = _ => {
    const [queryParameters] = useSearchParams();
    const [userID, setUserID] = useState("none");
    const [userInput, setUserInput] = useState({
        email: queryParameters.get("email"),
        username: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [emailList, setEmailList] = useState([]);
    const [invitationList, setInvitationList] = useState([]);

    getUserID().then(res => setUserID(res));

    /* =================================== FILL IN ACCOUNT DETAILS =================================== */
    /* Update the "Sign Up" button's background color based on input validation */
    useEffect(() => {
        if(userInput.email && userInput.username && userInput.password.length >= 8 && userInput.firstName && userInput.lastName)
            document.getElementById("create-account-btn").style.backgroundColor = "#5D5FEF";
        else
            document.getElementById("create-account-btn").style.backgroundColor = "#A2ABBA";
    }, [userInput]);
    /* Function to render Step 1 of the sign-up form */
    const signUpStep1 = _ => {
        return(
            <div className = "sign-up" id ="step1">
                <div className="content">
                    <div className="user-authentication" style={{height: "100%"}} >
                        <div className="user-authentication-input">
                            <div className="sign-up-step-title">
                                <h3>Step 1 of 2</h3>
                            </div>
                        </div>
                        <h1>Create Account</h1>
                        <div className="user-authentication-input">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" value={userInput.email} placeholder="johndoe@gmail.com" onKeyPress={handleKeypress} onChange={event => setUserInput({...userInput, email: event.target.value})} />
                        </div>
                        <div className="user-authentication-input">
                            <label htmlFor="username">Username</label>
                            <input type ="text" value={userInput.username} placeholder="John Doe" onKeyPress={handleKeypress} onChange={event => setUserInput({...userInput, username: event.target.value})} />
                        </div>
                        <div className="user-authentication-input" style={{display: "flex"}} >
                            <div className="half-input left">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text"value={userInput.firstName} placeholder="John" onKeyPress={handleKeypress} onChange={event => setUserInput({...userInput, firstName: event.target.value})} />
                            </div>
                            <div className="half-input">
                                <label htmlFor="lastName">{`Last Name`}</label>
                                <input type="text" value={userInput.lastName} placeholder="Doe" onKeyPress={handleKeypress} onChange={event => setUserInput({...userInput, lastName: event.target.value})} />
                            </div>
                        </div>
                        <div>
                            <div className="user-authentication-input password">
                                <label htmlFor="password">Password</label>
                                <input type="password" value={userInput.password} onKeyPress={handleKeypress} onChange={event => setUserInput({...userInput, password: event.target.value})} />
                            </div>
                            <div className="alert">
                                <Error/>
                                <label>Minimum of 8 characters</label>
                            </div>
                        </div>
                        <div>
                            <button id="create-account-btn" onClick={nextAction}> Next</button>
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
    /* Function to handle Enter key press event for the next action */
    const handleKeypress = e => {
        if(e.key === "Enter"){
            nextAction();
        }
    };
    /* Function to handle the next action (proceed to Step 2) */
    const nextAction = _ => {
        try{
            // Check if the required fields are filled
            if(!userInput.email || !userInput.username || !userInput.password || !userInput.firstName || !userInput.lastName)
                return alert("Please fill in all fields!");
            // Check if the password is at least 8 characters
            if(userInput.password.length < 8)
                return alert("Password must be at least 8 characters long!");

            // Send a POST request to the server to validate the user's email and username
            fetch("/api/authenticateuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userInput.username,
                    email: userInput.email
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(!data.status){
                        alert(data.message);
                    }else{
                        // Proceed to Step 2
                        document.getElementById("step1").style.display = "none";
                        document.getElementById("step2").style.display = "block";
                    }
                });
        }catch(error){
            return alert(error);
        }
    };
    /* Function to handle the back action (go back to Step 1) */
    const backAction = _ => {
        document.getElementById("step1").style.display = "block";
        document.getElementById("step2").style.display = "none";
    };
    /* ========================================================================================== */

    /* =================================== INVITE TEAM MEMBERS =================================== */
    /* Function to render Step 2 of the sign-up form */
    const signUpStep2 = _ => {
        return(
            <div className = "sign-up2" id ="step2" style={{display: "none"}}>
                <div className="content">
                    <div className="user-authentication">
                        <div className="user-authentication-input">
                            <div className="sign-up-step-title">
                                <button type="button" onClick={backAction} >
                                    <span aria-hidden="true">{"<"}</span>
                                </button>
                                <h3>Step 2 of 2</h3>
                            </div>
                        </div>
                        <h1>Invite Team Members</h1>
                        <div className="user-authentication-input">
                            <label htmlFor="email">Email Address</label>
                            <div className="inviteInput">
                                <input type="email" id ="invitation-email" placeholder="johndoe@gmail.com" onKeyPress={handleKeypress2} />
                                <button onClick={addInvitation} >Invite</button>
                            </div>
                        </div>
                        <div id="invitation-list" className="invitation-list" style={{display: "none"}}> 
                        {emailList.map((data, index) => (
                            <div key={index} className="invitation-label">
                                <p>{data.email}</p>
                                <button className="close-button" aria-label="Dismiss alert" type="button" onClick={cancelEmailInvitation} >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        ))}
                        </div>
                        {emailList.length > 0 &&
                            <div className="alert">
                                <Error/>
                                <label>No account access</label>
                            </div>
                        }
                        <div >
                            <button onClick={createAccount}> Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    /* Function to handle Enter key press event for adding an invitation */
    const handleKeypress2 = e => {
        if(e.key === "Enter"){
            addInvitation();
        }
    };
    /* Function to add an invitation to the email list */
    const addInvitation = _ => {
        // Validate email input
        const email = document.getElementById("invitation-email").value;
        if(!email)
            return alert("Please fill in the input field!");
        // Adjust the box to contains the list of invited team member
        if(document.getElementById("invitation-list").style.display === "none"){
            document.getElementById("step2").style.maxHeight = "75vh";
            document.getElementById("step2").style.height = "fit-content";
            document.getElementById("invitation-list").style.display = "grid";
        }
        setEmailList([...emailList, { email: email }]);
        setInvitationList([...invitationList, email]);
        document.getElementById("invitation-email").value = "";
    };
    /* Function to cancel an email invitation */
    const cancelEmailInvitation = (index) => {
        const list = [...emailList];
        list.splice(index, 1);
        setEmailList(list);
        const list2 = [...invitationList];
        list2.splice(index, 1);
        setInvitationList(list2);
        if(list2.length === 0){
            document.getElementById("step2").style.height = "40vh";
            document.getElementById("step2").style.minHeight = "400px";
            document.getElementById("invitation-list").style.display = "none";
        }
    };
    /* Function to create the user account */
    const createAccount = _ => {
        try{
            // Send a POST request to the server to create the user account
            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...userInput,
                    emails: invitationList
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
    /* ========================================================================================== */

    /* If the user is already authenticated (has a userID), redirect to the home page */
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