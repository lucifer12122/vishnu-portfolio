import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Layers, Cpu, Code, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [yarnTrail, setYarnTrail] = useState([]);
  
  // Cat State Management Matrix
  const [catPos, setCatPos] = useState({ x: 200, y: 300 });
  const [catState, setCatState] = useState("WANDERING"); // WANDERING, CHASING, PLAYING, EATING
  const [catAngle, setCatAngle] = useState(0);
  const catTarget = useRef({ x: 200, y: 300 });
  
  // Eating State Lock
  const [isEating, setIsEating] = useState(false);
  const eatingTimeoutRef = useRef(null);

  // Station Coordinates (Top Right Corner)
  const stationPos = { x: window.innerWidth - 120, y: 120 };

  // Track global scroll progression
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track cursor coordinates and generate trailing yarn threads
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const newFiber = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      setYarnTrail(prev => [newFiber, ...prev.slice(0, 12)]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Yarn trail decay step loop
  useEffect(() => {
    const interval = setInterval(() => {
      setYarnTrail(prev => prev.filter(f => Date.now() - f.timestamp < 300));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // --- CAT AI ENGINE ---
  useEffect(() => {
    const updateCatPhysics = () => {
      if (isEating) return;

      setCatPos(prev => {
        const dxToMouse = mousePos.x - prev.x;
        const dyToMouse = mousePos.y - prev.y;
        const distToMouse = Math.hypot(dxToMouse, dyToMouse);

        const dxToStation = stationPos.x - prev.x;
        const dyToStation = stationPos.y - prev.y;
        const distToStation = Math.hypot(dxToStation, dyToStation);

        let targetX = catTarget.current.x;
        let targetY = catTarget.current.y;
        let currentSpeed = 2.2;
        let newState = "WANDERING";

        if (distToStation < 60 && distToMouse < 80) {
          setIsEating(true);
          setCatState("EATING");
          
          catTarget.current = { x: stationPos.x - 20, y: stationPos.y };
          
          const angleToStation = Math.atan2(dyToStation, dxToStation);
          setCatAngle(angleToStation * (180 / Math.PI));

          eatingTimeoutRef.current = setTimeout(() => {
            setIsEating(false);
            setCatState("WANDERING");
          }, 30000);

          return { x: stationPos.x - 20, y: stationPos.y };
        }

        if (distToMouse < 400 && distToMouse > 35) {
          targetX = mousePos.x;
          targetY = mousePos.y;
          currentSpeed = 5.0; 
          newState = "CHASING";
        } else if (distToMouse <= 35) {
          newState = "PLAYING";
          targetX = prev.x;
          targetY = prev.y;
        } else {
          if (Math.random() < 0.015 && Math.hypot(targetX - prev.x, targetY - prev.y) < 30) {
            catTarget.current = {
              x: Math.random() * (window.innerWidth - 120) + 60,
              y: Math.random() * (window.innerHeight - 120) + 60
            };
          }
        }

        if (newState !== "EATING") {
          setCatState(newState);
        }

        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const dist = Math.hypot(dx, dy);

        if (dist < currentSpeed) {
          return prev;
        }

        const angle = Math.atan2(dy, dx);
        setCatAngle(angle * (180 / Math.PI));

        return {
          x: prev.x + Math.cos(angle) * currentSpeed,
          y: prev.y + Math.sin(angle) * currentSpeed
        };
      });
    };

    const frameTick = setInterval(updateCatPhysics, 1000 / 60); 
    return () => clearInterval(frameTick);
  }, [mousePos, isEating]);

  useEffect(() => {
    return () => {
      if (eatingTimeoutRef.current) clearTimeout(eatingTimeoutRef.current);
    };
  }, []);

  const technicalPipelines = [
    {
      id: "nlp-pipeline",
      title: "CLINICAL TEXT-TO-ICD-10 AGENTIC DATA ENGINE",
      tag: "AI_AGENTS",
      icon: <Cpu size={18} />,
      points: [
        "Engineered a ReAct-style recursive agent execution pipeline designed to map highly raw doctor-patient conversational transcripts into standardized ICD-10 medical code sets.",
        "Integrated custom Named Entity Recognition arrays, UMLS-based normalization nodes, and high-efficiency BM25 text retrieval pipelines to correctly surface candidate records.",
        "Achieved a strict 86% diagnostic accuracy evaluation rating across tested unstructured clinical documentation sheets."
      ],
      tech: ["PYTHON", "REACT AGENTS", "UMLS MATRIX", "BM25 RETRIEVAL", "NER LAYER"]
    },
    {
      id: "voice-pipeline",
      title: "VOICE SOCIAL — VOICE-FIRST MOBILE ARCHITECTURE",
      tag: "MOBILE_INFRA",
      icon: <Layers size={18} />,
      points: [
        "Designed and constructed a mobile-exclusive, voice-only social platform in Flutter, incorporating real-time waveform visualization rendering engines and threaded audio replies.",
        "Architected low-overhead backend schemas within a Supabase ecosystem with active real-time subscriptions and Row Level Security backed by Backblaze B2 storage layers entirely on free-tier services.",
        "Implemented client-side hardware-level FFmpeg audio compression arrays (AAC @ 32-64kbps), reducing individual payload mass by 85–90% alongside hitting a 70–80% local caching performance score."
      ],
      tech: ["FLUTTER", "SUPABASE ENGINE", "POSTGRESQL", "FFMPEG LAYER", "BACKBLAZE B2"]
    },
    {
      id: "mern-pipeline",
      title: "DARK STAR — GAMIFIED FITNESS TELEMETRY SYSTEM",
      tag: "MERN_STACK",
      icon: <Code size={18} />,
      points: [
        "Assembled an end-to-end telemetry system running on a MERN stack backend designed to log, map, and process user fitness metric logs.",
        "Configured an internal AI recommendation module parsing patient historical health summaries to adaptively generate personalized workout tracks.",
        "Secured system state changes and profile authorization pipelines utilizing robust SHA-based hashing cryptographic matrices."
      ],
      tech: ["MONGODB", "EXPRESS.JS", "REACT.JS", "NODE.JS CORE", "CRYPT_SHA"]
    }
  ];

  const skillMatrix = [
    { category: "LANGUAGES", items: ["PYTHON", "JAVA", "C_CORE", "JAVASCRIPT", "HTML_CSS"] },
    { category: "DATA STORES", items: ["MYSQL", "MONGODB", "SQL_ENGINE"] },
    { category: "FRAMEWORKS & TOOLS", items: ["REACT", "NODE.JS", "FLUTTER", "SUPABASE", "DOCKER", "GIT_GITHUB"] },
    { category: "MODES", items: ["PROBLEM_SOLVING", "CRITICAL_THINKING", "RESEARCH_ANALYSIS", "TEAM_COLLAB"] }
  ];

  const isFlipped = Math.abs(catAngle) > 90;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', cursor: 'none' }}>
      <div className="blueprint-grid" />
      <div className="cosmic-grain" />

      {/* Refined Food and Water Station Corner Node */}
      <div style={{
        position: 'fixed',
        left: stationPos.x,
        top: stationPos.y,
        width: '90px',
        height: '50px',
        zIndex: 99997,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }}>
        <svg viewBox="0 0 90 50" style={{ width: '100%', height: '100%' }}>
          {/* Styled Base Mat with subtle shadow */}
          <rect x="3" y="18" width="84" height="26" rx="13" fill="#D6D6D6" opacity="0.4" />
          <rect x="5" y="16" width="80" height="26" rx="13" fill="#F0F0F0" stroke="#000" strokeWidth="2" />
          
          {/* ================ WATER BOWL (LEFT) ================ */}
          {/* Outer Bowl Rim Depth */}
          <ellipse cx="27" cy="31" rx="16" ry="9" fill="#BCC0C4" stroke="#000" strokeWidth="2" />
          {/* Inner Bowl Wall */}
          <ellipse cx="27" cy="28" rx="16" ry="9" fill="#E8ECEF" stroke="#000" strokeWidth="2" />
          {/* Water Surface Line */}
          <ellipse cx="27" cy="29" rx="13" ry="7" fill="#74C0FC" opacity="0.85" stroke="#4dabf7" strokeWidth="1" />
          {/* Water Specular Highlight */}
          <path d="M 18 28 Q 22 25 28 26" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

          {/* ================ FOOD BOWL (RIGHT) ================ */}
          {/* Outer Bowl Rim Depth */}
          <ellipse cx="63" cy="31" rx="16" ry="9" fill="#BCC0C4" stroke="#000" strokeWidth="2" />
          {/* Inner Bowl Wall */}
          <ellipse cx="63" cy="28" rx="16" ry="9" fill="#E8ECEF" stroke="#000" strokeWidth="2" />
          {/* Kibble Pile Base Fill */}
          <ellipse cx="63" cy="28" rx="12" ry="6" fill="#A0522D" />
          {/* Structured Isometric Kibble Bits */}
          <circle cx="58" cy="25" r="2" fill="#8B4513" stroke="#5C2E0B" strokeWidth="0.5" />
          <circle cx="63" cy="24" r="2.2" fill="#CD853F" stroke="#8B4513" strokeWidth="0.5" />
          <circle cx="68" cy="26" r="1.8" fill="#8B4513" stroke="#5C2E0B" strokeWidth="0.5" />
          <circle cx="60" cy="28" r="2" fill="#CD853F" stroke="#8B4513" strokeWidth="0.5" />
          <circle cx="65" cy="27" r="2.5" fill="#5C3A21" stroke="#3A2210" strokeWidth="0.5" />
          <circle cx="56" cy="27" r="1.5" fill="#5C3A21" stroke="#3A2210" strokeWidth="0.5" />
          <circle cx="64" cy="23" r="1.7" fill="#8B4513" />
        </svg>
      </div>

      {/* Upgraded Screen-Wandering Cat Sprite Node */}
      <div style={{
        position: 'fixed',
        left: catPos.x,
        top: catPos.y,
        width: '75px',
        height: '65px',
        zIndex: 99998,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%) scaleX(${isFlipped ? -1 : 1})`,
        transition: 'transform 0.1s ease',
      }}>
        <svg viewBox="0 0 80 70" style={{ width: '100%', height: '100%' }}>
          <path d="M 20 45 Q 5 45 8 25 Q 10 12 18 16 Q 22 20 16 28" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="32" cy="54" rx="5" ry="7" fill="#EAEAEA" stroke="#000" strokeWidth="2" />
          <ellipse cx="48" cy="54" rx="5" ry="7" fill="#EAEAEA" stroke="#000" strokeWidth="2" />
          <ellipse cx="38" cy="42" rx="20" ry="16" fill="#FFF" stroke="#000" strokeWidth="2.5" />
          <ellipse cx="36" cy="55" rx="5.5" ry="7" fill="#FFF" stroke="#000" strokeWidth="2.5" />
          <ellipse cx="52" cy="55" rx="5.5" ry="7" fill="#FFF" stroke="#000" strokeWidth="2.5" />
          <circle cx="54" cy="28" r="14" fill="#FFF" stroke="#000" strokeWidth="2.5" />
          <polygon points="43,18 36,4 49,12" fill="#FFF" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="43,18 39,7 47,13" fill="#FFB7B7" />
          <polygon points="65,18 72,4 59,12" fill="#FFF" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="65,18 69,7 61,13" fill="#FFB7B7" />
          
          {catState === "EATING" ? (
            <>
              <circle cx="51" cy="28" r="2" fill="#000" />
              <circle cx="57" cy="28" r="2" fill="#000" />
            </>
          ) : (
            <>
              <circle cx="50" cy="26" r="2.5" fill="#000" />
              <circle cx="50" cy="25.2" r="0.8" fill="#FFF" />
              <circle cx="60" cy="26" r="2.5" fill="#000" />
              <circle cx="60" cy="25.2" r="0.8" fill="#FFF" />
            </>
          )}
          
          <path d="M 52 30 Q 55 31 55 29 Q 55 31 58 30" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <line x1="66" y1="28" x2="75" y2="27" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="65" y1="31" x2="73" y2="33" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="28" x2="33" y2="27" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="43" y1="31" x2="35" y2="33" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Hardware-Accelerated Yarn Ball Cursor Layer */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
        {yarnTrail.map((f, idx) => (
          <div
            key={f.id}
            style={{
              position: 'absolute',
              left: f.x,
              top: f.y,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'transparent',
              border: '1px solid rgba(0, 0, 0, ' + (1 - idx / 12) * 0.4 + ')',
              transform: 'translate(-50%, -50%) scale(' + (1 - idx / 12) + ')',
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          width: '20px',
          height: '20px',
          background: '#000',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid #FFF',
          boxShadow: '2px 2px 0px #000',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)'
        }} />
      </div>

      {/* Floating HUD */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000,
        background: '#FFF', border: 'var(--border)', padding: '8px 12px',
        fontSize: '0.65rem', fontWeight: 700, boxShadow: '3px 3px 0px #000', pointerEvents: 'none'
      }}>
        <div>X_COORD: {mousePos.x} // Y_COORD: {mousePos.y}</div>
        <div>TARGET_TRACK: X:{Math.round(catPos.x)} Y:{Math.round(catPos.y)}</div>
      </div>

      {/* Navigation Matrix */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 4vw', borderBottom: 'var(--border)',
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)'
      }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <Terminal size={18} />
          P_VISHNU_CHAITANYA // ARCH_INDEX
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '24px' }}>
          <li><a href="#about" style={{ fontSize: '0.8rem', fontWeight: 700 }}>ABOUT</a></li>
          <li><a href="#work" style={{ fontSize: '0.8rem', fontWeight: 700 }}>PIPELINES</a></li>
          <li><a href="#matrix" style={{ fontSize: '0.8rem', fontWeight: 700 }}>MATRIX</a></li>
          <li><a href="#papers" style={{ fontSize: '0.8rem', fontWeight: 700 }}>DOCS</a></li>
        </ul>
      </nav>

      {/* Hero Header Frame */}
      <header className="hero" style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 4vw 60px', borderBottom: 'var(--border)'
      }}>
        <div className="schematic-frame" style={{
          position: 'relative', width: 'min(520px, 85vw)', height: 'min(420px, 70vw)',
          marginBottom: '30px', border: 'var(--border)', background: '#FFF',
          overflow: 'hidden', boxShadow: '8px 8px 0px #000'
        }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '20px', height: '20px', top: '10px', left: '10px', borderLeft: '2px solid #000', borderTop: '2px solid #000' }} />
            <div style={{ position: 'absolute', width: '20px', height: '20px', top: '10px', right: '10px', borderRight: '2px solid #000', borderTop: '2px solid #000' }} />
            <div style={{ position: 'absolute', width: '20px', height: '20px', bottom: '10px', left: '10px', borderLeft: '2px solid #000', borderBottom: '2px solid #000' }} />
            <div style={{ position: 'absolute', width: '20px', height: '20px', bottom: '10px', right: '10px', borderRight: '2px solid #000', borderBottom: '2px solid #000' }} />

            <svg style={{ width: '100%', height: '100%', stroke: '#000', fill: 'none', strokeWidth: 2 }} viewBox="0 0 400 320">
              <circle cx="200" cy="160" r="110" strokeDasharray="2,6" style={{ transform: `rotate(${scrollPercent * 360}deg)`, transformOrigin: '200px 160px' }} />
              <circle cx="200" cy="160" r="85" strokeDasharray="6,4" style={{ transform: `rotate(${-scrollPercent * 720}deg)`, transformOrigin: '200px 160px' }} />
              <circle cx="200" cy="160" r="45" />
              <rect x="170" y="130" width="60" height="60" rx="4" fill="#FFF" />
              <rect x="180" y="140" width="40" height="40" strokeDasharray="2,2" />
              <circle cx="200" cy="160" r="8" fill="#000" />
              <path d="M 200 20 L 200 130" style={{ transform: `rotate(${scrollPercent * 15}deg)`, transformOrigin: '200px 160px' }} />
              <path d="M 200 190 L 200 300" style={{ transform: `rotate(${-scrollPercent * 15}deg)`, transformOrigin: '200px 160px' }} />
              <path d="M 50 160 L 170 160" />
              <path d="M 230 160 L 350 160" />
              <path d="M 170 130 L 110 70 L 40 70" />
              <path d="M 230 130 L 290 70 L 360 70" />
              <path d="M 170 190 L 110 250 L 40 250" />
              <path d="M 230 190 L 290 250 L 360 250" />
            </svg>

            <a href="#nlp-pipeline" className="canvas-label" style={{ position: 'absolute', background: '#FFF', border: 'var(--border)', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, boxShadow: '3px 3px 0px #000', top: '45px', left: '15px' }}>[NODE_01_NLP]</a>
            <a href="#voice-pipeline" className="canvas-label" style={{ position: 'absolute', background: '#FFF', border: 'var(--border)', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, boxShadow: '3px 3px 0px #000', top: '45px', right: '15px' }}>[NODE_02_VOICE]</a>
            <a href="#mern-pipeline" className="canvas-label" style={{ position: 'absolute', background: '#FFF', border: 'var(--border)', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, boxShadow: '3px 3px 0px #000', bottom: '45px', left: '15px' }}>[NODE_03_MERN]</a>
            <a href="#papers" className="canvas-label" style={{ position: 'absolute', background: '#FFF', border: 'var(--border)', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, boxShadow: '3px 3px 0px #000', bottom: '45px', right: '15px' }}>[NODE_04_DOCS]</a>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', lineHeight: 0.95, marginTop: '10px' }}>PULAVARTHI VISHNU CHAITANYA</h1>
        <div className="sub" style={{ fontSize: '0.85rem', background: '#000', color: '#FFF', padding: '4px 12px', marginTop: '16px', display: 'inline-block' }}>
          COMPUTER SCIENCE UNDERGRADUATE // AI & ML SPECIALIZATION
        </div>
        <p className="tag" style={{ margin: '24px auto 0', maxWidth: '650px', fontSize: '1rem', color: '#333', lineHeight: 1.6, textAlign: 'justify' }}>
          I architect highly-disciplined computational processing engines that parse messy, unstructured inputs into verified machine intelligence—translating raw clinical discourse transcripts, low-level real-time audio streams, and underwater computer vision environments into precise data structures.
        </p>
        
        <div className="cta-row" style={{ marginTop: '36px', display: 'flex', gap: '16px' }}>
          <a className="btn dark" href="#work">EXECUTE_SYSTEM_VIEW</a>
          <a className="btn" href="mailto:vishnuchaitanyapulavarthi@gmail.com">INITIALIZE_COMMS</a>
        </div>
      </header>

      {/* Section 01: Profile */}
      <section id="about" style={{ padding: '100px 4vw', maxWidth: '1200px', margin: '0 auto', borderBottom: 'var(--border)' }}>
        <span className="section-index" style={{ fontSize: '0.8rem', fontWeight: 700, border: 'var(--border)', padding: '4px 12px', display: 'inline-block', marginBottom: '24px', background: '#FFF' }}>01 // DESCRIPTOR</span>
        <div className="section-head"><h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '20px' }}>SYSTEM PROFILE</h2></div>
        <div className="profile-layout">
          <div>
            <p style={{ fontSize: '1.05rem', marginBottom: '20px', lineHeight: 1.7, textAlign: 'justify' }}>I build at the intersection of agentic system execution, machine learning pipelines, and highly scaled backend architectures. My design methodologies emphasize decoupling computing layers to address platform bottlenecks—whether that involves designing asynchronous processing networks within free-tier cluster parameters, or establishing recursive retrieval engines over large medical ontologies.</p>
          </div>
          <div>
            <table className="spec-sheet" style={{ width: '100%', borderCollapse: 'collapse', background: '#FFF' }}>
              <tbody>
                <tr><td style={{ border: 'var(--border)', padding: '14px', fontWeight: 700, background: 'var(--light-gray)', width: '35%' }}>INSTITUTION</td><td style={{ border: 'var(--border)', padding: '14px' }}>Amrita School of Computing, Amrita Vishwa Vidyapeetham</td></tr>
                <tr><td style={{ border: 'var(--border)', padding: '14px', fontWeight: 700, background: 'var(--light-gray)' }}>DISCIPLINE</td><td style={{ border: 'var(--border)', padding: '14px' }}>B.Tech CSE — Artificial Intelligence</td></tr>
                <tr><td style={{ border: 'var(--border)', padding: '14px', fontWeight: 700, background: 'var(--light-gray)' }}>CGPA_METRIC</td><td style={{ border: 'var(--border)', padding: '14px' }}>7.48 / 10.00</td></tr>
                <tr><td style={{ border: 'var(--border)', padding: '14px', fontWeight: 700, background: 'var(--light-gray)' }}>TIMELINE</td><td style={{ border: 'var(--border)', padding: '14px' }}>2023 — 2027</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 02: Selected Production Pipelines */}
      <section id="work" style={{ padding: '100px 4vw', maxWidth: '1200px', margin: '0 auto', borderBottom: 'var(--border)' }}>
        <span className="section-index" style={{ fontSize: '0.8rem', fontWeight: 700, border: 'var(--border)', padding: '4px 12px', display: 'inline-block', marginBottom: '24px', background: '#FFF' }}>02 // ARCHITECTURES</span>
        <div className="project-pipeline" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {technicalPipelines.map((proj) => (
            <article key={proj.id} id={proj.id} className="project-panel" style={{ border: 'var(--border)', padding: '40px', background: '#FFF', boxShadow: '6px 6px 0px #000', position: 'relative', scrollMarginTop: '100px' }}>
              <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {proj.icon}
                <span>// LOG_NODE_{proj.id.toUpperCase()}</span>
              </div>
              <div className="project-meta-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: 'var(--border)', padding: '12px 0 16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.6rem', maxWidth: '75%' }}>{proj.title}</h3>
                <span className="project-tag" style={{ fontSize: '0.75rem', border: 'var(--border)', padding: '4px 10px', fontWeight: 700, background: '#000', color: '#FFF' }}>{proj.tag}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {proj.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ position: 'relative', paddingLeft: '24px', marginBottom: '12px', fontSize: '0.95rem', lineHeight: '1.6', color: '#111' }}>
                    <span style={{ position: 'absolute', left: 0, top: '2px', fontSize: '0.75rem' }}>■</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="tech-matrix-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {proj.tech.map((t, tIdx) => (
                  <span key={tIdx} style={{ border: 'var(--border-thin)', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, background: 'var(--light-gray)' }}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 03: Research Output */}
      <section id="papers" style={{ padding: '100px 4vw', maxWidth: '1200px', margin: '0 auto', borderBottom: 'var(--border)', scrollMarginTop: '100px' }}>
        <span className="section-index" style={{ fontSize: '0.8rem', fontWeight: 700, border: 'var(--border)', padding: '4px 12px', display: 'inline-block', marginBottom: '24px', background: '#FFF' }}>03 // CERTIFIED_DOCUMENTS</span>
        <div className="doc-container" style={{ border: 'var(--border)', padding: '40px', marginTop: '40px', background: '#FFF', boxShadow: '8px 8px 0px #000' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', lineHeight: 1.3 }}>Deep Learning-Based Underwater Fish Species Classification and Localization using Mask-Annotated Crops and Convolutional Architectures</h3>
          <p style={{ color: '#333', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>Co-authored an automated processing framework evaluating CNN-based segmentation networks configured to accurately capture and extract marine life patterns from low-visibility, chaotic underwater video feeds. Presented and archived within the contexts of the IEEE INSPECT 2025 conference proceedings, ABV-IIITM Gwalior, India (Published January 2026).</p>
          <a className="btn dark" href="https://doi.org/10.1109/INSPECT67393.2025.11350522" target="_blank" rel="noopener noreferrer">
            SYSTEM_DOI: 10.1109/INSPECT67393.2025.11350522 <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* Section 04: Capability Matrix */}
      <section id="matrix" style={{ padding: '100px 4vw', maxWidth: '1200px', margin: '0 auto', borderBottom: 'var(--border)' }}>
        <span className="section-index" style={{ fontSize: '0.8rem', fontWeight: 700, border: 'var(--border)', padding: '4px 12px', display: 'inline-block', marginBottom: '24px', background: '#FFF' }}>04 // DATA_MATRICES</span>
        <div className="grid-matrix" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {skillMatrix.map((matrix, mIdx) => (
            <div key={mIdx} className="matrix-cell" style={{ border: 'var(--border)', padding: '24px', background: '#FFF', boxShadow: '4px 4px 0px #000' }}>
              <h4 style={{ borderBottom: 'var(--border)', paddingBottom: '8px', fontSize: '0.9rem' }}>{matrix.category}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {matrix.items.map((item, iIdx) => (
                  <li key={iIdx} style={{ fontSize: '0.9rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item}
                    <span style={{ width: '8px', height: '8px', background: '#000' }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Node */}
      <footer id="contact" style={{ padding: '120px 4vw 80px', textAlign: 'center', background: '#000', color: '#FFF' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', marginBottom: '20px' }}>TERMINATE_SESSION // OPEN_COMMS</h2>
        <div className="footer-links" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn" style={{ background: '#000', color: '#FFF', borderColor: '#FFF', boxShadow: '4px 4px 0px #FFF' }} href="mailto:vishnuchaitanyapulavarthi@gmail.com"><Send size={14} /> EMAIL_NODE</a>
          <a className="btn" style={{ background: '#000', color: '#FFF', borderColor: '#FFF', boxShadow: '4px 4px 0px #FFF' }} href="https://linkedin.com/in/pulavarthivishnu" target="_blank" rel="noopener noreferrer">LINKEDIN_SYS</a>
          <a className="btn" style={{ background: '#000', color: '#FFF', borderColor: '#FFF', boxShadow: '4px 4px 0px #FFF' }} href="https://github.com/lucifer12122" target="_blank" rel="noopener noreferrer">GITHUB_ARCHIVE</a>
        </div>
      </footer>
    </div>
  );
}