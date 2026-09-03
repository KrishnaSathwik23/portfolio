import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  ArrowDown,
  ExternalLink,
  Terminal,
  Brain,
  Code2,
  Sparkles,
  X,
  Zap
} from 'lucide-react';
import './style.css';
import './fun.css';
import './reaction.css';

const projects = [
  {
    n: '01',
    title: 'LearnShot',
    desc: 'Anticipation-aware AI that turns long educational lectures into engaging microlearning clips.',
    stack: ['Python', 'Faster-Whisper', 'Gemini API', 'FFmpeg', 'FastAPI', 'React.js'],
    detail: 'Finds topic boundaries and high-anticipation moments, then automates transcription, segmentation and delivery.',
    repo: 'https://github.com/KrishnaSathwik23/LearnShot',
    icon: Brain
  },
  {
    n: '02',
    title: 'Self Decision AI Engine',
    desc: 'A self-learning decision engine that evaluates predictive models and selects the best algorithm for a dataset.',
    stack: ['Python', 'Scikit-learn', 'React.js', 'ML'],
    detail: 'Combines model evaluation, historical performance and feedback loops into an automated selection pipeline.',
    repo: 'https://github.com/KrishnaSathwik23',
    icon: Code2
  },
  {
    n: '03',
    title: 'Health Companion AI',
    desc: 'A RAG-powered healthcare chatbot built around domain-specific documents and semantic retrieval.',
    stack: ['Python', 'Gemini API', 'RAG', 'React.js'],
    detail: 'Uses document chunking, embeddings and semantic search for context-aware responses.',
    repo: 'https://github.com/KrishnaSathwik23',
    icon: Sparkles
  }
];

const skills = [
  'Python', 'C++', 'SQL', 'JavaScript', 'React.js', 'Node.js',
  'Machine Learning', 'RAG', 'DSA', 'OOP', 'DBMS', 'HTML/CSS'
];

const reactions = [
  'Ayyayyo!', 'Enti ra idi?', 'Abbaa!', 'Ohooo!', 'Adirindhi!', 'Aha!',
  'Chaala baagundhi!', 'Ayyo ayyo!', 'Mass ra!', 'Super ra!', 'Nuvvu thaggaku!',
  'Idhi vere level!', 'Em jaruguthundhi ra?', 'Sare sare!', 'Malli try cheddam!',
  'Aagandi aagandi!', 'Nenu ready!', 'Set ayipoyindhi!', 'Orey baabu!', 'Ammo!'
];

const memeSounds = [
  { name: 'Vine Boom', url: 'https://www.myinstants.com/media/sounds/vine-boom.mp3' },
  { name: 'Error', url: 'https://www.myinstants.com/media/sounds/error_CDOxCYm.mp3' },
  { name: 'Dun Dun Dun', url: 'https://www.myinstants.com/media/sounds/dun-dun-dun-sound-effect-brass_8nFBccR.mp3' },
  { name: 'Anime Wow', url: 'https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3' },
  { name: 'SpongeBob Fail', url: 'https://www.myinstants.com/media/sounds/spongebob-fail.mp3' },
  { name: 'Metal Pipe', url: 'https://www.myinstants.com/media/sounds/metal-pipe-clang.mp3' },
  { name: 'Taco Bong', url: 'https://www.myinstants.com/media/sounds/taco-bell-bong-sfx.mp3' },
  { name: 'MLG Airhorn', url: 'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3' }
];

