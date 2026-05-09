package com.example.shop.services.impls;

import com.example.shop.models.Category;
import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;
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
    public CategoryResponse getAllCategories() {

        List<CategoryDTO> categoryDTOList = categoryRepository.findAll()
                .stream()
                .filter(Category::getActive)
                .map(this::mapToDTO)
                .toList();

        return new CategoryResponse(categoryDTOList);
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));
        return mapToDTO(category);
    }

    @Override
    public CategoryDTO createCategory(CategoryRequest categoryRequest) {

        if (categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setActive(true);
        Category savedCategory = categoryRepository.save(category);
        return mapToDTO(savedCategory);
    }

    @Override
    public CategoryDTO updateCategory(
            Long id,
            CategoryRequest categoryRequest
    ) {
        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        if (!category.getName().equalsIgnoreCase(categoryRequest.getName())
                && categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }

        category.setName(categoryRequest.getName());
        Category updatedCategory = categoryRepository.save(category);
        return mapToDTO(updatedCategory);
    }

    @Override
    public CategoryDTO deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));
        // soft delete
        category.setActive(false);

        Category deletedCategory = categoryRepository.save(category);

        return mapToDTO(deletedCategory);
    }

    private CategoryDTO mapToDTO(Category category) {

        return new CategoryDTO(
                category.getId(),
                category.getName()
        );
    }
}
