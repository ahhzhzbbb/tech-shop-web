import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header.jsx";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout;