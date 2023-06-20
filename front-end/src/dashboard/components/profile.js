import React from "react";
import "../style/profile.css";

export const Profile = () => {
    

    return(
        <div className="profile-header">
            <div className="notification">
                <img src="./images/bell_icon.png" alt="logo"/>
            </div>
            <div className="profile-picture">
                <img src="./images/blank_profile_picture.png" alt="logo"/>
            </div>
            <div className="profile-name">
                <h1>John</h1>
                <h2>Business Owner</h2>
            </div>
            <div class="dropdown-arrow">

            </div>
        </div>
    );
};