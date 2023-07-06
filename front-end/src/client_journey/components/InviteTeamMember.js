import React, { useState } from 'react';
import "../style/TeamMembers.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';
import { teamMemberInputElements } from '../../business/components/createBusiness';

export const InviteTeamMember = (props) => {
    const [teamList, setTeamList] = useState([]);
    const handleKeypress = e => {
        if(e.key === "Enter"){
            addTeamMember();
        }
    };
    const addTeamMembertoDatabase = _ => {
        
    };
    const addTeamMember = _ => {
        try{
            const email = document.getElementById("invite-team-member-email").value;
            const role = document.getElementById("invite-team-member-role").value;
            if(!email || !role)
                return alert("Please fill in all fields!");
            if(teamMemberExist(email, role) === 1)
                return alert("Team member already exists with the same role!");
            setTeamList([...teamList, { email: email, role: role }]);
            document.getElementById("invite-team-member-email").value = "";
            document.getElementById("invite-team-member-role").value = "";
        }catch(error){
            alert(error);
        }
    };
    const teamMemberExist = (email, role) => {
        let res = 0;
        teamList.every((item, index) => {
            if(String(item.email).toLowerCase() === String(email).toLowerCase() && String(item.role).toLowerCase() === String(role).toLowerCase()){
                res = 1;
                return false;
            }
            return true;
        });
        return res;
    };
    const removeTeamMember = (index) => {
        const list = [...teamList];
        list.splice(index, 1);
        setTeamList(list);
    };
    const closeForm = _ => {
        setTeamList([]);
        document.getElementById("invite-team-member-form").style.display = "none";
        closePopUpForm();
    };
    return(
        <section id="invite-team-member-form" className="form-popup center form-container create-form">
            <div className='content-form'>
                <h2>Add Member</h2>
                <hr/>
                <h1>Team Members</h1>
                <div className="pop-up-input">
                    <div className="team-member-input">
                        <input 
                            type="email" 
                            id ="invite-team-member-email" 
                            placeholder="Add team member's email"
                            className="email-input"
                            onKeyPress={handleKeypress} 
                        />
                        <input 
                            type="text" 
                            id ="invite-team-member-role" 
                            placeholder="Role" 
                            style={{marginLeft: "20px", width: "20%"}}
                            onKeyPress={handleKeypress} 
                        />
                        <button onClick={addTeamMember}>Add</button>
                    </div>
                    {teamList.map((data, index) => (
                        teamMemberInputElements(teamList, setTeamList, index, removeTeamMember)
                    ))}
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button onClick={addTeamMembertoDatabase} >Add</button>
                </div>
            </div>
        </section>
    );
};