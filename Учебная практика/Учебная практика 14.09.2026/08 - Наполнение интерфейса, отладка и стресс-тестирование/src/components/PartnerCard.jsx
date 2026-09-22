import { Card } from 'antd';

export default function PartnerCard({ partner }) {
  return (
    <Card className="partner-card">
      <div className="partner-card__row">
        <div className="partner-card__info">
          <div className="partner-card__title">{partner.company_name}</div>
          <div className="partner-card__line">{partner.email}</div>
          <div className="partner-card__line">{partner.phone || '—'}</div>
          <div className="partner-card__line">Рейтинг: {partner.rating ?? '—'}</div>
        </div>
        <div className="partner-card__discount">{partner.discount}%</div>
      </div>
    </Card>
  );
}
