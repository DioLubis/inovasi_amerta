import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Droplets,
  Gauge,
  Grid2X2,
  Leaf,
  Menu,
  Plus,
  Search,
  Sprout,
  Sun,
  Thermometer,
  X,
} from 'lucide-react';
import './styles.css';

const innovations = [
  {
    id: 1,
    title: 'Irigasi Presisi',
    category: 'Irigasi',
    description: 'Mengatur kebutuhan air tanaman secara otomatis berbasis kelembapan tanah.',
    status: 'Aktif',
    metric: 'Hemat air 38%',
    accent: 'teal',
    icon: Droplets,
  },
  {
    id: 2,
    title: 'Greenhouse Pintar',
    category: 'Otomasi',
    description: 'Kontrol iklim mikro untuk menjaga tanaman tumbuh optimal sepanjang musim.',
    status: 'Aktif',
    metric: 'Suhu 24.6°C',
    accent: 'lime',
    icon: Sprout,
  },
  {
    id: 3,
    title: 'Drone Monitoring',
    category: 'Monitoring',
    description: 'Pemetaan kesehatan tanaman dari udara dengan citra multispektral.',
    status: 'Terjadwal',
    metric: '12.4 ha dipantau',
    accent: 'blue',
    icon: Sun,
  },
  {
    id: 4,
    title: 'Panel Surya Komunal',
    category: 'Energi',
    description: 'Sumber energi terbarukan untuk operasional lahan dan pompa air.',
    status: 'Aktif',
    metric: '4.8 kWh hari ini',
    accent: 'amber',
    icon: Sun,
  },
  {
    id: 5,
    title: 'Sensor Nutrisi Tanah',
    category: 'Monitoring',
    description: 'Membaca pH, nitrogen, dan nutrisi utama untuk rekomendasi pemupukan.',
    status: 'Aktif',
    metric: 'pH 6.8 ideal',
    accent: 'purple',
    icon: Gauge,
  },
  {
    id: 6,
    title: 'Kebun Vertikal',
    category: 'Budidaya',
    description: 'Memaksimalkan hasil panen pada ruang terbatas dengan sistem bertingkat.',
    status: 'Aktif',
    metric: '+62% produktivitas',
    accent: 'green',
    icon: Leaf,
  },
];

const categories = ['Semua inovasi', 'Irigasi', 'Monitoring', 'Otomasi', 'Energi', 'Budidaya'];

