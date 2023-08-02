import React, { useState } from "react";
import "../style/profile.css";
import { logOut } from "../../App";
// eslint-disable-next-line
import { ArrowForwardIos, KeyboardArrowDown, KeyboardArrowUp, Logout, Notifications, Settings } from "@mui/icons-material";

export const Profile = (props) => {
    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState("");
    const openAccountSettingForm = _ => {
        document.getElementById("account-setting-Form").style.display = "block";
        setDropdownStatus(false);
    };
    const profileDropwdownAction = _ => {
        setDropdownStatus(!dropdownStatus);
    };
    return (
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
            <button className="profile-dropdown-menu" onClick={profileDropwdownAction} >{dropdownStatus ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}</button>
            { dropdownStatus &&
                <div className="dropdown-content">
                    <button onClick={openAccountSettingForm} onMouseEnter={() => setHoveredMenu("account-setting")} onMouseLeave={() => setHoveredMenu("")} ><Settings /> Account Settings {hoveredMenu === "account-setting" && <ArrowForwardIos className="hover-arrow"/> } </button>
                    {/* <button onClick={null} onMouseEnter={() => setHoveredMenu("notification")} onMouseLeave={() => setHoveredMenu("")} ><Notifications /> Notifications {hoveredMenu === "notification" && <ArrowForwardIos className="hover-arrow"/> } </button> */}
                    <a href="/" onClick={logOut} style={{ color: 'red' }} onMouseEnter={() => setHoveredMenu("logout")} onMouseLeave={() => setHoveredMenu("")} ><Logout />Log Out  {hoveredMenu === "logout" && <ArrowForwardIos className="hover-arrow"/> } </a>
                </div>
            }
        </div>

    );
};