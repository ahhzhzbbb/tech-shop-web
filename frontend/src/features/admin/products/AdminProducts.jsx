import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Input,
    Popconfirm,
    Typography,
    Empty,
    Spin,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import ProductCard from "../../products/components/ProductCard";
import productsApi from "./productsApi";
import promotionApi from "./promotionApi";
import ProductDrawer from "../components/ProductDrawer";
import useCategoryStore from "../../../store/categoryStore";
import "./AdminProducts.scss";

const { Title, Text } = Typography;
const { Search } = Input;
// Lấy tối đa số sản phẩm mỗi danh mục / kết quả tìm kiếm trong một lần tải
const FETCH_SIZE = 200;

export default function AdminProducts() {
    const [groups, setGroups] = useState([]); // [{ category, products }]
    const [searchResults, setSearchResults] = useState(null); // null = không tìm kiếm
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchCategories = useCategoryStore((s) => s.fetchCategories);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Chế độ tìm kiếm: hiển thị kết quả phẳng
            if (keyword) {
                const data = await productsApi.searchProducts(keyword, 0, FETCH_SIZE);
                setSearchResults(data.products || []);
                return;
            }

            // Chế độ nhóm theo danh mục (lấy danh mục từ store)
            setSearchResults(null);
            const categories = await fetchCategories();
            const results = await Promise.all(
                categories.map((c) =>
                    productsApi
                        .getProductsByCategoryId(c.id, 0, FETCH_SIZE)
                        .then((d) => ({ category: c, products: d.products || [] }))
                        .catch(() => ({ category: c, products: [] }))
                )
            );
            // Ẩn danh mục không có sản phẩm
            setGroups(results.filter((g) => g.products.length > 0));
        } catch {
            messageApi.error("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [keyword, messageApi, fetchCategories]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSearch = (value) => setKeyword(value.trim());

    const openCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingItem(product);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    // Tạo/cập nhật/xoá khuyến mãi cho sản phẩm dựa trên trạng thái switch ở ProductDrawer
    const applyPromotion = async (productId, promotion) => {
        if (!promotion || productId == null) return;
        const { enabled, discountPercent, existingPromoId, existingDiscountPercent } = promotion;

        if (existingPromoId) {
            if (!enabled) {
                // Đang có khuyến mãi -> tắt switch -> xoá
                await promotionApi.deletePromotionById(existingPromoId);
            } else if (discountPercent !== existingDiscountPercent) {
                // Vẫn bật -> đổi % -> cập nhật
                await promotionApi.updatePromotionById(existingPromoId, { productId, discountPercent });
            }
        } else if (enabled) {
            // Chưa có khuyến mãi -> bật switch -> tạo mới
            await promotionApi.createPromotion({ productId, discountPercent });
        }
    };

    const handleSubmit = async (values, promotion) => {
        setConfirmLoading(true);
        try {
            let productId;
            if (editingItem) {
                await productsApi.updateProduct(editingItem.id, values);
                productId = editingItem.id;
                messageApi.success("Cập nhật sản phẩm thành công.");
            } else {
                const created = await productsApi.createProduct(values);
                productId = created?.id;
                messageApi.success("Thêm sản phẩm thành công.");
            }
            await applyPromotion(productId, promotion);
            closeModal();
            fetchData();
        } catch {
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = async (product) => {
        try {
            await productsApi.deleteProduct(product.id);
            messageApi.success(`Đã xoá sản phẩm "${product.name}".`);
            fetchData();
        } catch {
            messageApi.error("Xoá thất bại, vui lòng thử lại.");
        }
    };

    const renderCard = (product) => (
        <div className="ap-card" key={product.id}>
            <ProductCard product={product} />
            <div className="ap-card-actions">
                <Button
                    className="ap-btn-edit"
                    icon={<PencilSimpleIcon size={15} weight="bold" />}
                    size="small"
                    onClick={() => openEdit(product)}
                >
                    Sửa
                </Button>
                <Popconfirm
                    title="Xoá sản phẩm?"
                    description={`Bạn có chắc muốn xoá "${product.name}" không?`}
                    onConfirm={() => handleDelete(product)}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        className="ap-btn-delete"
                        icon={<TrashIcon size={15} weight="bold" />}
                        size="small"
                        danger
                    />
                </Popconfirm>
            </div>
        </div>
    );

    const isSearching = searchResults !== null;
    const hasContent = isSearching ? searchResults.length > 0 : groups.length > 0;

    return (
        <div className="ap-page">
            {contextHolder}

            <div className="ap-header">
                <div>
                    <Title level={3} className="ap-title">Quản lý sản phẩm</Title>
                    <Text className="ap-subtitle">Quản lý sản phẩm theo danh mục</Text>
                </div>

                <div className="ap-header-actions">
                    <Search
                        className="ap-search"
                        placeholder="Tìm sản phẩm theo tên..."
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 280 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="ap-btn-add"
                        onClick={openCreate}
                    >
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                {!hasContent && !loading ? (
                    <Empty
                        description={isSearching ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm nào"}
                        className="ap-empty"
                    />
                ) : isSearching ? (
                    <section className="ap-group">
                        <h2 className="ap-group-title">Kết quả tìm kiếm cho "{keyword}"</h2>
                        <div className="ap-grid">{searchResults.map(renderCard)}</div>
                    </section>
                ) : (
                    groups.map(({ category, products }) => (
                        <section className="ap-group" key={category.id}>
                            <h2 className="ap-group-title">Danh sách {category.name}</h2>
                            <div className="ap-grid">{products.map(renderCard)}</div>
                        </section>
                    ))
                )}
            </Spin>

            <ProductDrawer
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editingItem={editingItem}
                confirmLoading={confirmLoading}
            />
        </div>
    );
}
