package com.example.shop.exceptions;

import lombok.Getter;

/**
 * Lỗi xử lý callback/IPN của VNPay, mang theo RspCode theo chuẩn VNPay để
 * endpoint IPN phản hồi đúng mã cho VNPay.
 * <p>
 * Các mã thường dùng:
 * <ul>
 *     <li>00 - Confirm Success</li>
 *     <li>01 - Order not Found</li>
 *     <li>02 - Order already confirmed</li>
 *     <li>04 - Invalid Amount</li>
 *     <li>97 - Invalid Checksum</li>
 *     <li>99 - Unknown error</li>
 * </ul>
 */
@Getter
public class VNPayException extends RuntimeException {

    private final String rspCode;

    public VNPayException(String rspCode, String message) {
        super(message);
        this.rspCode = rspCode;
    }
}
