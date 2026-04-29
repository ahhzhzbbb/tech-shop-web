package com.example.shop.exceptions;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ResourceNotFoundException extends RuntimeException {
    private String resourceName;
    private String fieldName;
    private String filedDescription;
    private Long fieldId;

    public ResourceNotFoundException(String resourceName, String fieldName, String filedDescription) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, filedDescription));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.filedDescription = filedDescription;
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Long fieldId) {
        super(String.format("%s not found with %s: %d", resourceName, fieldName, fieldId));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldId = fieldId;
    }
}