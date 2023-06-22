import React, { useEffect, useState } from "react";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/dashboard_main.css";
import "../style/pane.css";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search";
import { Pane } from "../components/pane";
import { Profile } from "../components/profile";
import { getUserID } from "../../App";
import { CreateBusiness } from "../../business/components/createBusiness";

export const DashboardPage = () => {
    const [userID, setUserID] = useState();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [activeLink, setActiveLink] = useState('');
    const [activeLink2, setActiveLink2] = useState('');

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try{
            setLoading(true);
            const getUserData = async _ => {
                const res = await fetch("/api/getuserdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: userID
                    })
                });
                const data = await res.json();
                if(data.status){
                    setUser(data.user);
                    setLoading(false);
                }else{
                    alert(data.message);
                }
            };
            if(userID != null && userID !== "none") getUserData();
        }catch(error){
            console.log(error);
        }
    }, [userID]);
    
    if(userID === "none") return window.location.href = "/";
    return (
        <div className="background">
            <div id="bash" className="bash">
                <Sidebar businesses = {businesses} activeLink = {activeLink} setActiveLink = {setActiveLink} activeLink2 = {activeLink2} setActiveLink2 = {setActiveLink2} />
            </div>
            {!loading &&
                <div>
                    <CreateBusiness businesses = {businesses} setBusinesses = {setBusinesses} />
                    <div id="dashboard-content">
                        <div style={{display: "flex"}}>
                            <div className="search">
                                <SearchBar />
                            </div>
                            <div className="profile">
                                <Profile user = {user} />
                            </div>
                        </div>
                        <div className="pane">
                            <Pane createNewBusinessForm = {createNewBusinessForm} businesses = {businesses} activeLink = {activeLink} activeLink2 = {activeLink2} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export const createNewBusinessForm = _ => {
    document.getElementById("createAccountForm").style.display = "block";
    openPopUpForm();
};
const openPopUpForm = _ => {
    document.getElementById("bash").style.opacity = "0.5";
    document.getElementById("dashboard-content").style.opacity = "0.5";
    document.getElementById("bash").style.filter = "blur(3px)";
    document.getElementById("dashboard-content").style.filter = "blur(3px)";
};
export const closePopUpForm = _ => {
    document.getElementById("bash").style.removeProperty("opacity");
    document.getElementById("dashboard-content").style.removeProperty("opacity");
    document.getElementById("bash").style.removeProperty("filter");
    document.getElementById("dashboard-content").style.removeProperty("filter");
};