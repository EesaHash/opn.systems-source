import React, { useState } from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTable';

export const ProceduresDashboard = _ => {
    const [procedures, setProcedures] = useState([]);
    return(
        <div className='procedure'>
            <MainTableHeader 
                title = "Procedures" 
                list = {procedures}
                addNewBtn = {null}
            />
        </div>
    );
};
