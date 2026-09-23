import { Layout, Typography } from 'antd';
import PartnerCard from './components/PartnerCard.jsx';
import { partners } from './data/partners.js';
import logo from './assets/logo.png';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Layout className="app">
      <Header className="app-header">
        <img className="app-header__logo" src={logo} alt="Лого" />
      </Header>
      <Content className="container">
        <Title level={3} className="page-title">Партнёры</Title>
        <div className="cards">
          {partners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </Content>
    </Layout>
  );
}
