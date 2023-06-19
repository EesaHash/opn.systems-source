import React from "react";
import { Outlet } from "react-router-dom";
import "../style/header.css";

export const Header = (props) => {

    return(
        <main>
            <header>
                {props.page === "homepage" && homepageHeader()}
                {(props.page === "signin" || props.page === "signup" || props.page === "forgetpass") && otherHeader()}
            </header>
            <Outlet/>
        </main>
    );
};

const homepageHeader = _ => {
    return(
        <div className="menu-bar" style={{backgroundColor: "transparent"}}>
            <ul>
                <li id="logo" className="logo"><a href="/"><img src="./images/green_profile_logo.png" alt="logo"/></a></li>
                <li><a href="#page-2">Features</a></li>
                <li><a href="#page-2">About OPN</a></li>
                <div className="right-header">
                    <a href="/SignUp" className="signup">Sign up</a>
                    <a href="/SignIn" className="login">Login</a>
                </div>
            </ul>
        </div>
    );
};
const otherHeader = _ => {
    return(
        <div className="menu-bar" style={{backgroundColor: "#030C14"}}>
            <ul>
                <li id="logo" className="logo"><a href="/"><img src="./images/green_profile_logo.png" alt="logo"/>Opn.Systems</a></li>
            </ul>
        </div>
    );
};