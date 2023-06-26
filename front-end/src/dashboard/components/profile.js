import React from "react";
import "../style/profile.css";
import { logOut } from "../../App";
import MeetingRoom from '@mui/icons-material/MeetingRoom';

export const Profile = (props) => {
    return(
        <div className="profile-header">
            <div className="profile-picture">
                <img src="./images/blank_profile_picture.png" alt="logo"/>
            </div>
            <div className="profile-name">
                <h1>{props.user.username}</h1>
                <h2>Business Owner</h2>
            </div>
            <div class="dropdown-arrow">
                <div className="profile-dropdown-content">
                    <a href="/" onClick={logOut}><MeetingRoom/>Log Out</a>
                </div>
            </div>
        </div>
    );
};