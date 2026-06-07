import React from 'react';

export default function RevenueChart({ revenueHistory, maxRevenue }) {
  return (
    <section className="glass-card chart-section">
      <div className="section-header">
        <h3>Fatturato Mensile (SaaS Preview)</h3>
      </div>
      
      <div className="custom-chart-wrapper">
        <div className="chart-y-axis">
          <span>€{maxRevenue}</span>
          <span>€{Math.round(maxRevenue / 2)}</span>
          <span>€0</span>
        </div>
        <div className="chart-bars-container">
          {revenueHistory.map((item, index) => {
            const percentHeight = (item.revenue / maxRevenue) * 100;
            const isCurrentMonth = index === revenueHistory.length - 1;
            return (
              <div key={item.month} className="chart-bar-column">
                <div className="chart-bar-tooltip">
                  €{item.revenue} ({item.appointments} app.)
                </div>
                <div className="chart-bar-track">
                  <div 
                    className={`chart-bar-fill ${isCurrentMonth ? 'current' : ''}`}
                    style={{ height: `${percentHeight}%` }}
                  >
                    <div className="bar-glow"></div>
                  </div>
                </div>
                <span className="chart-bar-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