function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [sound, setSound] = useState(false);
  const [intro, setIntro] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [chaos, setChaos] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [down, setDown] = useState(false);

  const audioElement = useRef(null);
  const audioContext = useRef(null);
  const timer = useRef(null);
  const interactionCount = useRef(0);

  const playMemeSound = (requested) => {
    if (!sound) return;

    try {
      const chosen =
        typeof requested === 'string'
          ? memeSounds.find((item) => item.name === requested) || memeSounds[0]
          : requested || memeSounds[Math.floor(Math.random() * memeSounds.length)];

      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.currentTime = 0;
      }

      const player = new Audio(chosen.url);
      player.volume = 0.12;
      audioElement.current = player;
      player.play().catch(() => {});
    } catch {
      // Audio can be unavailable until the browser allows playback.
    }
  };

  const beep = () => {
    if (!sound) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContext.current) {
        audioContext.current = new AudioContextClass();
      }

      const context = audioContext.current;
      context.resume();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(520, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(760, context.currentTime + 0.07);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.09);
    } catch {
      // Ignore browsers that block Web Audio.
    }
  };

  const react = (text, forcedSound) => {
    const message = text || reactions[Math.floor(Math.random() * reactions.length)];
    setToast(message);

    if (forcedSound) {
      playMemeSound(forcedSound);
    } else {
      interactionCount.current += 1;
      if (sound && (interactionCount.current % 3 === 0 || Math.random() < 0.22)) {
        playMemeSound();
      } else {
        beep();
      }
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1500);
  };

  useEffect(() => {
    const move = (event) => setCursor({ x: event.clientX, y: event.clientY });
    const press = () => {
      setDown(true);
      if (sound && Math.random() < 0.12) playMemeSound();
    };
    const release = () => setDown(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [sound]);

  useEffect(() => {
    if (!sound) return undefined;

    const id = setInterval(() => {
      if (!document.hidden && Math.random() < 0.32) {
        playMemeSound();
      }
    }, 22000);

    return () => clearInterval(id);
  }, [sound]);

  useEffect(() => {
    if (sound) {
      const id = setTimeout(() => playMemeSound('Anime Wow'), 120);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [sound]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setChaos((value) => !value);
        react('Mass mode on!', 'MLG Airhorn');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sound]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />

      <div
        className="cursor-dot"
        style={{
          transform: `translate3d(${cursor.x}px,${cursor.y}px,0) scale(${down ? 0.65 : 1})`
        }}
      />
      <div
        className="cursor-ring"
        style={{
          transform: `translate3d(${cursor.x}px,${cursor.y}px,0) scale(${down ? 1.5 : 1})`
        }}
      >
        <span>+</span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast surprise-toast"
            initial={{ y: -40, opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: -40, opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="close" onClick={() => setModal(null)}>
                <X />
              </button>
              <span className="modal-kicker">PROJECT INTEL / {modal.n}</span>
              <h2>{modal.title}</h2>
              <p>{modal.detail}</p>
              <div className="modal-stack">
                {modal.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <a className="modal-link" href={modal.repo} target="_blank" rel="noreferrer">
                OPEN SOURCE <ExternalLink size={16} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {intro && (
        <motion.div
          className="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grain" />
          <div className="scanlines" />
          <div className="intro-copy">
            <span>ఓయ్… SYSTEM BOOT // 2026</span>
            <h1>WELCOME TO<br /><em>KRISHNA'S WORLD</em></h1>
            <p>Portfolio kaadu. <b>Experience.</b></p>
            <button
              onClick={() => {
                setIntro(false);
                react('Ready aa? Let’s go!', 'Anime Wow');
              }}
            >
              ENTER THE MASS <ArrowDown size={18} />
            </button>
            <small>Sound effects optional. Surprises compulsory.</small>
          </div>
          <div className="boot-log">
            &gt; booting_ai.exe<br />
            &gt; loading_telugu.dll<br />
            &gt; loading_interactions...<br />
            &gt; sound_engine ✓<br />
            &gt; surprise_engine: ARMED
          </div>
        </motion.div>
      )}

      <header>
        <a className="logo" href="#home" onClick={() => react('Aha! Home ki vachesaav.')}>KS<span>.</span></a>
        <nav>
          <a href="#about" onClick={() => react('About aa? Chuddam!')}>01 / ABOUT</a>
          <a href="#skills" onClick={() => react('Skills check chesthunnava?')}>02 / SKILLS</a>
          <a href="#projects" onClick={() => react('Projects ki veldhaam!')}>03 / WORK</a>
          <a href="#contact" onClick={() => react('Contact ki ra!')}>04 / CONTACT</a>
        </nav>
        <button className="sound" onClick={() => setSound((value) => !value)}>
          {sound ? <Volume2 /> : <VolumeX />}
          <span>{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
        </button>
      </header>

      <main id="home" className={chaos ? 'chaos' : ''}>
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-scan" />
          <div className="orb orb1" />
          <div className="orb orb2" />

          <div className="hero-left">
            <p className="eyebrow">CSE IoT · AI BUILDER · CREATIVE TECHNOLOGIST</p>
            <h1>KRISHNA<br /><span>SATHWIK</span></h1>
            <p className="hero-sub">
              I build <b>AI systems</b>, experiment with software,<br />
              and occasionally break things just to understand them.
            </p>
            <div className="hero-actions">
              <a href="#projects" onClick={() => react('Idhi vere level!')}>
                ENTER THE PROJECTS <ArrowDown size={18} />
              </a>
              <a href="mailto:krishnasathwik23@gmail.com" className="ghost" onClick={() => react('Sare, mail pampu!')}>
                LET'S TALK
              </a>
            </div>
            <div className="hero-meta">
              <span><i /> AVAILABLE FOR COOL BUILDS</span>
              <span>INDIA · 2026</span>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="portrait-glow" />
            <div className="portrait-ring" />
            <img
              src="https://avatars.githubusercontent.com/u/217095135?v=4"
              className="portrait"
              alt="Krishna Sathwik"
            />
            <div className="portrait-frame">PORTRAIT_001<br /><b>MAIN CHARACTER</b></div>
            <div className="stamp">AI<br />×<br />CODE</div>
          </div>
          <div className="scroll">SCROLL TO CONTINUE ↓</div>
        </section>

        <section className="ticker">
          <span>TELUGU MODE ON //</span>
          <div>BUG → FIX → BREAK → FIX → DEPLOY → PRAY → REPEAT → &nbsp;</div>
        </section>

        <section id="about" className="section about">
          <div className="section-label">01 / EVARU VEEDU?</div>
          <div className="about-grid">
            <div>
              <h2>STUDENT.<br /><em>BUILDER.</em><br />PROBLEM<br />MAKER.</h2>
            </div>
            <div className="about-copy">
              <p className="big">
                Krishna Sathwik Mandavilli builds practical AI and software projects with curiosity, engineering and a little chaos.
              </p>
              <p>
                From educational video intelligence to automated model selection and retrieval-augmented AI, the goal is simple: turn weird ideas into working systems.
              </p>
              <div className="fun-stats">
                <div><b>03</b><span>AI BUILDS</span></div>
                <div><b>∞</b><span>BUGS DEFEATED</span></div>
                <div><b>01</b><span>CHAOS ENGINE</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills">
          <div className="section-label">02 / ENTHA SKILL UNNAY?</div>
          <h2>THE TOOLBOX<br /><em>OF DOOM.</em></h2>
          <div className="skill-cloud">
            {skills.map((skill, index) => (
              <motion.button
                className="skill"
                key={skill}
                whileHover={{ scale: 1.1, rotate: index % 2 ? 2 : -2 }}
                onClick={() => react(`${skill} — super!`)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>{skill}
              </motion.button>
            ))}
          </div>
          <div className="terminal">
            <Terminal />
            <span>krishna@portfolio:~$</span>
            <b> python build_cool_stuff.py --with-mass</b>
            <i>✓</i>
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-label">03 / ASALU MATTER IDHE</div>
          <h2>PROJECTS<br /><em>WITH PLOT.</em></h2>
          {projects.map((project, index) => {
            const Icon = project.icon;
            const projectSound = index === 0 ? 'Vine Boom' : index === 1 ? 'Dun Dun Dun' : 'Anime Wow';
            const projectReaction = index === 0 ? 'Abbaa! LearnShot!' : index === 1 ? 'Ohooo! Decision time!' : 'Ayyayyo! Health AI!';

            return (
              <motion.article
                className="project"
                key={project.title}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                onClick={() => {
                  setModal(project);
                  react(projectReaction, projectSound);
                }}
              >
                <div className="project-no">{project.n}</div>
                <div className="project-main">
                  <div className="project-top">
                    <span>AI / BUILD</span>
                    <span>CLICK FOR INTEL ↗</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div className="stack">
                    {project.stack.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="project-action">OPEN PROJECT INTEL <Zap size={15} /></div>
                </div>
                <div className={`project-art art${index}`}>
                  <div className="art-core"><Icon /></div>
                  <div className="orbit o1" />
                  <div className="orbit o2" />
                  <span>
                    {index === 0 ? 'TRANSCRIBE → THINK → CUT' : index === 1 ? 'DATA → MODELS → DECISION' : 'DOCS → EMBEDDINGS → ANSWER'}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </section>

        <section id="contact" className="contact">
          <div className="contact-no">04</div>
          <p>INKA MATLADUKUNDAAMA?</p>
          <h2>LET'S MAKE<br /><em>SOMETHING CRAZY.</em></h2>
          <a href="mailto:krishnasathwik23@gmail.com" onClick={() => react('Sare, matladukundham!')}>
            krishnasathwik23@gmail.com
          </a>
          <div className="socials">
            <a href="https://github.com/KrishnaSathwik23" target="_blank" rel="noreferrer" onClick={() => react('GitHub ki vellam!')}>
              ⌘ GITHUB
            </a>
            <a href="https://linkedin.com/in/krishnasathwikmandavilli" target="_blank" rel="noreferrer" onClick={() => react('LinkedIn time!')}>
              in LINKEDIN
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>KRISHNA SATHWIK © 2026</span>
        <span>MADE WITH CODE, CHAOS & TELUGU</span>
        <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); react('Back to top!'); }}>
          BACK TO TOP ↑
        </button>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
