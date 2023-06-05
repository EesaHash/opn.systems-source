import React, {useState} from "react";

export const SignUp = _ => {
    const createAccount = _ => {

    };
    return(
        <div className = "page">
            <div className = "cover">
                <div className = "sign-up">
                    <div className="content">
                        <div className ="user-authentication" style={{height: "80%", width: "100%", overflow: "scroll"}}>
                            <h1>Create Account</h1>
                            <form onSubmit={createAccount}>
                                <div className="user-authentication-input">
                                    <label htmlFor="name">Username</label>
                                    <input name ="name" id="name" placeholder=""></input>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id ="email"></input>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id ="password"/>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" id ="firstName"/>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id ="password"/>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="contactNumber">Contact Number</label>
                                    <input type="text" id ="contactNumber"/>
                                </div>
                                <div className="user-authentication-input">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input type="date" id ="dob"/>
                                </div>
                            </form>
                            <div>
                                <button type ="submit"> Sign Up</button>
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