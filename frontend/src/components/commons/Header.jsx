import { useState } from "react";
import { Input } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import RegisterModal from "../../features/auth/component/RegisterModal.jsx";
import logo from "../../assets/logo_shop.png";
import shopName from "../../assets/shop_name.png";
import HeaderButton from "../ui/HeaderButton.jsx";
import Dropdown from "../ui/Dropdown.jsx";
import SearchInput from "../../features/search/components/SearchInput";
import "./Header.scss";

const categoryItems = [
  { key: "laptop", label: "Laptop" },
  { key: "gaming", label: "Laptop Gaming" },
  { key: "pc", label: "PC GVN" },
  { key: "main", label: "Main, CPU, VGA" },
  { key: "case", label: "Case, Nguồn, Tản" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="header_left">
            <div className="header_brand">
              <img src={logo} className="header_logo" alt="logo" />
              <img src={shopName} className="header_name" alt="shop name" />
            </div>

            <Dropdown
              icon={<MenuOutlined />}
              title="Danh mục"
              menu={{ items: categoryItems }}
              placement="bottomLeft"
            />
          </div>

          <div className="header_search">
            <SearchInput />
          </div>

          <div className="header_right">
            <HeaderButton
              icon={<PhoneOutlined />}
              title="Hotline"
              subtitle="1900.5301"
            />
            <HeaderButton
              icon={<EnvironmentOutlined />}
              title="Hệ thống"
              subtitle="Showroom"
            />
            <HeaderButton
              icon={<BarcodeOutlined />}
              title="Tra cứu"
              subtitle="đơn hàng"
            />
            <HeaderButton
              icon={<ShoppingCartOutlined />}
              title="Giỏ hàng"
              subtitle="của bạn"
            />
            <HeaderButton icon={<LoginOutlined />} title="Đăng nhập" />
          </div>
        </div>
      </div>

      <RegisterModal open={open} onCancel={() => setOpen(false)} />
    </>
  );
};

export default Header;
