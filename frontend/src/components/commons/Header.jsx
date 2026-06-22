import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Button, Popconfirm, message } from "antd";
import { ShoppingCartOutlined, ContainerOutlined, EnvironmentOutlined, UserOutlined, MenuOutlined, CloseOutlined, PhoneOutlined, LogoutOutlined } from '@ant-design/icons';

import logo from "../../assets/logo_shop.png"
import shopName from "../../assets/shop_name.png"

import Dropdown from "../ui/Dropdown.jsx";
import HeaderButton from "../ui/HeaderButton.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useLogout } from "../../features/auth/hooks/useAuth.jsx";

import RegisterModal from "../../features/auth/component/RegisterModal.jsx";
import LoginModal from "../../features/auth/component/LoginModal.jsx";
import ProfileModal from "../../features/user/component/ProfileModal.jsx";
import SearchInput from "../../features/search/components/SearchInput.jsx";
import useCartStore from "../../store/cartStore.js";
import "./Header.scss";

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout, loading: logoutLoading } = useLogout();
  const location = useLocation();
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Đóng mobile menu khi chuyển trang: so sánh pathname với lần render trước
  // (đặt state ngay trong render thay vì useEffect để tránh cascading renders).
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const cartCount = useCartStore((s) => s.count);
  const refreshCart = useCartStore((s) => s.refresh);
  const resetCart = useCartStore((s) => s.reset);

  // Đồng bộ số lượng giỏ hàng theo trạng thái đăng nhập
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      resetCart();
    }
  }, [user, refreshCart, resetCart]);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đã đăng xuất thành công');
      navigate('/');
    } catch (err) {
      message.error('Lỗi đăng xuất: ' + (err.message || 'Vui lòng thử lại'));
    }
  };

  const roles = user?.roles;
  const normalizedRoles = Array.isArray(roles) ? roles : roles ? [roles] : [];
  const isAdmin = normalizedRoles.some((role) => ["ROLE_ADMIN", "ADMIN", "admin"].includes(role));

  const items = [];
  items.push({
    key: 'profile',
    label: (
      <Button
        type="text"
        style={{ width: '100%', textAlign: 'left', color: '#E30019' }}
        icon={<UserOutlined />}
        onClick={() => setOpenProfile(true)}
      >
        Thông tin tài khoản
      </Button>
    ),
  });
  if (isAdmin) {
    items.push({
      key: 'adminPanel',
      label: (
        <Button
          type="text"
          style={{ width: '100%', textAlign: 'left', color: '#E30019' }}
          onClick={() => navigate('/admin')}
        >
          Trang quản trị (Admin)
        </Button>
      ),
    });
  }

  items.push(
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
    }
  );

  const handleOrdersClick = () => {
    console.log("handleOrdersClick triggered, current user:", user);
    if (user) {
      navigate("/orders");
    } else {
      console.log("User not logged in, opening LoginModal");
      setOpenLogin(true);
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      setOpenLogin(true);
    }
  }

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

          <button
            className="header_burger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>

          <div className={`header_right${mobileMenuOpen ? ' header_right--open' : ''}`}>
            <HeaderButton icon={<PhoneOutlined />} title="Hotline" subtitle="1900.5301" />
            <HeaderButton icon={<EnvironmentOutlined />} title="Hệ thống" subtitle="Showroom" />
            <HeaderButton icon={<ContainerOutlined />} title="Tra cứu" subtitle="đơn hàng" onClick={handleOrdersClick} />
            <Badge count={cartCount} size="small" offset={[-6, 8]}>
              <HeaderButton icon={<ShoppingCartOutlined />} title="Giỏ" subtitle="hàng" onClick={handleCartClick} />
            </Badge>
            {user ? (
              <>
                <span className="desktop-only-user">
                  <Dropdown icon={<UserOutlined />} title="Tài khoản" subtitle={user.username} menu={{ items }} variant="dark" />
                </span>

                <span className="mobile-only-user">
                  {isAdmin && (
                    <HeaderButton
                      icon={<UserOutlined />}
                      title="Trang quản trị (Admin)"
                      subtitle=""
                      variant="dark"
                      onClick={() => navigate('/admin')}
                    />
                  )}
                  <HeaderButton
                    icon={<UserOutlined />}
                    title="Thông tin tài khoản"
                    subtitle=""
                    variant="dark"
                    onClick={() => setOpenProfile(true)}
                  />
                  <HeaderButton
                    icon={<LogoutOutlined />}
                    title="Đăng xuất"
                    subtitle=""
                    variant="dark"
                    onClick={handleLogout}
                  />
                </span>
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

      <ProfileModal
        open={openProfile}
        onCancel={() => setOpenProfile(false)}
      />
    </>
  );
};

export default Header;
