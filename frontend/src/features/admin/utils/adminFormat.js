export const ORDER_STATUS_OPTIONS = [
    { label: "Chờ xử lý", value: "PENDING", color: "gold" },
    { label: "Đã xác nhận", value: "CONFIRMED", color: "blue" },
    { label: "Đang giao", value: "SHIPPING", color: "cyan" },
    { label: "Hoàn tất", value: "COMPLETED", color: "green" },
    { label: "Đã huỷ", value: "CANCELLED", color: "red" },
];

export const PRODUCT_STATUS_OPTIONS = [
    { label: "Đang bán", value: "ACTIVE", color: "green" },
    { label: "Ngừng bán", value: "INACTIVE", color: "default" },
];

export const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    })
        .format(Number(value) || 0)
        .replace("₫", "đ");

export const formatNumber = (value = 0) =>
    new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

export const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("vi-VN").format(date);
};

export const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
};

export const toDateInputValue = (value) => {
    if (!value) return "";
    return `${value}`.slice(0, 10);
};

export const toDateTimeInputValue = (value) => {
    if (!value) return "";
    return `${value}`.slice(0, 16);
};

export const toLocalDateTimePayload = (value) => {
    if (!value) return null;
    return value.length === 16 ? `${value}:00` : value;
};

export const getOrderStatusMeta = (status) =>
    ORDER_STATUS_OPTIONS.find((item) => item.value === status) || {
        label: status || "Chưa rõ",
        value: status,
        color: "default",
    };

export const getProductStatusMeta = (status) =>
    PRODUCT_STATUS_OPTIONS.find((item) => item.value === status) || {
        label: status || "Chưa rõ",
        value: status,
        color: "default",
    };
