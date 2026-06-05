import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header.jsx";
import Footer from "../components/commons/Footer.jsx";
import './MainLayout.scss';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main className="main">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout;