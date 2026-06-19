package com.example.shop.services.impls;

import com.example.shop.models.Category;
import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    @Cacheable(value = "categories", key = "#includeInactive")
    public CategoryResponse getAllCategory(boolean includeInactive) {

        List<Category> categories = categoryRepository.findAll();
        if (!includeInactive) {
            categories = categories.stream()
                    .filter(Category::getActive)
                    .toList();
        }

        List<CategoryDTO> categoryList = categories.stream()
                .map(this::toCategoryDTO)
                .toList();

        CategoryResponse response = new CategoryResponse();
        response.setCategories(categoryList);

        return response;
    }

//    @Override
//    public CategoryDTO getCategoryAndProduct(Long id) {
//
//        return categoryRepository.findById(id)
//                .filter(Category::getActive)
//                .orElseThrow(() ->
//                        new RuntimeException("Không tìm thấy danh mục " + id));
//    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDTO createCategory(CategoryRequest request) {

        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }

        Category newCategory = modelMapper.map(request, Category.class);
        if (newCategory.getActive() == null) {
            newCategory.setActive(true);
        }

        categoryRepository.save(newCategory);

        return toCategoryDTO(newCategory);
    }

    @Override
    @CacheEvict(value = {"categories", "products"}, allEntries = true)
    public CategoryDTO updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByNameIgnoreCase(request.getName())) {

            throw new RuntimeException("Danh mục đã tồn tại");
        }

        category.setName(request.getName());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        categoryRepository.save(category);

        return toCategoryDTO(category);
    }

    @Override
    @CacheEvict(value = {"categories", "products"}, allEntries = true)
    public CategoryDTO deleteCategory(Long id) {

        Category deletedCategory = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        categoryRepository.delete(deletedCategory);

        return toCategoryDTO(deletedCategory);
    }

    private CategoryDTO toCategoryDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getActive()
        );
    }
}
