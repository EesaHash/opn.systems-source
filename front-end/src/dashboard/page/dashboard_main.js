// Import necessary dependencies and styles
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

/**
 * Component for rendering the main dashboard page.
 */
export const DashboardPage = () => {
    // States to manage user data and various dashboard-related data
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

    // Fetch user ID when the component mounts
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Fetch user data and business list based on the user ID
    useEffect(() => {
        try {
            setLoading(true);
            const getUserData = async () => {
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
                if (data.status) {
                    setUser(data.user);
                    setLoading(false);
                } else {
                    alert(data.message);
                }
            };

            const getBusinessList = async () => {
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
                if (data.status) {
                    setBusinesses(data.businesses);
                } else {
                    alert(data.message);
                }
            };

            if (userID != null && userID !== "none") {
                getUserData();
                getBusinessList();
            }
        } catch (error) {
            console.log(error);
        }
    }, [userID]);

    // Fetch client journeys from the database when the products change
    useEffect(() => {
        try {
            setLoading(true);
            const getProduct = async () => {
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

    // Reset journeys when the second active link changes
    useEffect(() => {
        setJourneys([]);
    }, [activeLink2]);

    // Fetch client journeys based on the products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchJourney = async (productID, list) => {
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
                        list.push(data.clientJourney);
                    }
                };

                const list = [];
                for (const item of products) {
                    await fetchJourney(item.id, list)
                }
                setJourneys(list);
                setLoading(false);
            } catch (error) {
                alert(error);
            }
        };

        fetchData();
    }, [products]);

    // Redirect to the home page if the userID is not found
    if (userID === "none") return window.location.href = "/";

    // Render the dashboard components
    return (
        <div id="background" className="background">
            <div id="bash" className="bash">
                <Sidebar
                    loading={loading}
                    businesses={businesses}
                    activeLink={activeLink}
                    setActiveLink={setActiveLink}
                    activeLink2={activeLink2}
                    setActiveLink2={setActiveLink2}
                />
            </div>
            {!loading &&
                <div>
                    {/* Components that might be conditionally displayed */}
                    <AccessLimit />
                    <FutureFeature />
                    <GenerateProcedure documentName={business.businessName} />
                    <AccountSetting
                        user={user}
                        setUser={setUser}
                    />
                    <CreateBusiness businesses={businesses} setBusinesses={setBusinesses} userID={userID} />
                    <CreateClientJourney
                        products={products} setProducts={setProducts}
                        journeys={journeys} setJourneys={setJourneys}
                        business={business}
                    />
                    <CreateProcedure
                        procedures={procedures} setProcedures={setProcedures}
                    />
                    <InviteTeamMember />

                    {/* Main dashboard content */}
                    <div id="dashboard-content" className="dashboard-content">
                        <div id="dashboard-heading" style={{ display: "flex" }}>
                            {/* Search bar component */}
                            <div className="search">
                                <SearchBar />
                            </div>
                            {/* Profile component */}
                            <div className="profile">
                                <Profile user={user} />
                            </div>
                        </div>
                        {/* Pane component */}
                        <div className="pane">
                            <Pane
                                business={business} setBusiness={setBusiness}
                                businesses={businesses} setBusinesses={setBusinesses}
                                activeLink={activeLink}
                                activeLink2={activeLink2} setActiveLink2={setActiveLink2}
                                activeLink3={activeLink3} setActiveLink3={setActiveLink3}
                                user={user}
                                journeys={journeys} setJourneys={setJourneys}
                                procedures={procedures} setProcedures={setProcedures}
                                policies={policies} setPolicies={setPolicies}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

// Functions to handle form display, might be used elsewhere in the code
export const openAccessLimitForm = () => {
    document.getElementById("access-limit-form").style.display = "block";
};

export const openFutureFeatureWarningForm = () => {
    document.getElementById("future-feature-warning-form").style.display = "block";
};

export const createNewBusinessForm = (businesses) => {
    // if(businesses.length > 0)
    //     return openAccessLimitForm();
    document.getElementById("createAccountForm").style.display = "block";
};
