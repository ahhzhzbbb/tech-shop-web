import { Outlet } from "react-router-dom";
import Header from "../components/commons/Header";

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