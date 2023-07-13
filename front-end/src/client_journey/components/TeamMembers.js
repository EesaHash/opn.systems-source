import React, { useEffect, useState } from 'react';
import "../style/TeamMembers.css";
import "../../header/style/header.css"
import { ListTable } from '../../table/components/List/ListTable';
import { openPopUpForm } from '../../dashboard/page/dashboard_main';

const inviteTeam = _ =>{
    document.getElementById("invite-team-member-form").style.display = "block"
    openPopUpForm();
}

export const TeamMembers = (props) => {
    const [teamMembers, setTeamMembers] = useState([]);
    useEffect(() => {
        try{
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
            if(data.status){
                setTeamMembers(data.teamMembers);
            }else{
                throw data.message;
            }
        };
        if(props.business.id){
            getTeamMembers();
        }
        }catch(error){
            alert(error);
        }
    }, [props.business]);
    return(
        <div className='Team_Member'>
            <ListTable 
                id = "team-member-main-table"
                title = "Team Members" 
                list = {teamMembers}
                addNewBtn = {inviteTeam}
            /> 
        </div>
    );

    
}
