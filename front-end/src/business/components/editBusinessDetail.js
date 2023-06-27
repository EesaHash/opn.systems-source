import React, { useEffect } from 'react';
import "../style/business.css";
import { closePopUpForm } from '../../dashboard/page/dashboard_main';
import { getBusinessTypeList, getCompanySizeList } from '../../App';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export const EditBusinessDetail = (props) => {
    const index = props.index;
    
    useEffect(() => {
        if(index >= 0)
            props.setBusiness(props.businesses[index]);
        // eslint-disable-next-line
    }, [props.businesses, props.setBusiness, index]);

    const closeForm = _ => {
        document.getElementById("editBusinessForm").style.display = "none";
        closePopUpForm();
    };
    return(
        <section id="editBusinessForm" className="form-popup center form-container edit-business">
            <div className="content-form">
                <h2>Edit Business Details</h2>
                <hr/>
                <div style={{display: "flex"}}>
                    <div className='business-icon'>
                        <img src={`./images/businessIcon/businessIcon${(index%6)+1}.png`} alt="logo"/>
                    </div>
                    <div className='business-detail'>
                        {itemInput("Business Name", props.business.businessName)}
                        {itemDropdown("Nature of Business", props.business, props.setBusiness, businessTypeListDrowdown)}
                        {itemInput("Industry", props.business.industry)}
                        {itemDropdown("Company Size", props.business, props.setBusiness, companySizeDropdown)}
                        {itemArea("Business Objective", props.business.businessObjective)}
                        {itemArea("Core Service", props.business.coreServices)}
                        {itemInput("Target Market", props.business.targetMarket)}
                        {itemDropdown("Product/Service", props.business, props.setBusiness, manufactureDropdown)}
                        {itemArea("Product/Service Description", props.business.productOrServiceDescription)}
                        {itemArea("Funding Strategy", props.business.fundingStrategy)}
                        <div className='pop-up-button'>
                            <button className='cancel-button' onClick={closeForm}>Cancel</button>
                            <button onClick={null} >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const itemInput = (title, data) => {
    return(
        <div className='pop-up-input'>
            <label>{title}</label>
            <input type='text' defaultValue={data ? data : ''} />
        </div>
    );
};

const itemArea = (title, data) => {
    return(
        <div className='pop-up-input'>
            <label>{title}</label>
            <textarea type='text' defaultValue={data ? data : ''} />
        </div>
    );
};

const itemDropdown = (title, data, setData, dropdown) => {
    return(
        <div className='pop-up-input'>
            <label>{title}</label>
            {dropdown(data, setData)}
        </div>
    );
};

const businessTypeListDrowdown = (business, setBusiness) => {
    const getBusinessType = _ => {
        let newType = [];
        getBusinessTypeList().forEach(type => {
            newType.push(
                <DropdownItem
                    key = {type}
                    onClick = {_=> {
                        let newSel = {
                            ...business,
                            businessType: type
                        };
                        setBusiness(newSel);
                    }}
                >
                    {type}
                </DropdownItem>
            );
        });
        return newType;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{business.businessType}</DropdownToggle>
            <DropdownMenu>{getBusinessType()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};
const companySizeDropdown = (business, setBusiness) => {
    const getCompanySize = _ => {
        let newRes = [];
        getCompanySizeList().forEach(res => {
            newRes.push(
                <DropdownItem
                    key = {res}
                    onClick = {_=> {
                        let newSel = {
                            ...business,
                            companySize: res
                        };
                        setBusiness(newSel);
                    }}
                >
                    {res}
                </DropdownItem>
            );
        });
        return newRes;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{business.companySize}</DropdownToggle>
            <DropdownMenu>{getCompanySize()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};
const manufactureDropdown = (business, setBusiness) => {
    const list = ["Product", "Service"];
    const getManufacture = _ => {
        let newRes = [];
        list.forEach(res => {
            newRes.push(
                <DropdownItem
                    key = {res}
                    onClick = {_=> {
                        let newSel = {
                            ...business,
                            isProduct: (res === "Product" ? true : false)
                        };
                        setBusiness(newSel);
                    }}
                >
                    {res}
                </DropdownItem>
            );
        });
        return newRes;
    };
    return(
        <UncontrolledDropdown>
            <DropdownToggle>{(business.isProduct === true) ? "Product" : "Service"}</DropdownToggle>
            <DropdownMenu>{getManufacture()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};