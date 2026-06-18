import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    CaretRightIcon,
    CaretLeftIcon,
    FireIcon,
} from "@phosphor-icons/react";
import { Empty, Spin, Typography, message } from "antd";
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import productsService from "../../products/services/products.service";
import { getAllProductPromotion } from "../services/promotion.service";
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

const FEATURED_CATEGORIES = [
    "Laptop", "PC", "Chuột", "Bàn phím", "Màn hình", "Tai nghe",
    "Thiết bị nhớ", "CPU", "Card đồ họa", "Tản nhiệt",
];

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

function HomePage() {
    const navigate = useNavigate();
    const [productsByCategory, setProductsByCategory] = useState({});
    const [promoProducts, setPromoProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const scrollRefs = useRef({});

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

            const [promoData, ...catResults] = await Promise.all([
                getAllProductPromotion().catch(() => ({ promotionItems: [] })),
                ...targetCats.slice(0, 8).map(async (cat) => {
                    const data = await productsService.getProductsByCategoryName(cat.name, {
                        page: 0,
                        size: 20,
                        sortBy: "id",
                        sortDir: "desc",
                    });
                    return { category: cat.name, products: data?.products || data?.items || [] };
                }),
            ]);

            const promoItems = promoData?.promotionItems || [];
            const promoIds = new Set(promoItems.map((p) => p.productId));
            const discountMap = {};
            promoItems.forEach((p) => { discountMap[p.productId] = p.discountPercent; });

            const grouped = {};
            const promos = [];

            catResults.forEach((result) => {
                if (result?.status === "rejected") return;
                const catData = result;
                if (catData?.products?.length > 0) {
                    grouped[catData.category] = catData.products;

                    catData.products.forEach((product) => {
                        if (promoIds.has(product.id)) {
                            const discount = discountMap[product.id];
                            promos.push({
                                ...product,
                                discount,
                                salePrice: Math.round((product.price * (100 - discount)) / 100),
                            });
                        }
                    });
                }
            });

            setProductsByCategory(grouped);
            setPromoProducts(promos);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải sản phẩm."));
        } finally {
            setLoading(false);
        }
    }, [categories, messageApi]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        if (categories.length > 0) fetchProducts();
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

    const handleScroll = useCallback((sectionId, direction) => {
        const container = scrollRefs.current[sectionId];
        if (container) {
            container.scrollBy({ left: direction * 480, behavior: "smooth" });
        }
    }, []);

    const PROMO_SECTION_ID = "__promos__";

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

                    {promoProducts.length > 0 && (
                        <section className="homepage-row homepage-row--promo">
                            <div className="homepage-row__header homepage-row__header--promo">
                                <div className="homepage-row__title-group">
                                    <FireIcon size={22} weight="fill" className="homepage-row__promo-icon" />
                                    <h3 className="homepage-row__title homepage-row__title--promo">
                                        Deal nóng - Khuyến mãi đặc biệt
                                    </h3>
                                </div>
                                <div className="homepage-row__nav">
                                    <button
                                        className="homepage-row__arrow"
                                        onClick={() => handleScroll(PROMO_SECTION_ID, -1)}
                                    >
                                        <CaretLeftIcon size={18} weight="bold" />
                                    </button>
                                    <button
                                        className="homepage-row__arrow"
                                        onClick={() => handleScroll(PROMO_SECTION_ID, 1)}
                                    >
                                        <CaretRightIcon size={18} weight="bold" />
                                    </button>
                                </div>
                            </div>
                            <div
                                className="homepage-row__scroll"
                                ref={(el) => { scrollRefs.current[PROMO_SECTION_ID] = el; }}
                            >
                                {promoProducts.map((product) => (
                                    <div key={product.id} className="homepage-row__item">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {productSections.map((section) => (
                        <section className="homepage-row" key={section.id}>
                            <div className="homepage-row__header">
                                <h3 className="homepage-row__title">{section.title}</h3>
                                <div className="homepage-row__nav">
                                    <button
                                        className="homepage-row__arrow"
                                        onClick={() => handleScroll(section.id, -1)}
                                    >
                                        <CaretLeftIcon size={18} weight="bold" />
                                    </button>
                                    <button
                                        className="homepage-row__arrow"
                                        onClick={() => handleScroll(section.id, 1)}
                                    >
                                        <CaretRightIcon size={18} weight="bold" />
                                    </button>
                                </div>
                            </div>
                            <div
                                className="homepage-row__scroll"
                                ref={(el) => { scrollRefs.current[section.id] = el; }}
                            >
                                {section.products.map((product) => (
                                    <div key={product.id || product._id || product.code} className="homepage-row__item">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {!loading && Object.keys(productsByCategory).length === 0 && (
                        <div className="homepage-empty">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sản phẩm nào" />
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
}

export default HomePage;
