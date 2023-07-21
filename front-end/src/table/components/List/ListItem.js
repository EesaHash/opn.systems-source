import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EditPrompt } from '../EditPrompt';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PatternsItem';

export const ListItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised");
    const [selectedStep, setSelectedStep] = useState(0);
    const [list, setList] = useState([]);

    useEffect(() => {
        setItemClassName("minimised");
        let indent = false;
        let heading = "";
        let prevHeading = "";
        const temp = [];
        let idx = -1;
        const setHeading = (pattern, data) => {
            let hyphen = "-";
            switch (pattern) {
                case "number":
                    hyphen = data.substring(0, data.indexOf('.'));
                    data = data.replace(numberingPattern, '');
                    break;
                case "step":
                    const stepNumbers = data.heading.match(/\bStep\s+(\d+)\b/g);
                    const numbersOnly = stepNumbers.map(step => parseInt(step.match(/\d+/)[0]));
                    hyphen = numbersOnly;
                    data = data.replace(stepPattern, '');
                    break;
                case "letter":
                    hyphen =  `${data.substring(0, data.indexOf('.'))}.`;
                    data = data.replace(letterPattern, '');
                    break;
                default:
                    data = data.replace(dashPattern, '');
                    break;
            }
            if((heading.length <= 0 && !indent) || (heading === pattern && !indent) || (prevHeading !== pattern && indent) || (prevHeading === "empty")){
                indent = false;
                heading = pattern;
                temp.push({
                    hyphen,
                    heading: data,
                    item: []
                });
                ++idx;
            }else if(heading !== pattern){
                indent = true;
                temp[idx].item.push({hyphen, data});
            }
            prevHeading = pattern;
        };
        props.list.forEach((value, index, arr) => {
            arr[index] = value.trim();
            const data = arr[index];
            if(data.length > 0){
                if(numberingPattern.test(data)){
                    setHeading("number", data);
                }else if(stepPattern.test(data)){
                    setHeading("step", data);
                }else if(letterPattern.test(data)){
                    setHeading("letter", data);
                }else if(dashPattern.test(data)){
                    setHeading("dash", data);
                }else{
                    setHeading("empty", data);
                }
            }
        });
        setList(temp);
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
            list.map((data, index) => (
                mainItem(index, isEditSelected, setSelectedStep, data)
            ))}
            {(props.editStatus && itemClassName !== "minimised") && addItem()}
        </div>
    );
};

const mainItem = (index, isEditSelected, setSelectedStep, data) => {
    return(
        <div key={index} className={`list-table4-list-item${isEditSelected(index) ? " active" : ""}`}>
            <div style={{marginBottom: isEditSelected(index) ? "15px" : "0"}} onClick={() => setSelectedStep(index)}>
                <div style={{display: "flex"}}>
                    <h3>{data.hyphen}</h3>
                    <text>{data.heading}</text>
                </div>
                {
                    data.item.map((item) => (
                        <div className='sub-items'>
                            <h3>{item.hyphen}</h3>
                            <text>{item.data}</text>
                        </div>
                    ))
                }
            </div>
            {isEditSelected(index) && <EditPrompt/>}
        </div>
    );
};
const subItems = () => {

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