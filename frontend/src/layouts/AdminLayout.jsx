import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header.jsx";
import './AdminLayout.scss';

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

export default AdminLayout;