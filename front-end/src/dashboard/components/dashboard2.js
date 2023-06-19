import React, {useEffect, useState} from "react";
import "../style/dashboard2.css";
import { getUserID, logOut } from "../../App";
import { ForgotPassword } from "../../account/components/ForgotPassword";


export const Dashboard2 = _ => {
    const [userID, setUserID] = useState();
    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res)); 
        }catch(error){
            console.log(error);
        }
    }, []);
    
    if(userID === "none") return window.location.href = "/";
    return (
      <section className="dashboard2">
      <div className="dashboard2-main">
        <div className="dash">
            <a href="/" className="dash_list">
              <div className="title">
                  <ul>
                      <li id="logo" className="logo"><a href="/dashboard"><img src="./images/green_profile_logo.png" alt="logo"/>Opn.Systems</a></li>
                  </ul>
              </div>
              <hr/>
            </a>
            <hr/>
            <ul className="sidebar nav-pills">
              <li className="navigation-item">
                <a href="#" className="navigation_link">
                  <svg className="bi pe-none me-2" width="16" height="16">
                   <path/>
                  </svg>
                  Dashboard
                </a>
              </li>
             <li className="business dropdown">
                <a className="navigation_link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <rect width="16" height="16" fill="blue" /> {/* Replace with your desired icon */}
                  </svg>
                  Add Business
                </a>
              </li>
            </ul> 
            <hr />
          </div>
      </div>
    </section>
  );
};