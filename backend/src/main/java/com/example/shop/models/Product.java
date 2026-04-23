package com.example.shop.models;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*
 * Model Product được sử dụng để lưu trữ thông tin về vai trò của sản phẩm trong hệ thống.
 */
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false)
    private Double price;
    private Integer quantity;
    private String imageUrl;
}
