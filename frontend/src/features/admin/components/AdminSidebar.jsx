import { Button, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
    SquaresFour,
    Package,
    Tag,
    ShoppingCart,
    ChartBar,
    Percent,
} from "@phosphor-icons/react";
import shopName from "../../../assets/shop_name.png";
import "./AdminSidebar.scss";

const categories = [
    {
        section: "Quản lý",
        items: [
            { id: "overview", label: "Tổng quan" },
            { id: "products", label: "Sản phẩm" },
            { id: "categories", label: "Danh mục" },
            { id: "orders", label: "Đơn hàng" },
            { id: "promotions", label: "Khuyến mãi" },
            { id: "statistics", label: "Thống kê" },
        ],
    },
];

const iconMap = {
    overview: <SquaresFour size={18} />,
    products: <Package size={18} />,
    categories: <Tag size={18} />,
    orders: <ShoppingCart size={18} />,
    promotions: <Percent size={18} />,
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

const getSelectedKey = (pathname) => {
    if (pathname === "/") return "home";
    if (pathname === "/admin") return "overview";

    const match = pathname.match(/^\/admin\/([^/]+)/);
    return match?.[1] || "overview";
};

export default function AdminSidebar({ onSelect }) {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedKey = getSelectedKey(location.pathname);

    const handleSelect = ({ key }) => {
        onSelect?.(key);

        if (key === "home") {
            navigate("/");
        } else if (key === "overview") {
            navigate("/admin")
        } else {
            navigate(`/admin/${key}`);
        }
    };

    return (
        <aside className="asb-wrapper">
            <div className="asb-inner">
                <Button
                    className="asb-header"
                    onClick={() => navigate("/")}
                    aria-label="Về trang chủ"
                >
                    <img className="asb-header__logo-img" src={shopName} alt="Trang chủ" />
                </Button>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onSelect={handleSelect}
                    items={menuItems}
                    className="asb-menu"
                    inlineIndent={16}
                />
            </div>
        </aside>
    );
}
