import { useParams } from "react-router-dom";
import ProductSideBar from "../../products/components/ProductSidebar";
import "./Product.scss";

function Products() {
    const { category } = useParams();

    return (
        <div className="productLayout">
            <ProductSideBar />
            <div>
                <h1>Trang hiển thị danh sách sản phẩm: {category}</h1>
            </div>
        </div>
    )
}

export default Products;