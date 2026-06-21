import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Descriptions, Tag, Spin, Divider } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    EditOutlined,
    LockOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../../context/AuthContext';
import useAuthStore from '../../../store/authStore';
import LoginModal from '../../auth/component/LoginModal';
import RegisterModal from '../../auth/component/RegisterModal';
import './UserProfile.scss';

const UserProfile = () => {
    const { user } = useAuthContext();
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const updateProfile = useAuthStore((s) => s.updateProfile);
    const navigate = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetchProfile()
            .then(() => message.success('Tải thông tin thành công'))
            .catch(() => message.error('Không thể tải thông tin tài khoản'))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = () => {
        form.setFieldsValue({
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
        });
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        form.resetFields();
    };

    const handleSave = async (values) => {
        setSaving(true);
        try {
            await updateProfile({
                phoneNumber: values.phoneNumber,
                address: values.address,
            });
            message.success('Cập nhật thông tin thành công!');
            setEditing(false);
        } catch {
            message.error('Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="user-profile__login">
                <Card bordered={false} className="user-profile__login-card">
                    <div className="user-profile__login-icon">
                        <LockOutlined />
                    </div>
                    <h2 className="user-profile__login-title">
                        Thông tin tài khoản
                    </h2>
                    <p className="user-profile__login-desc">
                        Vui lòng đăng nhập để xem và chỉnh sửa thông tin tài khoản của bạn.
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        className="user-profile__login-btn"
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

    const roles = user?.roles || [];
    const isAdmin = roles.some((r) => ['ROLE_ADMIN', 'ADMIN', 'admin'].includes(r));

    return (
        <div className="user-profile">
            <div className="user-profile__header">
                <div className="user-profile__avatar">
                    <UserOutlined />
                </div>
                <div className="user-profile__header-info">
                    <h2>{user.fullName || user.username}</h2>
                    <span className="user-profile__username">@{user.username}</span>
                    <div className="user-profile__roles">
                        {isAdmin ? (
                            <Tag color="red">Quản trị viên</Tag>
                        ) : (
                            <Tag color="blue">Khách hàng</Tag>
                        )}
                    </div>
                </div>
            </div>

            <Spin spinning={loading}>
                <Card className="user-profile__card" bordered={false}>
                    <div className="user-profile__card-title">
                        <span>Thông tin cá nhân</span>
                        {!editing && (
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>

                    {!editing ? (
                        <Descriptions column={1} size="middle" colon={false}
                            labelStyle={{ fontWeight: 500, color: '#666', padding: '12px 16px' }}
                            contentStyle={{ padding: '12px 16px' }}
                        >
                            <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
                                {user.fullName || '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                                {user.phoneNumber || '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                                {user.address || '—'}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            className="user-profile__form"
                        >
                            <Form.Item label="Số điện thoại" name="phoneNumber">
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Nhập số điện thoại"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input
                                    prefix={<EnvironmentOutlined />}
                                    placeholder="Nhập địa chỉ"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item className="user-profile__form-actions">
                                <Button onClick={handleCancel} size="large">
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={saving}
                                    size="large"
                                >
                                    Lưu thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Card>
            </Spin>

            <Divider />

            <Card className="user-profile__shortcuts" bordered={false}>
                <div className="user-profile__shortcuts-title">Phím tắt</div>
                <div className="user-profile__shortcut-list">
                    <div
                        className="user-profile__shortcut-item"
                        onClick={() => navigate('/orders')}
                    >
                        <ShoppingOutlined />
                        <span>Đơn hàng của tôi</span>
                    </div>
                    {isAdmin && (
                        <div
                            className="user-profile__shortcut-item"
                            onClick={() => navigate('/admin')}
                        >
                            <LockOutlined />
                            <span>Trang quản trị</span>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default UserProfile;
