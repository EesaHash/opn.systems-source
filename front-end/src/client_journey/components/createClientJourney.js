import React, { useEffect, useState } from 'react';
import "../style/client_journey.css";
import { loadingPage } from '../../warning_pages/components/loadingPage';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { areaItem, textInputItem } from '../../public_components/popupInput';

export const CreateClientJourney = (props) => {
    const [productInput, setProductInput] = useState({
        coreServices: "",
        targetMarket: "",
        isProduct: "",
        productOrServiceDescription: "",
        fundingStrategy: "",
        businessID: props.business.id
    });
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const titlePage = "Create Client Journey";
    
    // STEP 1
    const step1 = _ => {
        const setCoreService = (value) => {
            setProductInput({...productInput, coreServices: value});
        };
        const setTargetMarket = (value) => {
            setProductInput({...productInput, targetMarket: value});
        };
        const setProductDesc = (value) => {
            setProductInput({...productInput, productOrServiceDescription: value});
        };
        const setFundingStrategy = (value) => {
            setProductInput({...productInput, fundingStrategy: value});
        };

        return(
            <div id="create-client-journey-step1" className="content-form">
                <h2>{titlePage}</h2>
                <hr/>
                <h3>Step 1 of 2</h3>
                <h1>Product Details</h1>
                {areaItem("Core Service", productInput.coreServices, setCoreService)}
                {textInputItem("Target Market", productInput.targetMarket, setTargetMarket, handleKeypress, "text")}
                <div className='pop-up-input'>
                    <label>Product/Service</label>
                    {manufactureDropdown(productInput, setProductInput)}
                </div>
                {areaItem("Product/Service Description", productInput.productOrServiceDescription, setProductDesc)}
                {areaItem("Funding Strategy", productInput.fundingStrategy, setFundingStrategy)}
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button id="create-journey-step1btn" className='next-button' onClick={nextAction} >Next</button>
                </div>
            </div>
        );
    };
    // Dynamic Button Color
    useEffect(() => {
        if(!productInput.coreServices || !productInput.targetMarket || !productInput.isProduct || !productInput.productOrServiceDescription || !productInput.fundingStrategy)
            document.getElementById("create-journey-step1btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("create-journey-step1btn").style.backgroundColor = "#5D5FEF";
    }, [productInput]);
    // Move to Step 2
    const nextAction = _ => {
        try{
            if(!productInput.coreServices || !productInput.targetMarket || !productInput.isProduct || !productInput.productOrServiceDescription || !productInput.fundingStrategy)
                return alert("Please fill in all fields!");
            document.getElementById("create-client-journey-step1").style.display = "none";
            document.getElementById("create-client-journey-step2").style.display = "block";
        }catch(error){
            alert(error);
        }
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            nextAction();
        }
    };

    // STEP 2
    const step2 = _ => {
        return(
            <div id="create-client-journey-step2" className="content-form" style={{display: "none"}}>
                <h2>{titlePage}</h2>
                <hr/>
                <div className='title'>
                    <button type="button" onClick={backAction} >
                        <span aria-hidden="true">{"<"}</span>
                    </button>
                    <h3>Step 2 of 2</h3>
                </div>
                <h1>Client Journey Details</h1>
                <div className='pop-up-input' >
                    <label>Client Journey Title</label>
                    <input 
                        type='text'
                        value={title}
                        onKeyPress={handleKeypress2} 
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div className='pop-up-button'>
                    <button className='cancel-button' onClick={closeForm}>Cancel</button>
                    <button id="create-journey-step2btn" className='next-button' onClick={generate} >Generate File</button>
                </div>
            </div>
        );
    };
    // Dynamic Button Color
    useEffect(() => {
        if(!title)
            document.getElementById("create-journey-step2btn").style.backgroundColor = "#A2ABBA";
        else
            document.getElementById("create-journey-step2btn").style.backgroundColor = "#5D5FEF";
    }, [title]);
    // Generate Client Journey
    const generate = _ => {
        if(!title)
            return alert("Please fill in all fields!");
        document.getElementById("create-client-journey-step2").style.display = "none";
        setLoading(true);
        fetch("/api/clientjourney/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                productInput
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if(data.status){
                    props.setProducts([...props.products, data.product]);
                }else{
                    alert(data.message);
                }
                closeForm();
            }); 
    };
    const handleKeypress2 = e => {
        if(e.key === "Enter"){
            generate();
        }
    };
    // Move back to Step 1
    const backAction = _ => {
        document.getElementById("create-client-journey-step1").style.display = "block";
        document.getElementById("create-client-journey-step2").style.display = "none";
    };

    const closeForm = _ => {
        setProductInput({
            coreServices: "",
            targetMarket: "",
            isProduct: "",
            productOrServiceDescription: "",
            fundingStrategy: "",
            businessID: props.business.id
        });
        setTitle("");
        document.getElementById("create-client-journey-step1").style.display = "block";
        document.getElementById("create-client-journey-step2").style.display = "none";
        setLoading(false);
        document.getElementById("createClientJourney").style.display = "none";
    };

    return(
        <section id="createClientJourney" className="form-popup center form-container create-client-journey">
            {step1()}
            {step2()}
            {loading && loadingPage(titlePage, "AI is writing client journeys for", title)}
        </section>
    );
};
const manufactureDropdown = (productInput, setProductInput) => {
    const list = ["Product", "Service"];
    const getManufacture = _ => {
        let newRes = [];
        list.forEach(res => {
            newRes.push(
                <DropdownItem
                    key = {res}
                    onClick = {_=> {
                        let newSel = {
                            ...productInput,
                            isProduct: res
                        };
                        setProductInput(newSel);
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
            <DropdownToggle>{productInput.isProduct}</DropdownToggle>
            <DropdownMenu>{getManufacture()}</DropdownMenu>
        </UncontrolledDropdown>
    );
};