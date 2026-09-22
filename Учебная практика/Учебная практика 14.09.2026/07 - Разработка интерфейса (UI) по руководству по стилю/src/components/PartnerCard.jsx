import { Card } from 'antd';
import { calculatePartnerDiscount } from '../discount.js';

export default function PartnerCard({ partner }) {
  const discount = calculatePartnerDiscount(partner.total_quantity);

  return (
    <Card className="partner-card">
      <div className="partner-card__row">
        <div className="partner-card__info">
          <div className="partner-card__title">{partner.company_name}</div>
          <div className="partner-card__line">{partner.email}</div>
          <div className="partner-card__line">{partner.phone || '—'}</div>
          <div className="partner-card__line">Рейтинг: {partner.rating ?? '—'}</div>
        </div>
        <div className="partner-card__discount">{discount}%</div>
      </div>
    </Card>
  );
}
