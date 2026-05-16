package com.example.shop;

import com.example.shop.models.AppRole;
import com.example.shop.models.Category;
import com.example.shop.models.Product;
import com.example.shop.models.Role;
import com.example.shop.models.User;
import com.example.shop.repositories.CategoryRepository;
import com.example.shop.repositories.ProductRepository;
import com.example.shop.repositories.RoleRepository;
import com.example.shop.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role role1 = new Role();
        role1.setRoleName(AppRole.ROLE_USER);

        roleRepository.save(role1);

        Role role2 = new Role();
        role2.setRoleName(AppRole.ROLE_ADMIN);

        roleRepository.save(role2);

        User newUser = new User();
        newUser.setUsername("admin");
        newUser.setPassword(passwordEncoder.encode("admin"));
        newUser.setPhoneNumber("0585424988");
        newUser.setRole(role2);
        userRepository.save(newUser);

        Category laptopCategory = new Category();
        laptopCategory.setName("Laptop");
        laptopCategory.setActive(true);
        categoryRepository.save(laptopCategory);

        Product laptop1 = new Product();
        laptop1.setName("Dell XPS 13");
        laptop1.setDescription("Premium ultrabook with Intel i7 processor, 16GB RAM, 512GB SSD");
        laptop1.setPrice(1299.99);
        laptop1.setQuantity(10);
        laptop1.setImageUrl("https://via.placeholder.com/300?text=Dell+XPS+13");
        laptop1.setStatus("AVAILABLE");
        laptop1.setAverageScore(4.8);
        laptop1.setCategory(laptopCategory);
        productRepository.save(laptop1);

        Product laptop2 = new Product();
        laptop2.setName("MacBook Air M2");
        laptop2.setDescription("Apple MacBook Air with M2 chip, 8GB unified memory, 256GB SSD");
        laptop2.setPrice(1199.99);
        laptop2.setQuantity(8);
        laptop2.setImageUrl("https://via.placeholder.com/300?text=MacBook+Air+M2");
        laptop2.setStatus("AVAILABLE");
        laptop2.setAverageScore(4.9);
        laptop2.setCategory(laptopCategory);
        productRepository.save(laptop2);

        Product laptop3 = new Product();
        laptop3.setName("Lenovo ThinkPad X1 Carbon");
        laptop3.setDescription("Business laptop with Intel i5, 8GB RAM, 512GB SSD, 14-inch FHD display");
        laptop3.setPrice(899.99);
        laptop3.setQuantity(15);
        laptop3.setImageUrl("https://via.placeholder.com/300?text=ThinkPad+X1+Carbon");
        laptop3.setStatus("AVAILABLE");
        laptop3.setAverageScore(4.7);
        laptop3.setCategory(laptopCategory);
        productRepository.save(laptop3);
    }
}
