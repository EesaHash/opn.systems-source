import React from 'react';
import "../style/business.css";

export const businessDashboard = (businessLink) => {
    return(
        <div className='business-dashboard'>
            {title()}
            {body()}
        </div>
    );
};
const title = _ => {
    return(
        <div className='business-dashboard-title'>
              
        </div>
    );
};
const body = _ => {
    return(
        <div className='business-dashboard-body'>
                
        </div>
    );
}