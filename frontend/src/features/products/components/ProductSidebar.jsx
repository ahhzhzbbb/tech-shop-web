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
<<<<<<< HEAD
        ],
=======
        ]
>>>>>>> 92dfd95 (add sidebar and navigate)
    },
    {
        section: "Thiết bị chính",
        items: [
            { id: "laptop", label: "Laptop", badge: "Mới", badgeType: "new" },
<<<<<<< HEAD
=======
            { id: "laptop-gaming", label: "Laptop Gaming", badge: "Hot", badgeType: "hot" },
>>>>>>> 92dfd95 (add sidebar and navigate)
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
<<<<<<< HEAD
    home: <HomeOutlined style={{ fontSize: 18 }} />,
=======
    home: <HomeOutlined size={18} />,
>>>>>>> 92dfd95 (add sidebar and navigate)
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
<<<<<<< HEAD

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

=======
            label: item.badge
                ? <span className="psb-item-label">{item.label} <Badge type={item.badgeType} label={item.badge} /></span>
                : item.label,
        })),
    };
>>>>>>> 92dfd95 (add sidebar and navigate)
    return gi === 0 ? [groupItem] : [{ type: "divider" }, groupItem];
});

// =========================================
// ProductSideBar
// =========================================
<<<<<<< HEAD
=======
/**
 * @param {object}   props
 * @param {string}   props.defaultSelected - Key mặc định được chọn
 * @param {function} props.onSelect  - Callback khi chọn item (key)
 */
>>>>>>> 92dfd95 (add sidebar and navigate)
export default function ProductSideBar({
    defaultSelected = "home",
    onSelect,
}) {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([defaultSelected]);

    const handleSelect = ({ key }) => {
        setSelectedKeys([key]);
        onSelect?.(key);
<<<<<<< HEAD

        if (key === "home") {
=======
        if (key == "home") {
>>>>>>> 92dfd95 (add sidebar and navigate)
            navigate("/");
        } else {
            navigate(`/products/${key}`);
        }
    };

    return (
<<<<<<< HEAD
        <aside className="psb-wrapper">
=======
        <aside className={`psb-wrapper`}>
>>>>>>> 92dfd95 (add sidebar and navigate)
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