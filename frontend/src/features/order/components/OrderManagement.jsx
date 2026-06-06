import { useState } from 'react';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons';
import OrderTable from './OrderTable';
import './OrderManagement.scss';

/**
 * Các tab trạng thái đơn hàng
 */
const ORDER_TABS = [
    { key: 'all', label: 'TẤT CẢ' },
    { key: 'new', label: 'MỚI' },
    { key: 'processing', label: 'ĐANG XỬ LÝ' },
    { key: 'shipping', label: 'ĐANG VẬN CHUYỂN' },
    { key: 'completed', label: 'HOÀN THÀNH' },
    { key: 'cancelled', label: 'HUỶ' },
];

/**
 * Component quản lý đơn hàng
 * 
 * @param {Array}    orders       - Mảng đơn hàng
 * @param {function} onSearch     - Callback khi tìm kiếm (searchText)
 * @param {function} onTabChange  - Callback khi đổi tab (tabKey)
 * @param {boolean}  loading      - Trạng thái loading
 */
const OrderManagement = ({ orders = [], onSearch, onTabChange, loading = false }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchText, setSearchText] = useState('');

    const handleTabClick = (key) => {
        setActiveTab(key);
        onTabChange?.(key);
    };

    const handleSearch = () => {
        onSearch?.(searchText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Lọc đơn hàng theo tab
    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status === activeTab);

    return (
        <div className="order-mgmt">
            {/* Header */}
            <div className="order-mgmt__header">
                <h2 className="order-mgmt__title">Quản lý đơn hàng</h2>
            </div>

            {/* Tabs */}
            <div className="order-mgmt__tabs">
                {ORDER_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`order-mgmt__tab ${activeTab === tab.key ? 'order-mgmt__tab--active' : ''}`}
                        onClick={() => handleTabClick(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="order-mgmt__search">
                <div className="order-mgmt__search-input">
                    <SearchOutlined className="order-mgmt__search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm đơn hàng theo Mã đơn hàng"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <button
                    className="order-mgmt__search-btn"
                    onClick={handleSearch}
                >
                    Tìm đơn hàng
                </button>
            </div>

            {/* Content */}
            <div className="order-mgmt__content">
                {loading ? (
                    <div className="order-mgmt__loading">Đang tải...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="order-mgmt__empty">
                        <InboxOutlined className="order-mgmt__empty-icon" />
                        <p>Bạn chưa đặt mua sản phẩm.</p>
                    </div>
                ) : (
                    <OrderTable orders={filteredOrders} />
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
