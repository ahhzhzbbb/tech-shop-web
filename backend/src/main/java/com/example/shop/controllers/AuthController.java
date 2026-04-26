package com.example.shop.controllers;

import com.example.shop.security.request.LoginRequest;
import com.example.shop.security.request.SignupRequest;
import com.example.shop.security.request.UpdateProfileRequest;
import com.example.shop.security.response.AuthenticationResult;
import com.example.shop.security.response.MessageResponse;
import com.example.shop.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
 * Controller quản lý các API liên quan đến xác thực và người dùng
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Đăng nhập người dùng", description = "API dùng để đăng nhập và trả về JWT cookie")
    /* API dùng để đăng nhập người dùng */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                        result.getJwtCookie().toString())
                .body(result.getResponse());
    }

    @Operation(summary = "đăng ký người dùng mới", description = "API dùng để đăng ký một tài khoản mới")
    /* API dùng để đăng ký người dùng mới */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @Operation(summary = "Lấy tên người dùng hiện tại", description = "API dùng để lấy tên người dùng hiện tại")
    /* API dùng để lấy tên người dùng hiện tại */
    @GetMapping("/username")
    public String currentUserName(Authentication authentication) {
        if (authentication != null)
            return authentication.getName();
        else
            return "";
    }

    @Operation(summary = "lấy thông tin chi tiết người dùng", description = "API dùng để lấy thông tin chi tiết người dùng hiện tại")
    /* API dùng để lấy thông tin chi tiết người dùng hiện tại */
    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        return ResponseEntity.ok().body(authService.getCurrentUserDetails(authentication));
    }

    @Operation(summary = "cập nhật thông tin người dùng", description = "API dùng để cập nhật thông tin người dùng")
    /* API dùng để cập nhật thông tin người dùng */
    @PutMapping("/user")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok().body(authService.updateProfile(authentication, request.getPhoneNumber()));
    }

    @Operation(summary = "đăng xuất", description = "API dùng để đăng xuất người dùng")
    /* API dùng để đăng xuất người dùng */
    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = authService.logoutUser();
        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }
}