import React, { useEffect } from 'react';
import "../style/business.css";
import { getBusinessTypeList, getCompanySizeList } from '../../App';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import CloseIcon from '@mui/icons-material/Close';

export const EditBusinessDetail = (props) => {
    
    useEffect(() => {
        if(props.index >= 0)
            props.setBusiness(props.businesses[props.index]);
        // eslint-disable-next-line
    }, [props.businesses, props.setBusiness, props.index]);

    // Update Data
    const updateData = _ => {
        try{
            if(!props.business.businessName || !props.business.businessType || !props.business.industry || !props.business.companySize || !props.business.businessObjective)
                return alert("Please fill in all fields!");
            fetch("/api/business/updateBusiness", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(props.business)
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(data.status){
                        const temp = [...props.businesses];
                        temp[props.index] = props.business;
                        props.setBusinesses(temp);
                        alert(data.message);
                        closeForm();
                    }
                });
        }catch(error){
            alert(error);
        }
    };
    const updateBusinessName = (value) => {
        props.setBusiness({...props.business, businessName: value});
    };
    const updateBusinessIndustry = (value) => {
        props.setBusiness({...props.business, industry: value});
    };
    const updateBusinessObjective = (value) => {
        props.setBusiness({...props.business, businessObjective: value});
    };

    // Close Form
    const closeForm = _ => {
        if(!checkChanges())
            if(window.confirm("Do you want to save the changes you made?"))
                updateData();
            else
                props.setBusiness(props.businesses[props.index]);
        document.getElementById("editBusinessForm").style.display = "none";
    };

    // Check of any changes made
    const checkChanges = _ => {
        return Object.entries(props.business).toString() === Object.entries(props.businesses[props.index]).toString();
    };

    return(
        <section id="editBusinessForm" className="form-popup center form-container edit-business">
            <div className="content-form">
                <h2>Edit Business Details <button className='close-button' onClick={closeForm}><CloseIcon /></button></h2>
                <hr/>
                <div style={{display: "flex"}}>
                    <div className='business-icon'>
                        <img src={`./images/businessIcon/businessIcon${(props.index%6)+1}.png`} alt="logo"/>
                    </div>
                    <div className='business-detail'>
                        {itemInput("Business Name", props.business.businessName, updateBusinessName)}
                        {itemDropdown("Nature of Business", props.business, props.setBusiness, businessTypeListDrowdown)}
                        {itemInput("Industry", props.business.industry, updateBusinessIndustry)}
                        {itemDropdown("Company Size", props.business, props.setBusiness, companySizeDropdown)}
                        {itemArea("Business Objective", props.business.businessObjective, updateBusinessObjective)}
                        <div className='pop-up-button'>
                            <button className='cancel-button' onClick={closeForm}>Cancel</button>
                            <button onClick={updateData} >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
const itemInput = (title, data, updateData) => {
    return(
        <div className='pop-up-input'>
            <label>{title}</label>
            <input 
                type='text' 
                value={data ? data : ''} 
                onChange={event => updateData(event.target.value)} 
            />
        </div>
    );
};

const itemArea = (title, data, updateData) => {
    return(
        <div className='pop-up-input'>
            <label>{title}</label>
            <textarea 
                type='text' 
                value={data ? data : ''} 
                onChange={event => updateData(event.target.value)} 
            />
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