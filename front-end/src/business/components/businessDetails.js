import React from 'react';
import "../style/business.css";

export const businessDetails = (business) => {
    return(
        <div className='business-details'>
            {itemInput("Nature of Business", business.businessType)}
            {itemInput("Industry", business.industry)}
            {itemInput("Company Size", business.companySize)}
            {itemArea("Business Objective", business.businessObjective)}
            {itemArea("Core Service", business.coreServices)}
            {itemInput("Target Market", business.targetMarket)}
            {itemArea("Product/Service Description", business.productOrServiceDescription)}
            {itemArea("Funding Strategy", business.fundingStrategy)}
        </div>
    );
};

const itemInput = (title, data) => {
    return(
        <div className='business-details-item'>
            <label>{title}</label>
            <input type='text' value={data ? data : ''} readOnly/>
        </div>
    );
};

const itemArea = (title, data) => {
    return(
        <div className='business-details-item'>
            <label>{title}</label>
            <textarea type='text' value={data ? data : ''} readOnly/>
        </div>
    );
};