# Tech Shop — Backend

REST API cho website bán đồ công nghệ, xây dựng bằng **Spring Boot (Java 21)**.

- **API base:** https://tech-shop-web.onrender.com
- **Swagger UI:** https://tech-shop-web.onrender.com/swagger-ui/index.html

## Công nghệ

- Java 21, Spring Boot, Maven
- Spring Web, Spring Data JPA (Hibernate)
- MySQL / TiDB Cloud (driver `mysql-connector-j`), H2 (test)
- Spring Security + JWT (jjwt)
- Spring Data Redis + Spring Cache
- ModelMapper, Lombok, Bean Validation
- springdoc OpenAPI (Swagger UI)
- Tích hợp thanh toán VNPay

## Cấu trúc thư mục

```
backend/
├── Dockerfile                       # Build & chạy bằng Docker (multi-stage)
├── pom.xml                          # Khai báo dependency & build (Maven)
├── mvnw, mvnw.cmd                   # Maven wrapper
└── src/
    ├── main/
    │   ├── java/com/example/shop/
    │   │   ├── ShopApplication.java        # Entry point Spring Boot
    │   │   ├── DataInitializer.java        # Khởi tạo dữ liệu mẫu (role, user...)
    │   │   ├── configs/                     # Cấu hình bean
    │   │   │   ├── AppConfig.java           #   ModelMapper, bean dùng chung
    │   │   │   ├── RedisConfig.java         #   Cấu hình cache Redis
    │   │   │   └── VNPayConfig.java         #   Cấu hình thanh toán VNPay
    │   │   ├── controllers/                 # REST controller (Auth, Product, Cart,
    │   │   │                                #   Order, Payment, Category, Rating...)
    │   │   ├── services/                    # Interface tầng nghiệp vụ
    │   │   │   └── impls/                   #   Hiện thực service
    │   │   ├── repositories/                # Spring Data JPA repository
    │   │   ├── models/                      # Entity JPA (User, Product, Order,
    │   │   │                                #   Cart, Payment, Category, Rating...)
    │   │   ├── payloads/                    # Đối tượng truyền dữ liệu
    │   │   │   ├── dto/                      #   DTO trả về client
    │   │   │   ├── request/                  #   Body request
    │   │   │   └── response/                 #   Response bao đóng (pagination...)
    │   │   ├── security/                    # Bảo mật & xác thực
    │   │   │   ├── SecurityConfigs.java     #   Cấu hình Spring Security
    │   │   │   ├── jwt/                      #   Sinh/kiểm tra JWT, filter
    │   │   │   ├── service/                  #   UserDetails(Service)Impl
    │   │   │   ├── request/                  #   Login/Signup/UpdateProfile...
    │   │   │   └── response/                 #   UserInfo, MessageResponse...
    │   │   ├── exceptions/                  # Xử lý lỗi tập trung
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   └── ResourceNotFoundException.java
    │   │   └── utils/                       # Tiện ích (VNPayUtil...)
    │   └── resources/
    │       ├── application.properties       # Cấu hình chung (đọc biến từ .env)
    │       ├── application-dev.properties    # Profile dev (bật Redis cache)
    │       └── application-prod.properties   # Profile prod
    └── test/                                # Unit/integration test
```

## Chạy ở local

> Yêu cầu: **Java 21**, **Redis**, và file `backend/.env` chứa biến môi trường (DB, JWT, VNPay).

1. Đảm bảo Java 21 trong PATH:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@21
   export PATH="$JAVA_HOME/bin:$PATH"
   ```
2. Export biến môi trường từ `.env` (phải `export`, vì `application.properties` đọc qua `${...}`):
   ```bash
   cd backend
   set -a && source ./.env && set +a
   ```
3. Khởi động Redis (cache, mặc định `localhost:6379`):
   ```bash
   brew services start redis      # hoặc: redis-server
   ```
4. Chạy ứng dụng (profile `dev` để bật Redis cache):
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   hoặc đóng gói rồi chạy jar:
   ```bash
   ./mvnw -DskipTests package
   java -jar target/*.jar
   ```

Backend chạy ở **http://localhost:8080**, Swagger UI tại http://localhost:8080/swagger-ui/index.html.

> Thiếu Redis khi bật cache sẽ khiến các endpoint có cache (vd `/api/products`) trả lỗi 500 "Unable to connect to Redis".
