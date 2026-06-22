# Tech Shop Web

Website thương mại điện tử bán đồ công nghệ (laptop, PC, linh kiện, phụ kiện...).
Hệ thống gồm **backend Spring Boot** cung cấp REST API và **frontend React** cho người dùng & trang quản trị, hỗ trợ giỏ hàng, đặt hàng và thanh toán qua **VNPay**.

## Link deploy

| Thành phần | Đường dẫn |
|------------|-----------|
| Frontend (Firebase Hosting) | https://tech-9de80.web.app |
| Backend API (Render) | https://tech-shop-web.onrender.com |
| API docs (Swagger UI) | https://tech-shop-web.onrender.com/swagger-ui/index.html |

## Công nghệ sử dụng

**Backend**
- Java 21, Spring Boot, Maven
- Spring Web, Spring Data JPA (Hibernate)
- MySQL / TiDB Cloud, H2 (test)
- Spring Security + JWT
- Redis (cache), springdoc OpenAPI (Swagger)
- Thanh toán VNPay

**Frontend**
- React 19, Vite 8
- Ant Design 6, React Router 7
- Zustand, TanStack React Query, Axios, Sass

## Cấu trúc dự án

```
tech-shop-web/
├── backend/      # REST API (Spring Boot, Java 21) — xem backend/README.md
├── frontend/     # Giao diện web (React + Vite) — xem frontend/README.md
└── README.md
```

> Chi tiết cấu trúc thư mục từng phần xem trong [backend/README.md](backend/README.md) và [frontend/README.md](frontend/README.md).

## Hướng dẫn chạy ở local

### Backend

Yêu cầu: **Java 21**, **Redis**, và file `backend/.env` (DB, JWT, VNPay).

```bash
cd backend

# 1. Java 21 vào PATH
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
export PATH="$JAVA_HOME/bin:$PATH"

# 2. Export biến môi trường từ .env
set -a && source ./.env && set +a

# 3. Khởi động Redis (cache)
brew services start redis

# 4. Chạy (profile dev để bật Redis cache)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend chạy ở **http://localhost:8080**.

### Frontend

Yêu cầu: **Node.js** (khuyến nghị 18+).

```bash
cd frontend

# 1. Cài dependency
npm install

# 2. Trỏ API về backend local trong .env
#    VITE_API_URL=http://localhost:8080

# 3. Chạy dev server
npm run dev
```

Frontend chạy ở **http://localhost:5173**.
