package com.example.shop;

import com.example.shop.models.AppRole;
import com.example.shop.models.Role;
import com.example.shop.models.User;
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
    }
}
