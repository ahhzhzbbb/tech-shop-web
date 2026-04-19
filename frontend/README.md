# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Cấu trúc thư mục frontend

```
frontend/
├── .env                    # File cấu hình biến môi trường
├── .gitignore              # File bỏ qua các file không cần commit
├── eslint.config.js        # Cấu hình ESLint
├── index.html              # File HTML chính
├── node_modules/           # Thư mục chứa các package phụ thuộc
├── package-lock.json       # File khóa phiên bản package
├── package.json            # File cấu hình dự án và dependencies
├── public/                 # Thư mục chứa tài nguyên tĩnh
│   ├── favicon.svg         # Icon trang web
│   └── icons.svg           # Các icon SVG
├── README.md               # File hướng dẫn dự án
├── src/                    # Thư mục nguồn chính
│   ├── App.css             # CSS cho component App
│   ├── App.jsx             # Component chính của ứng dụng
│   ├── assets/             # Thư mục chứa hình ảnh và tài nguyên
│   ├── components/         # Thư mục chứa các component dùng chung
│   │   ├── commons/        # Component dùng chung như Header
│   │   │   └── Header.js   # Component Header
│   │   └── ui/             # Component giao diện người dùng
│   ├── features/           # Thư mục chứa các tính năng theo module
│   │   ├── auth/           # Tính năng xác thực
│   │   │   ├── component/  # Component cho auth
│   │   │   │   └── RegisterModal.js  # Modal đăng ký
│   │   │   ├── hooks/      # Hook cho auth
│   │   │   ├── pages/      # Trang cho auth
│   │   │   └── services/   # Service cho auth
│   │   ├── cart/           # Tính năng giỏ hàng
│   │   │   ├── components/ # Component cho cart
│   │   │   ├── pages/      # Trang cho cart
│   │   │   ├── store/      # State management cho cart
│   │   │   └── utils/      # Utility cho cart
│   │   ├── checkout/       # Tính năng thanh toán
│   │   │   ├── components/ # Component cho checkout
│   │   │   ├── hooks/      # Hook cho checkout
│   │   │   ├── pages/      # Trang cho checkout
│   │   │   └── services/   # Service cho checkout
│   │   ├── home/           # Trang chủ
│   │   │   ├── components/ # Component cho home
│   │   │   ├── pages/      # Trang home
│   │   │   │   └── HomePage.js  # Trang chủ
│   │   │   └── services/   # Service cho home
│   │   ├── order/          # Tính năng đơn hàng
│   │   │   ├── components/ # Component cho order
│   │   │   ├── pages/      # Trang cho order
│   │   │   └── services/   # Service cho order
│   │   ├── products/       # Tính năng sản phẩm
│   │   │   ├── components/ # Component cho products
│   │   │   ├── hooks/      # Hook cho products
│   │   │   ├── pages/      # Trang sản phẩm
│   │   │   │   ├── ProductDetail.js  # Trang chi tiết sản phẩm
│   │   │   │   └── Products.js  # Trang danh sách sản phẩm
│   │   │   ├── services/   # Service cho products
│   │   │   └── store/      # State management cho products
│   │   ├── search/         # Tính năng tìm kiếm
│   │   │   ├── components/ # Component cho search
│   │   │   ├── hooks/      # Hook cho search
│   │   │   └── services/   # Service cho search
│   │   └── user/           # Tính năng người dùng
│   │       ├── components/ # Component cho user
│   │       ├── pages/      # Trang cho user
│   │       └── services/   # Service cho user
│   ├── hooks/              # Thư mục chứa custom hooks dùng chung
│   ├── layouts/            # Thư mục chứa layout của ứng dụng
│   │   └── MainLayout.js   # Layout chính
│   ├── main.jsx            # File entry point của React
│   ├── routes/             # Thư mục chứa cấu hình routing
│   │   └── index.js        # File cấu hình route
│   ├── services/           # Thư mục chứa các service API
│   │   ├── api.js          # Cấu hình API
│   │   └── axiosInstances.js  # Instance Axios
│   ├── store/              # Thư mục chứa state management (Redux, Zustand, etc.)
│   └── utils/              # Thư mục chứa các utility functions
├── vite.config.js          # Cấu hình Vite
```
