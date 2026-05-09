package com.example.shop.services.impls;

import com.example.shop.models.Category;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategory() {

        return categoryRepository.findAll()
                .stream()
                .filter(Category::getActive)
                .toList();
    }

    @Override
    public Category getCategoryAndProduct(Long id) {

        return categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));
    }

    @Override
    public Category createCategory(Category category) {

        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }

        category.setActive(true);

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category newCategory) {

        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        if (!category.getName().equalsIgnoreCase(newCategory.getName())
                && categoryRepository.existsByNameIgnoreCase(newCategory.getName())) {

            throw new RuntimeException("Danh mục đã tồn tại");
        }

        category.setName(newCategory.getName());

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        // soft delete
        category.setActive(false);

        categoryRepository.save(category);
    }
}
