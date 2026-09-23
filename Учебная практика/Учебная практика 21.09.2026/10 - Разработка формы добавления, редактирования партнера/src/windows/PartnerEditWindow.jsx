import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Form, Input, InputNumber, Select, Button, Space, Card, Tooltip } from 'antd';

const { Title } = Typography;

const partnerTypes = [
  { value: 'ЗАО', label: 'ЗАО' },
  { value: 'ООО', label: 'ООО' },
  { value: 'ИП', label: 'ИП' },
  { value: 'ПАО', label: 'ПАО' },
];

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
            <Input placeholder="Логистик-Экспресс" />
          </Form.Item>

          <Form.Item label="Тип партнёра">
            <Select placeholder="Выберите тип" options={partnerTypes} />
          </Form.Item>

          <Form.Item label="Рейтинг">
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>

          <Form.Item label="Адрес">
            <Input placeholder="г. Москва, ул. Ленина, д. 1" />
          </Form.Item>

          <Form.Item label="ФИО директора">
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>

          <Form.Item label="Телефон">
            <Tooltip title="Формат: +7XXXXXXXXXX">
              <Input placeholder="+79991112233" />
            </Tooltip>
          </Form.Item>

          <Form.Item label="Email">
            <Tooltip title="Формат: name@company.ru">
              <Input placeholder="info@company.ru" />
            </Tooltip>
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
