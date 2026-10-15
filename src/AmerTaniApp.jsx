import React, { useState, useEffect } from 'react';
import {
  Activity,
  LayoutDashboard,
  History,
  Settings,
  Minimize2,
  Wifi,
  CloudRain,
  Droplet,
  Droplets,
  Timer,
  Zap,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Save,
  Clock,
  Sliders,
  LogOut,
  Flower2
} from 'lucide-react';
import amertaniLogo from '../assets/amertani-logo.png';
import './amertani.css';

// Initial Mock Data
const INITIAL_SOILS = [68, 48, 76, 62];
const INITIAL_NPK = { n: 215, p: 46, k: 182 };

const INITIAL_HISTORY = [
  { id: 1, timestamp: '15/10/2026 18:30:15', jenis: 'Penyiraman Tetes', mode: 'Auto', action: 'Irigasi Baris 2', dur: 120, tot_irrig: 12.8, tot_fert: 0 },
  { id: 2, timestamp: '15/10/2026 16:15:00', jenis: 'Penyiraman Kabut', mode: 'Manual', action: 'Pupuk POC Baris 1', dur: 120, tot_irrig: 0, tot_fert: 8.5 },
  { id: 3, timestamp: '15/10/2026 14:00:22', jenis: 'Penyiraman Tetes', mode: 'Manual', action: 'Irigasi Baris 4', dur: 180, tot_irrig: 18.2, tot_fert: 0 },
  { id: 4, timestamp: '15/10/2026 09:45:10', jenis: 'Penyiraman Kabut', mode: 'Auto', action: 'Pupuk POC Baris 3', dur: 120, tot_irrig: 0, tot_fert: 8.4 },
  { id: 5, timestamp: '15/10/2026 07:30:00', jenis: 'Penyiraman Tetes', mode: 'Auto', action: 'Irigasi Baris 1', dur: 240, tot_irrig: 24.5, tot_fert: 0 },
  { id: 6, timestamp: '14/10/2026 17:00:00', jenis: 'Penyiraman Tetes', mode: 'Auto', action: 'Irigasi Baris 3', dur: 180, tot_irrig: 19.1, tot_fert: 0 },
  { id: 7, timestamp: '14/10/2026 11:20:15', jenis: 'Penyiraman Kabut', mode: 'Manual', action: 'Pupuk POC Baris 2', dur: 120, tot_irrig: 0, tot_fert: 8.3 },
  { id: 8, timestamp: '14/10/2026 07:30:00', jenis: 'Penyiraman Tetes', mode: 'Auto', action: 'Irigasi Baris 4', dur: 240, tot_irrig: 25.0, tot_fert: 0 },
];

