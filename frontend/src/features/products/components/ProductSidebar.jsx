import { useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { MoreOutlined, LaptopOutlined, HomeOutlined } from "@ant-design/icons";
import {
    LaptopIcon,
    DesktopTowerIcon,
    MouseIcon,
    KeyboardIcon,
    DesktopIcon,
    HeadphonesIcon,
    MemoryIcon,
    CpuIcon,
    GraphicsCardIcon,
    FanIcon,
} from "@phosphor-icons/react";
import "./ProductSideBar.scss";

// =========================================
// Categories data
// =========================================
const categories = [
    {
        items: [
            { id: "home", label: "Trang chủ", badge: "Sales", badgeType: "hot" },
        ],
    },
    {
        section: "Thiết bị chính",
        items: [
            { id: "laptop", label: "Laptop", badge: "Mới", badgeType: "new" },
            { id: "pc", label: "PC" },
        ],
    },
    {
        section: "Ngoại vi",
        items: [
            { id: "mouse", label: "Chuột" },
            { id: "keyboard", label: "Bàn phím" },
            { id: "screen", label: "Màn hình" },
            { id: "headphone", label: "Tai nghe" },
        ],
    },
    {
        section: "Linh kiện",
        items: [
            { id: "memory", label: "Thiết bị nhớ" },
            { id: "cpu", label: "CPU" },
            { id: "vga", label: "Card đồ họa" },
            { id: "heatSink", label: "Tản nhiệt" },
        ],
    },
    {
        section: "Khác",
        items: [
            { id: "accessory", label: "Phụ kiện" },
        ],
    },
];

// =========================================
// Icon map
// =========================================
const iconMap = {
    home: <HomeOutlined style={{ fontSize: 18 }} />,
    laptop: <LaptopIcon size={18} />,
    "laptop-gaming": <LaptopOutlined style={{ fontSize: 18 }} />,
    pc: <DesktopTowerIcon size={18} />,
    mouse: <MouseIcon size={18} />,
    keyboard: <KeyboardIcon size={18} />,
    screen: <DesktopIcon size={18} />,
    headphone: <HeadphonesIcon size={18} />,
    memory: <MemoryIcon size={18} />,
    cpu: <CpuIcon size={18} />,
    vga: <GraphicsCardIcon size={18} />,
    heatSink: <FanIcon size={18} />,
    accessory: <MoreOutlined style={{ fontSize: 18 }} />,
};

// =========================================
// Badge helper
// =========================================
const Badge = ({ type, label }) => (
    <span className={`psb-badge psb-badge--${type}`}>{label}</span>
);

// =========================================
// Build Menu items from categories
// =========================================
const menuItems = categories.flatMap((group, gi) => {
    const groupItem = {
        key: `group-${gi}`,
        type: "group",
        label: group.section,
        children: group.items.map((item) => ({
            key: item.id,
            icon: iconMap[item.id],

            // FIX: tất cả item đều dùng chung class psb-item-label
            label: (
                <span className="psb-item-label">
                    <span className="psb-item-text">{item.label}</span>

                    {item.badge && (
                        <Badge
                            type={item.badgeType}
                            label={item.badge}
                        />
                    )}
                </span>
            ),
        })),
    };

    return gi === 0 ? [groupItem] : [{ type: "divider" }, groupItem];
});

// =========================================
// ProductSideBar
// =========================================
export default function ProductSideBar({
    defaultSelected = "home",
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
            navigate(`/products/${key}`);
        }
    };

    return (
        <aside className="psb-wrapper">
            <div className="psb-inner">
                <div className="psb-header">
                    <span className="psb-header__title">Danh mục sản phẩm</span>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    onSelect={handleSelect}
                    items={menuItems}
                    className="psb-menu"
                    inlineIndent={16}
                />

                <div className="psb-promo">
                    <span className="psb-promo__icon">🏷️</span>
                    <div>
                        <p className="psb-promo__title">Khuyến mãi hôm nay</p>
                        <span className="psb-promo__sub">Giảm đến 30% linh kiện →</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}