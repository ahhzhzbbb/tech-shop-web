import { useEffect, useState } from "react";
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

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(amount || 0)
        .replace("₫", "đ");

function Products() {
    const { category } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortValue, setSortValue] = useState("newest");
    const [showFilter, setShowFilter] = useState(false);

    // Khoảng giá min/max của danh mục (lấy từ server)
    const [priceBounds, setPriceBounds] = useState([0, 0]);
    // draft: đang chỉnh trong panel; applied: thực sự gửi lên server
    const [draftPriceRange, setDraftPriceRange] = useState([0, 0]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 0]);
    const [draftBrand, setDraftBrand] = useState("");
    const [appliedBrand, setAppliedBrand] = useState("");

    const [page, setPage] = useState(1);

    // Lấy khoảng giá min/max của danh mục bằng 2 truy vấn nhỏ (size 1)
    useEffect(() => {
        if (!category) return;
        if (category === "tim-kiem") {
            setPriceBounds([0, 0]);
            setDraftPriceRange([0, 0]);
            setAppliedPriceRange([0, 0]);
            setDraftBrand("");
            setAppliedBrand("");
            setPage(1);
            return;
        }

        let active = true;
        (async () => {
            try {
                const [asc, desc] = await Promise.all([
                    productsService.getProductsByCategoryName(category, {
                        sortBy: "price",
                        sortDir: "asc",
                        page: 0,
                        size: 1,
                    }),
                    productsService.getProductsByCategoryName(category, {
                        sortBy: "price",
                        sortDir: "desc",
                        page: 0,
                        size: 1,
                    }),
                ]);
                if (!active) return;
                const min = Number(asc.products?.[0]?.price) || 0;
                const max = Number(desc.products?.[0]?.price) || 0;
                setPriceBounds([min, max]);
                setDraftPriceRange([min, max]);
                setAppliedPriceRange([min, max]);
                setDraftBrand("");
                setAppliedBrand("");
                setPage(1);
            } catch {
                if (active) setPriceBounds([0, 0]);
            }
        })();

        return () => {
            active = false;
        };
    }, [category]);

    // Có thu hẹp giá so với bounds hay không -> mới gửi minPrice/maxPrice
    const priceNarrowed =
        appliedPriceRange[0] > priceBounds[0] || appliedPriceRange[1] < priceBounds[1];

    // Tải danh sách sản phẩm (server-side: category + giá + hãng + sort + phân trang)
    useEffect(() => {
        if (!category) return;

        let active = true;
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (category === "tim-kiem") {
                    if (searchQuery) {
                        data = await productsService.searchProducts(searchQuery, page - 1, PAGE_SIZE);
                    } else {
                        data = { products: [], pagination: { totalElements: 0 } };
                    }
                } else {
                    const { sortBy, sortDir } = SORT_MAP[sortValue] || SORT_MAP.newest;
                    data = await productsService.getProductsByCategoryName(category, {
                        page: page - 1,
                        size: PAGE_SIZE,
                        sortBy,
                        sortDir,
                        minPrice: priceNarrowed ? appliedPriceRange[0] : undefined,
                        maxPrice: priceNarrowed ? appliedPriceRange[1] : undefined,
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
        // priceNarrowed phụ thuộc appliedPriceRange + priceBounds nên không cần liệt kê riêng
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, searchQuery, sortValue, appliedPriceRange, appliedBrand, page]);

    // Về trang 1 khi đổi sắp xếp / điều kiện lọc
    useEffect(() => {
        setPage(1);
    }, [sortValue, appliedPriceRange, appliedBrand]);

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

        if (products.length === 0) {
            return (
                <div className="products__status products__status--empty">
                    <Empty description="Không có sản phẩm phù hợp" />
                </div>
            );
        }

        return (
            <>
                <div className="products__grid">
                    {products.map((product) => (
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
                        total={total}
                        onChange={setPage}
                        showSizeChanger={false}
                        showTotal={(value) => `${value} sản phẩm`}
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
                    <h1 className="products__title">
                        {category === "tim-kiem" ? `Kết quả tìm kiếm cho: "${searchQuery}"` : `Danh mục: ${category}`}
                    </h1>
                    {!loading && !error && (
                        <span className="products__count">{total} sản phẩm</span>
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

                {renderContent()}
            </div>
        </div>
    );
}

export default Products;
