const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'main.jsx');
let source = fs.readFileSync(file, 'utf8');

// Keep the surprise audio engine enabled from the beginning so the intro sound
// is not immediately disabled by the initial sound state.
source = source.replace("const [sound, setSound] = useState(false);", "const [sound, setSound] = useState(true);");

// The old effect fired Anime Wow 120ms after sound was enabled. That effect
// paused the Spider-Man intro because all meme sounds shared one audio player.
source = source.replace(/\n  useEffect\(\(\) => \{\n    if \(sound\) \{\n      const id = setTimeout\(\(\) => playMemeSound\('Anime Wow'\), 120\);\n      return \(\) => clearTimeout\(id\);\n    \}\n    return undefined;\n  \}, \[sound\]\);\n/, '\n');

// Do not replace the opening Spider-Man sound with another effect when the
// visitor presses ENTER. The intro should be allowed to play naturally.
source = source.replace("playIntroSound(); setIntro(false); react('Ready aa? Let’s go!', 'Anime Wow');", "playIntroSound(); setIntro(false); setToast('Ready aa? Let’s go!'); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 1500);");

fs.writeFileSync(file, source);
console.log('Audio startup fix applied.');
