package com.example.shop.services;

import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;

public interface CategoryService {

    CategoryResponse getAllCategories();
    CategoryDTO getCategoryById(Long id);
    CategoryDTO createCategory(CategoryRequest categoryRequest);
    CategoryDTO updateCategory(Long id, CategoryRequest categoryRequest);
    CategoryDTO deleteCategory(Long id);
}
