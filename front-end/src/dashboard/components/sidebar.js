import React from 'react';
import "../style/sidebar.css";
import { SidebarData } from './SidebarData';
import { createNewBusinessForm } from '../page/dashboard_main';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import OpnLogo from '../svg/opnLogo';

/**
 * Component for rendering the sidebar menu with navigation links and business options.
 * @param {Object} props - The properties passed to the component.
 *   @prop {string} activeLink - The currently active link.
 *   @prop {Function} setActiveLink - Function to set the active link.
 *   @prop {Array} businesses - An array of business options.
 *   @prop {string} activeLink2 - The second active link.
 *   @prop {Function} setActiveLink2 - Function to set the second active link.
 *   @prop {boolean} loading - A boolean indicating whether data is loading.
 */
export const Sidebar = (props) => {
    return (
        <div className="sidebar">
            {/* Sidebar navigation list */}
            <ul className="sidebar-list">
                {/* Opn.Systems text and logo */}
                <p className="opn-systems-text">
                    <ul>
                        <li>
                            <a href="/dashboard">
                                <div style={{ width: "10vw" }}> <OpnLogo /> Opn.Systems</div>
                            </a>
                        </li>
                    </ul>
                </p>

                {/* Render each sidebar item */}
                {SidebarData.map((val, key) => {
                    return (
                        <li
                            className={`row ${props.activeLink === val.link ? 'active' : ''}`}
                            key={key}
                        >
                            {/* Main sidebar item */}
                            <div className="main-item" onClick={() => { onLink1ClickAction(props.activeLink, val.link, props.setActiveLink) }}>
                                <div className='main-item-content'>
                                    <div id="icon" style={{ marginRight: "12px" }} > {val.icon} </div>
                                    <div id="title"> {val.title} </div>
                                    {/* Display an arrow icon for the "Business" item to indicate dropdown */}
                                    {(val.title === "Business") && <div style={{ marginLeft: "4px" }}>{props.activeLink === "business" ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</div>}
                                </div>
                            </div>
                            {/* Render sub-items for the "Business" item */}
                            {(val.items && props.activeLink === val.link && !props.loading) && (
                                <ul className="sub-items">
                                    {/* Loop through businesses and render each option */}
                                    {(val.title === "Business") && props.businesses.map((item, index) => (
                                        <li className={props.activeLink2 === index + 1 ? 'active' : ''} key={index} onClick={() => { props.setActiveLink2(index + 1) }} >
                                            <div className='sub-items-content'>
                                                <div className='icon'><img src={`./images/businessIcon/businessIcon${(index % 6) + 1}.png`} alt="logo" /></div>
                                                <div className='title'>{item.businessName}</div>
                                            </div>
                                        </li>
                                    ))}
                                    {/* Button to add a new business */}
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

/**
 * Function to handle sidebar link click actions.
 * @param {string} activeLink - The currently active link.
 * @param {string} valLink - The link associated with the clicked item.
 * @param {Function} setActiveLink - Function to set the active link.
 */
const onLink1ClickAction = (activeLink, valLink, setActiveLink) => {
    if (activeLink === valLink)
        setActiveLink('');
    else
        setActiveLink(valLink);
}
