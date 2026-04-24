import { useState } from "react";
import RegisterModal from "../../features/auth/component/RegisterModal.jsx";
import logo from "../../assets/logo_shop.png"
import shopName from "../../assets/shop_name.png"
import HeaderButton from "../ui/HeaderButton.jsx";
import { ShoppingCartOutlined, ContainerOutlined, EnvironmentOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="header">
                <div className="header_left">
                    <image src="../../assets/logo_shop.png" className="header_logo" />
                    <img src="../../assets/shop_name.png" className="header_logo" />
                </div>

                <div className="header_right">
                    <HeaderButton icon={<EnvironmentOutlined />} title="Hệ thống" subtitle="cửa hàng" />
                    <HeaderButton icon={<ContainerOutlined />} title="Tìm" subtitle="đơn hàng" />
                    <HeaderButton icon={<ShoppingCartOutlined />} title="Giỏ hàng" subtitle="của bạn" />
                    <HeaderButton icon={<UserAddOutlined />} title="Đăng ký" />
                    <HeaderButton icon={<LoginOutlined />} title="Đăng nhập" />
                </div>
            </div>

            <RegisterModal
                open={open}
                onCancel={() => setOpen(false)}
            />
        </>
    );
};

export default Header;