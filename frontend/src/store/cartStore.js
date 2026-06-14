import { create } from "zustand";
import cartService from "../features/cart/service/cart.service";

// Store dùng chung số lượng sản phẩm trong giỏ, để header hiển thị badge
const useCartStore = create((set) => ({
    count: 0,

    // Đặt số lượng trực tiếp (thường từ CartResponse.totalItems sau khi gọi API)
    setCount: (count) => set({ count: Number(count) || 0 }),

    // Tải lại số lượng từ server
    refresh: async () => {
        try {
            const data = await cartService.getCart();
            set({ count: data?.totalItems ?? 0 });
        } catch {
            set({ count: 0 });
        }
    },

    reset: () => set({ count: 0 }),
}));

export default useCartStore;
