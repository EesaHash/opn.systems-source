import React, { useState } from 'react';
import "../style/sidebar.css";
import { SidebarData } from './SidebarData';
import { createNewBusinessForm } from '../page/dashboard_main';

export const Sidebar = (props) => {
    const [activeLink, setActiveLink] = useState('');
    const [activeLink2, setActiveLink2] = useState('');

    const addBusiness = _ => {
        createNewBusinessForm();
    };
  
    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                <p className="opn-systems-text">
                <ul>
                    <li id="logo" className="logo">
                    <a href="/dashboard">
                        <img src="./images/green_profile_logo.png" alt="logo" />
                        Opn.Systems
                    </a>
                    </li>
                </ul>
                </p>
                {SidebarData.map((val, key) => {
                return (
                    <li
                        className={`row ${activeLink === val.link ? 'active' : ''}`}
                        key={key}
                        onClick={() => {
                            setActiveLink(val.link);
                        }}
                    >
                        <div className="main-item">
                            <div id="icon" style={{marginRight: "15px"}}>{val.icon}</div>
                            <div id="title">{val.title}</div>
                            {(val.title === "Business") && <div class="dropdown-arrow"></div>}
                        </div>
                        {val.items && activeLink === val.link && (
                        <ul className="sub-items">
                            {(val.title === "Business") && props.businesses.map((item, index) => (
                            <li className={activeLink2 === item.link ? 'active' : ''} key={index} onClick={() => {setActiveLink2(item.link)}} >
                                <a href={`#${item.title}`}>{item.title}</a>
                            </li>
                            ))}
                            {(val.title === "Business") && <button onClick={addBusiness}>+ Add Business</button>}
                        </ul>
                        )}
                    </li>
                );
                })}
            </ul>
        </div>
    );
  };
  