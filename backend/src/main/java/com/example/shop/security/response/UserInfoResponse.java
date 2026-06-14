package com.example.shop.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private Long userId;
    private String jwtToken;
    private String username;
    private List<String> roles;

    private String phoneNumber;
    private String fullName;
    private String address;

    public UserInfoResponse(Long id, String username, String name, List<String> roles) {
        this.userId = id;
        this.username = username;
        this.roles = roles;
    }

    public UserInfoResponse(Long id, String username, List<String> roles, String phoneNumber) {
        this.userId = id;
        this.username = username;
        this.roles = roles;
        this.phoneNumber = phoneNumber;
    }

    // Giữ tương thích với chỗ gọi login (trước khi thêm fullName/address)
    public UserInfoResponse(Long userId, String jwtToken, String username,
                            List<String> roles, String phoneNumber) {
        this.userId = userId;
        this.jwtToken = jwtToken;
        this.username = username;
        this.roles = roles;
        this.phoneNumber = phoneNumber;
    }
}