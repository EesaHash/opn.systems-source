import React from "react";
import { Outlet } from "react-router-dom";
import "../style/header.css";

/**
 * Component for rendering the header section of the application.
 *
 * @param {Object} props - Props passed to the Header component.
 * @param {string} props.page - The current page or route.
 */
export const Header = (props) => {
    return (
        <main>
            <header>
                {/* Conditionally render the header content based on the current page */}
                {props.page === "homepage" && homepageHeader()}
                {(props.page === "signin" || props.page === "signup" || props.page === "forgetpass") && otherHeader()}
            </header>
            {/* Render the outlet content (nested routes) */}
            <Outlet />
        </main>
    );
};

/**
 * Component for rendering the header content on the homepage.
 */
const homepageHeader = () => {
    return (
        <div className="menu-bar">
            <ul>
                <li style={{ marginTop: "1vh" }} id="logo" className="logo">
                    <a href="/">
                        <img src="./images/green_profile_logo.png" alt="logo" />
                    </a>
                </li>
                <li style={{ marginTop: "2.2vh" }}>
                    <a href="#page-2">Features</a>
                </li>
                <li style={{ marginTop: "2.2vh" }}>
                    <a href="#page-2">About OPN</a>
                </li>
                <div className="right-header">
                    <a href="/SignUp" className="signup">
                        Sign up
                    </a>
                    <a href="/SignIn" className="login">
                        Login
                    </a>
                </div>
            </ul>
        </div>
    );
};

/**
 * Component for rendering the header content on other pages (sign-in, sign-up, forget password).
 */
const otherHeader = () => {
    return (
        <div className="menu-bar" style={{ backgroundColor: "transparent" }}>
            <ul>
                <li id="logo" className="logo">
                    <a href="/">
                        <img src="./images/green_profile_logo.png" alt="logo" />
                        Opn.Systems
                    </a>
                </li>
            </ul>
        </div>
    );
};
