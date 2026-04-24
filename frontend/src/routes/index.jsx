import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../features/home/pages/HomePage.jsx";
import Products from "../features/products/pages/Products.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<Products />} />
                    <Route path="/products/:category/:id" element={<ProductDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute;