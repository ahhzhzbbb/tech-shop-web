package com.example.shop.services.impls;

import com.example.shop.models.Category;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.services.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategory() {
        // chỉ lấy category đang active
        return categoryRepository.findAll()
                .stream()
                .filter(Category::getActive)
                .toList();
    }

    @Override
    public Category getCategoryAndProduct(Long id) {
        return categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục " + id));
    }

    @Override
    public Category createCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }
        category.setActive(true); // đảm bảo mặc định
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category newCategory) {
        Category category = getCategoryAndProduct(id);

        if (!category.getName().equalsIgnoreCase(newCategory.getName())
                && categoryRepository.existsByNameIgnoreCase(newCategory.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }

        category.setName(newCategory.getName());

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryAndProduct(id);
        // soft delete
        category.setActive(false);

        categoryRepository.save(category);
    }
}
