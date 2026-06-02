package com.example.shop.utils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class VNPayUtil {
    
    /**
     * Generate HMAC SHA512 hash
     */
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            final SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }
    
    /**
     * Build VNPay payment URL with hash
     */
    public static String buildPaymentUrl(Map<String, String> vnpParams, String vnpPayUrl, String hashSecret) {
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                String encodedValue = urlEncode(fieldValue);
                hashData.append(fieldName).append("=").append(encodedValue);
                query.append(urlEncode(fieldName)).append("=").append(encodedValue);
                
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }
        
        String vnpSecureHash = hmacSHA512(hashSecret, hashData.toString());
        System.out.println("HASH DATA: " + hashData);
        System.out.println("HASH: " + vnpSecureHash);
        return vnpPayUrl + "?" + query.toString() + "&vnp_SecureHash=" + vnpSecureHash;
    }
    
    /**
     * Get current Unix timestamp in seconds
     */
    public static String getCurrentTimeStamp() {
        return String.valueOf(System.currentTimeMillis() / 1000);
    }
    
    /**
     * Generate random number
     */
    public static String getRandomNumber(int len) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    
    /**
     * URL encode string
     */
    public static String urlEncode(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }
        try {
            return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8)
                    .replace("+", "%20");
        } catch (Exception ex) {
            return "";
        }
    }
    
    /**
     * Hash all fields for verification
     */
    public static String hashAllFields(Map<String, String> fields, String hashSecret) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                sb.append(fieldName).append("=").append(fieldValue);
                if (i < fieldNames.size() - 1) {
                    sb.append("&");
                }
            }
        }
        return hmacSHA512(hashSecret, sb.toString());
    }


    private static final DateTimeFormatter VNPAY_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public static String getVNPayDateTime() {
        return LocalDateTime.now()
                .format(VNPAY_FORMATTER);
    }

    public static String getVNPayExpireDate(int minutes) {
        return LocalDateTime.now()
                .plusMinutes(minutes)
                .format(VNPAY_FORMATTER);
    }
}
