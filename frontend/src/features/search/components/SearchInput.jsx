import { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../products/services/products.service";
import { getAllProductPromotion } from "../../home/services/promotion.service";
import "./SearchInput.scss";

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount || 0)
    .replace("₫", "đ");
};

const SearchInput = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Load all promotions on mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllProductPromotion();
        setPromotions(data?.promotionItems || []);
      } catch (err) {
        console.error("Lỗi khi tải thông tin khuyến mãi:", err);
      }
    };
    fetchPromotions();
  }, []);

  // Debounce keyword input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  // Fetch search results when debounced keyword changes
  useEffect(() => {
    if (!debouncedKeyword) {
      setResults([]);
      return;
    }

    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(debouncedKeyword, 0, 8);
        if (!active) return;
        setResults(data?.products || data?.items || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm sản phẩm:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      active = false;
    };
  }, [debouncedKeyword]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getProductPromo = (productId) => {
    return promotions.find((p) => p.productId === productId);
  };

  const getSalePrice = (product) => {
    const promo = getProductPromo(product.id);
    if (promo && promo.discountPercent > 0) {
      return Math.round((product.price * (100 - promo.discountPercent)) / 100);
    }
    return product.price;
  };

  const hasDiscount = (product) => {
    const promo = getProductPromo(product.id);
    return !!(promo && promo.discountPercent > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (keyword.trim()) {
      setIsOpen(true);
    }
  };

  const handleItemClick = (product) => {
    const category = product.categoryName || "Laptop";
    navigate(`/products/${encodeURIComponent(category)}/${product.id}`);
    setIsOpen(false);
    setKeyword("");
  };

  const handleViewAllClick = () => {
    if (keyword.trim()) {
      navigate(`/products/tim-kiem?q=${encodeURIComponent(keyword.trim())}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleViewAllClick();
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <Input
        placeholder="Bạn cần tìm gì?"
        value={keyword}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        suffix={
          <SearchOutlined
            onClick={handleViewAllClick}
            style={{
              fontSize: 18,
              color: "#333",
              cursor: "pointer",
            }}
          />
        }
        size="large"
        style={{
          borderRadius: 4,
          height: 40,
          border: "none",
          boxShadow: "none",
          fontSize: 14,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      />

      {isOpen && (
        <div className="search-dropdown">
          {loading ? (
            <div className="search-dropdown__loading">
              <Spin size="small" />
              <span>Đang tìm kiếm...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="search-dropdown__list">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="search-dropdown__item"
                  onClick={() => handleItemClick(product)}
                >
                  <div className="search-dropdown__item-info">
                    <div className="search-dropdown__item-name" title={product.name}>
                      {product.name}
                    </div>
                    <div className="search-dropdown__item-prices">
                      <span className="search-dropdown__item-price">
                        {formatCurrency(getSalePrice(product))}
                      </span>
                      {hasDiscount(product) && (
                        <span className="search-dropdown__item-old-price">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="search-dropdown__item-img-wrap">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="search-dropdown__item-img"
                    />
                  </div>
                </div>
              ))}
              <div
                className="search-dropdown__view-all"
                onClick={handleViewAllClick}
              >
                Xem tất cả kết quả cho "{keyword}" →
              </div>
            </div>
          ) : (
            keyword.trim() && (
              <div className="search-dropdown__empty">
                Không tìm thấy sản phẩm nào
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;