import React from "react";
import "./style/index.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./header/components/Header";
import { SignUp } from "./account/components/SignUp";
import { SignIn } from "./account/components/SignIn";

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
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Header/>} >
          <Route path="" element={<SignIn/>}/>
        </Route>
        <Route path="/signin" element={<Header/>} >
          <Route path="" element={<SignIn/>}/>
        </Route>
        <Route path="/signup" element={<Header/>} >
          <Route path="" element={<SignUp/>}/>
        </Route>
        <Route path="/test" element={<Header/>} >
          <Route path="" element={<SignUp/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
