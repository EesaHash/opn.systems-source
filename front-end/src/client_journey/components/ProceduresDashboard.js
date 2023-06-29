import React from 'react';
import "../style/client_journey.css";
import { MainTableHeader } from '../../table/components/MainTableTitle';

export const ProceduresDashboard = _ => {
    return(
        <div className='procedure'>
            <MainTableHeader title = "Procedure" list = {[]}/>
        </div>
    );
};
