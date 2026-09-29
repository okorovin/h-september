import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Table, Button, Space, Spin, Modal } from 'antd';

const { Title } = Typography;

const columns = [
  { title: 'Наименование продукции', dataIndex: 'product_name', key: 'product_name' },
  { title: 'Количество (шт.)', dataIndex: 'quantity', key: 'quantity', align: 'right' },
  { title: 'Дата продажи', dataIndex: 'sale_date', key: 'sale_date', align: 'right' },
];

export default function PartnerHistoryWindow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partnerName, setPartnerName] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = partnerName
      ? `CRM: История реализации продукции — ${partnerName}`
      : 'CRM: История реализации продукции';
  }, [partnerName]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/partners/${id}`).then((r) => r.json()),
      fetch(`/api/partners/${id}/history`).then((r) => r.json()),
    ])
      .then(([partner, rows]) => {
        setPartnerName(partner.company_name);
        setHistory(rows);
      })
      .catch(() => Modal.error({ title: 'Ошибка', content: 'Не удалось загрузить историю продаж. Проверьте подключение к серверу.' }))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Space className="page-head">
        <Title level={3} className="page-title">
          История реализации продукции{partnerName ? ` — ${partnerName}` : ''}
        </Title>
        <Button onClick={() => navigate('/')}>Назад</Button>
      </Space>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={history}
          rowKey={(row, index) => index}
          pagination={false}
        />
      )}
    </>
  );
}
