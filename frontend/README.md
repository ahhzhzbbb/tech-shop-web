# Tech Shop — Frontend

Giao diện website bán đồ công nghệ, xây dựng bằng **React + Vite**.

- **Trang web:** https://tech-9de80.web.app

## Công nghệ

- React 19, Vite 8
- Ant Design 6 (`antd`) + icon (`@ant-design/icons`, `@phosphor-icons/react`)
- React Router 7 (`react-router-dom`)
- Zustand (state management) + TanStack React Query
- Axios (gọi API)
- Sass (SCSS)
- `qrcode.react` (mã QR thanh toán)

## Cấu trúc thư mục

Dự án theo kiến trúc **feature-based** (mỗi tính năng tự gói component / page / service / store).

```
frontend/
├── .env                      # Biến môi trường (VITE_API_URL...)
├── firebase.json             # Cấu hình Firebase Hosting
├── index.html                # File HTML gốc
├── vite.config.js            # Cấu hình Vite
├── eslint.config.js          # Cấu hình ESLint
├── package.json              # Dependency & scripts
├── public/                   # Tài nguyên tĩnh (favicon, icons.svg)
└── src/
    ├── main.jsx              # Entry point React
    ├── App.jsx               # Component gốc
    ├── assets/               # Hình ảnh, logo
    ├── components/           # Component dùng chung toàn app
    │   ├── commons/          #   Header... (layout chung)
    │   └── ui/               #   Component UI tái sử dụng (Dropdown, Step...)
    ├── context/              # React Context (AuthContext)
    ├── layouts/              # Layout (MainLayout, AdminLayout)
    ├── routes/               # Cấu hình định tuyến
    ├── store/                # Zustand store dùng chung (auth, cart, category...)
    ├── services/             # Cấu hình API & Axios instance
    ├── hooks/                # Custom hook dùng chung
    ├── utils/                # Hàm tiện ích
    └── features/             # Các tính năng theo module
        ├── auth/             #   Đăng nhập / đăng ký
        ├── home/             #   Trang chủ
        ├── products/         #   Danh sách & chi tiết sản phẩm
        ├── search/           #   Tìm kiếm
        ├── cart/             #   Giỏ hàng
        ├── checkout/         #   Thanh toán (COD, VNPay)
        ├── order/            #   Đơn hàng
        ├── rating/           #   Đánh giá sản phẩm
        ├── user/             #   Thông tin tài khoản
        └── admin/            #   Trang quản trị (dashboard, sản phẩm,
                              #   danh mục, đơn hàng, khuyến mãi, thống kê)
```

Mỗi thư mục trong `features/` thường gồm: `components/` (hoặc `component/`),
`pages/`, `services/`, và tuỳ tính năng có thêm `hooks/`, `store/`, `utils/`.

## Chạy ở local

> Yêu cầu: **Node.js** (khuyến nghị 18+).

1. Cài dependency:
   ```bash
   cd frontend
   npm install
   ```
2. Cấu hình API trong `.env` (trỏ tới backend local):
   ```env
   VITE_API_URL=http://localhost:8080
   ```
3. Chạy dev server:
   ```bash
   npm run dev
   ```
   Frontend chạy ở **http://localhost:5173**.

Các script khác: `npm run build` (đóng gói production vào `dist/`), `npm run preview` (xem thử bản build), `npm run lint`.
