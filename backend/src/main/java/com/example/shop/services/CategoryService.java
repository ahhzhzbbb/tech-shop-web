package com.example.shop.services;

import com.example.shop.models.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getAllCategory();
    Category getCategoryAndProduct(Long id);
    Category createCategory(Category category);
    Category updateCategory(Long id, Category category);
    void deleteCategory(Long id);
}
