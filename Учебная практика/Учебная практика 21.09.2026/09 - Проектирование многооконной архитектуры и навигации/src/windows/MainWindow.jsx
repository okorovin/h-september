import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Spin, Alert, Space } from 'antd';
import PartnerCard from '../components/PartnerCard.jsx';

const { Title } = Typography;

export default function MainWindow() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'CRM: Реестр партнеров';
  }, []);

  useEffect(() => {
    fetch('/api/partners')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить список партнёров');
        }
        return response.json();
      })
      .then((data) => setPartners(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Space className="page-head">
        <Title level={3} className="page-title">Реестр партнёров</Title>
        <Button type="primary" onClick={() => navigate('/partner/new')}>
          Добавить партнёра
        </Button>
      </Space>
      {loading && <Spin />}
      {error && <Alert type="error" message={error} showIcon />}
      {!loading && !error && (
        <div className="cards">
          {partners.map((partner) => (
            <PartnerCard key={partner.partner_id} partner={partner} />
          ))}
        </div>
      )}
    </>
  );
}
