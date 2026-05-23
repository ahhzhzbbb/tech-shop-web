import ProductSideBar from "../../products/components/ProductSidebar";
import "./HomePage.scss";

function HomePage() {
    return (
        <div className="homepageLayout">
            <ProductSideBar />
            <div>
                <h1>Home Page</h1>
            </div>
        </div>
    )
}

export default HomePage;