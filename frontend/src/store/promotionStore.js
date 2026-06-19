import { create } from "zustand";
import { getAllProductPromotion } from "../features/home/services/promotion.service";

const usePromotionStore = create((set, get) => ({
    promotions: [],
    loading: false,

    fetchPromotions: async () => {
        console.log("fetchPromotions called. Current state:", { promotions: get().promotions, loading: get().loading });
        // Tránh fetch trùng lặp nếu đã có dữ liệu
        if (get().promotions.length > 0 || get().loading) {
            console.log("fetchPromotions: Already loaded or loading, skipping.");
            return;
        }
        set({ loading: true });
        try {
            console.log("fetchPromotions: Calling getAllProductPromotion...");
            const data = await getAllProductPromotion();
            console.log("fetchPromotions: API response data:", data);
            set({ promotions: data?.promotionItems || [], loading: false });
        } catch (err) {
            console.error("Lỗi khi tải thông tin khuyến mãi in store:", err);
            set({ promotions: [], loading: false });
        }
    },

    getPromoByProductId: (productId) => {
        return get().promotions.find((p) => p.productId === productId);
    }
}));

export default usePromotionStore;
