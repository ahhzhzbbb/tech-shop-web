import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Spin, Alert, Empty, Select, Slider, Button, Input, Pagination } from "antd";
import { FunnelSimpleIcon } from "@phosphor-icons/react";

import productsService from "../services/products.service";
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import "./Products.scss";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
    { value: "name-asc", label: "Tên: A → Z" },
    { value: "name-desc", label: "Tên: Z → A" },
    { value: "price-asc", label: "Giá: tăng dần" },
    { value: "price-desc", label: "Giá: giảm dần" },
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
];

// sortValue (UI) -> tham số server
const SORT_MAP = {
    "name-asc": { sortBy: "name", sortDir: "asc" },
    "name-desc": { sortBy: "name", sortDir: "desc" },
    "price-asc": { sortBy: "price", sortDir: "asc" },
    "price-desc": { sortBy: "price", sortDir: "desc" },
    newest: { sortBy: "id", sortDir: "desc" },
    oldest: { sortBy: "id", sortDir: "asc" },
};

// Danh mục "ảo" trên sidebar -> gồm nhiều danh mục thật ở backend,
// mỗi danh mục thật hiển thị thành 1 danh sách riêng (phân trang server-side độc lập)
const VIRTUAL_CATEGORIES = {
    "Thiết bị nhớ": ["RAM", "SSD"],
};

// Trả về danh sách danh mục thật tương ứng (1 phần tử nếu không phải danh mục ảo)
const resolveCategories = (categoryName) =>
    VIRTUAL_CATEGORIES[categoryName] || [categoryName];

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(amount || 0)
        .replace("₫", "đ");

/**
 * Một danh sách sản phẩm độc lập (1 danh mục hoặc kết quả tìm kiếm),
 * tự quản lý phân trang server-side của riêng nó.
 */
function ProductList({
    title,
    categoryName,
    searchQuery,
    sortValue,
    priceNarrowed,
    appliedPriceRange,
    appliedBrand,
}) {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const isSearch = searchQuery !== undefined;
    const minPrice = priceNarrowed ? appliedPriceRange[0] : undefined;
    const maxPrice = priceNarrowed ? appliedPriceRange[1] : undefined;

    // Về trang 1 khi đổi danh mục / từ khoá / sắp xếp / bộ lọc
    useEffect(() => {
        setPage(1);
    }, [categoryName, searchQuery, sortValue, minPrice, maxPrice, appliedBrand]);

    useEffect(() => {
        let active = true;
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (isSearch) {
                    data = searchQuery
                        ? await productsService.searchProducts(searchQuery, page - 1, PAGE_SIZE)
                        : { products: [], pagination: { totalElements: 0 } };
                } else {
                    const { sortBy, sortDir } = SORT_MAP[sortValue] || SORT_MAP.newest;
                    data = await productsService.getProductsByCategoryName(categoryName, {
                        page: page - 1,
                        size: PAGE_SIZE,
                        sortBy,
                        sortDir,
                        minPrice,
                        maxPrice,
                        brandName: appliedBrand || undefined,
                    });
                }
                if (!active) return;
                setProducts(data.products || data.items || []);
                setTotal(data.pagination?.totalElements || 0);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryName, searchQuery, sortValue, minPrice, maxPrice, appliedBrand, page]);

    return (
        <section className="products__list">
            {title && (
                <div className="products__listHeader">
                    <h2 className="products__listTitle">{title}</h2>
                    {!loading && !error && (
                        <span className="products__count">{total} sản phẩm</span>
                    )}
                </div>
            )}

            {loading ? (
                <div className="products__status products__status--loading">
                    <Spin tip="Đang tải sản phẩm..." />
                </div>
            ) : error ? (
                <div className="products__status products__status--error">
                    <Alert message="Lỗi khi tải sản phẩm" description={error} type="error" showIcon />
                </div>
            ) : products.length === 0 ? (
                <div className="products__status products__status--empty">
                    <Empty description="Không có sản phẩm phù hợp" />
                </div>
            ) : (
                <>
                    <div className="products__grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id || product._id || product.code}
                                product={product}
                                categoryName={categoryName}
                            />
                        ))}
                    </div>
                    <div className="products__pagination">
                        <Pagination
                            current={page}
                            pageSize={PAGE_SIZE}
                            total={total}
                            onChange={setPage}
                            showSizeChanger={false}
                            showTotal={(value) => `${value} sản phẩm`}
                        />
                    </div>
                </>
            )}
        </section>
    );
}

