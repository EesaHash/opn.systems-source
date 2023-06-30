import React, {useState} from "react";
import { getUserID } from "../../App";
import { useSearchParams } from "react-router-dom";

export const SignUp = _ => {
    const [userID, setUserID] = useState("none");
    const [userInput, setUserInput] = useState({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [emailList, setEmailList] = useState([]);
    const [invitationList, setInvitationList] = useState([]);
    const [queryParameters] = useSearchParams();

    getUserID().then(res => setUserID(res));

    const nextAction = _ => {
        try{
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;

            // Check if the required fields are filled
            if(!email || !username || !password || !firstName){
                return alert("Please fill in all non-optional fields!");
            }

            // Check if the password is at least 8 characters
            if(password.length < 8)
                return alert("Password must be at least 8 characters long!");

            const data = {
                email: email,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName
            };
            setUserInput(data);

            fetch("/api/authenticateuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(!data.status){
                        alert(data.message);
                    }
                    else{
                        document.getElementById("step1").style.display = "none";
                        document.getElementById("step2").style.display = "block";
                    }
                });
        }catch(error){
            return alert(error);
        }
    };
    const backAction = _ => {
        document.getElementById("step1").style.display = "block";
        document.getElementById("step2").style.display = "none";
    };
    const createAccount = _ => {
        try{
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
    const handleKeypress = e => {
        if(e.key === "Enter"){
            nextAction();
        }
    };
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
                            <input type="email" id ="email" placeholder="johndoe@gmail.com" onKeyPress={handleKeypress} defaultValue={queryParameters.get("email")} />
                        </div>
                        <div className="user-authentication-input">
                            <label htmlFor="username">Username</label>
                            <input type ="text" id="username" placeholder="John Doe" onKeyPress={handleKeypress} />
                        </div>
                        <div className="user-authentication-input password">
                            <label htmlFor="password">Password</label>
                            <input type="password" id ="password" onKeyPress={handleKeypress} />
                        </div>
                        <div className="pass">
                            <label style={{marginRight: "150px"}}>Minimum of 8 characters</label>
                        </div>
                        <div className="user-authentication-input" style={{display: "flex"}} >
                            <div className="half-input left">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id ="firstName" placeholder="John" onKeyPress={handleKeypress} />
                            </div>
                            <div className="half-input">
                                <label htmlFor="lastName">{`Last Name (optional)`}</label>
                                <input type="text" id ="lastName" placeholder="Doe" onKeyPress={handleKeypress} />
                            </div>
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
                        <div >
                            <button onClick={createAccount}> Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const addInvitation = _ => {
        const email = document.getElementById("invitation-email").value;
        if(!email)
            return alert("Please fill in the input field!");
        if(document.getElementById("invitation-list").style.display === "none"){
            document.getElementById("step2").style.height = "75vh";
            document.getElementById("step2").style.minHeight = "625px";
            document.getElementById("invitation-list").style.display = "grid";
        }
        setEmailList([...emailList, { email: email }]);
        setInvitationList([...invitationList, email]);
        document.getElementById("invitation-email").value = "";
    };
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
    const handleKeypress2 = e => {
        if(e.key === "Enter"){
            addInvitation();
        }
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