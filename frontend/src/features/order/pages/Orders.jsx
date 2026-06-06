import OrderManagement from '../components/OrderManagement';

function Orders() {
    const handleTabChange = (tabKey) => {
        console.log('Tab changed:', tabKey);
        // TODO: Gọi API lọc đơn hàng theo trạng thái
    };

    const handleSearch = (searchText) => {
        console.log('Search:', searchText);
        // TODO: Gọi API tìm kiếm đơn hàng theo mã
    };

    return (
        <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
            <OrderManagement
                orders={[]}
                onTabChange={handleTabChange}
                onSearch={handleSearch}
            />
        </div>
    );
}

export default Orders;