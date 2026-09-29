import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Form, Input, InputNumber, Select, Button, Space, Card, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { Title } = Typography;

function validatePartner(values) {
  if (!values.company_name || values.company_name.trim() === '') {
    throw new Error('Поле «Наименование» не должно быть пустым. Заполните его и повторите попытку.');
  }
  if (!values.contact_email || values.contact_email.trim() === '') {
    throw new Error('Поле «Email» не должно быть пустым. Укажите адрес в формате name@company.ru и повторите попытку.');
  }
  if (values.rating !== null && values.rating !== undefined) {
    if (!Number.isInteger(values.rating) || values.rating < 0) {
      throw new Error('Рейтинг должен быть целым числом от 0. Пожалуйста, удалите знаки препинания и дробную часть, затем повторите попытку.');
    }
  }
}

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
      .catch(() => Modal.error({ title: 'Ошибка', content: 'Не удалось загрузить типы партнёров. Проверьте подключение к серверу и обновите страницу.' }));
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
      .catch((err) => Modal.error({ title: 'Ошибка', content: err.message }));
  }, [id, isEdit, form]);

  const handleSave = async (values) => {
    try {
      validatePartner(values);
    } catch (err) {
      Modal.error({ title: 'Ошибка', content: err.message });
      return;
    }

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
      Modal.info({
        title: 'Готово',
        content: isEdit ? 'Данные партнёра успешно обновлены.' : 'Партнёр успешно добавлен в базу.',
        onOk: () => navigate('/'),
      });
    } catch (err) {
      Modal.error({
        title: 'Ошибка',
        content: `Не удалось сохранить данные: ${err.message}. Проверьте доступность базы данных и повторите попытку.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: 'Внимание',
        icon: <ExclamationCircleFilled />,
        content: 'Внесённые изменения не сохранены и будут потеряны без возможности восстановления. Покинуть форму?',
        okText: 'Выйти без сохранения',
        cancelText: 'Остаться',
        onOk: () => navigate('/'),
      });
      return;
    }
    navigate('/');
  };

  return (
    <>
      <Title level={3} className="page-title">Карточка партнёра</Title>
      <Card className="form-card">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Наименование" name="company_name">
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

          <Form.Item label="Email" name="contact_email" tooltip="Формат: name@company.ru">
            <Input placeholder="info@company.ru" />
          </Form.Item>

          <Space>
            <Button onClick={handleBack}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={saving}>Сохранить</Button>
          </Space>
        </Form>
      </Card>
    </>
  );
}
