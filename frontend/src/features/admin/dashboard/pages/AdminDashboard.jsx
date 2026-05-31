import {
    Package,
    SquaresFour,
    ShoppingCart,
    ChartBar,
    Users,
    Tag,
} from '@phosphor-icons/react';
import { Typography } from 'antd';
import AdminCard from './components/AdminCard';
import './AdminDashboard.scss';

const { Title, Text } = Typography;

const MENU_ITEMS = [
    {
        key: 'products',
        label: 'Sản phẩm',
        description: 'Thêm, sửa, xoá và quản lý kho hàng',
        icon: Package,
        path: '/admin/products',
    },
    {
        key: 'categories',
        label: 'Danh mục',
        description: 'Phân loại và sắp xếp sản phẩm',
        icon: SquaresFour,
        path: '/admin/categories',
    },
    {
        key: 'orders',
        label: 'Đơn hàng',
        description: 'Xem và xử lý đơn hàng của khách',
        icon: ShoppingCart,
        path: '/admin/orders',
    },
    {
        key: 'statistics',
        label: 'Thống kê',
        description: 'Báo cáo doanh thu và hiệu suất',
        icon: ChartBar,
        path: '/admin/statistics',
    },
    {
        key: 'customers',
        label: 'Khách hàng',
        description: 'Danh sách và thông tin khách hàng',
        icon: Users,
        path: '/admin/customers',
    },
    {
        key: 'promotions',
        label: 'Khuyến mãi',
        description: 'Tạo và quản lý mã giảm giá, ưu đãi',
        icon: Tag,
        path: '/admin/promotions',
    },
];

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__header">
                <Title level={3} className="admin-dashboard__title">
                    Bảng điều khiển
                </Title>
                <Text className="admin-dashboard__subtitle">
                    Chọn chức năng bạn muốn quản lý
                </Text>
            </div>

            <div className="admin-dashboard__grid">
                {MENU_ITEMS.map((item) => (
                    <AdminCard key={item.key} item={item} />
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;