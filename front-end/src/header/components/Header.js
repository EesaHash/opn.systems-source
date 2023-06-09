import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getUserID } from "../../App";
import "../style/header.css";

export const Header = (props) => {
    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    return(
        <main>
            <header>
                {props.page !== "none" && navbar(props.page)}
            </header>
            <div id="content" className="content">
                <Outlet/>
            </div>
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