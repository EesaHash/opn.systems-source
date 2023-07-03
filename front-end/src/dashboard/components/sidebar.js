import React from 'react';
import "../style/sidebar.css";
import { SidebarData } from './SidebarData';
import { createNewBusinessForm } from '../page/dashboard_main';

export const Sidebar = (props) => {
    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                <p className="opn-systems-text">
                <ul>
                    <li id="logo" className="logo">
                    <a href="/dashboard">
                        <img src="./images/green_profile_logo.png" alt="logo"/>
                        Opn.Systems
                    </a>
                    </li>
                </ul>
                </p>
                {SidebarData.map((val, key) => {
                return (
                    <li
                        className={`row ${props.activeLink === val.link ? 'active' : ''}`}
                        key={key}
                    >
                        <div className="main-item" onClick={() => { onLink1ClickAction(props.activeLink, val.link, props.setActiveLink) }}>
                            <div className='main-item-content'>
                                <div id="icon" style={{marginRight: "15px"}} > {val.icon} </div>
                                <div id="title" > {val.title} </div>
                                {(val.title === "Business") && <div class="dropdown-arrow"></div>}
                            </div>
                        </div>
                        {val.items && props.activeLink === val.link && (
                        <ul className="sub-items">
                            {(val.title === "Business") && props.businesses.map((item, index) => (
                            <li className={props.activeLink2 === index + 1 ? 'active' : ''} key={index} onClick={() => {props.setActiveLink2(index + 1)}} >
                                <div className='sub-items-content'>
                                    <div className='icon'><img src = {`./images/businessIcon/businessIcon${(index%6)+1}.png`} alt = "logo" /></div>
                                    <div className='title'>{item.businessName}</div>
                                </div>
                            </li>
                            ))}
                            {(val.title === "Business") && <button onClick={() => createNewBusinessForm(props.businesses)}>+ Add Business</button>}
                        </ul>
                        )}
                    </li>
                );
                })}
            </ul>
        </div>
    );
  };
  const onLink1ClickAction = (activeLink, valLink, setActiveLink) => {
    if(activeLink === valLink)
        setActiveLink('');
    else
        setActiveLink(valLink);
  }