import React from "react";
import "../style/profile.css";
import { logOut } from "../../App";
import MeetingRoom from '@mui/icons-material/MeetingRoom';
import { Logout } from "@mui/icons-material";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import { openPopUpForm } from "../page/dashboard_main";

const openAccountSettingForm = _ => {
  document.getElementById("account-setting-Form").style.display = "block";
  openPopUpForm();
}

export const Profile = (props) => {
    return(
        <div className="profile-header">
        <div className="profile-picture">
          {props.user && props.user.first_name && (
            <div className="profile_in">{`${props.user.first_name.charAt(0)}${props.user.last_name ? props.user.last_name.charAt(0) : ""}`}</div>
          )}
        </div>
          <div className="profile-name">
              <h1>{props.user && `${props.user.first_name}`}</h1>
              <h2>Business Owner</h2>
          </div>
          <div className="dropdown-arrow-area">
              <div className="dropdown-arrow">
              <div className="dropdown-content">
                  <button onClick={logOut}><TuneSharpIcon/>Admin Console</button>
                  <button onClick={openAccountSettingForm}><SettingsRoundedIcon/>Account Settings</button>
                  <button onClick={null} ><NotificationsSharpIcon/>Notifications</button>
                  <a href="/" onClick={logOut} style={{ color: 'red' }}><MeetingRoom/>Log Out</a>
              </div>
              </div>
          </div>
    </div>

    );
};