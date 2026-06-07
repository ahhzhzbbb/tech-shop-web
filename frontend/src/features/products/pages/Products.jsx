import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Empty, Select, Slider, Button, Pagination } from "antd";
import { FunnelSimpleIcon } from "@phosphor-icons/react";

import productsService from "../services/products.service";
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import "./Product.scss";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
    { value: "name-asc", label: "Tên: A → Z" },
    { value: "name-desc", label: "Tên: Z → A" },
    { value: "price-asc", label: "Giá: tăng dần" },
    { value: "price-desc", label: "Giá: giảm dần" },
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
];

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(amount || 0)
        .replace("₫", "đ");

const sortProducts = (list, sortValue) => {
    const sorted = [...list];
    switch (sortValue) {
        case "name-asc":
            return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || "", "vi"));
        case "name-desc":
            return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || "", "vi"));
        case "price-asc":
            return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        case "price-desc":
            return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        case "oldest":
            return sorted.sort((a, b) => (a.id || 0) - (b.id || 0));
        case "newest":
        default:
            return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
};

function Products() {
    const { category } = useParams();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortValue, setSortValue] = useState("newest");
    const [showFilter, setShowFilter] = useState(false);
    // draft: giá trị đang chỉnh trong panel; applied: giá trị thực sự dùng để lọc
    const [draftPriceRange, setDraftPriceRange] = useState([0, 0]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 0]);
    const [draftBrands, setDraftBrands] = useState([]);
    const [appliedBrands, setAppliedBrands] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!category) return;

        let active = true;
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productsService.getProductsByCategoryName(category, {
                    page: 0,
                    size: 1000,
                });
                if (!active) return;

                const items = data?.products || data?.items || [];
                setAllProducts(items);
                setDraftBrands([]);
                setAppliedBrands([]);
                setPage(1);
            } catch (err) {
                if (!active) return;
                const msg = err?.response?.data?.message || err?.message || String(err);
                setError(msg);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            active = false;
        };
    }, [category]);

    // Khoảng giá min/max lấy động từ dữ liệu của danh mục
    const priceBounds = useMemo(() => {
        if (allProducts.length === 0) return [0, 0];
        const prices = allProducts.map((p) => Number(p.price) || 0);
        return [Math.min(...prices), Math.max(...prices)];
    }, [allProducts]);

    // Reset thanh trượt giá mỗi khi danh mục (dữ liệu) thay đổi
    useEffect(() => {
        setDraftPriceRange(priceBounds);
        setAppliedPriceRange(priceBounds);
    }, [priceBounds]);

    const brandOptions = useMemo(() => {
        const brands = new Set();
        allProducts.forEach((p) => {
            if (p.brandName) brands.add(p.brandName);
        });
        return Array.from(brands)
            .sort((a, b) => a.localeCompare(b, "vi"))
            .map((brand) => ({ value: brand, label: brand }));
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        const [minPrice, maxPrice] = appliedPriceRange;
        const filtered = allProducts.filter((product) => {
            const price = Number(product.price) || 0;
            if (price < minPrice || price > maxPrice) return false;
            if (appliedBrands.length > 0 && !appliedBrands.includes(product.brandName)) {
                return false;
            }
            return true;
        });
        return sortProducts(filtered, sortValue);
    }, [allProducts, appliedPriceRange, appliedBrands, sortValue]);

    const pagedProducts = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, page]);

    // Quay về trang 1 khi điều kiện lọc/sắp xếp thay đổi
    useEffect(() => {
        setPage(1);
    }, [sortValue, appliedPriceRange, appliedBrands]);

    // Đang có lọc khi giá đã thu hẹp so với mặc định hoặc đã chọn thương hiệu
    const isFilterApplied =
        appliedBrands.length > 0 ||
        appliedPriceRange[0] !== priceBounds[0] ||
        appliedPriceRange[1] !== priceBounds[1];

    const handleApplyFilters = () => {
        setAppliedPriceRange(draftPriceRange);
        setAppliedBrands(draftBrands);
    };

    const handleResetFilters = () => {
        setDraftPriceRange(priceBounds);
        setDraftBrands([]);
        setAppliedPriceRange(priceBounds);
        setAppliedBrands([]);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="products__status products__status--loading">
                    <Spin tip="Đang tải sản phẩm..." />
                </div>
            );
        }

        if (error) {
            return (
                <div className="products__status products__status--error">
                    <Alert message="Lỗi khi tải sản phẩm" description={error} type="error" showIcon />
                </div>
            );
        }

        if (filteredProducts.length === 0) {
            return (
                <div className="products__status products__status--empty">
                    <Empty description="Không có sản phẩm phù hợp" />
                </div>
            );
        }

        return (
            <>
                <div className="products__grid">
                    {pagedProducts.map((product) => (
                        <ProductCard
                            key={product.id || product._id || product.code}
                            product={product}
                            categoryName={category}
                        />
                    ))}
                </div>
                <div className="products__pagination">
                    <Pagination
                        current={page}
                        pageSize={PAGE_SIZE}
                        total={filteredProducts.length}
                        onChange={setPage}
                        showSizeChanger={false}
                        showTotal={(total) => `${total} sản phẩm`}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="productLayout">
            <ProductSideBar />
            <div className="products__main">
                <div className="products__header">
                    <h1 className="products__title">Danh mục: {category}</h1>
                    {!loading && !error && (
                        <span className="products__count">{filteredProducts.length} sản phẩm</span>
                    )}
                </div>

                <div className="products__controls">
                    <div className="products__controlsBar">
                        <div className="products__filterButtons">
                            <Button
                                className={`products__filterBtn${showFilter ? " is-active" : ""}`}
                                icon={<FunnelSimpleIcon size={16} weight="bold" />}
                                onClick={() => setShowFilter((prev) => !prev)}
                            >
                                Bộ lọc
                            </Button>
                            <Button onClick={handleResetFilters} disabled={!isFilterApplied}>
                                Xoá lọc
                            </Button>
                        </div>

                        <div className="products__sort">
                            <span className="products__sortLabel">Sắp xếp:</span>
                            <Select
                                value={sortValue}
                                onChange={setSortValue}
                                options={SORT_OPTIONS}
                                className="products__sortSelect"
                            />
                        </div>
                    </div>

                    {showFilter && (
                        <div className="products__filterPanel">
                            <div className="products__filterGroup">
                                <label className="products__filterLabel">Khoảng giá</label>
                                <Slider
                                    range
                                    min={priceBounds[0]}
                                    max={priceBounds[1]}
                                    value={draftPriceRange}
                                    onChange={setDraftPriceRange}
                                    tooltip={{ formatter: (value) => formatCurrency(value) }}
                                    disabled={priceBounds[0] === priceBounds[1]}
                                />
                                <div className="products__priceLabels">
                                    <span>{formatCurrency(draftPriceRange[0])}</span>
                                    <span>{formatCurrency(draftPriceRange[1])}</span>
                                </div>
                            </div>

                            <div className="products__filterGroup">
                                <label className="products__filterLabel">Thương hiệu</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Tất cả thương hiệu"
                                    value={draftBrands}
                                    onChange={setDraftBrands}
                                    options={brandOptions}
                                    className="products__brandSelect"
                                    maxTagCount="responsive"
                                />
                            </div>

                            <div className="products__filterActions">
                                <Button onClick={handleResetFilters}>Đặt lại</Button>
                                <Button type="primary" onClick={() => {
                                    handleApplyFilters();
                                    setShowFilter(false);
                                }}>
                                    Áp dụng
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {renderContent()}
            </div>
        </div>
    );
}

export default Products;
