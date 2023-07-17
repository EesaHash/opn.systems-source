import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EditPrompt } from '../EditPrompt';

export const ListItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised");
    const [selectedStep, setSelectedStep] = useState(0);
    const indentedPattern = [false, false, false, false];
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;
    const pattern3 = /^[a-z]\.\s*/;

    useEffect(() => {
        setItemClassName("minimised");
        props.list.forEach((value, index, arr) => {
            arr[index] = value.trim();
        });
    }, [props.list]);

    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };
    const isEditSelected = (index) => {
        return (props.editStatus && index === selectedStep);
    };
    return(
        <div className={`list-table4-list ${itemClassName}`} onClick = {() => itemClassName === "minimised" && expandMinimisedBtn()}>
            <div style={{display: "flex"}} onClick={expandMinimisedBtn}>
                <h2>{props.listTitle}</h2>
                <button>
                    {itemClassName === "minimised" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                </button>
            </div>
            { itemClassName !== "minimised" && 
            props.list.map((data, index) => (
                (data.length > 0) && (
                    pattern.test(data) ? (
                        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`} style={{marginLeft: indentedPattern[3] ? "20px" : "0"}}>
                            {indentedPattern[0] = true}
                            <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                                <h3>{data.substring(0, data.indexOf('.'))}</h3>
                                <text>{data.substring(data.indexOf('.') + 2)}</text>
                            </div>
                            {isEditSelected(index) && <EditPrompt/>}
                        </div>
                    ) : (
                        pattern2.test(data) ? (
                            <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`} style={{marginLeft: indentedPattern[0] ? "40px" : "0"}}>
                                {indentedPattern[1] = true}
                                <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                                    <h3>-</h3>
                                    <text>{data.substring(2)}</text>
                                </div>
                                {isEditSelected(index) && <EditPrompt/>}
                            </div>
                        ) : (
                            pattern3.test(data) ? (
                                <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`} style={{marginLeft: indentedPattern[0] ? "40px" : "0"}}>
                                    {indentedPattern[2] = true}
                                    <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                                        <h3>{data.substring(0, data.indexOf('.'))}</h3>
                                        <text>{data.replace(pattern3, '')}</text>
                                    </div>
                                    {isEditSelected(index) && <EditPrompt/>}
                                </div>
                            ) : (
                                <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
                                    {indentedPattern[3] = true}
                                    <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                                        <h3>-</h3>
                                        <text>{data}</text>
                                    </div>
                                    {isEditSelected(index) && <EditPrompt/>}
                                </div>
                            )
                        )
                    )
                )
            ))}
            {(props.editStatus && itemClassName !== "minimised") && addItem()}
        </div>
    );
};
const addItem = _ => {
    return(
        <div className='add-list-item'>
            <h3>+</h3>
            <text>Add step with AI</text>
            <img src="./images/ai_icon2.png" alt = "icon"/>
        </div>
    );
}; 