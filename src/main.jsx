import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, Expand, ExternalLink, Instagram, Mail, Minimize2, Music2, Youtube } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import logo from '../assets/LOGO AMERTA.png';
import asparagus from '../assets/asparagus.png';
import batrai from '../assets/batrai.png';
import fertilizer from '../assets/fertilizer.png';
import flowmeter from '../assets/flowmeter.png';
import irigasi from '../assets/irigasi.png';
import panelsurya from '../assets/panelsurya.png';
import pupuk from '../assets/pupuk.png';
import solenoidvalve from '../assets/solenoidvalve.png';
import amertani from '../assets/tampilan amertani.png';
import webdesa from '../assets/webdesa.png';
import relayModel from '../assets/Panel_IoT_8_Relay.glb';
import teamPhoto from '../assets/TimPelaksana.png';
import AmerTaniApp from './AmerTaniApp';
import './styles.css';

const innovations = [
  { title: 'Panel Box', category: 'Perangkat IoT', description: 'Panel kontrol terintegrasi untuk otomasi smart farming yang dikendalikan melalui aplikasi AMERTANI. Solar Charge Controller mengatur pengisian baterai dari panel surya, MCB melindungi sistem dari arus berlebih dan korsleting, sementara baterai LiFePO4 12V 30Ah menyimpan energi. ESP32 memproses data sensor dan menerima perintah dari AMERTANI untuk mengendalikan pompa serta solenoid valve melalui modul relay. Step-down 12V ke 5V menyesuaikan tegangan untuk modul elektronik.', model: true },
  { title: 'Panel Surya', category: 'Sistem solar panel', description: 'Suplai tenaga listrik mandiri yang ramah lingkungan dan off-grid untuk mendukung operasional perangkat pertanian di lahan.', image: panelsurya },
  { title: 'Baterai Penyimpanan', category: 'Sistem penyimpanan energi', description: 'Penerapan baterai LiFePO4 30Ah dengan proteksi ganda untuk menyimpan energi dan mendukung kebutuhan DC Hub.', image: batrai },
  { title: 'Smart Fertilizer', category: 'Smart fertilizer', description: 'Distribusi pupuk organik cair atau POC berbasis IoT yang berjalan otomatis dan terjadwal untuk membantu pemupukan lebih konsisten.', image: fertilizer },
  { title: 'Smart Irrigation', category: 'Smart irrigation', description: 'Irigasi presisi dan otomatis berbasis IoT yang terintegrasi dengan sensor kelembapan tanah agar penyiraman sesuai kebutuhan tanaman.', image: irigasi },
  { title: 'Flow Meter', category: 'Monitoring aliran', description: 'Alat ukur aliran air dan pupuk yang membantu pemantauan distribusi secara real-time sehingga penggunaan dapat dikontrol lebih akurat.', image: flowmeter },
  { title: 'Solenoid Valve', category: 'Kontrol distribusi', description: 'Manajemen distribusi air otomatis per blok atau zona lahan melalui katup elektrik yang terhubung dengan sistem kontrol.', image: solenoidvalve },
  { title: 'Pupuk Organik', category: 'Metode pemupukan NPK cair', description: 'Inovasi distribusi NPK larut yang sangat presisi dan terkontrol untuk mendukung pemberian nutrisi sesuai kebutuhan tanaman.', image: pupuk },
  { title: 'AmerTani', category: 'Aplikasi pertanian', description: 'Platform digital monitoring nilai unsur NPK, kelembapan, dan kontrol pertanian melalui fitur aplikasi AmerTani dan dengan mode offline tanpa internet.', image: amertani, imageFit: 'contain', link: 'https://amer-tani.vercel.app/', linkLabel: 'Buka AmerTani' },
  { title: 'Asparagus Vacuum Seal', category: 'Pasca panen & pengemasan', description: 'Inovasi pasca panen menggunakan vacuum seal dan stiker label “AMERTA Fresh” untuk menjaga kualitas sekaligus memperkuat identitas produk.', image: asparagus, imageFit: 'contain' },
  { title: 'Web Desa', category: 'Website AMERTA', description: 'Inovasi pemasaran dan WebGIS untuk pemetaan hasil bumi Desa Belok/Sidan agar potensi desa lebih mudah ditemukan dan dikembangkan.', image: webdesa, link: 'https://website-amerta.vercel.app/', linkLabel: 'Kunjungi Web Desa' },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAmerTaniFullscreen, setIsAmerTaniFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showcaseRef = useRef(null);

  const isTransitioningRef = useRef(false);
  isTransitioningRef.current = isTransitioning;

  const isAmerTaniFullscreenRef = useRef(isAmerTaniFullscreen);
  isAmerTaniFullscreenRef.current = isAmerTaniFullscreen;

  const openAmerTaniFullscreen = () => {
    setIsAmerTaniFullscreen(true);
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } catch (e) { }
  };

  const closeAmerTaniFullscreen = () => {
    setIsAmerTaniFullscreen(false);
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
    } catch (e) { }
  };

  const triggerChange = useRef(null);
  triggerChange.current = (direction) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setSlideDirection(direction > 0 ? 'next' : 'prev');
    setScrollProgress(0);

    setActiveIndex((current) => (current + direction + innovations.length) % innovations.length);

    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 450);
  };

  useEffect(() => {
    const showcase = showcaseRef.current;
    if (!showcase) return undefined;

    let wheelAccumulator = 0;
    let wheelDecayTimer = null;
    let lastSwitchTime = 0;
    const WHEEL_THRESHOLD = 65;

    const onWheel = (event) => {
      if (isAmerTaniFullscreenRef.current) return;
      if (event.target instanceof Element && event.target.closest('.model-viewer')) return;

      event.preventDefault();
      const now = Date.now();
      if (now - lastSwitchTime < 450 || isTransitioningRef.current) return;

      // Akumulasikan jarak scroll
      wheelAccumulator += event.deltaY;

      // Geser tampilan secara proporsional dan halus mengikuti scroll user (-45px s/d 45px)
      const visualShift = Math.min(Math.max(wheelAccumulator * 0.35, -45), 45);
      setScrollProgress(visualShift);

      if (wheelDecayTimer) clearTimeout(wheelDecayTimer);

      // Cek apakah scroll user sudah melebihi threshold
      if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
        lastSwitchTime = now;
        const dir = wheelAccumulator > 0 ? 1 : -1;
        wheelAccumulator = 0;
        triggerChange.current(dir);
      } else {
        // Jika scroll pelan / tidak tembus threshold:
        // Kembalikan posisi secara halus (spring back) tanpa berpindah inovasi
        wheelDecayTimer = setTimeout(() => {
          wheelAccumulator = 0;
          setScrollProgress(0);
        }, 180);
      }
    };

    const isModelEvent = (event) => event.target instanceof Element && event.target.closest('.model-viewer');

    let touchStartY = null;
    let touchStartX = null;
    let currentDeltaY = 0;
    const TOUCH_THRESHOLD = 40;

    const onTouchStart = (event) => {
      if (isAmerTaniFullscreenRef.current || isModelEvent(event)) {
        touchStartY = null;
        return;
      }
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
      currentDeltaY = 0;
    };

    const onTouchMove = (event) => {
      if (touchStartY === null || isAmerTaniFullscreenRef.current || isModelEvent(event) || isTransitioningRef.current) return;
      const deltaY = touchStartY - event.touches[0].clientY;
      const deltaX = touchStartX - event.touches[0].clientX;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        event.preventDefault();
        currentDeltaY = deltaY;
        // Tampilan mengikuti sentuhan jari user secara halus
        const visualShift = Math.min(Math.max(deltaY * 0.4, -50), 50);
        setScrollProgress(visualShift);
      }
    };

    const onTouchEnd = () => {
      if (touchStartY === null || isTransitioningRef.current) {
        touchStartY = null;
        return;
      }

      if (Math.abs(currentDeltaY) >= TOUCH_THRESHOLD) {
        // Swipe cukup jauh: ganti inovasi
        triggerChange.current(currentDeltaY > 0 ? 1 : -1);
      } else {
        // Swipe pelan / sedikit: kembali ke posisi semula secara halus
        setScrollProgress(0);
      }

      touchStartY = null;
      currentDeltaY = 0;
    };

    showcase.addEventListener('wheel', onWheel, { passive: false });
    showcase.addEventListener('touchstart', onTouchStart, { passive: true });
    showcase.addEventListener('touchmove', onTouchMove, { passive: false });
    showcase.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      if (wheelDecayTimer) clearTimeout(wheelDecayTimer);
      showcase.removeEventListener('wheel', onWheel);
      showcase.removeEventListener('touchstart', onTouchStart);
      showcase.removeEventListener('touchmove', onTouchMove);
      showcase.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="logo-link" href="#beranda" aria-label="Amerta Innovation Hub">
          <img src={logo} alt="Logo Amerta" />
          <span>INNOVATION HUB</span>
        </a>
        <div className="header-caption">PPK ORMAWA BADAN EKSEKUTIF MAHASISWA FAKULTAS TEKNIK UNIVERSITAS UDAYANA</div>
        <a
          className="scroll-cue"
          href="#inovasi"
          onClick={(e) => {
            e.preventDefault();
            triggerChange.current(1);
          }}
        >
          Scroll untuk menjelajah <ChevronDown size={15} />
        </a>
      </header>

      <section className="innovation-showcase" id="inovasi" ref={showcaseRef}>
        <div className="showcase-heading">
          <div><div className="eyebrow"><span /> KOLEKSI INOVASI</div><h1>Inovasi Smart Farming Asparagus.</h1></div>
          <div className="showcase-progress"><strong>{String(activeIndex + 1).padStart(2, '0')}</strong><span>/ {String(innovations.length).padStart(2, '0')}</span><div><i style={{ width: `${((activeIndex + 1) / innovations.length) * 100}%` }} /></div></div>
        </div>
        <div
          className="innovation-stage"
          style={{
            transform: `translateY(${-scrollProgress}px)`,
            opacity: 1 - Math.abs(scrollProgress) / 220,
            transition: scrollProgress === 0
              ? 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
              : 'transform 0.14s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.14s ease',
          }}
        >
          <InnovationSection
            key={activeIndex}
            item={innovations[activeIndex]}
            index={activeIndex}
            slideDirection={slideDirection}
            onNext={() => triggerChange.current(1)}
            onOpenAmerTaniFullscreen={openAmerTaniFullscreen}
          />
        </div>
        <footer className="site-footer">
          <div className="footer-team">
            <img src={teamPhoto} alt="Tim Pelaksana PPK Ormawa" />
          </div>
          <div className="footer-contact">
            <a className="footer-email" href="mailto:ppkormawasmft26@gmail.com"><Mail size={14} /> ppkormawasmft26@gmail.com</a>
            <div className="social-links" aria-label="Media sosial">
              <a href="https://www.instagram.com/ppkormawabemftunud2026/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="https://www.youtube.com/@PPKORMAWABEMFT2026" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} /></a>
              <a href="https://www.tiktok.com/@ppk.ormawa.bem.ft" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={16} /></a>
              <span className="social-username">@ppkormawabemftunud2026</span>
            </div>
          </div>
        </footer>
      </section>

      {/* Standalone Fullscreen System for Innovation #9 AmerTani */}
      {isAmerTaniFullscreen && (
        <AmerTaniApp onClose={closeAmerTaniFullscreen} />
      )}
    </main>
  );
}

