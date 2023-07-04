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
import { EditBusinessDetail } from "../../business/components/editBusinessDetail";
import { CreateClientJourney } from "../../client_journey/components/createClientJourney";
import { ModifyAccountDetails } from "../components/account_settings";
import { AccessLimit } from "../../warning_pages/components/AccessLimit";
import { FutureFeature } from "../../warning_pages/components/FutureFeature";
import { CreateProcedure } from "../../client_journey/components/CreateProcedure";

export const DashboardPage = () => {
    const [userID, setUserID] = useState();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [business, setBusiness] = useState({});
    const [businesses, setBusinesses] = useState([]);
    const [activeLink, setActiveLink] = useState('');
    const [activeLink2, setActiveLink2] = useState(0);
    const [activeLink3, setActiveLink3] = useState('Overview');
    const [journeys, setJourneys] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [policies, setPolicies] = useState([]);

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
            const getBusinessList = async _ => {
                const res = await fetch("/api/business/getAllBusinesses", {
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
                    setBusinesses(data.businesses);
                }else{
                    alert(data.message);
                }
            };
            if(userID != null && userID !== "none"){
                getUserData();
                getBusinessList();
            }
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    useEffect(() => {
        try{
            setLoading(true);
            const getClientJourneyList = async _ => {
                const res = await fetch("/api/clientjourney/getall", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        businessId: business.id
                    })
                });
                const data = await res.json();
                console.log(data);
                if(data.status){
                    setJourneys(data.clientJourneys);
                    setLoading(false);
                }
            };
            if(business.id)
                getClientJourneyList();
        }catch(error){
            alert(error);
        }
    }, [business])
    
    if(userID === "none") return window.location.href = "/";
    return (
        <div className="background">
            <div id="bash" className="bash">
                <Sidebar
                    loading = {loading}
                    businesses = {businesses} 
                    activeLink = {activeLink}   setActiveLink = {setActiveLink} 
                    activeLink2 = {activeLink2} setActiveLink2 = {setActiveLink2}
                />
            </div>
            {!loading &&
            <div>
                <AccessLimit/>
                <FutureFeature/>
                <ModifyAccountDetails
                    user = {user}
                    setUser = {setUser}
                />
                <CreateBusiness businesses = {businesses} setBusinesses = {setBusinesses} userID = {userID} />
                <EditBusinessDetail 
                    businesses = {businesses} setBusinesses = {setBusinesses} 
                    index = {activeLink2 - 1}
                    business = {business} setBusiness = {setBusiness}
                />
                <CreateClientJourney  
                    journeys = {journeys} setJourneys = {setJourneys}
                    business = {business}
                />
                <CreateProcedure
                    procedures = {procedures} setProcedures = {setProcedures}
                />
                <div id="dashboard-content" className="dashboard-content">
                    <div style={{display: "flex"}}>
                        <div className="search">
                            <SearchBar />
                        </div>
                        <div className="profile">
                            <Profile user = {user} />
                        </div>
                    </div>
                    <div className="pane">
                        <Pane 
                            business = {business} setBusiness = {setBusiness}
                            businesses = {businesses} setBusinesses = {setBusinesses} 
                            activeLink = {activeLink} 
                            activeLink2 = {activeLink2} setActiveLink2 = {setActiveLink2}
                            activeLink3 = {activeLink3} setActiveLink3 = {setActiveLink3} 
                            user = {user} 
                            journeys = {journeys} setJourneys = {setJourneys}
                            procedures = {procedures} setProcedures = {setProcedures}
                            policies = {policies} setPolicies = {setPolicies}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export const openAccessLimitForm = _ => {
    document.getElementById("access-limit-form").style.display = "block";
    openPopUpForm();
};
export const openFutureFeatureWarningForm = _ => {
    document.getElementById("future-feature-warning-form").style.display = "block";
    openPopUpForm();
};
export const createNewBusinessForm = (businesses) => {
    if(businesses.length > 0)
        return openAccessLimitForm();
    document.getElementById("createAccountForm").style.display = "block";
    openPopUpForm();
};
export const openPopUpForm = _ => {
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