import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header.jsx";
import './MainLayout.scss';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main className="main">
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout;