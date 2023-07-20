import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EditPrompt } from '../EditPrompt';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PatternsItem';

export const ListItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised");
    const [selectedStep, setSelectedStep] = useState(0);

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
                    numberingPattern.test(data) ? (
                        numberingItem(index, isEditSelected, setSelectedStep, data)
                    ) : (
                        stepPattern.test(data) ? (
                            stepItem(index, isEditSelected, setSelectedStep, data)
                        ) : (
                            letterPattern.test(data) ? (
                                letterItem(index, isEditSelected, setSelectedStep, data)
                            ) : (
                                dashItem(index, isEditSelected, setSelectedStep, data)
                            )
                        )
                    )
                )
            ))}
            {(props.editStatus && itemClassName !== "minimised") && addItem()}
        </div>
    );
};

const numberingItem = (index, isEditSelected, setSelectedStep, data) => {
    return(
        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
            <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                <h3>{data.substring(0, data.indexOf('.'))}</h3>
                <text>{data.replace(numberingPattern, '')}</text>
            </div>
            {isEditSelected(index) && <EditPrompt/>}
        </div>
    );
};
const dashItem = (index, isEditSelected, setSelectedStep, data) => {
    return(
        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
            <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                <h3>-</h3>
                <text>{data.replace(dashPattern, '')}</text>
            </div>
            {isEditSelected(index) && <EditPrompt/>}
        </div>
    );
};
const letterItem = (index, isEditSelected, setSelectedStep, data) => {
    return(
        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
            <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                <h3>{data.substring(0, data.indexOf('.'))}</h3>
                <text>{data.replace(letterPattern, '')}</text>
            </div>
            {isEditSelected(index) && <EditPrompt/>}
        </div>
    );
};
const stepItem = (index, isEditSelected, setSelectedStep, data) => {
    const stepNumbers = data.match(/\bStep\s+(\d+)\b/g);
    const numbersOnly = stepNumbers.map(step => parseInt(step.match(/\d+/)[0]));
    return(
        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
            <div style={{display: "flex", marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                <h3>{numbersOnly}</h3>
                <text>{data.replace(stepPattern, '')}</text>
            </div>
            {isEditSelected(index) && <EditPrompt/>}
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