function InnovationSection({ item, index, slideDirection, onNext, onOpenAmerTaniFullscreen }) {
  const isAmerTani = item.title.toLowerCase() === 'amertani';

  return (
    <article className={`innovation-section slide-${slideDirection || 'next'}`}>
      <div className={`innovation-visual ${item.imageFit === 'contain' ? 'innovation-visual-contain' : ''}`}>
        {item.model ? (
          <ModelViewer />
        ) : (
          <img
            className={item.imageFit === 'contain' ? 'innovation-image-contain' : ''}
            src={item.image}
            alt={item.title}
          />
        )}

        {/* Fullscreen Button khusus inovasi AmerTani */}
        {isAmerTani && (
          <button
            className="model-fullscreen"
            type="button"
            onClick={onOpenAmerTaniFullscreen}
            title="Buka Sistem AmerTani Fullscreen"
          >
            <Expand size={14} />
            <span>Fullscreen Sistem</span>
          </button>
        )}
      </div>
      <div className="innovation-detail">
        <div className="detail-number">0{index + 1} <span>—</span> {item.category}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {isAmerTani ? (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="primary-link"
              onClick={onOpenAmerTaniFullscreen}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #8ead88',
                cursor: 'pointer',
                padding: '12px 0 8px',
                color: 'var(--green)',
                fontSize: '11px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Expand size={15} />
              <span>Buka Demo Sistem (Fullscreen)</span>
            </button>
            {item.link && (
              <a className="innovation-link" href={item.link} target="_blank" rel="noreferrer">
                {item.linkLabel} <ExternalLink size={15} />
              </a>
            )}
          </div>
        ) : (
          item.link && (
            <a className="innovation-link" href={item.link} target="_blank" rel="noreferrer">
              {item.linkLabel} <ExternalLink size={15} />
            </a>
          )
        )}
        <div
          className="detail-scroll"
          onClick={onNext}
          title="Klik untuk ke inovasi berikutnya"
        >
          <span>SCROLL UNTUK INOVASI BERIKUTNYA</span>
          <div />
        </div>
      </div>
    </article>
  );
}

