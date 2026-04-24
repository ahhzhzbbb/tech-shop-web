import React from "react";
import { Button } from "antd";
import "./HeaderButton.scss";
import { useNavigate } from 'react-router-dom';

const HeaderButton = ({ icon, title, subtitle, to }) => {
    const navigate = useNavigate();
    return (
        <Button className="header-button" onClick={() => navigate(to)}>
            <div className="hb-icon">
                {icon}
            </div>

            <div className="hb-content">
                <span className="hb-title">{title}</span>
                <span className="hb-subtitle">{subtitle}</span>
            </div>
        </Button>
    );
};

export default HeaderButton;