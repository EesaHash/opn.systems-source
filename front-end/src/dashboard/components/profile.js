import React from "react";
import "../style/profile.css";
import { logOut } from "../../App";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import { Logout } from "@mui/icons-material";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import { ModifyAccountDetails } from "./account_settings";

export const Profile = (props) => {
    return(
        <div className="profile-header">
        <div className="profile-picture">
          {props.user && props.user.username && (
            <div className="profile_in">{props.user.username.charAt(0)}</div>
          )}
        </div>
          <div className="profile-name">
              <h1>{props.user && props.user.username}</h1>
              <h2>Business Owner</h2>
          </div>
          <div className="dropdown-arrow-area">
              <div className="dropdown-arrow">
              <div className="dropdown-content">
                  <a href="/" onClick={logOut}><TuneSharpIcon/>Admin Console</a>
                  <a href="/" onClick={ModifyAccountDetails}><SettingsRoundedIcon/>Account Settings</a>
                  <a href="/" onClick={logOut} ><NotificationsSharpIcon/>Notifications</a>
                  <a href="/" onClick={logOut} style={{ color: 'red' }}><MeetingRoom/>Log Out</a>
              </div>
              </div>
          </div>
    </div>

    );
};