function ModelViewer() {
  const containerRef = useRef(null);
  const canvasHostRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const onFullscreenChange = () => {
      const fullscreen = document.fullscreenElement === container;
      setIsFullscreen(fullscreen);
      if (!fullscreen) resetView();
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c150f');
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(2.8, 1.9, 3.2);
    const initialCameraPosition = camera.position.clone();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasHostRef.current?.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.zoomToCursor = true;
    controls.panSpeed = 0.8;
    controls.maxTargetRadius = 2.2;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI - 0.35;
    controls.minDistance = 1.5;
    controls.maxDistance = 7;
    controls.target.set(0, 0.35, 0);
    const initialTarget = controls.target.clone();

    const resetView = () => {
      camera.position.copy(initialCameraPosition);
      controls.target.copy(initialTarget);
      controls.zoomToCursor = false;
      controls.update();
      controls.zoomToCursor = true;
    };

    scene.add(new THREE.HemisphereLight('#f5ffe9', '#4b6d56', 2.4));
    const keyLight = new THREE.DirectionalLight('#ffffff', 3);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight('#b3e2a5', 1.5);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    let modelRoot;
    let animationFrame;
    const loader = new GLTFLoader();
    loader.load(
      relayModel,
      (gltf) => {
        modelRoot = gltf.scene;
        const box = new THREE.Box3().setFromObject(modelRoot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        modelRoot.scale.setScalar(2.2 / maxSize);
        modelRoot.position.set(-center.x * modelRoot.scale.x, -center.y * modelRoot.scale.x, -center.z * modelRoot.scale.x);
        scene.add(modelRoot);
        container.dataset.loaded = 'true';
      },
      undefined,
      (error) => {
        console.error('Gagal memuat model Panel IoT 8 Relay:', error);
        container.dataset.error = 'Model 3D gagal dimuat';
      },
    );

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      modelRoot?.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material.dispose();
      });
    };
  }, []);

  const toggleFullscreen = async (event) => {
    event.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen panel 3D tidak tersedia:', error);
    }
  };

  return (
    <div
      className="model-viewer"
      ref={containerRef}
      aria-label="Model 3D Panel IoT 8 Relay"
      onWheel={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <div className="model-canvas-host" ref={canvasHostRef} />
      <button className="model-fullscreen" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Keluar dari fullscreen' : 'Buka panel 3D fullscreen'}>
        {isFullscreen ? <Minimize2 size={16} /> : <Expand size={16} />}
        <span>{isFullscreen ? 'Tutup' : 'Fullscreen'}</span>
      </button>
      {isFullscreen && (
        <div className="model-controls-legend" aria-label="Petunjuk navigasi panel 3D">
          <div className="model-controls-legend-desktop">
            <strong>Navigasi panel 3D</strong>
            <span>Drag kiri: rotasi</span>
            <span>Drag kanan: geser panel</span>
            <span>Scroll: zoom</span>
            <span>Esc atau Tutup: keluar fullscreen</span>
          </div>
          <div className="model-controls-legend-mobile">
            <strong>Navigasi panel 3D</strong>
            <span>Geser satu jari: rotasi</span>
            <span>Pinch dua jari: zoom</span>
            <span>Geser dua jari: geser panel</span>
            <span>Tombol Tutup atau Esc: keluar fullscreen</span>
          </div>
        </div>
      )}
      <div className="model-loading">Memuat model 3D...</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