function App() {
  const [activeCategory, setActiveCategory] = useState('Semua inovasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');

  const visibleInnovations = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return innovations.filter((item) => {
      const matchesCategory = activeCategory === 'Semua inovasi' || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Leaf size={20} strokeWidth={2.5} /></div>
          <div>
            <strong>amerta</strong>
            <span>innovation hub</span>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setIsSidebarOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="main-nav" aria-label="Navigasi utama">
          <div className="nav-label">WORKSPACE</div>
          <a className="nav-item active" href="#overview"><Grid2X2 size={18} /> Overview</a>
          <a className="nav-item" href="#inovasi"><Sprout size={18} /> Katalog inovasi <span className="nav-count">06</span></a>
          <a className="nav-item" href="#monitoring"><Gauge size={18} /> Monitoring</a>
          <a className="nav-item" href="#analitik"><ArrowUpRight size={18} /> Analitik</a>
          <div className="nav-label nav-label-spaced">LAINNYA</div>
          <a className="nav-item" href="#dokumentasi"><Leaf size={18} /> Dokumentasi</a>
        </nav>

        <div className="sidebar-footer">
          <div className="help-card">
            <div className="help-icon">?</div>
            <div><strong>Butuh bantuan?</strong><span>Pelajari cara kerja dashboard</span></div>
            <ChevronRight size={16} />
          </div>
          <div className="profile">
            <div className="avatar">AN</div>
            <div><strong>Admin Amerta</strong><span>Pengelola sistem</span></div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      {isSidebarOpen && <button className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} aria-label="Tutup navigasi" />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-trigger" onClick={() => setIsSidebarOpen(true)} aria-label="Buka menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>Overview</strong></div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari inovasi..."
                aria-label="Cari inovasi"
              />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button notification-button" onClick={() => showToast('Belum ada notifikasi baru')} aria-label="Notifikasi">
              <Bell size={19} /><i />
            </button>
            <button className="add-button" onClick={() => showToast('Form inovasi siap dihubungkan ke backend')}><Plus size={17} /> <span>Tambah inovasi</span></button>
          </div>
        </header>

        <div className="page-content">
          <section className="hero-section" id="overview">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> PUSAT INOVASI PERTANIAN</div>
              <h1>Masa depan pertanian,<br /><em>dimulai dari sini.</em></h1>
              <p>Eksplorasi teknologi dan inovasi untuk membangun ekosistem pertanian yang lebih cerdas, berkelanjutan, dan berdampak.</p>
            </div>
            <div className="hero-visual" aria-label="Pratinjau visual lahan pintar">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="visual-glow" />
              <div className="field-grid">{Array.from({ length: 16 }).map((_, index) => <span key={index} />)}</div>
              <div className="visual-tower"><div className="tower-top" /><div className="tower-body"><span /><span /><span /></div></div>
              <div className="visual-data data-one"><span>SOIL MOISTURE</span><strong>72.4%</strong></div>
              <div className="visual-data data-two"><Thermometer size={14} /><strong>24.6°C</strong></div>
              <div className="visual-label"><span className="pulse-dot" /> LIVE SYSTEM</div>
            </div>
          </section>

          <section className="stat-grid" id="monitoring">
            <div className="stat-card primary-stat"><div className="stat-top"><span>Total inovasi</span><span className="trend positive">↗ 12%</span></div><strong>24</strong><small>inovasi terdaftar</small><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="stat-card"><div className="stat-top"><span>Proyek aktif</span><span className="stat-icon"><Sprout size={15} /></span></div><strong>18</strong><small><b>+3</b> bulan ini</small><div className="progress-line"><i style={{ width: '76%' }} /></div></div>
            <div className="stat-card"><div className="stat-top"><span>Dampak terukur</span><span className="stat-icon"><Droplets size={15} /></span></div><strong>38<span className="unit">%</span></strong><small>penghematan air rata-rata</small><div className="progress-line purple"><i style={{ width: '62%' }} /></div></div>
            <div className="stat-card weather-card"><div className="stat-top"><span>Kondisi lahan</span><span className="live-badge"><i /> LIVE</span></div><div className="weather-value"><Sun size={28} /><strong>24.6°<small>C</small></strong></div><small>Denpasar, Bali <span>• Cerah berawan</span></small></div>
          </section>

          <section className="section-heading" id="inovasi">
            <div><div className="eyebrow">KOLEKSI TERKINI</div><h2>Jelajahi inovasi</h2></div>
            <button className="text-button" onClick={() => { setActiveCategory('Semua inovasi'); setSearchQuery(''); }}>Lihat semua <ArrowUpRight size={16} /></button>
          </section>

          <div className="category-tabs" role="tablist" aria-label="Filter kategori">
            {categories.map((category) => <button key={category} className={activeCategory === category ? 'tab active' : 'tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>

          <div className="innovation-grid">
            {visibleInnovations.map((item) => <InnovationCard key={item.id} item={item} onOpen={() => showToast(`${item.title} dipilih`)} />)}
          </div>
          {visibleInnovations.length === 0 && <div className="empty-state"><Search size={22} /><strong>Inovasi tidak ditemukan</strong><span>Coba gunakan kata kunci atau kategori lain.</span></div>}

          <section className="bottom-banner" id="dokumentasi">
            <div><div className="eyebrow">RUANG BERKOLABORASI</div><h2>Punya ide untuk lahan<br /><em>yang lebih hidup?</em></h2><p>Bagikan inovasi Anda dan tumbuh bersama komunitas Amerta.</p><button className="banner-button" onClick={() => showToast('Terima kasih! Form kontribusi segera hadir.')}>Bagikan inovasi <ArrowUpRight size={16} /></button></div>
            <div className="banner-art"><div className="art-sun" /><div className="art-mountain mountain-back" /><div className="art-mountain mountain-front" /><div className="art-stem stem-one" /><div className="art-stem stem-two" /><div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" /></div>
          </section>
          <footer><span>© 2024 Amerta Innovation Hub</span><span>Built for a greener tomorrow <Leaf size={13} /></span></footer>
        </div>
      </main>
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

function InnovationCard({ item, onOpen }) {
  const Icon = item.icon;
  return <article className="innovation-card">
    <div className={`card-visual ${item.accent}`}><div className="card-pattern" /><div className="card-icon"><Icon size={24} /></div><span className={`status ${item.status === 'Aktif' ? 'status-active' : 'status-scheduled'}`}><i />{item.status}</span><span className="card-number">0{item.id}</span></div>
    <div className="card-content"><div className="card-category">{item.category}</div><h3>{item.title}</h3><p>{item.description}</p><div className="card-footer"><span>{item.metric}</span><button onClick={onOpen} aria-label={`Buka ${item.title}`}><ArrowUpRight size={17} /></button></div></div>
  </article>;
}

createRoot(document.getElementById('root')).render(<App />);
