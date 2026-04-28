import React from "react";
import { Button } from "antd";
import "./HeaderButton.scss";
import { useNavigate } from "react-router-dom";

const HeaderButton = ({ icon, title, subtitle, to, onClick }) => {
<<<<<<< HEAD
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

    return (
        <Button className="header-button" onClick={handleClick}>
            <div className="hb-icon">
                {icon}
            </div>
=======
  const navigate = useNavigate();
>>>>>>> 087dbf7 (sua UI header)

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  return (
    <Button className="header-button" onClick={handleClick}>
      <div className="hb-icon">{icon}</div>

      <div className="hb-content">
        <span className="hb-title">{title}</span>
        {subtitle && <span className="hb-subtitle">{subtitle}</span>}
      </div>
    </Button>
  );
};

export default HeaderButton;
