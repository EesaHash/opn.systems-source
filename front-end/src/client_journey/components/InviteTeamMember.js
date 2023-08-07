import React, { useState } from 'react';
import "../style/TeamMembers.css";
import { teamMemberInputElements } from '../../business/components/createBusiness';

/**
 * Component to invite team members.
 * 
 * @param {object} props - Component props.
 * @returns {JSX.Element} - The rendered InviteTeamMember component.
 */
export const InviteTeamMember = (props) => {
    // State to store the list of team members
    const [teamList, setTeamList] = useState([]);

    // Handler for Enter key press event
    const handleKeypress = e => {
        if (e.key === "Enter") {
            addTeamMember();
        }
    };

    // Function to add a team member to the database (not implemented yet)
    const addTeamMembertoDatabase = () => {
        // TODO: Implement database update for team members
    };

    // Function to add a team member to the teamList state
    const addTeamMember = () => {
        try {
            const email = document.getElementById("invite-team-member-email").value;
            const role = document.getElementById("invite-team-member-role").value;
            if (!email || !role)
                return alert("Please fill in all fields!");
            if (teamMemberExist(email, role) === 1)
                return alert("Team member already exists with the same role!");
            setTeamList([...teamList, { email: email, role: role }]);
            document.getElementById("invite-team-member-email").value = "";
            document.getElementById("invite-team-member-role").value = "";
        } catch (error) {
            alert(error);
        }
    };

    // Function to check if a team member with the same email and role exists in the teamList
    const teamMemberExist = (email, role) => {
        let res = 0;
        teamList.every((item, index) => {
            if (String(item.email).toLowerCase() === String(email).toLowerCase() && String(item.role).toLowerCase() === String(role).toLowerCase()) {
                res = 1;
                return false;
            }
            return true;
        });
        return res;
    };

    // Function to remove a team member from the teamList state based on its index
    const removeTeamMember = (index) => {
        const list = [...teamList];
        list.splice(index, 1);
        setTeamList(list);
    };

    // Function to close the invitation form and reset the teamList state
    const closeForm = () => {
        setTeamList([]);
        document.getElementById("invite-team-member-form").style.display = "none";
    };

    return (
        <section id="invite-team-member-form" className="form-popup center form-container add-team-member-form">
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
                            style={{marginLeft: "12px", width: "24%"}}
                            onKeyPress={handleKeypress} 
                        />
                        <button className='add-button' onClick={addTeamMember}>Add</button>
                    </div>
                    {/* Render the teamMemberInputElements for each team member in teamList */}
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