function Products() {
    const { category } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");
    const isSearch = category === "tim-kiem";

    // Danh mục ảo (vd: "Thiết bị nhớ") -> nhiều danh mục thật, mỗi cái 1 danh sách riêng
    const realCategories = useMemo(() => resolveCategories(category), [category]);
    const isVirtualCategory = realCategories.length > 1;

    const [sortValue, setSortValue] = useState("newest");
    const [showFilter, setShowFilter] = useState(false);

    // Khoảng giá min/max của danh mục (lấy từ server)
    const [priceBounds, setPriceBounds] = useState([0, 0]);
    // draft: đang chỉnh trong panel; applied: thực sự gửi lên server
    const [draftPriceRange, setDraftPriceRange] = useState([0, 0]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 0]);
    const [draftBrand, setDraftBrand] = useState("");
    const [appliedBrand, setAppliedBrand] = useState("");

    // Lấy khoảng giá min/max của danh mục bằng 2 truy vấn nhỏ (size 1) cho mỗi danh mục thật
    useEffect(() => {
        if (!category || isSearch) {
            setPriceBounds([0, 0]);
            setDraftPriceRange([0, 0]);
            setAppliedPriceRange([0, 0]);
            setDraftBrand("");
            setAppliedBrand("");
            return;
        }

        let active = true;
        (async () => {
            try {
                const pairs = await Promise.all(
                    realCategories.flatMap((c) => [
                        productsService.getProductsByCategoryName(c, {
                            sortBy: "price",
                            sortDir: "asc",
                            page: 0,
                            size: 1,
                        }),
                        productsService.getProductsByCategoryName(c, {
                            sortBy: "price",
                            sortDir: "desc",
                            page: 0,
                            size: 1,
                        }),
                    ])
                );
                if (!active) return;
                const prices = pairs
                    .map((res) => Number(res.products?.[0]?.price))
                    .filter((p) => Number.isFinite(p));
                const min = prices.length ? Math.min(...prices) : 0;
                const max = prices.length ? Math.max(...prices) : 0;
                setPriceBounds([min, max]);
                setDraftPriceRange([min, max]);
                setAppliedPriceRange([min, max]);
                setDraftBrand("");
                setAppliedBrand("");
            } catch {
                if (active) setPriceBounds([0, 0]);
            }
        })();

        return () => {
            active = false;
        };
        // realCategories chỉ đổi khi category đổi
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, isSearch]);

    // Có thu hẹp giá so với bounds hay không -> mới gửi minPrice/maxPrice
    const priceNarrowed =
        appliedPriceRange[0] > priceBounds[0] || appliedPriceRange[1] < priceBounds[1];

    const isFilterApplied = appliedBrand !== "" || priceNarrowed;

    const handleApplyFilters = () => {
        setAppliedPriceRange(draftPriceRange);
        setAppliedBrand(draftBrand.trim());
    };

    const handleResetFilters = () => {
        setDraftPriceRange(priceBounds);
        setDraftBrand("");
        setAppliedPriceRange(priceBounds);
        setAppliedBrand("");
    };

    return (
        <div className="productLayout">
            <ProductSideBar />
            <div className="products__main">
                <div className="products__header">
                    <h1 className="products__title">
                        {isSearch ? `Kết quả tìm kiếm cho: "${searchQuery}"` : `Danh mục: ${category}`}
                    </h1>
                </div>

                {!isSearch && (
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
                                    <Input
                                        allowClear
                                        placeholder="Nhập tên hãng (vd: Logitech)"
                                        value={draftBrand}
                                        onChange={(event) => setDraftBrand(event.target.value)}
                                        onPressEnter={handleApplyFilters}
                                        className="products__brandSelect"
                                    />
                                </div>

                                <div className="products__filterActions">
                                    <Button onClick={handleResetFilters}>Đặt lại</Button>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            handleApplyFilters();
                                            setShowFilter(false);
                                        }}
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isSearch ? (
                    <ProductList searchQuery={searchQuery} />
                ) : (
                    realCategories.map((c) => (
                        <ProductList
                            key={c}
                            categoryName={c}
                            title={isVirtualCategory ? c : undefined}
                            sortValue={sortValue}
                            priceNarrowed={priceNarrowed}
                            appliedPriceRange={appliedPriceRange}
                            appliedBrand={appliedBrand}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Products;
