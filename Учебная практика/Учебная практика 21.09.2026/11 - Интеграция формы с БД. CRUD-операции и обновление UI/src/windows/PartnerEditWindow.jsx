import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Form, Input, InputNumber, Select, Button, Space, Card, message } from 'antd';

const { Title } = Typography;

export default function PartnerEditWindow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = isEdit
      ? 'CRM: Карточка партнера [Редактирование]'
      : 'CRM: Карточка партнера [Создание]';
  }, [isEdit]);

  useEffect(() => {
    fetch('/api/partner-types')
      .then((response) => response.json())
      .then((data) => setTypes(data.map((t) => ({ value: t.partner_type_id, label: t.name }))))
      .catch(() => message.error('Не удалось загрузить типы партнёров'));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    fetch(`/api/partners/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные партнёра');
        }
        return response.json();
      })
      .then((partner) => {
        form.setFieldsValue({
          company_name: partner.company_name,
          partner_type_id: partner.partner_type_id,
          director_name: partner.director_name,
          address: partner.address,
          contact_email: partner.contact_email,
          phone: partner.phone,
          rating: partner.rating === null ? null : Number(partner.rating),
        });
      })
      .catch((err) => message.error(err.message));
  }, [id, isEdit, form]);

  const handleSave = async (values) => {
    setSaving(true);
    const url = isEdit ? `/api/partners/${id}` : '/api/partners';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Не удалось сохранить партнёра');
      }
      message.success('Данные сохранены');
      navigate('/');
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Title level={3} className="page-title">Карточка партнёра</Title>
      <Card className="form-card">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Наименование" name="company_name" rules={[{ required: true, message: 'Укажите наименование' }]}>
            <Input placeholder="Логистик-Экспресс" />
          </Form.Item>

          <Form.Item label="Тип партнёра" name="partner_type_id">
            <Select placeholder="Выберите тип" options={types} allowClear />
          </Form.Item>

          <Form.Item label="Рейтинг" name="rating">
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>

          <Form.Item label="Адрес" name="address">
            <Input placeholder="г. Москва, ул. Ленина, д. 1" />
          </Form.Item>

          <Form.Item label="ФИО директора" name="director_name">
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>

          <Form.Item label="Телефон" name="phone" tooltip="Формат: +7XXXXXXXXXX">
            <Input placeholder="+79991112233" />
          </Form.Item>

          <Form.Item label="Email" name="contact_email" tooltip="Формат: name@company.ru" rules={[{ required: true, type: 'email', message: 'Укажите корректный email' }]}>
            <Input placeholder="info@company.ru" />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate('/')}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={saving}>Сохранить</Button>
          </Space>
        </Form>
      </Card>
    </>
  );
}
