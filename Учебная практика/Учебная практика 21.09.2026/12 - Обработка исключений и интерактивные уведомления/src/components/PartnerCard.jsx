import { Card } from 'antd';

export default function PartnerCard({ partner, onClick }) {
  const title = partner.partner_type
    ? `${partner.partner_type} | ${partner.company_name}`
    : partner.company_name;

  return (
    <Card className="partner-card" hoverable onClick={onClick}>
      <div className="partner-card__row">
        <div className="partner-card__info">
          <div className="partner-card__title">{title}</div>
          <div className="partner-card__line">{partner.director_name || '—'}</div>
          <div className="partner-card__line">{partner.phone || '—'}</div>
          <div className="partner-card__line">Рейтинг: {partner.rating ?? '—'}</div>
        </div>
        <div className="partner-card__discount">{partner.discount}%</div>
      </div>
    </Card>
  );
}
