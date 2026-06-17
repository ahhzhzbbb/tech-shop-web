import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import OrderManagement from '../components/OrderManagement';
import { getOrdersByUserId } from '../services/order.service.jsx';
import LoginModal from '../../auth/component/LoginModal.jsx';
import RegisterModal from '../../auth/component/RegisterModal.jsx';
import { Button, Card, Spin, message } from 'antd';
import { ShoppingOutlined, LockOutlined } from '@ant-design/icons';

// Map trạng thái backend sang frontend
const mapBackendStatusToFrontend = (backendStatus) => {
    switch (backendStatus) {
        case 'PENDING':
            return 'new';
        case 'CONFIRMED':
            return 'processing';
        case 'SHIPPING':
            return 'shipping';
        case 'COMPLETED':
            return 'completed';
        case 'CANCELLED':
            return 'cancelled';
        default:
            return 'new';
    }
};

function Orders() {
    const { user } = useAuthContext();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Quản lý modal đăng nhập/đăng ký nếu chưa đăng nhập
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);

    // Tải danh sách đơn hàng khi đã đăng nhập
    useEffect(() => {
        if (!user || !user.id) {
            setOrders([]);
            setFilteredOrders([]);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await getOrdersByUserId(user.id);
                // Map status sang lowercase để khớp với component hiển thị
                const mappedOrders = (data || []).map(order => ({
                    ...order,
                    status: mapBackendStatusToFrontend(order.status)
                }));
                
                // Sắp xếp đơn hàng mới nhất lên đầu (theo ID giảm dần)
                mappedOrders.sort((a, b) => b.id - a.id);

                setOrders(mappedOrders);
                setFilteredOrders(mappedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                message.error('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleTabChange = (tabKey) => {
        console.log('Tab changed:', tabKey);
    };

    const handleSearch = (searchText) => {
        if (!searchText.trim()) {
            setFilteredOrders(orders);
        } else {
            const query = searchText.trim().toLowerCase();
            const filtered = orders.filter(order => 
                order.id.toString().includes(query) || 
                order.orderItems?.some(item => item.productName?.toLowerCase().includes(query))
            );
            setFilteredOrders(filtered);
        }
    };

    // Nếu chưa đăng nhập, hiển thị giao diện yêu cầu đăng nhập sang xịn mịn
    if (!user) {
        return (
            <div style={{ maxWidth: 600, margin: '64px auto', padding: '0 16px' }}>
                <Card 
                    bordered={false}
                    style={{ 
                        textAlign: 'center', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        borderRadius: 12,
                        padding: '24px 12px'
                    }}
                >
                    <div style={{ 
                        fontSize: 64, 
                        color: '#E30019', 
                        marginBottom: 16 
                    }}>
                        <LockOutlined />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#333' }}>
                        Tra cứu đơn hàng của bạn
                    </h2>
                    <p style={{ color: '#666', fontSize: 15, marginBottom: 24, lineHeight: '1.6' }}>
                        Vui lòng đăng nhập tài khoản của bạn để có thể xem danh sách đơn hàng đã đặt, theo dõi trạng thái giao hàng và chi tiết các sản phẩm.
                    </p>
                    <Button 
                        type="primary" 
                        size="large"
                        style={{ 
                            backgroundColor: '#E30019', 
                            borderColor: '#E30019',
                            height: 48,
                            padding: '0 32px',
                            fontSize: 16,
                            fontWeight: 500,
                            borderRadius: 6,
                            boxShadow: '0 4px 12px rgba(227, 0, 25, 0.2)'
                        }}
                        onClick={() => setOpenLogin(true)}
                    >
                        Đăng nhập ngay
                    </Button>
                </Card>

                <LoginModal
                    open={openLogin}
                    onCancel={() => setOpenLogin(false)}
                    onOpenRegister={() => {
                        setOpenLogin(false);
                        setOpenRegister(true);
                    }}
                />

                <RegisterModal
                    open={openRegister}
                    onCancel={() => setOpenRegister(false)}
                    onOpenLogin={() => {
                        setOpenRegister(false);
                        setOpenLogin(true);
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
            <OrderManagement
                orders={filteredOrders}
                onTabChange={handleTabChange}
                onSearch={handleSearch}
                loading={loading}
            />
        </div>
    );
}

export default Orders;