import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../features/home/pages/HomePage";
import Products from "../features/products/pages/Products";
import ProductDetail from "../features/products/pages/ProductDetail";

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute;