import React from 'react';
import "../../style/table.css";
import { EmptyTableContent } from '../EmptyTableContent';

export const FolderList2 = (props) => {
    return(
        <div id={props.id} className='folder-list2'>
            <div className='table-directory'>
                <div className='table-directory-left-header'>
                    <button onClick={props.button1}>{`${props.type}`}</button>
                    <h3>/</h3>
                    <button >{`${props.title}`}</button>
                </div>
            </div>
            <div className='folder-list-title'>
                <h1>{props.title}</h1>
            </div>
            <div className='folder-list-content'>
                {props.list.length > 0 &&
                    props.list.map((data, index) => (
                        item(data, index, [], props.itemActionBtn)
                    ))
                }
            </div>
        </div>
    );
};

const item = (data, index, list2, itemActionBtn) => {
    return(
        <div key={index} className='folder-list-content-item' onClick={() => itemActionBtn(data)}>
            <img src="./images/folder_icon.png" alt="icon"/>
            <div className='folder-list-item-desc'>
                <h2>{data}</h2>
                <h3>{list2.length} files</h3>
            </div>
        </div>
    );
};