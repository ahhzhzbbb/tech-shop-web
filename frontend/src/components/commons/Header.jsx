import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useLogout } from "../../features/auth/hooks/useAuth.jsx";
import RegisterModal from "../../features/auth/component/RegisterModal.jsx";
import logo from "../../assets/logo_shop.png"
import shopName from "../../assets/shop_name.png"
import HeaderButton from "../ui/HeaderButton.jsx";
import "./Header.scss";
import SearchInput from "../../features/search/components/SearchInput.js"
import { ShoppingCartOutlined, ContainerOutlined, EnvironmentOutlined, UserAddOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import LoginModal from "../../features/auth/component/LoginModal.jsx";
import Dropdown from "../ui/Dropdown.jsx";
import { Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";

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

    return (
        <>
            <div className="header">
                <div className="header_left">
                    <img src={logo} className="header_logo" />
                    <img src={shopName} className="header_logo" />
                </div>

                <div className="header_center">
                    <SearchInput />
                </div>

                <div className="header_right">
                    <HeaderButton icon={<EnvironmentOutlined />} title="Hệ thống" subtitle="cửa hàng" />
                    <HeaderButton icon={<ContainerOutlined />} title="Tìm" subtitle="đơn hàng" to="/orders" />
                    <HeaderButton icon={<ShoppingCartOutlined />} title="Giỏ hàng" subtitle="của bạn" to="/cart" />
                    {user ? (
                        <>
                            <Dropdown icon={<UserOutlined />} title="Xin chào," subtitle={user.username} menu={{ items }} />
                        </>
                    ) : (
                        <>
                            <HeaderButton icon={<UserAddOutlined />} title="Đăng ký" onClick={() => setOpenRegister(true)} />
                            <HeaderButton icon={<LoginOutlined />} title="Đăng nhập" onClick={() => setOpenLogin(true)} />
                        </>
                    )}
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