import React, {useEffect, useState} from "react";
import "../style/dashboard.css";
import { getUserID } from "../../App";
export const Dashboard = _ => {
     const [userID, setUserID] = useState();

     useEffect(() => {
         try{
             getUserID().then(res => setUserID(res));
         }catch(error){
             console.log(error);
         }
     }, []);

    // if(userID === "none") return window.location.href = "/signin";
  return (
    <div>
      <header>
        <a href="https://www.instagram.com/" className="circle"></a>
        <a href="https://www.instagram.com/" className="text">Features</a>
        <a href="https://www.instagram.com/" className="text">About OPN</a>
        <a href="/SignUp" className="signup">Sign up</a>
        <a href="/SignIn" className="login">Login</a>
      </header>
      <div className="center_head">SOPs Optimized</div>
      <div className="mission">AI generated. Streamlined SOPs. Continuous improvement.<br />Your operations made Easy!</div>
    </div>
  );
};