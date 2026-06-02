import { create } from "zustand";
import categoryApi from "../features/admin/category/categoryApi";

// Store dùng chung danh sách danh mục, tránh gọi API lặp lại ở nhiều nơi
const useCategoryStore = create((set, get) => ({
    categories: [],
    loading: false,
    loaded: false,

    // Tải danh mục (chỉ gọi API lần đầu, dùng force=true để tải lại)
    fetchCategories: async (force = false) => {
        if (get().loaded && !force) return get().categories;
        set({ loading: true });
        try {
            const data = await categoryApi.getCategories();
            const list = data.categories || [];
            set({ categories: list, loaded: true });
            return list;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useCategoryStore;
