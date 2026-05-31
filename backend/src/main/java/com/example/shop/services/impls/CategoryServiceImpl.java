package com.example.shop.services.impls;

import com.example.shop.models.Category;
import com.example.shop.payloads.dto.CategoryDTO;
import com.example.shop.payloads.request.CategoryRequest;
import com.example.shop.payloads.response.CategoryResponse;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.services.CategoryService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public CategoryResponse getAllCategory() {

        List<Category> categories = categoryRepository.findAll()
                .stream()
                .filter(Category::getActive)
                .toList();

        List<CategoryDTO> categoryList = categories.stream()
                .map(category -> new CategoryDTO(
                        category.getId(),
                        category.getName(),
                        category.getActive()))
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
    public CategoryDTO createCategory(CategoryRequest request) {

        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Danh mục đã tồn tại");
        }

        Category newCategory = modelMapper.map(request, Category.class);
        if (newCategory.getActive() == null) {
            newCategory.setActive(true);
        }

        categoryRepository.save(newCategory);

        return modelMapper.map(newCategory, CategoryDTO.class);
    }

    @Override
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

        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategory(Long id) {

        Category deletedCategory = categoryRepository.findById(id)
                .filter(Category::getActive)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy danh mục " + id));

        categoryRepository.delete(deletedCategory);

        return modelMapper.map(deletedCategory, CategoryDTO.class);
    }
}
