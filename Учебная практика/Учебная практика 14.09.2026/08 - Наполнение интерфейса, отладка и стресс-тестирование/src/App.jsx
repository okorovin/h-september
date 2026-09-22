import { useEffect, useState } from 'react';
import { Layout, Typography, Spin, Alert } from 'antd';
import PartnerCard from './components/PartnerCard.jsx';
import logo from './assets/logo.svg';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Layout className="app">
      <Header className="app-header">
        <img className="app-header__logo" src={logo} alt="Логотип компании" />
      </Header>
      <Content className="container">
        <Title level={3} className="page-title">Список партнёров и скидок</Title>
        {loading && <Spin />}
        {error && <Alert type="error" message={error} showIcon />}
        {!loading && !error && (
          <div className="cards">
            {partners.map((partner) => (
              <PartnerCard key={partner.partner_id} partner={partner} />
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
}
