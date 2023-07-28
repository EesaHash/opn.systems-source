import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PublicTableComponents';
import { ExpandMinimisedTableItem2 } from '../ExpandMinimisedItem/ExpandMinimisedTableItem2';

export const ListItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised");
    const [expandAll, setExpandAll] = useState(false);
    const [selectedStep, setSelectedStep] = useState(0);
    const [list, setList] = useState([]);
    const [dragItemIndex, setDragItemIndex] = useState();
    const [dragOverItemIndex, setDragOverItemIndex] = useState();

    useEffect(() => {
        if(props.list.length <= 0){
            setItemClassName("minimised");
            props.setEditStatus(false);
        }
        let indent = false;
        let heading = "";
        let prevPattern = "";
        let itemPattern = "";
        const temp = [];
        let idx = -1;
        let idx2 = 1;
        const setHeading = (pattern, data) => {
            let hyphen = "*";
            switch (pattern) {
                case "number":
                    hyphen = idx2++;
                    data = data.replace(numberingPattern, '');
                    break;
                case "step":
                    hyphen = idx2++;
                    data = data.replace(stepPattern, '');
                    break;
                case "letter":
                    hyphen =  `${data.substring(0, data.indexOf('.'))}`;
                    data = data.replace(letterPattern, '');
                    break;
                case "dash":
                    hyphen = "-";
                    data = data.replace(dashPattern, '');
                    break;
                default:
                    data = data.replace(dashPattern, '');
                    break;
            }
            if((heading.length <= 0 && !indent) || (!indent && prevPattern === "empty") || (heading === pattern) || (indent && prevPattern !== pattern) || (itemPattern.length > 0 && itemPattern !== pattern) ){
                indent = false;
                if(itemPattern.length <= 0 && heading.length > 0 && !(!indent && prevPattern === "empty"))
                    itemPattern = "*";
                heading = pattern;
                temp.push({
                    pattern,
                    hyphen,
                    data,
                    item: []
                });
                ++idx;
            }else{
                indent = true;
                temp[idx].item.push({pattern, hyphen, data});
                itemPattern = pattern;
            }
            prevPattern = pattern;
        };
        props.list.forEach((value, index, arr) => {
            if(list.length <= 0)
                arr[index] = value.trim();
            else
                arr[index] = value.trim();
            const data = arr[index];
            // if(data.length > 0){
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
            // }
        });
        setList(temp);
        // eslint-disable-next-line
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
            <div className='list-table4-list-heading' style={{display: "flex"}} >
                <div onClick={expandMinimisedBtn} style={{width: "100%"}}>
                    <h2>{props.listTitle}</h2>
                </div>
                <button onClick={() => setExpandAll(!expandAll)}>{expandAll ? "Minimised all" : "Expand all"}</button>
                <button onClick={expandMinimisedBtn}>
                    {itemClassName === "minimised" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                </button>
            </div>
            { itemClassName !== "minimised" && 
                list.map((data, index) => (
                    <ExpandMinimisedTableItem2
                        index = {index}
                        isEditSelected = {isEditSelected}
                        setSelectedStep = {setSelectedStep}
                        editStatus = {props.editStatus}
                        itemClassName = {expandAll ? "expanded" : "minimised"}

                        data = {data}
                        list = {list}   setList = {setList}

                        updateList = {props.updateList}

                        dragItemIndex = {dragItemIndex} setDragItemIndex = {setDragItemIndex}
                        dragOverItemIndex = {dragOverItemIndex}  setDragOverItemIndex = {setDragOverItemIndex}
                    />
                ))
            }
            {/* {(props.editStatus && itemClassName !== "minimised") && addItemWithAI()} */}
            {(props.editStatus && itemClassName !== "minimised") && addItemManual()}
        </div>
    );
};

// const addItemWithAI = _ => {
//     return(
//         <div className='add-list-item ai'>
//             <h3>+</h3>
//             <text>Add step with AI</text>
//             <img src="./images/ai_icon2.png" alt = "icon"/>
//         </div>
//     );
// }; 
const addItemManual = _ => {
    return(
        <div className='add-list-item manual'>
            <h3>+</h3>
            <text>Add step</text>
        </div>
    );
};