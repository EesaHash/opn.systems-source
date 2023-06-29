import React, { useState } from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';

export const PoliciesDashboard = _ => {
    const [policies, setPolicies] = useState([]);
    return(
        <div className='policies'>
            <MainTableHeader 
                title = "Policies" 
                list = {policies}
                addNewBtn = {null}
            />
        </div>
    );
};
