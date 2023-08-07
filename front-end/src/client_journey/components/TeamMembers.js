import React, { useEffect, useState } from 'react';
import "../style/TeamMembers.css";
import "../../header/style/header.css"
import { ListTable } from '../../table/components/List/ListTable';

// Function to display the invite team member form
const inviteTeam = _ => {
    document.getElementById("invite-team-member-form").style.display = "block";
}

/**
 * Component to display the list of team members for a business.
 * @param {Object} props - The properties passed to the component.
 *   @prop {Object} business - The business object containing the businessID.
 */
export const TeamMembers = (props) => {
    // State to store the list of team members
    const [teamMembers, setTeamMembers] = useState([]);

    // Effect hook to fetch team members when the business prop changes
    useEffect(() => {
        try {
            // Async function to fetch team members from the API
            const getTeamMembers = async _ => {
                const res = await fetch("/api/teammember/getbusinessteam", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        businessID: props.business.id
                    })
                });
                const data = await res.json();
                if (data.status) {
                    // Set the teamMembers state with the fetched data
                    setTeamMembers(data.teamMembers);
                } else {
                    // If an error occurs, throw an error with the error message
                    throw data.message;
                }
            };

            // If the business ID exists, fetch the team members
            if (props.business.id) {
                getTeamMembers();
            }
        } catch (error) {
            // Display an alert if an error occurs during fetching
            alert(error);
        }
    }, [props.business]);

    return (
        <div className='Team_Member'>
            {/* Render the ListTable component with team members data */}
            <ListTable
                id="team-member-main-table"
                title="Team Members"
                list={teamMembers}
                addNewBtn={inviteTeam}
            />
        </div>
    );
}
