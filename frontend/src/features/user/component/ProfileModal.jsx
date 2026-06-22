import { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Button, message, Tag, Spin } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../../context/AuthContext';
import useAuthStore from '../../../store/authStore';
import './ProfileModal.scss';

const ProfileModal = ({ open, onCancel }) => {
    const { user } = useAuthContext();
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const updateProfile = useAuthStore((s) => s.updateProfile);
    const changePassword = useAuthStore((s) => s.changePassword);

    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changing, setChanging] = useState(false);

    const [infoForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const fillInfoForm = (data) => {
        infoForm.setFieldsValue({
            fullName: data?.fullName || '',
            phoneNumber: data?.phoneNumber || '',
            address: data?.address || '',
        });
    };

    // Tải lại thông tin mỗi khi mở modal và đổ trực tiếp vào các ô input
    useEffect(() => {
        if (!open || !user) return;
        fillInfoForm(user);
        setLoading(true);
        fetchProfile()
            .then((fresh) => fillInfoForm(fresh))
            .catch(() => message.error('Không thể tải thông tin tài khoản'))
            .finally(() => setLoading(false));
    }, [open]);

    // Reset trạng thái khi đóng modal
    useEffect(() => {
        if (!open) {
            setActiveTab('info');
            infoForm.resetFields();
            passwordForm.resetFields();
        }
    }, [open]);

    const handleSaveInfo = async (values) => {
        setSaving(true);
        try {
            await updateProfile({
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                address: values.address,
            });
            message.success('Cập nhật thông tin thành công!');
        } catch {
            message.error('Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (values) => {
        setChanging(true);
        try {
            await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
            message.success('Đổi mật khẩu thành công!');
            passwordForm.resetFields();
        } catch (err) {
            const status = err?.status ?? err?.response?.status;
            const serverMsg = err?.response?.data?.message;
            if (status === 400) {
                message.error(serverMsg || 'Mật khẩu cũ không đúng');
            } else if (!status) {
                message.error('Lỗi đường truyền, không thể kết nối tới máy chủ');
            } else {
                message.error(serverMsg || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
            }
        } finally {
            setChanging(false);
        }
    };

    const roles = user?.roles || [];
    const isAdmin = roles.some((r) => ['ROLE_ADMIN', 'ADMIN', 'admin'].includes(r));

    const infoTab = (
        <Spin spinning={loading}>
            <div className="profile-modal__header">
                <div className="profile-modal__avatar">
                    <UserOutlined />
                </div>
                <div className="profile-modal__header-info">
                    <h3>{user?.fullName || user?.username}</h3>
                    <div>
                        {isAdmin ? (
                            <Tag color="red">Quản trị viên</Tag>
                        ) : (
                            <Tag color="blue">Khách hàng</Tag>
                        )}
                    </div>
                </div>
            </div>

            <Form form={infoForm} layout="vertical" onFinish={handleSaveInfo} className="profile-modal__form">
                <Form.Item label="Tên đăng nhập">
                    <Input prefix={<UserOutlined />} value={user?.username} size="large" disabled />
                </Form.Item>
                <Form.Item label="Họ và tên" name="fullName">
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[{ pattern: /^\d{10}$/, message: 'Số điện thoại phải gồm 10 chữ số' }]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                    <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" size="large" />
                </Form.Item>
                <div className="profile-modal__form-actions">
                    <Button type="primary" htmlType="submit" loading={saving} size="large">
                        Lưu thay đổi
                    </Button>
                </div>
            </Form>
        </Spin>
    );

    const passwordTab = (
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} className="profile-modal__form">
            <Form.Item
                label="Mật khẩu hiện tại"
                name="oldPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" size="large" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 6, message: 'Mật khẩu cần có 6 - 40 kí tự' },
                    { max: 40, message: 'Mật khẩu cần có 6 - 40 kí tự' },
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
            </Form.Item>
            <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" size="large" />
            </Form.Item>
            <div className="profile-modal__form-actions">
                <Button type="primary" htmlType="submit" loading={changing} size="large">
                    Đổi mật khẩu
                </Button>
            </div>
        </Form>
    );

    return (
        <Modal
            title="Thông tin tài khoản"
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={520}
            className="profile-modal"
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    { key: 'info', label: 'Thông tin cá nhân', children: infoTab },
                    { key: 'password', label: 'Đổi mật khẩu', children: passwordTab },
                ]}
            />
        </Modal>
    );
};

export default ProfileModal;
