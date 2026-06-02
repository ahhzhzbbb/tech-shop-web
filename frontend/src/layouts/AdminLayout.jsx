import { Outlet } from "react-router-dom";
import { Alert, Button } from "antd";
import Header from "../components/commons/Header.jsx";
import './AdminLayout.scss';
import AdminSidebar from "../features/admin/components/AdminSidebar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const AdminLayout = () => {
    const { user } = useAuthContext();
    const roles = user?.roles || [];
    const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

    return (
        <>
            <Header />
            <main className="admin-shell">
                <AdminSidebar />

                <div className="admin-content">
                    {isAdmin ? (
                        <Outlet />
                    ) : (
                        <div className="admin-denied">
                            <Alert
                                type="warning"
                                showIcon
                                message={user ? "Tài khoản không có quyền admin" : "Bạn cần đăng nhập bằng tài khoản admin"}
                                description="Các API quản trị yêu cầu quyền ROLE_ADMIN. Vui lòng đăng nhập đúng tài khoản để sử dụng admin panel."
                                action={
                                    <Button href="/" size="small">
                                        Về trang chủ
                                    </Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default AdminLayout;
