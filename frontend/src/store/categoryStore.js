import { create } from "zustand";
import categoryApi from "../features/admin/category/categoryApi";

// Store dùng chung danh sách danh mục, tránh gọi API lặp lại ở nhiều nơi
const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,
    loaded: false,
    inflight: null, // promise đang chạy, dùng để gộp các lời gọi đồng thời

    // Tải danh mục (chỉ gọi API lần đầu, dùng force=true để tải lại)
    fetchCategories: async (force = false) => {
        if (get().loaded && !force) return get().categories;
        // Đã có request đang bay → dùng chung, tránh gọi API trùng lặp
        const pending = get().inflight;
        if (pending && !force) return pending;

        set({ loading: true });
        const promise = (async () => {
            try {
                const data = await categoryApi.getCategories();
                const list = data.categories || [];
                set({ categories: list, loaded: true });
                return list;
            } finally {
                set({ loading: false, inflight: null });
            }
        })();

        set({ inflight: promise });
        return promise;
    },
}));

export default useCategoryStore;
