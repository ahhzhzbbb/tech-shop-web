import { useEffect, useMemo, useState, useCallback } from "react";
import {
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Button,
    Space,
    Spin,
    Empty,
    Divider,
    Typography,
    Image,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import categoryApi from "../category/categoryApi";
import promotionApi from "../products/promotionApi";
import useCategoryStore from "../../../store/categoryStore";
import "./ProductDrawer.scss";

const { TextArea } = Input;
const { Text } = Typography;

const STATUS_OPTIONS = [
    { label: "Đang bán", value: "ACTIVE" },
    { label: "Ngừng bán", value: "INACTIVE" },
];

// =========================================
// Props:
//   open           — boolean, hiển thị drawer
//   onClose        — fn, đóng drawer
//   onSubmit       — fn(values) => Promise, gọi API tạo/cập nhật
//   editingItem    — object | null (null = tạo mới)
//   confirmLoading — boolean
// =========================================
export default function ProductDrawer({
    open,
    onClose,
    onSubmit,
    editingItem,
    confirmLoading,
}) {
    const [form] = Form.useForm();
    const isEditing = !!editingItem;

    const categories = useCategoryStore((s) => s.categories);
    const fetchCategories = useCategoryStore((s) => s.fetchCategories);
    const [attributes, setAttributes] = useState([]);
    const [attrLoading, setAttrLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([""]);

    const addImageUrl = useCallback(() => {
        setImageUrls((prev) => [...prev, ""]);
    }, []);

    const removeImageUrl = useCallback((index) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const changeImageUrl = useCallback((index, value) => {
        setImageUrls((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }, []);

    // Khuyến mãi hiện tại của sản phẩm (null = chưa có)
    const [existingPromo, setExistingPromo] = useState(null);

    // categoryId hiện tại trên form (theo dõi để tải thuộc tính tương ứng)
    const categoryId = Form.useWatch("categoryId", form);
    // Trạng thái switch "Sản phẩm khuyến mãi"
    const promoEnabled = Form.useWatch("promoEnabled", form);

    // Map attributeId -> value đã lưu của sản phẩm (dùng để điền sẵn khi sửa)
    const savedAttrValues = useMemo(() => {
        const map = {};
        (editingItem?.attributes || []).forEach((a) => {
            map[a.attributeId] = a.value;
        });
        return map;
    }, [editingItem]);

    // Tải danh sách danh mục (từ store) + điền sẵn dữ liệu mỗi khi mở drawer
    useEffect(() => {
        if (!open) return;

        fetchCategories();

        if (isEditing) {
            let parsedImages = [];
            try {
                const raw = editingItem.images;
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) parsedImages = parsed.filter(Boolean);
                }
            } catch { /* ignore */ }

            form.setFieldsValue({
                name: editingItem.name,
                brandName: editingItem.brandName,
                price: editingItem.price,
                quantity: editingItem.quantity,
                thumbnail: editingItem.thumbnail,
                categoryId: editingItem.categoryId ?? undefined,
                status: editingItem.status ?? "ACTIVE",
                description: editingItem.description,
            });
            setImageUrls(parsedImages.length > 0 ? parsedImages : [""]);
        } else {
            form.resetFields();
            form.setFieldsValue({ status: "ACTIVE", quantity: 0, promoEnabled: false });
            setAttributes([]);
            setExistingPromo(null);
            setImageUrls([""]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingItem, fetchCategories]);

    // Tải khuyến mãi hiện có của sản phẩm khi sửa (mặc định tắt switch khi thêm)
    useEffect(() => {
        if (!open || !isEditing) return;

        let active = true;
        (async () => {
            try {
                const data = await promotionApi.getAllPromotions();
                const found = (data.promotionItems || []).find(
                    (p) => p.productId === editingItem.id
                ) || null;
                if (!active) return;
                setExistingPromo(found);
                form.setFieldsValue({
                    promoEnabled: !!found,
                    discountPercent: found?.discountPercent ?? undefined,
                });
            } catch {
                if (active) {
                    setExistingPromo(null);
                    form.setFieldsValue({ promoEnabled: false });
                }
            }
        })();

        return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingItem]);

    // Tải danh sách thuộc tính theo danh mục đang chọn
    useEffect(() => {
        if (!open) return;

        if (categoryId == null) {
            setAttributes([]);
            return;
        }

        let active = true;
        setAttrLoading(true);

        (async () => {
            try {
                const data = await categoryApi.getAttributesByCategory(categoryId);
                if (!active) return;
                const list = data.attributes || [];
                setAttributes(list);
                // Điền sẵn giá trị thuộc tính đã lưu của sản phẩm (nếu có)
                form.setFieldsValue({
                    attrValues: list.reduce((acc, attr) => {
                        acc[attr.id] = savedAttrValues[attr.id] ?? undefined;
                        return acc;
                    }, {}),
                });
            } catch {
                if (active) setAttributes([]);
            } finally {
                if (active) setAttrLoading(false);
            }
        })();

        return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, categoryId, savedAttrValues]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const {
                attrValues = {},
                promoEnabled: promoOn,
                discountPercent,
                ...rest
            } = values;

            const attributeValues = attributes
                .map((attr) => ({
                    attributeId: attr.id,
                    value: attrValues[attr.id],
                }))
                .filter((av) => av.value != null && `${av.value}`.trim() !== "");

            const validImageUrls = imageUrls.filter((u) => u.trim() !== "");
            const imagesJson = validImageUrls.length > 0 ? JSON.stringify(validImageUrls) : null;

            const promotion = {
                enabled: !!promoOn,
                discountPercent: promoOn ? discountPercent : null,
                existingPromoId: existingPromo?.id ?? null,
                existingDiscountPercent: existingPromo?.discountPercent ?? null,
            };

            await onSubmit({ ...rest, images: imagesJson, attributeValues }, promotion);
        } catch (err) {
            if (err?.errorFields) return;
            throw err;
        }
    };

    return (
        <Drawer
            title={
                <span className="pd-title">
                    {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </span>
            }
            open={open}
            onClose={onClose}
            width={520}
            destroyOnClose
            className="pd-drawer"
            footer={
                <div className="pd-footer">
                    <Space>
                        <Button onClick={onClose}>Huỷ</Button>
                        <Button
                            type="primary"
                            className="pd-btn-ok"
                            loading={confirmLoading}
                            onClick={handleSubmit}
                        >
                            {isEditing ? "Lưu thay đổi" : "Thêm"}
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form form={form} layout="vertical" className="pd-form">
                <Form.Item
                    name="name"
                    label="Tên sản phẩm"
                    rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                    name="brandName"
                    label="Tên hãng"
                >
                    <Input placeholder="Nhập tên hãng" />
                </Form.Item>

                <div className="pd-row">
                    <Form.Item
                        name="price"
                        label="Giá (đ)"
                        rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    >
                        <InputNumber
                            min={0}
                            step={1000}
                            style={{ width: "100%" }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(v) => v.replace(/,/g, "")}
                            placeholder="0"
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
                    </Form.Item>
                </div>

                <div className="pd-row">
                    <Form.Item
                        name="categoryId"
                        label="Danh mục"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                    >
                        <Select
                            allowClear
                            placeholder="Chọn danh mục"
                            options={categories.map((c) => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select options={STATUS_OPTIONS} />
                    </Form.Item>
                </div>

                <Form.Item name="thumbnail" label="Ảnh sản phẩm (URL)">
                    <Input placeholder="https://..." />
                </Form.Item>

                <div className="pd-images-section">
                    <label className="pd-images-label">Album ảnh sản phẩm (URL)</label>
                    {imageUrls.map((url, idx) => (
                        <div key={idx} className="pd-image-row">
                            <Input
                                value={url}
                                onChange={(e) => changeImageUrl(idx, e.target.value)}
                                placeholder="https://..."
                                className="pd-image-input"
                            />
                            <div className="pd-image-row-actions">
                                {url.trim() && (
                                    <Image
                                        src={url}
                                        alt={`Ảnh ${idx + 1}`}
                                        width={36}
                                        height={36}
                                        className="pd-image-preview"
                                        preview={false}
                                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iMTgiIHk9IjIwIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiPsOgxYLEgiA8L3RleHQ+PC9zdmc+"
                                    />
                                )}
                                {imageUrls.length > 1 && (
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeImageUrl(idx)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addImageUrl}
                        className="pd-image-add-btn"
                    >
                        Thêm ảnh
                    </Button>
                </div>

                <Form.Item name="description" label="Mô tả">
                    <TextArea rows={3} placeholder="Mô tả ngắn về sản phẩm..." />
                </Form.Item>

                <Divider className="pd-divider">Khuyến mãi</Divider>

                <Form.Item
                    name="promoEnabled"
                    label="Sản phẩm khuyến mãi"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                {promoEnabled && (
                    <Form.Item
                        name="discountPercent"
                        label="% khuyến mãi"
                        rules={[{ required: true, message: "Vui lòng nhập % khuyến mãi" }]}
                    >
                        <InputNumber
                            min={1}
                            max={100}
                            style={{ width: "100%" }}
                            addonAfter="%"
                            placeholder="Ví dụ: 10"
                        />
                    </Form.Item>
                )}

                <Divider className="pd-divider">Thuộc tính</Divider>

                {categoryId == null ? (
                    <Text type="secondary" className="pd-hint">
                        Chọn danh mục để nhập thuộc tính cho sản phẩm.
                    </Text>
                ) : attrLoading ? (
                    <div className="pd-attr-loading">
                        <Spin />
                    </div>
                ) : attributes.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Danh mục này chưa có thuộc tính"
                    />
                ) : (
                    attributes.map((attr) => (
                        <Form.Item
                            key={attr.id}
                            name={["attrValues", String(attr.id)]}
                            label={attr.name}
                        >
                            <Input placeholder={`Nhập ${attr.name.toLowerCase()}...`} />
                        </Form.Item>
                    ))
                )}
            </Form>
        </Drawer>
    );
}
