import React from 'react';
import "../style/business.css";

export const businessDashboard = (activeLink2, businesses) => {
    const businessIndex = getSelectedBusinessIndex(activeLink2, businesses);
    const business = businesses[businessIndex];
    return(
        <div className='business-dashboard'>
            {title(business)}
            {body()}
        </div>
    );
};
const title = (business) => {
    return(
        <div className='business-dashboard-title'>
            <div className='business-dashboard-title-content'>
                <h1>{business.businessName}</h1>
                <h3>{`${business.industry} - ${business.companySize}`}</h3>
            </div>
        </div>
    );
};
const body = _ => {
    return(
        <div className='business-dashboard-body'>
            <div className='business-dashboard-body-content'>
                <div className='business-dashboard-navbar'>
                    
                </div>
            </div>
        </div>
    );
};
const getSelectedBusinessIndex = (activeLink2, businesses) => {
    let result;
    businesses.every((item, index) => {
        if(item.id === activeLink2){
            result = index;
            return false;
        }
        return true;
    });
    return result;
};