export default function AmerTaniApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('monitoring');

  // Simulated IoT State
  const [soils, setSoils] = useState(INITIAL_SOILS);
  const [npk, setNpk] = useState(INITIAL_NPK);
  const [modeManualKabut, setModeManualKabut] = useState(true);
  const [modeManualTetes, setModeManualTetes] = useState(true);
  const [valveKabut, setValveKabut] = useState([false, false, false, false]);
  const [valveTetes, setValveTetes] = useState([false, false, false, false]);
  
  // Timer states (in seconds)
  const [timerKabut, setTimerKabut] = useState(0);
  const [timerTetes, setTimerTetes] = useState(0);
  const [totalIrrig, setTotalIrrig] = useState(485.4);
  const [totalFert, setTotalFert] = useState(194.2);

  // Settings State
  const [settings, setSettings] = useState({
    batasKering: 50,
    batasCukup: 75,
    durasiKabut: 2,
    durasiTetes: 2,
    scheduleEnabled: true,
    scheduleHour: '07',
    scheduleMinute: '30',
    scheduleIntervalDays: 7,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active Pumps
  const pumpKabut = valveKabut.some(Boolean);
  const pumpTetes = valveTetes.some(Boolean);

  // Interval for Timers and Live Sensor Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Countdown for Kabut
      if (pumpKabut) {
        setTimerKabut((prev) => Math.max(0, prev - 1));
        setTotalFert((prev) => +(prev + 0.05).toFixed(2));
      }
      // Countdown for Tetes
      if (pumpTetes) {
        setTimerTetes((prev) => Math.max(0, prev - 1));
        setTotalIrrig((prev) => +(prev + 0.1).toFixed(2));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pumpKabut, pumpTetes]);

  // Turn off valves when timer reaches 0
  useEffect(() => {
    if (timerKabut === 0 && pumpKabut) {
      setValveKabut([false, false, false, false]);
    }
  }, [timerKabut, pumpKabut]);

  useEffect(() => {
    if (timerTetes === 0 && pumpTetes) {
      setValveTetes([false, false, false, false]);
    }
  }, [timerTetes, pumpTetes]);

  const handleToggleValveKabut = (index) => {
    const next = [false, false, false, false];
    const willBeOn = !valveKabut[index];
    next[index] = willBeOn;
    setValveKabut(next);
    if (willBeOn) {
      setTimerKabut(settings.durasiKabut * 60);
      // Small moisture bump simulation
      setSoils((prev) => {
        const copy = [...prev];
        copy[index] = Math.min(100, copy[index] + 4);
        return copy;
      });
    } else {
      setTimerKabut(0);
    }
  };

  const handleToggleValveTetes = (index) => {
    const next = [false, false, false, false];
    const willBeOn = !valveTetes[index];
    next[index] = willBeOn;
    setValveTetes(next);
    if (willBeOn) {
      setTimerTetes(settings.durasiTetes * 60);
      // Small moisture bump simulation
      setSoils((prev) => {
        const copy = [...prev];
        copy[index] = Math.min(100, copy[index] + 6);
        return copy;
      });
    } else {
      setTimerTetes(0);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="amertani-overlay">
      {/* Top Navbar */}
      <header className="amertani-navbar">
        <div className="amertani-nav-brand">
          <div className="amertani-nav-logo">
            <img src={amertaniLogo} alt="Logo AmerTani" />
          </div>
          <div>
            <div className="amertani-nav-title">AmerTani</div>
          </div>
        </div>

        <div className="amertani-nav-right">
          <div className="amertani-status-badge">
            <div className="amertani-status-dot" />
            <Wifi size={14} />
            <span>Terhubung (IoT Aktif)</span>
          </div>

          <button className="amertani-exit-btn" onClick={onClose} title="Keluar Fullscreen">
            <Minimize2 size={15} />
            <span>Tutup Fullscreen</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="amertani-body">
        {/* Sidebar */}
        <aside className="amertani-sidebar">
          <nav className="amertani-menu">
            <button
              className={`amertani-menu-item ${activeTab === 'monitoring' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitoring')}
            >
              <Activity size={18} />
              <span>Monitoring Sensor</span>
            </button>

            <button
              className={`amertani-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Ringkasan Riwayat</span>
            </button>

            <button
              className={`amertani-menu-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={18} />
              <span>Catatan Aktivitas</span>
            </button>

            <button
              className={`amertani-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Pengaturan Alat</span>
            </button>
          </nav>

          <div style={{ padding: '16px 14px', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
              <span>Keluar ke Showcase</span>
            </button>
          </div>
        </aside>

        {/* Dynamic View */}
        <main className="amertani-main-content">
          {activeTab === 'monitoring' && (
            <MonitoringView
              soils={soils}
              npk={npk}
              modeManualKabut={modeManualKabut}
              setModeManualKabut={setModeManualKabut}
              modeManualTetes={modeManualTetes}
              setModeManualTetes={setModeManualTetes}
              valveKabut={valveKabut}
              valveTetes={valveTetes}
              handleToggleValveKabut={handleToggleValveKabut}
              handleToggleValveTetes={handleToggleValveTetes}
              pumpKabut={pumpKabut}
              pumpTetes={pumpTetes}
              timerKabut={timerKabut}
              timerTetes={timerTetes}
              formatTime={formatTime}
              totalIrrig={totalIrrig}
              totalFert={totalFert}
            />
          )}

          {activeTab === 'dashboard' && <DashboardView />}

          {activeTab === 'history' && <HistoryView />}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              saveSuccess={saveSuccess}
              setSaveSuccess={setSaveSuccess}
            />
          )}
        </main>
      </div>

      {/* Mobile Footer Navigation Bar untuk Berpindah Halaman */}
      <nav className="amertani-mobile-nav" aria-label="Navigasi Halaman Mobile">
        <button
          type="button"
          className={`amertani-mobile-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <Activity size={20} />
          <span>Sensor</span>
        </button>

        <button
          type="button"
          className={`amertani-mobile-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Riwayat</span>
        </button>

        <button
          type="button"
          className={`amertani-mobile-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={20} />
          <span>Catatan</span>
        </button>

        <button
          type="button"
          className={`amertani-mobile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span>Pengaturan</span>
        </button>
      </nav>
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. MONITORING SENSOR TAB
// ----------------------------------------------------------------------
function MonitoringView({
  soils,
  npk,
  modeManualKabut,
  setModeManualKabut,
  modeManualTetes,
  setModeManualTetes,
  valveKabut,
  valveTetes,
  handleToggleValveKabut,
  handleToggleValveTetes,
  pumpKabut,
  pumpTetes,
  timerKabut,
  timerTetes,
  formatTime,
  totalIrrig,
  totalFert,
}) {
  return (
    <div>
      <div className="amertani-page-header">
        <h2 className="amertani-page-title">Monitoring Sensor & Kendali Pompa</h2>
        <p className="amertani-page-desc">
          Pantau nilai sensor, kendalikan pompa, dan pantau status lahan secara real-time.
        </p>
      </div>

      {/* Top 7 Status Cards Row */}
      <div className="amertani-status-grid">
        {/* Status Kabut */}
        <div className={`amertani-status-card ${pumpKabut ? 'active-blue' : ''}`}>
          <div className="amertani-card-top">
            <div className={`amertani-icon-box ${pumpKabut ? 'icon-blue' : 'icon-muted'}`}>
              <CloudRain size={20} />
            </div>
            <div>
              <p className="amertani-card-label">Penyiraman Kabut</p>
              <p
                className="amertani-card-value"
                style={{ color: pumpKabut ? '#2563eb' : '#64748b' }}
              >
                {pumpKabut ? 'Menyala' : 'Mati'}
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span>{pumpKabut ? 'Sisa waktu' : 'Terakhir: Hari ini'}</span>
            <span style={{ fontWeight: '700', color: pumpKabut ? '#2563eb' : '#64748b' }}>
              {pumpKabut ? formatTime(timerKabut) : '00:00'}
            </span>
          </div>
        </div>

        {/* Status Tetes */}
        <div className={`amertani-status-card ${pumpTetes ? 'active-cyan' : ''}`}>
          <div className="amertani-card-top">
            <div className={`amertani-icon-box ${pumpTetes ? 'icon-cyan' : 'icon-muted'}`}>
              <Droplet size={20} />
            </div>
            <div>
              <p className="amertani-card-label">Penyiraman Tetes</p>
              <p
                className="amertani-card-value"
                style={{ color: pumpTetes ? '#0891b2' : '#64748b' }}
              >
                {pumpTetes ? 'Menyala' : 'Mati'}
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span>{pumpTetes ? 'Sisa waktu' : 'Terakhir: Hari ini'}</span>
            <span style={{ fontWeight: '700', color: pumpTetes ? '#0891b2' : '#64748b' }}>
              {pumpTetes ? formatTime(timerTetes) : '00:00'}
            </span>
          </div>
        </div>

        {/* Nitrogen */}
        <div className="amertani-status-card">
          <div className="amertani-card-top">
            <div className="amertani-icon-box icon-blue">N</div>
            <div>
              <p className="amertani-card-label">Nitrogen (N)</p>
              <p className="amertani-card-value">
                {npk.n} <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>mg/kg</span>
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span style={{ color: '#059669', fontWeight: '600' }}>Normal — cukup nutrisi</span>
          </div>
        </div>

        {/* Fosfor */}
        <div className="amertani-status-card">
          <div className="amertani-card-top">
            <div className="amertani-icon-box icon-rose">P</div>
            <div>
              <p className="amertani-card-label">Fosfor (P)</p>
              <p className="amertani-card-value">
                {npk.p} <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>mg/kg</span>
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span style={{ color: '#059669', fontWeight: '600' }}>Normal — cukup nutrisi</span>
          </div>
        </div>

        {/* Kalium */}
        <div className="amertani-status-card">
          <div className="amertani-card-top">
            <div className="amertani-icon-box icon-amber">K</div>
            <div>
              <p className="amertani-card-label">Kalium (K)</p>
              <p className="amertani-card-value">
                {npk.k} <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>mg/kg</span>
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span style={{ color: '#059669', fontWeight: '600' }}>Normal — cukup nutrisi</span>
          </div>
        </div>

        {/* Flow Irigasi */}
        <div className="amertani-status-card">
          <div className="amertani-card-top">
            <div className="amertani-icon-box icon-blue">
              <CloudRain size={20} />
            </div>
            <div>
              <p className="amertani-card-label">Flow Irigasi</p>
              <p className="amertani-card-value">
                {pumpTetes ? '12.4' : '0.00'}{' '}
                <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>L/m</span>
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span>Total: {totalIrrig} L</span>
          </div>
        </div>

        {/* Flow Pupuk */}
        <div className="amertani-status-card">
          <div className="amertani-card-top">
            <div className="amertani-icon-box icon-cyan">
              <Droplet size={20} />
            </div>
            <div>
              <p className="amertani-card-label">Flow Pupuk</p>
              <p className="amertani-card-value">
                {pumpKabut ? '8.20' : '0.00'}{' '}
                <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>L/m</span>
              </p>
            </div>
          </div>
          <div className="amertani-card-footer">
            <span>Total: {totalFert} L</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Pump Control & 4 Baris Gauges */}
      <div className="amertani-monitoring-layout">
        {/* Left Column: Pump Mode */}
        <div className="amertani-card amertani-control-box">
          <div className="amertani-box-title">
            <Zap size={18} color="#059669" />
            <span>Mode Pompa</span>
          </div>

          {/* Mode Kabut */}
          <div>
            <div className="amertani-section-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudRain size={16} color="#2563eb" />
                <span>Kabut</span>
              </div>
              <span className={`amertani-badge-pill ${modeManualKabut ? 'pill-manual' : 'pill-auto'}`}>
                {modeManualKabut ? 'Manual' : 'Auto'}
              </span>
            </div>
            <div className="amertani-btn-group">
              <button
                className={`amertani-toggle-btn ${!modeManualKabut ? 'active-blue' : ''}`}
                onClick={() => setModeManualKabut(false)}
              >
                Auto
              </button>
              <button
                className={`amertani-toggle-btn ${modeManualKabut ? 'active-blue' : ''}`}
                onClick={() => setModeManualKabut(true)}
              >
                Manual
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '14px 0' }} />

          {/* Mode Tetes */}
          <div>
            <div className="amertani-section-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Droplet size={16} color="#0891b2" />
                <span>Tetes</span>
              </div>
              <span className={`amertani-badge-pill ${modeManualTetes ? 'pill-manual' : 'pill-auto'}`}>
                {modeManualTetes ? 'Manual' : 'Auto'}
              </span>
            </div>
            <div className="amertani-btn-group">
              <button
                className={`amertani-toggle-btn ${!modeManualTetes ? 'active-cyan' : ''}`}
                onClick={() => setModeManualTetes(false)}
              >
                Auto
              </button>
              <button
                className={`amertani-toggle-btn ${modeManualTetes ? 'active-cyan' : ''}`}
                onClick={() => setModeManualTetes(true)}
              >
                Manual
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '14px 0' }} />

          {/* System status description */}
          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: pumpKabut || pumpTetes ? '#10b981' : '#94a3b8',
                }}
              />
              <span>
                Status:{' '}
                <strong style={{ color: '#0f172a' }}>
                  {pumpKabut || pumpTetes ? 'Menyiram Aktif' : 'Siaga (Standby)'}
                </strong>
              </span>
            </div>
            <span>Klik tombol valve di bawah setiap baris untuk mengaktifkan penyiraman secara presisi.</span>
          </div>
        </div>

        {/* Right Column: 4 Baris Gauges & Valve Buttons */}
        <div className="amertani-baris-grid">
          {[0, 1, 2, 3].map((idx) => {
            const val = soils[idx];
            let statusText = 'Lembap (Cukup Air)';
            let statusColor = '#059669';
            let strokeColor = '#10b981';

            if (val < 50) {
              statusText = 'Kering (Kurang Air)';
              statusColor = '#e11d48';
              strokeColor = '#f43f5e';
            } else if (val < 75) {
              statusText = 'Lembap Ideal';
              statusColor = '#d97706';
              strokeColor = '#f59e0b';
            }

            const radius = 40;
            const circum = 2 * Math.PI * radius;
            const offset = circum - (val / 100) * circum;
            const isKabutOn = valveKabut[idx];
            const isTetesOn = valveTetes[idx];

            return (
              <div key={idx} className="amertani-card amertani-gauge-card">
                <div className="amertani-gauge-title">Baris {idx + 1}</div>

                {/* SVG Gauge */}
                <div className="amertani-gauge-ring">
                  <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#f1f5f9"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={strokeColor}
                      strokeWidth="8"
                      strokeDasharray={circum}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  <div className="amertani-gauge-text">
                    <span className="amertani-gauge-value" style={{ color: statusColor }}>
                      {val}%
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Kelembapan</span>
                  </div>
                </div>

                <div className="amertani-gauge-badge" style={{ color: statusColor }}>
                  {statusText}
                </div>

                {/* Valve Controls */}
                <div className="amertani-valve-control">
                  <button
                    className={`amertani-valve-btn ${isKabutOn ? 'on-kabut' : ''}`}
                    onClick={() => handleToggleValveKabut(idx)}
                  >
                    <span>{isKabutOn ? 'Menyiram Kabut!' : 'Kabut'}</span>
                    {isKabutOn && (
                      <span style={{ fontSize: '10px', opacity: 0.9 }}>
                        {formatTime(timerKabut)}
                      </span>
                    )}
                  </button>

                  <button
                    className={`amertani-valve-btn ${isTetesOn ? 'on-tetes' : ''}`}
                    onClick={() => handleToggleValveTetes(idx)}
                  >
                    <span>{isTetesOn ? 'Meneteskan Air!' : 'Tetes'}</span>
                    {isTetesOn && (
                      <span style={{ fontSize: '10px', opacity: 0.9 }}>
                        {formatTime(timerTetes)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. DASHBOARD / RINGKASAN RIWAYAT TAB
// ----------------------------------------------------------------------
function DashboardView() {
  const [range, setRange] = useState('7days');

  // Dummy Chart Points
  const chartPoints = [
    { label: 'Sen', b1: 65, b2: 52, b3: 78, b4: 60, dur: 45 },
    { label: 'Sel', b1: 70, b2: 58, b3: 82, b4: 64, dur: 38 },
    { label: 'Rab', b1: 62, b2: 45, b3: 75, b4: 59, dur: 60 },
    { label: 'Kam', b1: 74, b2: 60, b3: 80, b4: 68, dur: 30 },
    { label: 'Jum', b1: 68, b2: 54, b3: 77, b4: 63, dur: 42 },
    { label: 'Sab', b1: 72, b2: 62, b3: 85, b4: 70, dur: 35 },
    { label: 'Min', b1: 68, b2: 48, b3: 76, b4: 62, dur: 50 },
  ];

  return (
    <div>
      <div
        className="amertani-page-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <h2 className="amertani-page-title">Ringkasan Riwayat Pertanian</h2>
          <p className="amertani-page-desc">
            Analisis data tren kelembapan tanah dan durasi penyiraman.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['today', '3days', '7days', '1month'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid #cbd5e1',
                background: range === r ? '#059669' : '#ffffff',
                color: range === r ? '#ffffff' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {r === 'today'
                ? 'Hari Ini'
                : r === '3days'
                ? '3 Hari'
                : r === '7days'
                ? '7 Hari'
                : '1 Bulan'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '22px' }}>
        <div className="amertani-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="amertani-icon-box icon-blue">
              <Droplets size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Total Irigasi Air</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: '800' }}>148.5 L</h3>
            </div>
          </div>
        </div>

        <div className="amertani-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="amertani-icon-box icon-cyan">
              <Flower2 size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Total Pupuk Organik</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: '800' }}>46.2 L</h3>
            </div>
          </div>
        </div>

        <div className="amertani-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="amertani-icon-box icon-amber">
              <Activity size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Rata-rata Kelembapan</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: '800' }}>66.4%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Moisture Trend SVG Chart */}
      <div className="amertani-card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Tren Kelembapan Tanah (%)</h4>
          <div style={{ display: 'flex', gap: '14px', fontSize: '11.5px', fontWeight: '600' }}>
            <span style={{ color: '#2563eb' }}>● Baris 1</span>
            <span style={{ color: '#e11d48' }}>● Baris 2</span>
            <span style={{ color: '#10b981' }}>● Baris 3</span>
            <span style={{ color: '#f59e0b' }}>● Baris 4</span>
          </div>
        </div>

        {/* SVG Multi-line Graph */}
        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
          <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />

            {/* Line Baris 1 (Blue) */}
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              points="20,110 110,95 200,118 290,88 380,102 470,92 560,104"
            />
            {/* Line Baris 2 (Rose) */}
            <polyline
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.5"
              points="20,135 110,122 200,150 290,118 380,130 470,115 560,142"
            />
            {/* Line Baris 3 (Green) */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              points="20,80 110,72 200,85 290,75 380,82 470,68 560,84"
            />
            {/* Line Baris 4 (Amber) */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              points="20,120 110,112 200,124 290,105 380,114 470,100 560,116"
            />

            {/* Points Baris 1 */}
            {[
              [20, 110], [110, 95], [200, 118], [290, 88], [380, 102], [470, 92], [560, 104]
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
            ))}
          </svg>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8',
              padding: '0 10px',
            }}
          >
            {chartPoints.map((p, i) => (
              <span key={i}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Watering Duration Bar Chart */}
      <div className="amertani-card" style={{ padding: '22px' }}>
        <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700' }}>
          Durasi Penyiraman Harian (Menit)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', height: '160px', alignItems: 'end' }}>
          {chartPoints.map((item, idx) => {
            const h = (item.dur / 70) * 120;
            return (
              <div
                key={idx}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
              >
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#059669' }}>
                  {item.dur}m
                </span>
                <div
                  style={{
                    width: '32px',
                    height: `${h}px`,
                    background: 'linear-gradient(180deg, #10b981, #047857)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. CATATAN AKTIVITAS / HISTORY TAB
// ----------------------------------------------------------------------
function HistoryView() {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterMode, setFilterMode] = useState('Semua');

  const filtered = INITIAL_HISTORY.filter((item) => {
    const matchSearch =
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      item.timestamp.includes(search);
    const matchJenis = filterJenis === 'Semua' || item.jenis === filterJenis;
    const matchMode = filterMode === 'Semua' || item.mode === filterMode;
    return matchSearch && matchJenis && matchMode;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Waktu,Jenis,Mode,Lokasi,Durasi(Detik),Total Irigasi(L),Total Pupuk(L)\n';
    const rows = filtered
      .map(
        (r) =>
          `${r.id},${r.timestamp},${r.jenis},${r.mode},"${r.action}",${r.dur},${r.tot_irrig},${r.tot_fert}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amertani-catatan-riwayat.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="amertani-page-header">
        <h2 className="amertani-page-title">Catatan Aktivitas Penyiraman</h2>
        <p className="amertani-page-desc">
          Log lengkap riwayat penyiraman irigasi tetes dan pupuk kabut di lahan.
        </p>
      </div>

      <div className="amertani-card amertani-table-card">
        {/* Filter Toolbar */}
        <div className="amertani-filter-bar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari aktivitas atau waktu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="amertani-input"
                style={{ width: '220px', paddingLeft: '32px' }}
              />
              <Search
                size={15}
                style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}
              />
            </div>

            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="amertani-input"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="Penyiraman Tetes">Penyiraman Tetes</option>
              <option value="Penyiraman Kabut">Penyiraman Kabut</option>
            </select>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="amertani-input"
            >
              <option value="Semua">Semua Mode</option>
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <button className="amertani-btn-primary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table */}
        <div className="amertani-table-wrap">
          <table className="amertani-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Jenis</th>
                <th>Mode</th>
                <th>Lokasi / Aksi</th>
                <th>Durasi</th>
                <th>Total Irigasi</th>
                <th>Total Pupuk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{item.timestamp}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background:
                          item.jenis === 'Penyiraman Tetes'
                            ? 'rgba(8,145,178,0.1)'
                            : 'rgba(37,99,235,0.1)',
                        color: item.jenis === 'Penyiraman Tetes' ? '#0891b2' : '#2563eb',
                      }}
                    >
                      {item.jenis}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: item.mode === 'Auto' ? '#15803d' : '#2563eb',
                      }}
                    >
                      {item.mode}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{item.action}</td>
                  <td>{Math.floor(item.dur / 60)} menit</td>
                  <td>{item.tot_irrig ? `${item.tot_irrig} L` : '-'}</td>
                  <td>{item.tot_fert ? `${item.tot_fert} L` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. PENGATURAN ALAT TAB
// ----------------------------------------------------------------------
function SettingsView({ settings, setSettings, saveSuccess, setSaveSuccess }) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="amertani-page-header">
        <h2 className="amertani-page-title">Pengaturan Alat Smart Farming</h2>
        <p className="amertani-page-desc">
          Konfigurasi ambang batas sensor dan durasi penyiraman otomatis ESP32.
        </p>
      </div>

      {saveSuccess && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Pengaturan berhasil disimpan dan disinkronkan ke ESP32!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="amertani-form-grid">
          {/* Ambang Batas Sensor Kelembapan */}
          <div className="amertani-card amertani-form-card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#059669" />
              <span>Ambang Batas Kelembapan Tanah</span>
            </h3>

            <div className="amertani-form-group">
              <label>Batas Kering (%)</label>
              <input
                type="number"
                className="amertani-input"
                style={{ width: '100%' }}
                value={formData.batasKering}
                onChange={(e) => setFormData({ ...formData, batasKering: Number(e.target.value) })}
              />
              <div className="desc">
                Jika kelembapan tanah di bawah nilai ini, pompa tetes otomatis menyala.
              </div>
            </div>

            <div className="amertani-form-group">
              <label>Batas Cukup (%)</label>
              <input
                type="number"
                className="amertani-input"
                style={{ width: '100%' }}
                value={formData.batasCukup}
                onChange={(e) => setFormData({ ...formData, batasCukup: Number(e.target.value) })}
              />
              <div className="desc">
                Saat kelembapan mencapai nilai ini, penyiraman otomatis dihentikan.
              </div>
            </div>
          </div>

          {/* Durasi & Waktu Pompa */}
          <div className="amertani-card amertani-form-card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#2563eb" />
              <span>Durasi Waktu Penyiraman</span>
            </h3>

            <div className="amertani-form-group">
              <label>Durasi Pompa Kabut (Menit)</label>
              <input
                type="number"
                className="amertani-input"
                style={{ width: '100%' }}
                value={formData.durasiKabut}
                onChange={(e) => setFormData({ ...formData, durasiKabut: Number(e.target.value) })}
              />
              <div className="desc">Lama penyemprotan kabut pupuk cair tiap siklus.</div>
            </div>

            <div className="amertani-form-group">
              <label>Durasi Pompa Tetes Manual (Menit)</label>
              <input
                type="number"
                className="amertani-input"
                style={{ width: '100%' }}
                value={formData.durasiTetes}
                onChange={(e) => setFormData({ ...formData, durasiTetes: Number(e.target.value) })}
              />
              <div className="desc">Maksimal durasi irigasi saat mode manual aktif.</div>
            </div>
          </div>

          {/* Jadwal Otomatis */}
          <div className="amertani-card amertani-form-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#0891b2" />
                <span>Jadwal Pemupukan Terjadwal (Timer ESP32)</span>
              </h3>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={formData.scheduleEnabled}
                  onChange={(e) => setFormData({ ...formData, scheduleEnabled: e.target.checked })}
                />
                <span>{formData.scheduleEnabled ? 'Aktif' : 'Nonaktif'}</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="amertani-form-group">
                <label>Jam Pelaksanaan (00 - 23)</label>
                <input
                  type="text"
                  className="amertani-input"
                  style={{ width: '100%' }}
                  value={formData.scheduleHour}
                  onChange={(e) => setFormData({ ...formData, scheduleHour: e.target.value })}
                />
              </div>

              <div className="amertani-form-group">
                <label>Menit Pelaksanaan (00 - 59)</label>
                <input
                  type="text"
                  className="amertani-input"
                  style={{ width: '100%' }}
                  value={formData.scheduleMinute}
                  onChange={(e) => setFormData({ ...formData, scheduleMinute: e.target.value })}
                />
              </div>

              <div className="amertani-form-group">
                <label>Interval Hari</label>
                <input
                  type="number"
                  className="amertani-input"
                  style={{ width: '100%' }}
                  value={formData.scheduleIntervalDays}
                  onChange={(e) => setFormData({ ...formData, scheduleIntervalDays: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="amertani-btn-primary" style={{ padding: '10px 24px' }}>
                <Save size={16} />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
