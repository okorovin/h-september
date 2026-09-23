import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import MainWindow from './windows/MainWindow.jsx';
import PartnerEditWindow from './windows/PartnerEditWindow.jsx';
import logo from './assets/logo.png';

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout className="app">
      <Header className="app-header">
        <img className="app-header__logo" src={logo} alt="Логотип компании" />
      </Header>
      <Content className="container">
        <Routes>
          <Route path="/" element={<MainWindow />} />
          <Route path="/partner/new" element={<PartnerEditWindow />} />
          <Route path="/partner/:id" element={<PartnerEditWindow />} />
        </Routes>
      </Content>
    </Layout>
  );
}
