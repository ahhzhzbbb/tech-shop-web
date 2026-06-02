package com.example.shop.configs;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class VNPayConfig {
    
    @Value("${vnpay.tmnCode:RLT2AP7L}")
    private String tmnCode;
    
    @Value("${vnpay.hashSecret:XG7OJ9AONUMS5FDH9XA6Y0ZNTLXULSOV}")
    private String hashSecret;
    
    @Value("${vnpay.payUrl:https://sandbox.vnpayment.vn/paygate/pay.html}")
    private String payUrl;
    
    @Value("${vnpay.apiUrl:https://sandbox.vnpayment.vn/merchant_webapi/merchant.html}")
    private String apiUrl;
    
    @Value("${vnpay.returnUrl:http://localhost:8080/api/payment/vnpay-callback}")
    private String returnUrl;
    
    @Value("${vnpay.notifyUrl:http://localhost:8080/api/payment/vnpay-notify}")
    private String notifyUrl;
}
