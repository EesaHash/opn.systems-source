import React from 'react';
import "../style/sidebar.css";
import { SidebarData } from './SidebarData';

export const Sidebar = () => {
  return (
    <div className = "sidebar">
      <ul className = "sidebar-list">
      <p className = "opn-systems-text">
        Opn.Systems
        </p>
      {SidebarData.map((val, key) => {
      return (
        <li className = "row" key={key} onClick={() => {
          window.location.pathname = val.link;
        }}>
          <div id="icon">{val.icon}</div>
          <div id="title">{val.title}</div> 
        </li>
      );
      })}
      </ul>
    </div>
  );
 }