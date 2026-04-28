import React from "react";
import { Button } from "antd";
import "./HeaderButton.scss";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
const HeaderButton = ({ icon, title, subtitle, to, onClick, variant = "transparent", ...rest }) => {
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
    <Button {...rest} className={`header-button variant-${variant}`} onClick={handleClick}>
      <div className="hb-icon">
        {icon}
      </div>
=======
const HeaderButton = ({ icon, title, subtitle, to, onClick }) => {
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
      <div className="hb-icon">{icon}</div>
>>>>>>> 087dbf7 (sua UI header)

      <div className="hb-content">
        <span className="hb-title">{title}</span>
        {subtitle && <span className="hb-subtitle">{subtitle}</span>}
      </div>
    </Button>
  );
};

export default HeaderButton;
