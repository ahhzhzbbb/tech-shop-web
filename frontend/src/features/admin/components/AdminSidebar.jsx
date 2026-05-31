import { useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
    SquaresFour,
    Package,
    Tag,
    ShoppingCart,
    ChartBar,
    House,
} from "@phosphor-icons/react";
import "./AdminSidebar.scss";

const categories = [
    {
        items: [
            { id: "home", label: "Trang chủ" },
        ],
    },
    {
        section: "Quản lý",
        items: [
            { id: "overview", label: "Tổng quan", badge: "Admin", badgeType: "admin" },
            { id: "products", label: "Sản phẩm" },
            { id: "categories", label: "Danh mục" },
            { id: "orders", label: "Đơn hàng" },
            { id: "statistics", label: "Thống kê" },
        ],
    },
];

const iconMap = {
    home: <House size={18} />,
    overview: <SquaresFour size={18} />,
    products: <Package size={18} />,
    categories: <Tag size={18} />,
    orders: <ShoppingCart size={18} />,
    statistics: <ChartBar size={18} />,
};

const Badge = ({ type, label }) => (
    <span className={`asb-badge asb-badge--${type}`}>{label}</span>
);

const menuItems = categories.flatMap((group, gi) => {
    const groupItem = {
        key: `group-${gi}`,
        type: "group",
        label: group.section,
        children: group.items.map((item) => ({
            key: item.id,
            icon: iconMap[item.id],
            label: (
                <span className="asb-item-label">
                    <span className="asb-item-text">{item.label}</span>
                    {item.badge && (
                        <Badge type={item.badgeType} label={item.badge} />
                    )}
                </span>
            ),
        })),
    };

    return gi === 0 ? [groupItem] : [{ type: "divider" }, groupItem];
});

export default function AdminSidebar({
    defaultSelected = "overview",
    onSelect,
}) {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([defaultSelected]);

    const handleSelect = ({ key }) => {
        setSelectedKeys([key]);
        onSelect?.(key);

        if (key === "home") {
            navigate("/");
        } else {
            navigate(`/admin/${key}`);
        }
    };

    return (
        <aside className="asb-wrapper">
            <div className="asb-inner">
                <div className="asb-header">
                    <span className="asb-header__logo">⬡</span>
                    <span className="asb-header__title">Admin Panel</span>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    onSelect={handleSelect}
                    items={menuItems}
                    className="asb-menu"
                    inlineIndent={16}
                />
            </div>
        </aside>
    );
}