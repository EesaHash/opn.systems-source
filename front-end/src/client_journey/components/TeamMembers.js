import React, { useState } from 'react';
import "../style/TeamMembers.css";
import { MainTableHeader } from '../../table/components/MainTable';
import { changePasswordForm } from '../../dashboard/components/account_settings';
import { openPopUpForm } from '../../dashboard/page/dashboard_main';

const inviteTeam = _ =>{
    document.getElementById("invite-team-member-form").style.display = "block";
    openPopUpForm();
}

export const TeamMembers = (props) => {
    const [teamMembers, setTeamMembers] = useState([]);
    return(
        <div className='Team_Member'>
            <MainTableHeader 
                id = "team-member-main-table"
                title = "Team Members" 
                list = {teamMembers}
                addNewBtn = {inviteTeam}
            />
            
        </div>
    );
   
    
}
