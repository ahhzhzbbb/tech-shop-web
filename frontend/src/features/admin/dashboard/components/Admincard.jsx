import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AdminCard.scss';

const AdminCard = ({ item }) => {
    const navigate = useNavigate();
    const Icon = item.icon;

    return (
        <Card
            className="admin-card"
            onClick={() => navigate(item.path)}
            hoverable
        >
            <div className="admin-card__icon-wrap">
                <Icon size={28} weight="duotone" />
            </div>
            <div className="admin-card__body">
                <p className="admin-card__label">{item.label}</p>
                <p className="admin-card__desc">{item.description}</p>
            </div>
            <div className="admin-card__arrow">→</div>
        </Card>
    );
};

export default AdminCard;