package com.example.shop.services.impls;

import com.example.shop.exceptions.ResourceNotFoundException;
import com.example.shop.models.Attribute;
import com.example.shop.models.Category;
import com.example.shop.payloads.dto.AttributeDTO;
import com.example.shop.payloads.request.AttributeRequest;
import com.example.shop.payloads.response.AttributesResponse;
import com.example.shop.repositories.AttributeRepository;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.services.AttributeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttributeServiceImpl implements AttributeService {
    private final AttributeRepository attributeRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    @Override
    public AttributeDTO createAttribute(AttributeRequest attributeRequest) {
        Category category = getActiveCategory(attributeRequest.getCategoryId());
        String name = normalizeName(attributeRequest.getName());

        if (attributeRepository.existsByNameIgnoreCaseAndCategoryId(name, category.getId())) {
            throw new RuntimeException("Thuộc tính đã tồn tại trong danh mục này");
        }

        Attribute attribute = new Attribute();
        attribute.setName(name);
        attribute.setCategory(category);

        Attribute savedAttribute = attributeRepository.save(attribute);
        return convertToDTO(savedAttribute);
    }

    @Transactional
    @Override
    public AttributesResponse getAllAttributes() {
        List<AttributeDTO> attributes = attributeRepository.findAll()
                .stream()
                .filter(attribute -> attribute.getCategory().getActive())
                .map(this::convertToDTO)
                .toList();

        return new AttributesResponse(attributes);
    }

    @Transactional
    @Override
    public AttributeDTO getAttributeById(Long attributeId) {
        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute", "id", attributeId));

        return convertToDTO(attribute);
    }

    @Transactional
    @Override
    public AttributesResponse getAttributesByCategory(Long categoryId) {
        getActiveCategory(categoryId);

        List<AttributeDTO> attributes = attributeRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::convertToDTO)
                .toList();

        return new AttributesResponse(attributes);
    }

    @Transactional
    @Override
    public AttributeDTO updateAttribute(Long attributeId, AttributeRequest attributeRequest) {
        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute", "id", attributeId));

        String newName = attributeRequest.getName() == null
                ? attribute.getName()
                : normalizeName(attributeRequest.getName());
        Category newCategory = attributeRequest.getCategoryId() == null
                ? attribute.getCategory()
                : getActiveCategory(attributeRequest.getCategoryId());

        boolean changedName = !attribute.getName().equalsIgnoreCase(newName);
        boolean changedCategory = !attribute.getCategory().getId().equals(newCategory.getId());

        if (changedCategory && !attribute.getProductAttributeValues().isEmpty()) {
            throw new RuntimeException("Không thể đổi danh mục của thuộc tính đã được gán cho sản phẩm");
        }

        if ((changedName || changedCategory)
                && attributeRepository.existsByNameIgnoreCaseAndCategoryId(newName, newCategory.getId())) {
            throw new RuntimeException("Thuộc tính đã tồn tại trong danh mục này");
        }

        attribute.setName(newName);
        attribute.setCategory(newCategory);

        Attribute savedAttribute = attributeRepository.save(attribute);
        return convertToDTO(savedAttribute);
    }

    @Transactional
    @Override
    public AttributeDTO deleteAttribute(Long attributeId) {
        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new ResourceNotFoundException("Attribute", "id", attributeId));
        AttributeDTO deletedAttribute = convertToDTO(attribute);

        attributeRepository.delete(attribute);
        return deletedAttribute;
    }

    private Category getActiveCategory(Long categoryId) {
        if (categoryId == null) {
            throw new RuntimeException("categoryId không được để trống");
        }

        return categoryRepository.findById(categoryId)
                .filter(Category::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }

    private String normalizeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Tên thuộc tính không được để trống");
        }

        return name.trim();
    }

    private AttributeDTO convertToDTO(Attribute attribute) {
        return new AttributeDTO(
                attribute.getId(),
                attribute.getName(),
                attribute.getCategory().getId(),
                attribute.getCategory().getName()
        );
    }
}
