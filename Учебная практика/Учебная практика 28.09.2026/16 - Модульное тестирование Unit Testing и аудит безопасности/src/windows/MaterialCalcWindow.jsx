import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Form, InputNumber, Select, Button, Space, Card, Statistic, Modal } from 'antd';

const { Title } = Typography;

export default function MaterialCalcWindow() {
  const navigate = useNavigate();
  const [productTypes, setProductTypes] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    document.title = 'CRM: Калькулятор расхода материалов';
  }, []);

  useEffect(() => {
    fetch('/api/product-types')
      .then((r) => r.json())
      .then((data) => setProductTypes(data.map((t) => ({ value: t.product_type_id, label: t.name }))))
      .catch(() => Modal.error({ title: 'Ошибка', content: 'Не удалось загрузить типы продукции.' }));
    fetch('/api/material-types')
      .then((r) => r.json())
      .then((data) => setMaterialTypes(data.map((t) => ({ value: t.material_type_id, label: t.name }))))
      .catch(() => Modal.error({ title: 'Ошибка', content: 'Не удалось загрузить типы материала.' }));
  }, []);

  const handleCalculate = async (values) => {
    setCalculating(true);
    setResult(null);

    try {
      const response = await fetch('/api/calculate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Сервер недоступен');
      }
      const data = await response.json();
      // метод возвращает -1 при некорректных данных — показываем ошибку, а не число
      if (data.result === -1) {
        Modal.error({
          title: 'Некорректные данные',
          content: 'Проверьте ввод: количество должно быть больше нуля, параметры не могут быть отрицательными, а типы продукции и материала должны быть выбраны из списка. Исправьте данные и повторите расчёт.',
        });
        return;
      }
      setResult(data.result);
    } catch (err) {
      Modal.error({ title: 'Ошибка', content: `Не удалось выполнить расчёт: ${err.message}. Повторите попытку.` });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <>
      <Space className="page-head">
        <Title level={3} className="page-title">Калькулятор расхода материалов</Title>
        <Button onClick={() => navigate('/')}>Назад</Button>
      </Space>
      <Card className="form-card">
        <Form layout="vertical" onFinish={handleCalculate}>
          <Form.Item label="Тип продукции" name="product_type_id" rules={[{ required: true, message: 'Выберите тип продукции' }]}>
            <Select placeholder="Выберите тип" options={productTypes} />
          </Form.Item>

          <Form.Item label="Тип материала" name="material_type_id" rules={[{ required: true, message: 'Выберите тип материала' }]}>
            <Select placeholder="Выберите тип" options={materialTypes} />
          </Form.Item>

          <Form.Item label="Количество продукции (шт.)" name="quantity" rules={[{ required: true, message: 'Укажите количество' }]}>
            <InputNumber style={{ width: '100%' }} placeholder="10" />
          </Form.Item>

          <Form.Item label="Параметр 1" name="param_1" rules={[{ required: true, message: 'Укажите параметр 1' }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} placeholder="2.0" />
          </Form.Item>

          <Form.Item label="Параметр 2" name="param_2" rules={[{ required: true, message: 'Укажите параметр 2' }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} placeholder="3.0" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={calculating}>Рассчитать</Button>
        </Form>

        {result !== null && (
          <Statistic className="calc-result" title="Требуется материала" value={result} suffix="ед." />
        )}
      </Card>
    </>
  );
}
