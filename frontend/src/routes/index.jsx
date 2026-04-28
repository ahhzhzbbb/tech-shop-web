import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../features/home/pages/HomePage.jsx";
import Products from "../features/products/pages/Products.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import UserInfo from "../features/user/pages/UserInfo.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import Orders from "../features/order/pages/Orders.jsx"

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<Products />} />
                    <Route path="/products/:category/:id" element={<ProductDetail />} />
                    <Route path="/user" element={<UserInfo />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute;