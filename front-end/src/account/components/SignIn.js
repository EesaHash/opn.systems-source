import React from "react";

export const SignIn = _ => {
    return(
        <section>
            <div className="form-floating">
                <input type="email" className="form-control" id="email" placeholder="email" />
                <label for="email">Email Address</label>
            </div>
            <div className="checkbox mb-3">
                <input type="checkbox" value="remember-me"/> Remember me for the next 7 days <br/>
                <button style={{backgroundColor: "transparent"}} onClick={forgetPassword} >Forget Password</button>
            </div>
        </section>
    );
};

const forgetPassword = _ => {
    try{
        const email = document.getElementById("email").value;
        fetch("/api/forgetpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then((res) => {return res.json(); })
            .then((data) => {
                alert(data.message);
            });
    }catch(error){
        console.log(error);
    }
};