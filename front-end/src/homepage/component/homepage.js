import React, { useState } from "react";
import "../style/homepage.css";
import { getUserID } from "../../App";

function SignOut(setUserID) {
  setUserID("none");
}

function varLink(userID,setUserID) {
    if (userID === "none") {
        return (
            <>
            <div className="buttons">
            <a href="/SignUp" className="signup">Sign up</a>
            <a href="/SignIn" className="login">Login</a>
            </div>
            </>
        );
    }
    else {
        return <button onClick={(SignOut(setUserID))} className="signout">Sign Out
        </button>
    }

}

export const Dashboard = _ => {
     const [userID, setUserID] = useState();
     useEffect(() => {
         try{
             getUserID().then(res => setUserID(res)); 
         }catch(error){
             console.log(error);
         }
     }, []);

    //  if (userID === "none") {
    //     return window.location.href = "/SignIn"
    //  }

//style={{overflow: "scroll"}} for scrolling
export const Homepage = _ => {
  const [userID, setUserID] = useState("none");
  getUserID().then(res => setUserID(res));

  if(userID !== "none") return window.location.href = "/dashboard"
  return (
    <div className = "page"> 
        <div className="ricky">
          <div className="header">
           <div className="circle"></div>
          <a href="https://www.instagram.com/" className="text">Features</a>
          <a href="https://www.instagram.com/" className="text">About OPN</a>
           <div className="buttons">
            <a href="/SignUp" className="signup">Sign up</a>
            <a href="/SignIn" className="login">Login</a>
          </div>
          </div>
          <div className="center_head">SOPs Optimized</div>
          <div className="mission">AI generated. Streamlined SOPs. Continuous improvement.<br />Your operations made Easy!</div>
          <div className="page_1">
          </div>
          <div className="page_2"></div>
          <div className="page_3"></div>
          <div className="page_4"></div>
        </div>
    </div>
  );
};