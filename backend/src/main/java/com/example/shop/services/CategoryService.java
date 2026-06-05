package com.example.shop.services;

import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;

public interface CategoryService {

    CategoryResponse getAllCategory(boolean includeInactive);
//    CategoryDTO getCategoryAndProduct(Long id);
    CategoryDTO createCategory(CategoryRequest request);
    CategoryDTO updateCategory(Long id, CategoryRequest request);
    CategoryDTO deleteCategory(Long id);
}
