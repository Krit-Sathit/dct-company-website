'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalUniqueVisitors: number;
    todayViews: number;
    todayVisitors: number;
    mobilePercent: number;
    desktopPercent: number;
  };
  last7Days: Array<{
    date: string;
    label: string;
    views: number;
    visitors: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    count: number;
    percent: number;
  }>;
  recentViews: Array<{
    path: string;
    device: string;
    referrer: string;
    created_at: string;
  }>;
}

export function CmsAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
        <div>กำลังประมวลผลสถิติการเข้าชมเว็บไซต์...</div>
      </div>
    );
  }

  const summary = data?.summary || {
    totalViews: 0,
    totalUniqueVisitors: 0,
    todayViews: 0,
    todayVisitors: 0,
    mobilePercent: 50,
    desktopPercent: 50,
  };

  const last7Days = data?.last7Days || [];
  const maxDayViews = Math.max(...last7Days.map((d) => d.views), 10);
  const topPages = data?.topPages || [];
  const recentViews = data?.recentViews || [];

  function formatTimeAgo(isoString: string) {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'เมื่อสักครู่';
      if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr} ชม. ที่แล้ว`;
      return `${Math.floor(diffHr / 24)} วันที่แล้ว`;
    } catch {
      return 'เมื่อสักครู่';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📈</span> รายงานสถิติผู้เข้าชมเว็บไซต์ (Web Traffic Analytics)
          </h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>
            บันทึกการเข้าชมแบบเรียลไทม์ (ไม่นับรวมการเปิดดูของแอดมิน เพื่อความแม่นยำ)
          </p>
        </div>
        <button
          onClick={() => void loadAnalytics()}
          disabled={loading}
          className="button secondary"
          style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{loading ? '⏳' : '🔄'}</span>
          <span>{loading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Card 1: Total Views */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '18px 20px', borderLeft: '4px solid var(--red)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            เปิดชมทั้งหมด (Total Pageviews)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--red)', margin: '8px 0 4px' }}>
            {summary.totalViews.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#666' }}>ครั้ง</span>
          </div>
          <div style={{ fontSize: '12px', color: '#777' }}>
            รวมทุกหน้าที่ลูกค้าเปิดดูในเว็บไซต์
          </div>
        </div>

        {/* Card 2: Unique Visitors */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '18px 20px', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ผู้เข้าชมจริง (Unique Visitors)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#b7791f', margin: '8px 0 4px' }}>
            {summary.totalUniqueVisitors.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#666' }}>คน</span>
          </div>
          <div style={{ fontSize: '12px', color: '#777' }}>
            นับแยกตามเครื่อง/อุปกรณ์ (ไม่นับคนซ้ำ)
          </div>
        </div>

        {/* Card 3: Today's Traffic */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '18px 20px', borderLeft: '4px solid #38a169' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ผู้เข้าชมวันนี้ (Today's Visitors)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#276749', margin: '8px 0 4px' }}>
            {summary.todayVisitors.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#666' }}>คน</span>
          </div>
          <div style={{ fontSize: '12px', color: '#2f855a' }}>
            เปิดดูทั้งหมด <b>{summary.todayViews}</b> ครั้งในวันนี้
          </div>
        </div>

        {/* Card 4: Device Breakdown */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '18px 20px', borderLeft: '4px solid var(--brown)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            สัดส่วนอุปกรณ์ (Devices)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0 6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brown)' }}>📱 มือถือ {summary.mobilePercent}%</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#718096' }}>💻 คอม {summary.desktopPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${summary.mobilePercent}%`, background: 'var(--red)', height: '100%' }} />
            <div style={{ width: `${summary.desktopPercent}%`, background: '#718096', height: '100%' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: 7-Day Chart & Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* 7-Day Bar Chart */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--brown)' }}>
              📊 สถิติผู้เข้าชมย้อนหลัง 7 วัน (Daily Visits)
            </h3>
            <span style={{ fontSize: '12px', color: '#888' }}>จำนวนครั้งที่เปิดดู</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '190px', paddingBottom: '10px', borderBottom: '1px solid #edf2f7' }}>
            {last7Days.map((d, i) => {
              const heightPercent = Math.max(Math.round((d.views / maxDayViews) * 100), 10);
              const isToday = i === last7Days.length - 1;
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: isToday ? 'var(--red)' : '#4a5568', marginBottom: '4px' }}>
                    {d.views}
                  </div>
                  <div
                    title={`${d.label}: เข้าชม ${d.views} ครั้ง (${d.visitors} คน)`}
                    style={{
                      width: '70%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      background: isToday ? 'linear-gradient(180deg, var(--red) 0%, #7b1113 100%)' : 'linear-gradient(180deg, #d69e2e 0%, #b7791f 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: isToday ? 'var(--red)' : '#718096', fontWeight: isToday ? 700 : 500, marginTop: '8px', whiteSpace: 'nowrap' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#a0aec0' }}>
                    {d.visitors} คน
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages Ranking */}
        <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--brown)' }}>
              🏆 หน้าที่ลูกค้าเข้าดูเยอะที่สุด (Top Pages)
            </h3>
            <span style={{ fontSize: '12px', color: '#888' }}>สัดส่วนความสนใจ</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topPages.map((page, idx) => (
              <div key={page.path} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--brown)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: idx < 3 ? 'var(--red)' : '#888', marginRight: '6px' }}>#{idx + 1}</span>
                    {page.title}
                  </span>
                  <span style={{ color: '#4a5568', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {page.count} ครั้ง <span style={{ color: '#888', fontWeight: 400 }}>({page.percent}%)</span>
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${page.percent}%`,
                      height: '100%',
                      background: idx === 0 ? 'var(--red)' : idx === 1 ? 'var(--gold)' : idx === 2 ? '#319795' : '#a0aec0',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div style={{ background: '#fff', border: '1px solid #e8e1d9', borderRadius: '10px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--brown)' }}>
          ⏱️ ประวัติการเข้าชมล่าสุด (Recent Visits)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7', textAlign: 'left', color: '#718096' }}>
                <th style={{ padding: '10px 12px' }}>เวลา</th>
                <th style={{ padding: '10px 12px' }}>หน้าที่เปิดดู</th>
                <th style={{ padding: '10px 12px' }}>อุปกรณ์</th>
                <th style={{ padding: '10px 12px' }}>แหล่งที่มา (Referrer)</th>
              </tr>
            </thead>
            <tbody>
              {recentViews.map((v, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px 12px', color: '#718096', whiteSpace: 'nowrap' }}>
                    {formatTimeAgo(v.created_at)}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--brown)' }}>
                    {v.path}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#4a5568' }}>
                    {v.device === 'mobile' ? '📱 มือถือ' : '💻 คอมพิวเตอร์'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#718096' }}>
                    <span style={{ padding: '2px 8px', background: '#edf2f7', borderRadius: '4px', fontSize: '12px' }}>
                      {v.referrer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
