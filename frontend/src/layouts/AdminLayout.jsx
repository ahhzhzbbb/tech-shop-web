import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header.jsx";
import './AdminLayout.scss';
import AdminSidebar from "../features/admin/components/AdminSidebar.jsx";

const AdminLayout = () => {
    return (
        <>
            <Header />
            <main className="main">
                <AdminSidebar />

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default AdminLayout;