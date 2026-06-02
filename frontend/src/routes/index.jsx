import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../features/home/pages/HomePage.jsx";
import Products from "../features/products/pages/Products.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import UserInfo from "../features/user/pages/UserInfo.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import Orders from "../features/order/pages/Orders.jsx"
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../features/admin/dashboard/pages/AdminDashboard.jsx";
import AdminOrders from "../features/admin/orders/AdminOrders.jsx"
import AdminCategories from "../features/admin/category/AdminCategories.jsx"
import AdminProducts from "../features/admin/products/AdminProducts.jsx"
import AdminStatistics from "../features/admin/statistics/AdminStatistics.jsx"
import AdminPromotions from "../features/admin/promotions/AdminPromotions.jsx"

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* user */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<Products />} />
                    <Route path="/products/:category/:id" element={<ProductDetail />} />
                    <Route path="/user" element={<UserInfo />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                </Route>

                {/* admin */}
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/promotions" element={<AdminPromotions />} />
                    <Route path="/admin/statistics" element={<AdminStatistics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute;
