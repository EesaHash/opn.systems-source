import React from "react";
import { Outlet } from "react-router-dom";
import "../style/header.css";

export const Header = (props) => {

    return(
        <main>
            <header>
                {props.page !== "none" && navbar(props.page)}
            </header>
            <Outlet/>
        </main>
    );
};

const navbar = (page) => {
    return(
        <div className="menu-bar">
            <ul>
                {page === "signin" || page === "signup" || page === "forgetpass"}
                <li id="logo" className="logo"><a href="/"><img src="./images/green_profile_logo.png" alt="logo"/>Opn.Systems</a></li>
            </ul>
        </div>
    );
};