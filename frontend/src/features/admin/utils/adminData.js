import productsApi from "../products/productsApi";

export const fetchAllProducts = async (pageSize = 100) => {
    const firstPage = await productsApi.getAllProducts(0, pageSize);
    const products = [...(firstPage.products || [])];
    const totalPages = firstPage.pagination?.totalPages || 1;

    if (totalPages <= 1) return products;

    const pages = Array.from({ length: totalPages - 1 }, (_, index) => index + 1);
    const responses = await Promise.all(
        pages.map((page) => productsApi.getAllProducts(page, pageSize))
    );

    responses.forEach((response) => {
        products.push(...(response.products || []));
    });

    return products;
};
