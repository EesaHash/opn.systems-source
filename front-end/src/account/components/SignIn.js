import React, {useState} from "react";
import "../style/account.css";

export const SignIn = _ => {
    const signIn = _ => {

    };
    return(
        <div className = "page">
            <div className = "cover">
                <div className = "sign-in">
                    <div className="content">
                        <div className ="user-authentication">
                            <h1>Login</h1>
                            <form onSubmit={signIn}>
                                <div className="user-authentication-input">
                                    <label html="email">Email Address</label>
                                    <input type="email" placeholder="johndoe@gmail.com" id ="email"></input>
                                </div>
                                <div className="user-authentication-input">
                                    <div>
                                        <label html="password">Password</label>
                                        <button className="forgot-password" href="#forgotpassword" onClick={forgetPassword} >Forget your password?</button>
                                    </div>
                                    <input type="password" id ="password"/>
                                </div>
                            </form>
                            <div>
                            <button type ="submit"> Sign In</button>
                            </div>
                            <div>
                                <label style={{marginRight: "5px"}} >New to opn.systems?</label>
                                <a href="/signup">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
};

const forgetPassword = _ => {

};