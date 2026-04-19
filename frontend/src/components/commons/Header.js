import { useState } from "react";
import RegisterModal from "../../features/auth/components/RegisterModal";

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>Đăng ký</button>

            <RegisterModal
                open={open}
                onCancel={() => setOpen(false)}
            />
        </>
    );
};

export default Header;