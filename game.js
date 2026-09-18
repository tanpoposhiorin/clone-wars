window.CLONE_WARS_GAME = true;
const ART_NAMES = ['drawBackground', 'drawGround', 'drawBird', 'drawPipe'];
const SOUND_NAMES = ['flap', 'score', 'crash'];
const DEFAULTS = { title: 'Flap Clone', fix: 'none', canvasWidth: 360, canvasHeight: 640, gravity: 1400, flapStrength: 420, birdSize: 34, pipeWidth: 64, pipeGap: 150, pipeSpacing: 220, pipeSpeed: 170, groundHeight: 80, modes: { normal: { pipeGap: 150, pipeSpeed: 170 }, easy: { pipeGap: 170, pipeSpeed: 145 } } };
const missing = [];
if (!window.GAME_CONFIG) missing.push('settings');
else for (const key of Object.keys(DEFAULTS)) { if (!(key in window.GAME_CONFIG)) missing.push(key); }
if (!window.SPRITES) missing.push('art');
else for (const name of ART_NAMES) { if (typeof window.SPRITES[name] !== 'function') missing.push(name); }
if (!window.SOUNDS) missing.push('sound');
else for (const name of SOUND_NAMES) { if (typeof window.SOUNDS[name] !== 'function') missing.push(name); }
const CONFIG = Object.assign({}, DEFAULTS, window.GAME_CONFIG || {});
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const ot = document.getElementById('overlay-title');
const ox = document.getElementById('overlay-text');
const fb = document.getElementById('fix-buttons');
const ml = document.getElementById('missing-label');
const sr = document.getElementById('sr');
canvas.width = CONFIG.canvasWidth; canvas.height = CONFIG.canvasHeight;
if (missing.length) ml.textContent = 'Missing: ' + missing.join(', ');
const SPRITES = window.SPRITES || {};
const SOUNDS = window.SOUNDS || {};
let state = 'ready', birdX = CONFIG.canvasWidth * 0.28, y = (CONFIG.canvasHeight - CONFIG.groundHeight) * 0.5;
let velocity = 0, pipes = [], pipesMade = 0, groundOffset = 0, lastGapTop = y - CONFIG.pipeGap * 0.5;
let score = 0, checkpoint = 0, secondsSinceCrash = 0, muted = false, currentMode = 'normal', bestScore = 0;
try { bestScore = parseInt(localStorage.getItem('cloneWarsBest'), 10) || 0; } catch (error) {}
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function play(name) { if (!muted && typeof SOUNDS[name] === 'function') SOUNDS[name](); }
function soundLine() { return 'Press M to turn sound ' + (muted ? 'on.' : 'off.'); }
function show(title, text) { ot.textContent = title; ox.textContent = text; overlay.hidden = false; }
function setupOverlay() { if (state === 'ready') show(CONFIG.title, 'Press Space, click or tap to start.\n' + soundLine()); else if (state === 'gameover') show('Game over', 'Score ' + score + '   ·   Best ' + bestScore + (checkpoint > 0 ? '\nNext game starts at checkpoint ' + checkpoint + '.' : '') + '\nPress Space, click or tap to play again.\n' + soundLine()); }
function press() { if (state === 'ready') startGame(); else if (state === 'playing') { velocity = -CONFIG.flapStrength; play('flap'); } else if (state === 'gameover' && secondsSinceCrash >= 0.5) startGame(); }
function startGame() { state = 'playing'; y = (CONFIG.canvasHeight - CONFIG.groundHeight) * 0.5; velocity = -CONFIG.flapStrength; pipes = []; pipesMade = 0; groundOffset = 0; lastGapTop = (CONFIG.canvasHeight - CONFIG.groundHeight - CONFIG.pipeGap) * 0.5; score = checkpoint; secondsSinceCrash = 0; overlay.hidden = true; play('flap'); }
function addPipe() { const mode = CONFIG.fix === 'easy-mode' ? CONFIG.modes[currentMode] : CONFIG; const gap = mode.pipeGap + (CONFIG.fix === 'gentle-start' && pipesMade < 3 ? 70 : 0); const maxTop = CONFIG.canvasHeight - CONFIG.groundHeight - gap; const gapTop = Math.max(20, Math.min(maxTop - 20, lastGapTop + (Math.random() - 0.5) * 150)); const gapBottom = gapTop + gap; lastGapTop = gapTop; pipes.push({ x: CONFIG.canvasWidth, gapTop: gapTop, gapBottom: gapBottom, scored: false }); pipesMade += 1; }
function crash() { if (state !== 'playing') return; state = 'gameover'; secondsSinceCrash = 0; play('crash'); if (score > bestScore) bestScore = score; try { localStorage.setItem('cloneWarsBest', String(bestScore)); } catch (error) {} checkpoint = CONFIG.fix === 'checkpoints' ? Math.floor(score / 10) * 10 : 0; sr.textContent = 'Game over. Score ' + score + '. Best ' + bestScore + '.'; setupOverlay(); }
function frame(now) { const seconds = Math.min(0.05, Math.max(0, (now - (frame.last || now)) / 1000)); frame.last = now; if (state === 'playing') { const mode = CONFIG.fix === 'easy-mode' ? CONFIG.modes[currentMode] : CONFIG; const pipeGap = mode.pipeGap; const pipeSpeed = mode.pipeSpeed * (CONFIG.fix === 'gentle-start' && score < 3 ? 0.75 : 1); velocity += CONFIG.gravity * seconds; y += velocity * seconds; if (!pipes.length || pipes[pipes.length - 1].x <= CONFIG.canvasWidth - CONFIG.pipeSpacing) addPipe(); for (const pipe of pipes) { pipe.x -= pipeSpeed * seconds; if (!pipe.scored && pipe.x + CONFIG.pipeWidth < birdX) { pipe.scored = true; score += 1; play('score'); } const hitX = birdX + CONFIG.birdSize / 2 > pipe.x && birdX - CONFIG.birdSize / 2 < pipe.x + CONFIG.pipeWidth; if (hitX && (y - CONFIG.birdSize / 2 < pipe.gapTop || y + CONFIG.birdSize / 2 > pipe.gapBottom)) crash(); } pipes = pipes.filter((pipe) => pipe.x + CONFIG.pipeWidth > 0); groundOffset = (groundOffset + pipeSpeed * seconds) % 40; if (y - CONFIG.birdSize / 2 <= 0 || y + CONFIG.birdSize / 2 >= CONFIG.canvasHeight - CONFIG.groundHeight) crash(); } else if (state === 'gameover') secondsSinceCrash += seconds; ctx.clearRect(0, 0, canvas.width, canvas.height); if (typeof SPRITES.drawBackground === 'function') SPRITES.drawBackground(ctx, CONFIG.canvasWidth, CONFIG.canvasHeight, reduceMotion ? 0 : now / 1000); for (const pipe of pipes) if (typeof SPRITES.drawPipe === 'function') SPRITES.drawPipe(ctx, pipe.x, pipe.gapTop, pipe.gapBottom, CONFIG.pipeWidth, CONFIG.canvasHeight - CONFIG.groundHeight); if (typeof SPRITES.drawGround === 'function') SPRITES.drawGround(ctx, CONFIG.canvasWidth, CONFIG.canvasHeight, CONFIG.groundHeight, groundOffset); if (typeof SPRITES.drawBird === 'function') SPRITES.drawBird(ctx, birdX, y, CONFIG.birdSize, velocity); if (state === 'playing') { ctx.save(); ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 5; ctx.strokeStyle = '#182033'; ctx.fillStyle = '#fff'; ctx.strokeText(String(score), CONFIG.canvasWidth / 2, 52); ctx.fillText(String(score), CONFIG.canvasWidth / 2, 52); ctx.restore(); } requestAnimationFrame(frame); }
window.addEventListener('keydown', (event) => { if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); press(); } if (event.code === 'KeyM') { muted = !muted; setupOverlay(); } });
canvas.addEventListener('pointerdown', (event) => { event.preventDefault(); press(); });
if (CONFIG.fix === 'easy-mode') { ['easy', 'normal'].forEach((mode) => { const button = document.createElement('button'); button.textContent = mode[0].toUpperCase() + mode.slice(1); button.setAttribute('aria-pressed', String(currentMode === mode)); button.addEventListener('click', () => { currentMode = mode; setupOverlay(); }); fb.appendChild(button); }); }
setupOverlay(); requestAnimationFrame(frame);
