 import React, { useState } from 'react';
 import "../style/sidebar.css";
import { SidebarData } from './SidebarData';

export const Sidebar = () => {
    const [activeLink, setActiveLink] = useState('');
  
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
                        {val.items.map((item, index) => (
                        <li key={index}>
                            <a href={item.link}>{item.title}</a>
                        </li>
                        ))}
                    </ul>
                    )}
                </li>
            );
          })}
        </ul>
      </div>
    );
  };
  