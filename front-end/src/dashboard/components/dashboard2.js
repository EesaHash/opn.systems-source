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
        <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px' , height: '100vh' }}>
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <svg className="sidebar">
              <use xlinkHref="https://www.instagram.com/"></use>
            </svg>
            <span className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              Opn. Systems
            </span>
          </a>
          <hr/>
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <a href="#" className="nav-link active" aria-current="page">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#home"></use>
                </svg>
                Dashboard
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#speedometer2"></use>
                </svg>
                Add Business
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Business 1</a></li>
                <li><a className="dropdown-item" href="#">Business 2</a></li>
              </ul>
            </li>
          </ul>
          <hr />
        </div>
      </div>
    </section>
  
  );
};