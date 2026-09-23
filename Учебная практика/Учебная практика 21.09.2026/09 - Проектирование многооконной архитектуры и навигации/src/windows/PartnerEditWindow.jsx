import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Form, Input, InputNumber, Button, Space, Card } from 'antd';

const { Title } = Typography;

export default function PartnerEditWindow() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'CRM: Карточка партнера [Редактирование]';
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Title level={3} className="page-title">Карточка партнёра</Title>
      <Card className="form-card">
        <Form layout="vertical">
          <Form.Item label="Наименование">
            <Input placeholder='ООО "Пример"' />
          </Form.Item>
          <Form.Item label="ИНН">
            <Input placeholder="7700000000" />
          </Form.Item>
          <Form.Item label="Email">
            <Input placeholder="mail@example.ru" />
          </Form.Item>
          <Form.Item label="Телефон">
            <Input placeholder="+70000000000" />
          </Form.Item>
          <Form.Item label="Рейтинг">
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Space>
            <Button onClick={handleBack}>Отмена</Button>
            <Button type="primary">Сохранить</Button>
          </Space>
        </Form>
      </Card>
    </>
  );
}
