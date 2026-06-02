import { useState, useEffect, useMemo } from "react";
import { Menu, Popover } from "antd";
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
    UserGearIcon,
} from "@phosphor-icons/react";
import "./ProductSideBar.scss";
import useCategoryStore from "../../../store/categoryStore";

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
    {
        section: "Admin",
        items: [
            { id: "admin", label: "Quản lý" },
        ]
    }
];

const DEFAULT_CATEGORY_NAME = ["Laptop", "PC", "Chuột", "Bàn phím", "Màn hình", "Tai nghe", "RAM", "CPU", "Card đồ họa", "Tản nhiệt"];

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
    admin: <UserGearIcon size={18} />
};

// =========================================
// Badge helper
// =========================================
const Badge = ({ type, label }) => (
    <span className={`psb-badge psb-badge--${type}`}>{label}</span>
);

// =========================================
// ProductSideBar
// =========================================
export default function ProductSideBar({
    defaultSelected = "home",
    onSelect
}) {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([defaultSelected]);

    const storeCategories = useCategoryStore((s) => s.categories);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // Các danh mục thuộc nhóm "Phụ kiện" (không nằm trong danh mục mặc định)
    const optionCategories = useMemo(
        () => storeCategories.filter((c) => !DEFAULT_CATEGORY_NAME.includes(c.name)),
        [storeCategories]
    );

    // Nội dung flyout hiển thị khi hover vào "Phụ kiện"
    const accessoryOptions = (
        <div className="psb-options">
            {optionCategories.length > 0 ? (
                optionCategories.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        className="psb-options__item"
                        onClick={() => navigate(`/products/${c.name}`)}
                    >
                        {c.name}
                    </button>
                ))
            ) : (
                <span className="psb-options__empty">Chưa có danh mục</span>
            )}
        </div>
    );

    const menuItems = useMemo(
        () =>
            categories.flatMap((group, gi) => {
                const groupItem = {
                    key: `group-${gi}`,
                    type: "group",
                    label: group.section,
                    children: group.items.map((item) => ({
                        key: item.id,
                        icon: iconMap[item.id],

                        // "Phụ kiện": hover hiện danh mục con (Popover), không điều hướng
                        label:
                            item.id === "accessory" ? (
                                <Popover
                                    trigger="hover"
                                    placement="rightTop"
                                    overlayClassName="psb-options-popover"
                                    content={accessoryOptions}
                                >
                                    <span className="psb-item-label">
                                        <span className="psb-item-text">{item.label}</span>
                                    </span>
                                </Popover>
                            ) : (
                                <span className="psb-item-label">
                                    <span className="psb-item-text">{item.label}</span>
                                    {item.badge && (
                                        <Badge type={item.badgeType} label={item.badge} />
                                    )}
                                </span>
                            ),
                    })),
                };

                return gi === 0 ? [groupItem] : [{ type: "divider" }, groupItem];
            }),
        // accessoryOptions phụ thuộc optionCategories nên đủ để rebuild
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [optionCategories]
    );

    const handleSelect = ({ key }) => {
        // Nhấn vào "Phụ kiện" không điều hướng, chỉ dùng để hover xem danh mục con
        if (key === "accessory") return;

        setSelectedKeys([key]);
        onSelect?.(key);

        if (key === "home") {
            navigate("/");
        } else if (key === "admin") {
            navigate("/admin");
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
            </div>
        </aside>
    );
}