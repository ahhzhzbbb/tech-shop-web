import React from "react";
import { Dropdown as AntDropdown, Button } from "antd";
import "./Dropdown.scss";
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ icon, title, subtitle, menu, to, onClick, placement = "bottomLeft" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (to) {
            navigate(to);
        }
    };

    const button = (
        <Button className="dropdown-button" onClick={handleClick}>
            <div className="db-icon">
                {icon}
            </div>

            <div className="db-content">
                <span className="db-title">{title}</span>
                <span className="db-subtitle">{subtitle}</span>
            </div>
        </Button>
    );

    if (menu && menu.items && menu.items.length > 0) {
        return (
            <AntDropdown
                menu={menu}
                placement={placement}
                trigger={['click']}
            >
                {button}
            </AntDropdown>
        );
    }

    return button;
};

export default Dropdown;