import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

const APP_NAME = "TechShop";

/**
 * Bảng ánh xạ route -> tên trang hiển thị trên tab trình duyệt.
 * `title` có thể là chuỗi tĩnh hoặc hàm nhận params của route.
 * matchPath (react-router v6) khớp toàn bộ pathname nên thứ tự không bắt buộc,
 * nhưng vẫn đặt route cụ thể trước cho dễ đọc.
 */
const TITLE_ROUTES = [
    { path: "/", title: "Trang chủ" },
    { path: "/products/:category/:id", title: "Chi tiết sản phẩm" },
    { path: "/products/:category", title: (params) => decodeURIComponent(params.category) },
    { path: "/cart", title: "Giỏ hàng" },
    { path: "/checkout", title: "Thanh toán" },
    { path: "/checkout/success", title: "Kết quả thanh toán" },
    { path: "/checkout/vnpay-return", title: "Kết quả thanh toán" },
    { path: "/orders", title: "Đơn hàng của tôi" },
    { path: "/admin", title: "Quản lý" },
    { path: "/admin/products", title: "Quản lý sản phẩm" },
    { path: "/admin/categories", title: "Quản lý danh mục" },
    { path: "/admin/orders", title: "Quản lý đơn hàng" },
    { path: "/admin/promotions", title: "Quản lý khuyến mãi" },
    { path: "/admin/statistics", title: "Thống kê" },
];

/**
 * Cập nhật tiêu đề tab trình duyệt theo route hiện tại.
 * Đặt bên trong <BrowserRouter>, không render gì ra UI.
 */
const RouteTitle = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        let pageName = null;
        for (const route of TITLE_ROUTES) {
            const matched = matchPath(route.path, pathname);
            if (matched) {
                pageName = typeof route.title === "function"
                    ? route.title(matched.params)
                    : route.title;
                break;
            }
        }
        document.title = pageName ? `${pageName} | ${APP_NAME}` : APP_NAME;
    }, [pathname]);

    return null;
};

export default RouteTitle;
