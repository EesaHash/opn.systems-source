import React, {useEffect, useState} from "react";
import "../style/dashboard.css";
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




  return (
    <div className = "page" style={{overflow: "scroll"}}>
        <div className="ricky">
          <div className="header">
           <a href="https://www.instagram.com/" className="circle"></a>
           <a href="https://www.instagram.com/" className="text">Features</a>
           <a href="https://www.instagram.com/" className="text">About OPN</a>
           {varLink(userID, setUserID)}
          </div>
          <div className="center_head">SOPs Optimized</div>
          <div className="mission">AI generated. Streamlined SOPs. Continuous improvement.<br />Your operations made Easy!</div>
          <div>
            
          </div>
        </div>
    </div>
  );
};