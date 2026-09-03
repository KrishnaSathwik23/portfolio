import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Volume2, VolumeX, ArrowDown, ExternalLink, Terminal, Brain, Code2,
  Sparkles, Play, Pause, X, Zap, PartyPopper, MousePointer2
} from 'lucide-react';
import './style.css';
import './fun.css';

const projects = [
  {
    n: '01', title: 'LearnShot',
    desc: 'Anticipation-aware AI that turns long educational lectures into engaging microlearning clips.',
    stack: ['Python', 'Faster-Whisper', 'Gemini API', 'FFmpeg', 'FastAPI', 'React.js'],
    detail: 'Finds topic boundaries and high-anticipation moments, then automates transcription, segmentation and delivery.',
    repo: 'https://github.com/KrishnaSathwik23/LearnShot', icon: Brain
  },
  {
    n: '02', title: 'Self Decision AI Engine',
    desc: 'A self-learning decision engine that evaluates predictive models and selects the best algorithm for a dataset.',
    stack: ['Python', 'Scikit-learn', 'React.js', 'ML'],
    detail: 'Combines model evaluation, historical performance and feedback loops into an automated selection pipeline.',
    repo: 'https://github.com/KrishnaSathwik23', icon: Code2
  },
  {
    n: '03', title: 'Health Companion AI',
    desc: 'A RAG-powered healthcare chatbot built around domain-specific documents and semantic retrieval.',
    stack: ['Python', 'Gemini API', 'RAG', 'React.js'],
    detail: 'Uses document chunking, embeddings and semantic search for context-aware responses.',
    repo: 'https://github.com/KrishnaSathwik23', icon: Sparkles
  }
];

const skills = ['Python', 'C++', 'SQL', 'JavaScript', 'React.js', 'Node.js', 'Machine Learning', 'RAG', 'DSA', 'OOP', 'DBMS', 'HTML/CSS'];

// These are real hosted YouTube videos containing original Telugu comedy/dialogue audio.
// The portfolio embeds the source video rather than copying copyrighted media into the repo.
const videos = [
  {
    title: 'BRAHMANANDAM × VENNELA KISHORE',
    source: 'Non Stop Comedy Scenes',
    url: 'https://www.youtube.com/embed/Xau2OkTnb1k?rel=0&modestbranding=1',
    note: 'Original comedy audio from the source video'
  },
  {
    title: 'BRAHMI HILARIOUS DIALOGUES',
    source: 'Telugu Comedy',
    url: 'https://www.youtube.com/embed/CgW9h7M1kSM?rel=0&modestbranding=1',
    note: 'Original dialogue audio from the source video'
  },
  {
    title: 'SATYA × VENNELA KISHORE',
    source: 'Best Comedy Scenes',
    url: 'https://www.youtube.com/embed/C8Dy9hHLDug?rel=0&modestbranding=1',
    note: 'Original comedy audio from the source video'
  }
];

