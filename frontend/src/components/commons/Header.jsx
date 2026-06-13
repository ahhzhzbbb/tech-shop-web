import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, message } from "antd";
import { ShoppingCartOutlined, ContainerOutlined, EnvironmentOutlined, UserOutlined, MenuOutlined, PhoneOutlined, LogoutOutlined } from '@ant-design/icons';

import logo from "../../assets/logo_shop.png"
import shopName from "../../assets/shop_name.png"

import Dropdown from "../ui/Dropdown.jsx";
import HeaderButton from "../ui/HeaderButton.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useLogout } from "../../features/auth/hooks/useAuth.jsx";

import RegisterModal from "../../features/auth/component/RegisterModal.jsx";
import LoginModal from "../../features/auth/component/LoginModal.jsx";
import SearchInput from "../../features/search/components/SearchInput.jsx";
import "./Header.scss";

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout, loading: logoutLoading } = useLogout();
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đã đăng xuất thành công');
      navigate('/');
    } catch (err) {
      message.error('Lỗi đăng xuất: ' + (err.message || 'Vui lòng thử lại'));
    }
  };

  const items = [
    {
      key: 'userInfo',
      label: (
        <Button
          type="text"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => navigate('/user')}
        >
          Thông tin tài khoản
        </Button>
      ),
    },
    {
      key: 'logout',
      label: (
        <Popconfirm
          title="Đăng xuất"
          description="Bạn có chắc muốn đăng xuất?"
          okText="Có"
          cancelText="Không"
          onConfirm={handleLogout}
          okButtonProps={{ loading: logoutLoading }}
        >
          <Button
            type="text"
            danger
            style={{ width: '100%', textAlign: 'left' }}
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const handleOrdersClick = () => {
    console.log("handleOrdersClick triggered, current user:", user);
    if (user) {
      navigate("/orders");
    } else {
      console.log("User not logged in, opening LoginModal");
      setOpenLogin(true);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header_container">
          <div className="header_left">
            <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <img src={logo} className="header_logo" alt="Logo" />
              <img src={shopName} className="header_logo" alt="Shop Name" />
            </div>
          </div>

          <div className="header_center">
            <SearchInput />
          </div>

          <div className="header_right">
            <HeaderButton icon={<PhoneOutlined />} title="Hotline" subtitle="1900.5301" />
            <HeaderButton icon={<EnvironmentOutlined />} title="Hệ thống" subtitle="Showroom" />
            <HeaderButton icon={<ContainerOutlined />} title="Tra cứu" subtitle="đơn hàng" onClick={handleOrdersClick} />
            <HeaderButton icon={<ShoppingCartOutlined />} title="Giỏ" subtitle="hàng" to="/cart" />
            {user ? (
              <>
                <Dropdown icon={<UserOutlined />} title="Tài khoản" subtitle={user.username} menu={{ items }} variant="dark" />
              </>
            ) : (
              <>
                <HeaderButton icon={<UserOutlined />} title="Đăng nhập" subtitle="" variant="dark" onClick={() => setOpenLogin(true)} />
              </>
            )}
          </div>
        </div>
      </div>

      <RegisterModal
        open={openRegister}
        onCancel={() => setOpenRegister(false)}
        onOpenLogin={() => {
          setOpenRegister(false);
          setOpenLogin(true);
        }}
      />

      <LoginModal
        open={openLogin}
        onCancel={() => setOpenLogin(false)}
        onOpenRegister={() => {
          setOpenLogin(false);
          setOpenRegister(true);
        }}
      />
    </>
  );
};

export default Header;
