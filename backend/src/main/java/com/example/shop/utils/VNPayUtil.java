package com.example.shop.utils;

import java.net.URLEncoder;
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
    public static String buildPaymentUrl(
            Map<String, String> vnpParams,
            String vnpPayUrl,
            String hashSecret) {

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = hmacSHA512(hashSecret, hashData.toString());

        System.out.println("HASH DATA = " + hashData);
        System.out.println("HASH = " + secureHash);

        return vnpPayUrl
                + "?"
                + query
                + "&vnp_SecureHash="
                + secureHash;
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

    public static String hashAllFields(
            Map<String, String> fields,
            String hashSecret) {

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        boolean first = true;

        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                if (!first) {
                    hashData.append("&");
                }

                hashData.append(fieldName)
                        .append("=")
                        .append(URLEncoder.encode(
                                fieldValue,
                                StandardCharsets.US_ASCII));

                first = false;
            }
        }

        System.out.println("VERIFY HASH DATA = " + hashData);

        return hmacSHA512(hashSecret, hashData.toString());
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