function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [sound, setSound] = useState(false);
  const [intro, setIntro] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [playing, setPlaying] = useState(true);
  const [chaos, setChaos] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [down, setDown] = useState(false);
  const audio = useRef(null);

  const beep = (type = 'click') => {
    if (!sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audio.current) audio.current = new AudioCtx();
      const ctx = audio.current;
      ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === 'success' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(type === 'hover' ? 620 : type === 'success' ? 820 : 220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(type === 'success' ? 1100 : 120, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  };

  const fun = (text) => {
    setToast(text);
    beep('success');
    window.clearTimeout(fun.timer);
    fun.timer = window.setTimeout(() => setToast(''), 2400);
  };

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, []);

  useEffect(() => {
    const key = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setChaos((value) => !value);
        fun('CTRL + K — MASS MODE');
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [sound]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="cursor-dot" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0) scale(${down ? 0.65 : 1})` }} />
      <div className="cursor-ring" style={{ transform: `translate3d(${cursor.x}px,${cursor.y}px,0) scale(${down ? 1.5 : 1})` }}><span>+</span></div>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div className="modal" initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }} onClick={(e) => e.stopPropagation()}>
              <button className="close" onClick={() => setModal(null)} aria-label="Close"><X /></button>
              {modal.type === 'project' ? (
                <>
                  <span className="modal-kicker">PROJECT INTEL / {modal.n}</span>
                  <h2>{modal.title}</h2>
                  <p>{modal.detail}</p>
                  <div className="modal-stack">{modal.stack.map((item) => <span key={item}>{item}</span>)}</div>
                  <a className="modal-link" href={modal.repo} target="_blank" rel="noreferrer">OPEN SOURCE <ExternalLink size={16} /></a>
                </>
              ) : (
                <>
                  <span className="modal-kicker">SYSTEM SECRET</span>
                  <h2>YOU FOUND THE<br /><em>MASS BUTTON.</em></h2>
                  <p>Try CTRL + K whenever you want the interface to go a little wild.</p>
                  <button className="mass-btn" onClick={() => { setChaos((value) => !value); fun('MASS MODE TOGGLED'); }}><PartyPopper /> MAKE IT MASS</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {intro && (
        <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.8 }}>
          <div className="grain" />
          <div className="scanlines" />
          <div className="intro-copy">
            <span>ఓయ్… SYSTEM BOOT // 2026</span>
            <h1>WELCOME TO<br /><em>KRISHNA'S WORLD</em></h1>
            <p>Portfolio kaadu. <b>Experience.</b></p>
            <button onClick={() => setIntro(false)}>ENTER THE MASS <ArrowDown size={18} /></button>
            <small>Headphones optional. Fun compulsory.</small>
          </div>
          <div className="boot-log">&gt; booting_ai.exe<br />&gt; loading_telugu.dll<br />&gt; loading_meme_engine...<br />&gt; sound_engine ✓<br />&gt; chaos_level: HIGH</div>
        </motion.div>
      )}

      <header>
        <a className="logo" href="#home">KS<span>.</span></a>
        <nav>
          <a href="#about">01 / ABOUT</a>
          <a href="#skills">02 / SKILLS</a>
          <a href="#projects">03 / WORK</a>
          <a href="#contact">04 / CONTACT</a>
        </nav>
        <button className="sound" onClick={() => { setSound((value) => !value); beep('success'); }}>
          {sound ? <Volume2 /> : <VolumeX />}<span>{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
        </button>
      </header>

      <main id="home" className={chaos ? 'chaos' : ''}>
        <section className="hero">
          <div className="hero-grid" /><div className="hero-scan" /><div className="orb orb1" /><div className="orb orb2" />
          <div className="hero-left">
            <p className="eyebrow">CSE IoT · AI BUILDER · CREATIVE TECHNOLOGIST</p>
            <h1>KRISHNA<br /><span>SATHWIK</span></h1>
            <p className="hero-sub">I build <b>AI systems</b>, experiment with software,<br />and occasionally break things just to understand them.</p>
            <div className="hero-actions"><a href="#projects">ENTER THE PROJECTS <ArrowDown size={18} /></a><a href="mailto:krishnasathwik23@gmail.com" className="ghost">LET'S TALK</a></div>
            <div className="hero-meta"><span><i /> AVAILABLE FOR COOL BUILDS</span><span>INDIA · 2026</span></div>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-glow" /><div className="portrait-ring" />
            <img src="https://avatars.githubusercontent.com/u/217095135?v=4" className="portrait" alt="Krishna Sathwik" />
            <div className="portrait-frame">PORTRAIT_001<br /><b>MAIN CHARACTER</b></div>
            <div className="stamp">AI<br />×<br />CODE</div>
          </div>
          <div className="scroll">SCROLL TO CONTINUE ↓</div>
        </section>

        <section className="ticker"><span>TELUGU MODE ON //</span><div>BUG → FIX → BREAK → FIX → DEPLOY → PRAY → REPEAT → &nbsp;</div></section>

        <section className="reel section">
          <div className="section-label">MEDIA / ORIGINAL TELUGU COMEDY</div>
          <div className="reel-head">
            <h2>MEMES.<br /><em>DIALOGUES.</em><br />CHAOS.</h2>
            <button className="play-toggle" onClick={() => { setPlaying((value) => !value); beep('click'); }}>{playing ? <Pause /> : <Play />}{playing ? 'PAUSE CHAOS' : 'PLAY CHAOS'}</button>
          </div>
          <div className={`meme-grid ${playing ? '' : 'paused'}`}>
            {videos.map((video, index) => (
              <motion.article className="meme-card" key={video.title} whileHover={{ y: -12, rotate: index === 1 ? 0 : index === 0 ? -2 : 2 }}>
                <div className="video-shell"><iframe src={video.url} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                <div className="meme-caption"><span>ORIGINAL_{String(index + 1).padStart(2, '0')}</span><b>{video.title}</b><small>{video.source} · {video.note}</small></div>
              </motion.article>
            ))}
          </div>
          <div className="dialogue-marquee"><span>ORIGINAL TELUGU AUDIO // PLAY THE SOURCE VIDEO //</span><span>ORIGINAL TELUGU AUDIO // PLAY THE SOURCE VIDEO //</span><span>ORIGINAL TELUGU AUDIO // PLAY THE SOURCE VIDEO //</span></div>
        </section>

        <section id="about" className="section about">
          <div className="section-label">01 / EVARU VEEDU?</div>
          <div className="about-grid"><div><h2>STUDENT.<br /><em>BUILDER.</em><br />PROBLEM<br />MAKER.</h2></div><div className="about-copy"><p className="big">Krishna Sathwik Mandavilli builds practical AI and software projects with equal parts curiosity, engineering and chaos.</p><p>From educational video intelligence to automated model selection and retrieval-augmented AI, the goal is simple: turn weird ideas into working systems.</p><div className="fun-stats"><div><b>03</b><span>AI BUILDS</span></div><div><b>∞</b><span>BUGS DEFEATED</span></div><div><b>01</b><span>CHAOS ENGINE</span></div></div></div></div>
        </section>

        <section id="skills" className="section skills">
          <div className="section-label">02 / ENTHA SKILL UNNAY?</div><h2>THE TOOLBOX<br /><em>OF DOOM.</em></h2>
          <div className="skill-cloud">{skills.map((skill, index) => <motion.button className="skill" key={skill} whileHover={{ scale: 1.1, rotate: index % 2 ? 2 : -2 }} onClick={() => fun(`${skill} selected ✓`)}><span>{String(index + 1).padStart(2, '0')}</span>{skill}</motion.button>)}</div>
          <div className="terminal"><Terminal /><span>krishna@portfolio:~$</span><b> python build_cool_stuff.py --with-mass</b><i>✓</i></div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-label">03 / ASALU MATTER IDHE</div><h2>PROJECTS<br /><em>WITH PLOT.</em></h2>
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article className="project" key={project.title} initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} onClick={() => setModal({ ...project, type: 'project' })}>
                <div className="project-no">{project.n}</div>
                <div className="project-main"><div className="project-top"><span>AI / BUILD</span><span>CLICK FOR INTEL ↗</span></div><h3>{project.title}</h3><p>{project.desc}</p><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-action">OPEN PROJECT INTEL <Zap size={15} /></div></div>
                <div className={`project-art art${index}`}><div className="art-core"><Icon /></div><div className="orbit o1" /><div className="orbit o2" /><span>{index === 0 ? 'TRANSCRIBE → THINK → CUT' : index === 1 ? 'DATA → MODELS → DECISION' : 'DOCS → EMBEDDINGS → ANSWER'}</span></div>
              </motion.article>
            );
          })}
        </section>

        <section className="fun-zone section"><div className="section-label">BONUS / DON'T BE BORING</div><div className="fun-grid"><button className="fun-card" onClick={() => setModal({ type: 'secret' })}><Zap /><strong>SECRET BUTTON</strong><span>Definitely don't click.</span></button><button className="fun-card" onClick={() => { const video = videos[Math.floor(Math.random() * videos.length)]; fun(`${video.title} — OPEN THE ORIGINAL CLIP`); }}><MousePointer2 /><strong>RANDOM SCENE</strong><span>Pick an original comedy clip.</span></button><button className="fun-card" onClick={() => { setChaos((value) => !value); fun('MASS MODE TOGGLED'); }}><PartyPopper /><strong>MASS MODE</strong><span>Make the UI misbehave.</span></button></div></section>

        <section id="contact" className="contact"><div className="contact-no">04</div><p>INKA MATLADUKUNDAAMA?</p><h2>LET'S MAKE<br /><em>SOMETHING CRAZY.</em></h2><a href="mailto:krishnasathwik23@gmail.com">krishnasathwik23@gmail.com</a><div className="socials"><a href="https://github.com/KrishnaSathwik23" target="_blank" rel="noreferrer">⌘ GITHUB</a><a href="https://linkedin.com/in/krishnasathwikmandavilli" target="_blank" rel="noreferrer">in LINKEDIN</a></div></section>
      </main>

      <footer><span>KRISHNA SATHWIK © 2026</span><span>MADE WITH CODE, CHAOS & TELUGU</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
