import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    Tag,
} from "@phosphor-icons/react";
import { Empty, Spin, Typography, message } from "antd";
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import productsService from "../../products/services/products.service";
import useCategoryStore from "../../../store/categoryStore";
import "./HomePage.scss";

const { Title, Text } = Typography;

const CATEGORY_ICONS = {
    "Laptop": LaptopIcon,
    "PC": DesktopTowerIcon,
    "Chuột": MouseIcon,
    "Bàn phím": KeyboardIcon,
    "Màn hình": DesktopIcon,
    "Tai nghe": HeadphonesIcon,
    "Thiết bị nhớ": MemoryIcon,
    "CPU": CpuIcon,
    "Card đồ họa": GraphicsCardIcon,
    "Tản nhiệt": FanIcon,
};

const FEATURED_CATEGORIES = ["Laptop", "PC", "Chuột", "Bàn phím", "Màn hình", "Tai nghe", "Thiết bị nhớ", "CPU", "Card đồ họa", "Tản nhiệt"];

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

function HomePage() {
    const navigate = useNavigate();
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const categories = useCategoryStore((s) => s.categories);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);

    const featuredCategories = useMemo(() => {
        return categories.filter((c) => FEATURED_CATEGORIES.includes(c.name) && c.active !== false);
    }, [categories]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const activeCats = categories.filter((c) => c.active !== false);
            const targetCats = activeCats.length > 0 ? activeCats : FEATURED_CATEGORIES.map((name) => ({ name }));

            const results = await Promise.allSettled(
                targetCats.slice(0, 8).map(async (cat) => {
                    const data = await productsService.getProductsByCategoryName(cat.name, {
                        page: 0,
                        size: 8,
                        sortBy: "id",
                        sortDir: "desc",
                    });
                    return { category: cat.name, products: data?.products || data?.items || [] };
                })
            );

            const grouped = {};
            results.forEach((result) => {
                if (result.status === "fulfilled" && result.value.products.length > 0) {
                    grouped[result.value.category] = result.value.products;
                }
            });
            setProductsByCategory(grouped);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải sản phẩm."));
        } finally {
            setLoading(false);
        }
    }, [categories, messageApi]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (categories.length > 0) {
            fetchProducts();
        }
    }, [categories.length, fetchProducts]);

    const categoryCards = useMemo(() => {
        const primary = featuredCategories.slice(0, 6);
        const IconFallback = Tag;
        return primary.map((cat) => ({
            key: cat.name,
            label: cat.name,
            icon: CATEGORY_ICONS[cat.name] || IconFallback,
            path: `/products/${cat.name}`,
        }));
    }, [featuredCategories]);

    const productSections = useMemo(() => {
        return Object.entries(productsByCategory).map(([categoryName, products]) => ({
            id: categoryName,
            title: categoryName,
            products,
        }));
    }, [productsByCategory]);

    return (
        <div className="homepage-layout">
            <ProductSideBar />
            <div className="homepage-content">
                {contextHolder}

                <Spin spinning={loading}>
                    <section className="homepage-hero">
                        <div className="homepage-hero__overlay">
                            <Title level={2} className="homepage-hero__title">
                                Công nghệ dẫn đầu - Giá tốt mỗi ngày
                            </Title>
                            <Text className="homepage-hero__subtitle">
                                Khám phá hàng ngàn sản phẩm chính hãng với giá ưu đãi và dịch vụ tận tâm
                            </Text>
                        </div>
                    </section>

                    {categoryCards.length > 0 && (
                        <section className="homepage-categories">
                            <div className="homepage-categories__header">
                                <Title level={4} className="homepage-categories__title">
                                    Danh mục nổi bật
                                </Title>
                            </div>
                            <div className="homepage-categories__grid">
                                {categoryCards.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            className="homepage-categories__card"
                                            onClick={() => navigate(item.path)}
                                        >
                                            <span className="homepage-categories__card-icon">
                                                <Icon size={28} weight="duotone" />
                                            </span>
                                            <span className="homepage-categories__card-label">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {productSections.map((section) => (
                        <section className="homepage-section" key={section.id}>
                            <div className="homepage-section__header">
                                <Text strong className="homepage-section__title">
                                    {section.title}
                                </Text>
                            </div>
                            <div className="homepage-section__grid">
                                {section.products.map((product) => (
                                    <ProductCard
                                        product={product}
                                        key={product.id || product._id || product.code}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}

                    {!loading && Object.keys(productsByCategory).length === 0 && (
                        <div className="homepage-empty">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa có sản phẩm nào"
                            />
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
}

export default HomePage;