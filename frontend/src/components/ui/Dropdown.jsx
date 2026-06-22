import React from "react";
import { Dropdown as AntDropdown, Button } from "antd";
import "./Dropdown.scss";
import { useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const Dropdown = ({ icon, title, subtitle, menu, to, onClick, placement = "bottomRight", variant = "dark" }) => {
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
        <Button className={`dropdown-button variant-${variant}`} onClick={handleClick}>
            <div className="db-icon">
                {icon}
            </div>

            <div className="db-content">
                <span className="db-title">{title}</span>
                {subtitle && <span className="db-subtitle">{subtitle}</span>}
            </div>

            {menu && menu.items && menu.items.length > 0 && (
                <DownOutlined className="db-arrow" />
            )}
        </Button>
    );

    if (menu && menu.items && menu.items.length > 0) {
        return (
            <AntDropdown
                menu={menu}
                placement={placement}
                trigger={['hover']}
                overlayClassName="dropdown-menu-popup"
            >
                {button}
            </AntDropdown>
        );
    }

    return button;
};

export default Dropdown;