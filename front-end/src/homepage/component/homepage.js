import React, { useState } from "react";
import "../style/homepage.css";
import { getUserID } from "../../App";
import CcfImage from '../svg/ccfImage';

/**
 * Component for rendering the homepage of the application.
 */
export const Homepage = () => {
    const [userID, setUserID] = useState("none");

    // Fetch user ID and set the state
    getUserID().then(res => setUserID(res));

    // Function to handle sign-up process
    const signUp = () => {
        window.location.href = `/signup?email=${document.getElementById("email").value}`
    };

    // Function to handle Enter key press for the sign-up input
    const handleKeypress = e => {
        if(e.key === "Enter"){
            signUp();
        }
    };

    // If user ID is available, redirect to the dashboard page
    if(userID !== "none") return window.location.href = "/dashboard";

    return (
        <div className="homepage">
            <div className="homepage-body">
                {/* Page 1: SOPs. Optimized. */}
                <div className="page-1">
                    <h1>SOPs. Optimized.</h1>
                    <h3>{`AI generated. Streamlined SOPs. Continuous improvement.\nYour operations made Easy!`}</h3>
                    <div className="free-trial">
                        <div className="form-floating">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email Address"
                                onKeyPress={handleKeypress}
                            />
                            <label style={{ fontSize: "100%" }} htmlFor="floatingInput">Email Address</label>
                        </div>
                        <button style={{ fontSize: "100%" }} onClick={signUp}>{`Start your free trial >`}</button>
                    </div>
                </div>

                {/* Page 2: Trusted by various companies, AI Driven, Customizable, Seamless Integration */}
                <div className="page-2" id="page-2">
                    {/* Trusted by various companies */}
                    <div className="sponsor">
                        <h3>Trusted by various companies</h3>
                        <div className="sponsor-list">
                            <img src="./images/green_logo.png" alt="logo"/>
                            <img src="./images/blue_logo.png" alt="logo" />
                            <img src="./images/green_logo.png" alt="logo" />
                            <img src="./images/blue_logo.png" alt="logo" style={{marginRight: "0"}} />
                        </div>
                    </div>

                    {/* AI Driven */}
                    <div className="ai-driven">
                        <h1>AI Driven</h1>
                        <h2>Regeneration</h2>
                        <h3 style={{fontSize:"2vw"}}>AI generated. Streamlined SOPs. Continuous improvement.<br/>Your improved operations.</h3>
                        <div className="ai-driven-content">
                            <div className="ai-driven-content-1" style={{backgroundColor: "transparent"}}> <CcfImage/></div>
                            <div className="ai-driven-msg">
                                <h3 style={{color:"white"}}>Client Journey creation made easy</h3>
                                <hr></hr>
                                <text>Let our highly-trained and adaptive AI takes care of the rest while you sit back and relax.</text>
                            </div>
                        </div>
                    </div>

                    {/* Customizable Customer Journey */}
                    <div className="customer-journey">
                        <h1>Customizable</h1>
                        <h2>Customer Journey.</h2>
                        <h3>AI generated. Streamlined SOPs. Continuous improvement.<br/>Your improved operations.</h3>
                        <div className="customer-journey-content">
                            <div className="customer-journey-content-1"></div>
                            <div className="customer-journey-content-2"></div>
                        </div>
                    </div>

                    {/* Seamless Integration */}
                    <div className="integration">
                        <did className="integration-title">
                            <h1>Seamless</h1>
                            <h2>Integration.</h2>
                        </did>
                        <h3>AI generated. Streamlined SOPs. Continuous improvement.<br/>Your improved operations.</h3>
                        <div className="integration-content">
                            <div className="integration-content-row">
                                <div className="text"><img src="./images/github.png" alt="logo"/>GitHub</div>
                                <div className="text"><img src="./images/google_sheets.png" alt="logo"/>Google Sheets</div>
                                <div className="text"><img src="./images/slack.png" alt="logo"/>Slack</div>
                            </div>
                            <div className="integration-content-row">
                                <div className="text"><img src="./images/g_drive.png" alt="logo"/>Google Drive</div>
                                <div className="text"><img src="./images/teams.png" alt="logo"/>Microsoft Teams</div>
                            </div>
                            <div className="integration-content-row">
                                <div className="text"><img src="./images/google_calendar.png" alt="logo"/>Google Calendar</div>
                                <div className="text"><img src="./images/google_calendar.png" alt="logo"/>Google Calendar</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page 4: More plans */}
                <div className="page-4">
                    <h1>Think that you might need more?</h1>
                    <h3>AI generated. Streamlined SOPs. Continuous improvement.<br/>Your improved operations. Your improved operations.</h3>
                    <div style={{margin: "50px 0"}}>
                        <a href="mailto:support@opn.systems">Talk to our consultant</a>
                    </div>
                    <div className="plan-list">
                        {/* Plan: Basic */}
                        <div className="plan-content">
                            <h2>Basic</h2>
                            <h1 style={{filter:"blur(9px)"}}>12$</h1>
                            <h3 style={{filter:"blur(9px)"}}>{`Billed annually (1$ if billed monthly)`}</h3>
                            <p>For business owners that need to automate their business SOPs.</p>
                            <button onClick={e => window.location.href = "signup"}>Get Started</button>
                        </div>
                        {/* Plan: Pro */}
                        <div className="plan-content">
                            <h2>Pro</h2>
                            <h1 style={{filter:"blur(9px)"}}>$24</h1>
                            <h3 style={{filter:"blur(9px)"}}>{`Billed annually (2$ if billed monthly)`}</h3>
                            <p>For small teams that need to manage work and scale collaboration.</p>
                            <button onClick={e => window.location.href = "signup"}>Get Started</button>
                        </div>
                        {/* Plan: Enterprise */}
                        <div className="plan-content" style={{marginRight: "0"}}>
                            <h2>Enterprise</h2>
                            <h1 style={{filter:"blur(9px)"}}>48$</h1>
                            <h3 style={{filter:"blur(9px)"}}>{`Billed annually (4$ if billed monthly)`}</h3>
                            <p>For large enterprises that need to manage work and scale collaboration.</p>
                            <button onClick={e => window.location.href = "signup"}>Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
