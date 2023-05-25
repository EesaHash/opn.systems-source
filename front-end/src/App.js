import React from "react";
import "./style/index.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./header/components/Header";
import { SignUp } from "./account/components/SignUp";
import { SignIn } from "./account/components/SignIn";

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
      </Routes>
    </div>
  );
}

export default App;
