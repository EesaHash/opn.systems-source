import React, { useEffect, useState } from "react";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/dashboard_main.css";
import "../style/pane.css";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search";
import { Pane } from "../components/pane";
import { getUserID } from "../../App";
import { CreateBusiness } from "../../business/components/createBusiness";
import { CreateClientJourney } from "../../client_journey/components/createClientJourney";
import { AccessLimit } from "../../warning_pages/components/AccessLimit";
import { FutureFeature } from "../../warning_pages/components/FutureFeature";
import { CreateProcedure } from "../../cj_procedure/components/CreateProcedure";
import { InviteTeamMember } from "../../client_journey/components/InviteTeamMember";
import { GenerateProcedure } from "../../cj_procedure/components/GenerateProcedure";
import { AccountSetting } from "../../account/components/AccountSetting";
import { Profile } from "../../account/components/Profile";

export const DashboardPage = () => {
    const [userID, setUserID] = useState();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [business, setBusiness] = useState({});
    const [businesses, setBusinesses] = useState([]);
    const [products, setProducts] = useState([]);
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

    // Get client journeys from database
    useEffect(() => {
        try{
            setLoading(true);
            const getProduct = async _ => {
                setProducts([]);
                const res = await fetch("/api/product/getall", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        businessID: business.id
                    })
                })
                const data = await res.json();
                console.log(data);
                if(data.status){
                    setProducts(data.products);
                }
            };
            setProducts([]);
            if(business.id){
                getProduct();
            }
        }catch(error){
            alert(error);
        }
    }, [business.id]);

    useEffect(() => {
        setJourneys([]);
    }, [activeLink2]);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const fetchJourney = async (productID) => {
                const res = await fetch("/api/clientjourney/get", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productID: productID
                    })
                });
                const data = await res.json();
                console.log(data);
                if (data.status) {
                    return data.clientJourney;
                } else {
                    return null;
                }
            };
            const list = [];
            for (const item of products) {
                list.push(await fetchJourney(item.id));
            }
            setJourneys(list);
            setLoading(false);
          } catch (error) {
            alert(error);
          }
        };
    
        fetchData();
      }, [products]);
    
    if(userID === "none") return window.location.href = "/";
    return (
        <div id = "background" className="background">
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
                <GenerateProcedure documentName = {business.businessName} />
                <AccountSetting
                    user = {user}
                    setUser = {setUser}
                />
                <CreateBusiness businesses = {businesses} setBusinesses = {setBusinesses} userID = {userID} />
                <CreateClientJourney  
                    products = {products} setProducts = {setProducts}
                    journeys = {journeys} setJourneys = {setJourneys}
                    business = {business}
                />
                <CreateProcedure
                    procedures = {procedures} setProcedures = {setProcedures}
                />
                <InviteTeamMember />
                <div id="dashboard-content" className="dashboard-content">
                    <div id="dashboard-heading" style={{display: "flex"}}>
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
};
export const openFutureFeatureWarningForm = _ => {
    document.getElementById("future-feature-warning-form").style.display = "block";
};
export const createNewBusinessForm = (businesses) => {
    // if(businesses.length > 0)
    //     return openAccessLimitForm();
    document.getElementById("createAccountForm").style.display = "block";
};