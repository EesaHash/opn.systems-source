import React from "react";
import "./style/index.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./header/components/Header";
import { SignUp } from "./account/components/SignUp";
import { SignIn } from "./account/components/SignIn";
import { ForgotPassword } from "./account/components/ForgotPassword";
import { Homepage } from "./homepage/component/homepage";
import { DashboardPage } from "./dashboard/page/dashboard_main";

export const getUserID = _ => {
    let token;
    if (localStorage.getItem("rememberMe") === "true")
        token = localStorage.getItem("u");
    else
        token = sessionStorage.getItem("u");
    return fetch("/api/authenticatelogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: token
        })
    })
    .then((res) => res.json())
    .then((data) => {
        return String(data.userID);
    })
    .catch(error => {
        console.log(error);
        return "none";
    });
};
export const logOut = _ => {
    sessionStorage.removeItem("u");
    localStorage.removeItem("u");
    localStorage.removeItem("rememberMe");
    window.location.href = "/";
};
export const getBusinessTypeList = _ => {
    return ["Private", "Public", "For-Profit", "Non-Profit"];
};
export const getCompanySizeList = _ => {
    return ["Startup", "Small-Scale", "Medium-Scale", "Large-Enterprise"];
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="*" element={<Header page="homepage"/>} >
                    <Route path="" element={<Homepage/>}/>
                </Route>
                <Route path="/dashboard" element={<Header page="none"/>} >
                    <Route path="" element={<DashboardPage/>}/>
                </Route>
                <Route path="/signin" element={<Header page="signin"/>} >
                    <Route path="" element={<SignIn/>}/>
                </Route>
                <Route path="/signup" element={<Header page="signup"/>} >
                    <Route path="" element={<SignUp/>}/>
                </Route>
                <Route path="/forgotpassword" element={<Header page="forgetpass"/>} >
                    <Route path="" element={<ForgotPassword/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
