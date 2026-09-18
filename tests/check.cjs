#!/usr/bin/env node
// Clone Wars checker. Zero dependencies.
//
//   node tests/check.cjs          check the files and play the game automatically
//   node tests/check.cjs --files  also check that this branch only changed the four build files
//
// Passing this is NOT the same as "the game is fun". Always play it yourself too.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const childProcess = require('child_process');

const root = path.join(__dirname, '..');
const BUILD_FILES = ['config.js', 'sprites.js', 'sounds.js', 'game.js'];
const ART_NAMES = ['drawBackground', 'drawGround', 'drawBird', 'drawPipe'];
const SOUND_NAMES = ['flap', 'score', 'crash'];
const FIXES = ['none', 'easy-mode', 'gentle-start', 'checkpoints', 'custom'];
const SETTINGS = {
  title: 'string', fix: 'string', canvasWidth: 'number', canvasHeight: 'number', gravity: 'number',
  flapStrength: 'number', birdSize: 'number', pipeWidth: 'number', pipeGap: 'number',
  pipeSpacing: 'number', pipeSpeed: 'number', groundHeight: 'number', modes: 'object'
};

let passed = 0;
let failed = 0;
function check(name, condition, detail) {
  if (condition) { passed += 1; console.log('  ok    ' + name); }
  else { failed += 1; console.log('  FAIL  ' + name + (detail ? '\n        ' + detail : '')); }
}
function section(title) { console.log('\n' + title); }
const has = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

// ---------- A fake browser, just enough to run the game ----------
function makeElement(tag, id) {
  const listeners = {};
  const element = {
    tagName: String(tag).toUpperCase(), id: id || '', hidden: false, textContent: '', style: {},
    width: 0, height: 0, children: [], attributes: {},
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    fire(type, event) { for (const fn of listeners[type] || []) fn(Object.assign({ currentTarget: element, target: element, preventDefault() {} }, event)); },
    appendChild(child) { element.children.push(child); return child; },
    setAttribute(name, value) { element.attributes[name] = String(value); },
    getAttribute(name) { return element.attributes[name]; },
    removeAttribute(name) { delete element.attributes[name]; },
    querySelectorAll(selector) { return selector === 'button' ? element.children.filter((c) => c.tagName === 'BUTTON') : []; },
    querySelector(selector) { return element.querySelectorAll(selector)[0] || null; },
    closest(selector) { return selector === 'button' && element.tagName === 'BUTTON' ? element : null; },
    focus() {}, blur() {},
    classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); }, contains(c) { return this._set.has(c); }, toggle(c) { this._set.has(c) ? this._set.delete(c) : this._set.add(c); } },
    getContext() { return makeContext(); }
  };
  return element;
}

function makeContext(log) {
  const target = { canvas: { width: 360, height: 640 } };
  let depth = 0;
  return new Proxy(target, {
    get(obj, key) {
      if (key in obj) return obj[key];
      if (key === 'save') return () => { depth += 1; };
      if (key === 'restore') return () => { depth -= 1; if (log) log.depth = depth; };
      if (key === '__depth') return depth;
      if (key === 'createLinearGradient' || key === 'createRadialGradient' || key === 'createPattern') return () => ({ addColorStop() {} });
      if (key === 'measureText') return () => ({ width: 10 });
      if (key === 'getImageData') return () => ({ data: [] });
      if (key === 'fillText' || key === 'strokeText') return (text) => { if (log) log.text.push(String(text)); };
      return () => {};
    },
    set(obj, key, value) { obj[key] = value; return true; }
  });
}

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// Runs the given scripts in a fresh fake page. Returns handles for driving the game.
function makePage(scripts, options) {
  options = options || {};
  const elements = {};
  const ids = ['game', 'overlay', 'overlay-title', 'overlay-text', 'fix-buttons', 'missing-label', 'sr', 'stage', 'starter'];
  for (const id of ids) elements[id] = makeElement(id === 'game' ? 'canvas' : 'div', id);
  elements.overlay.hidden = true;

  const windowListeners = {};
  let frameCallback = null;
  const storage = {};
  const drawLog = { text: [] };
  const context = makeContext(drawLog);
  elements.game.getContext = () => context;

  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame(fn) { frameCallback = fn; return 1; },
    cancelAnimationFrame() {},
    performance: { now: () => 0 },
    localStorage: { getItem: (k) => (k in storage ? storage[k] : null), setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; } },
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    addEventListener(type, fn) { (windowListeners[type] = windowListeners[type] || []).push(fn); },
    removeEventListener() {},
    document: {
      getElementById: (id) => elements[id] || null,
      createElement: (tag) => makeElement(tag),
      querySelector: () => null, querySelectorAll: () => [],
      body: makeElement('body'), documentElement: makeElement('html')
    },
    location: { protocol: 'https:', origin: 'https://example.github.io', pathname: '/clone-wars/' },
    navigator: {}
  };
  sandbox.window = sandbox;
  if (options.config !== undefined) sandbox.GAME_CONFIG = options.config;
  if (options.sprites !== undefined) sandbox.SPRITES = options.sprites;
  if (options.sounds !== undefined) sandbox.SOUNDS = options.sounds;
  vm.createContext(sandbox);
  vm.runInContext('Math.random = (' + seededRandom.toString() + ')(' + (options.seed || 7) + ');', sandbox);
  for (const [name, code] of scripts) vm.runInContext(code, sandbox, { filename: name, timeout: 2000 });

  let now = 1000;
  return {
    sandbox, elements, drawLog, storage,
    hasLoop: () => typeof frameCallback === 'function',
    step(frames) {
      for (let i = 0; i < frames; i += 1) {
        const fn = frameCallback;
        frameCallback = null;
        if (typeof fn !== 'function') throw new Error('the game stopped asking for new frames (requestAnimationFrame)');
        now += 1000 / 60;
        if (options.onFrameStart) options.onFrameStart();
        fn(now);
        if (options.onFrameEnd) options.onFrameEnd();
      }
    },
    key(code) { for (const fn of windowListeners.keydown || []) fn({ code, key: code === 'Space' ? ' ' : code, target: elements.game, preventDefault() {} }); },
    tap() { for (const fn of windowListeners.pointerdown || []) fn({ target: elements.game, preventDefault() {} }); }
  };
}

// Recording stand-ins for art and sound, so the play test sees what the core does.
function makeRecorders() {
  const frame = { bird: null, pipes: [] };
  const sounds = { flap: 0, score: 0, crash: 0 };
  const sprites = {
    drawBackground() {},
    drawGround() {},
    drawBird(ctx, x, y, size, velocity) { frame.bird = { x, y, size, velocity }; },
    drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height) { frame.pipes.push({ x, gapTop, gapBottom, pipeWidth, height }); }
  };
  const soundFns = { flap() { sounds.flap += 1; }, score() { sounds.score += 1; }, crash() { sounds.crash += 1; } };
  return { frame, sounds, sprites, soundFns, reset() { frame.bird = null; frame.pipes = []; } };
}

// ---------- 1. Template files ----------
section('1. Template files');
for (const file of ['index.html', 'README.md', 'AGENTS.md', 'CONTRACT.md', 'docs/HELP.md']) check(file + ' exists', has(file));
if (has('index.html')) {
  const html = read('index.html');
  const order = BUILD_FILES.map((f) => html.indexOf('<script src="' + f + '"></script>'));
  check('index.html loads config.js, sprites.js, sounds.js, game.js in that order', order.every((i) => i >= 0) && order.every((i, n) => n === 0 || i > order[n - 1]));
  check('index.html has no modules', !/type\s*=\s*["']module/.test(html));
  for (const id of ['game', 'overlay', 'overlay-title', 'overlay-text', 'fix-buttons', 'missing-label', 'sr']) {
    check('index.html has the #' + id + ' element', html.includes('id="' + id + '"'));
  }
}

const present = BUILD_FILES.filter(has);
if (present.length === 0) {
  console.log('\nStarter only: none of the four build files exist yet. That is correct before the build.');
  finish();
}

// ---------- 2. Rules for every build file ----------
section('2. Rules for every build file');
for (const file of BUILD_FILES) check(file + ' exists', has(file), 'The ' + (file === 'sprites.js' ? 'Art' : file === 'sounds.js' ? 'Sound' : 'Core') + ' subagent should have made this file.');
for (const file of present) {
  const code = read(file);
  check(file + ': no import / export / modules', !/^\s*(import|export)\s/m.test(code) && !/type\s*=\s*["']module/.test(code));
  check(file + ': no fetch, XMLHttpRequest or WebSocket', !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(code));
  check(file + ': no web addresses', !/https?:\/\//.test(code));
  check(file + ': no innerHTML (use textContent)', !/innerHTML/.test(code));
  check(file + ': no audio or image files', !/\.(mp3|wav|ogg|png|jpe?g|gif|webp|svg)\b/i.test(code));
  check(file + ': does not use the name "Flappy Bird"', !/flappy\s*bird/i.test(code));
}

// ---------- 3. Settings (config.js) ----------
let config;
if (has('config.js')) {
  section('3. Settings (config.js)');
  try {
    const page = makePage([['config.js', read('config.js')]]);
    config = page.sandbox.GAME_CONFIG;
  } catch (error) { check('config.js runs without errors', false, error.message); }
  check('config.js sets window.GAME_CONFIG to an object', config && typeof config === 'object');
  if (config && typeof config === 'object') {
    for (const [key, type] of Object.entries(SETTINGS)) check('setting "' + key + '" is a ' + type, typeof config[key] === type && config[key] !== null);
    const numbers = Object.keys(SETTINGS).filter((k) => SETTINGS[k] === 'number');
    check('every number is above 0', numbers.every((k) => typeof config[k] === 'number' && config[k] > 0));
    check('title is 1 to 30 characters', typeof config.title === 'string' && config.title.trim().length >= 1 && config.title.length <= 30);
    check('fix is one of: ' + FIXES.join(', '), FIXES.includes(config.fix), 'got: ' + JSON.stringify(config.fix));
    const birdSize = config.birdSize;
    const gapOk = (gap) => typeof gap === 'number' && gap >= birdSize * 3 && gap <= birdSize * 6;
    check('pipeGap is 3 to 6 times birdSize', gapOk(config.pipeGap), 'pipeGap ' + config.pipeGap + ', birdSize ' + birdSize);
    const modes = config.modes || {};
    check('modes.easy and modes.normal both have pipeGap and pipeSpeed', modes.easy && modes.normal && ['pipeGap', 'pipeSpeed'].every((k) => typeof modes.easy[k] === 'number' && typeof modes.normal[k] === 'number'));
    if (modes.easy && modes.normal) {
      check('easy gap is at least the normal gap, and both are 3 to 6 times birdSize', modes.easy.pipeGap >= modes.normal.pipeGap && gapOk(modes.easy.pipeGap) && gapOk(modes.normal.pipeGap));
    }
    check('the ground leaves room to fly (groundHeight under 25% of canvasHeight)', config.groundHeight < config.canvasHeight * 0.25);
  }
}

// ---------- 4. Art (sprites.js) ----------
if (has('sprites.js')) {
  section('4. Art (sprites.js)');
  let sprites;
  try {
    const page = makePage([['sprites.js', read('sprites.js')]]);
    sprites = page.sandbox.SPRITES;
  } catch (error) { check('sprites.js runs without errors', false, error.message); }
  check('sprites.js sets window.SPRITES', sprites && typeof sprites === 'object');
  if (sprites) {
    const calls = {
      drawBackground: [360, 640, 0], drawGround: [360, 640, 80, 37], drawBird: [90, 280, 34, -300], drawPipe: [200, 180, 330, 64, 560]
    };
    for (const name of ART_NAMES) {
      if (typeof sprites[name] !== 'function') { check(name + ' is a function', false); continue; }
      const log = { text: [], depth: 0 };
      const ctx = makeContext(log);
      let error = null;
      try {
        sprites[name](ctx, ...calls[name]);
        if (name === 'drawBackground') sprites[name](ctx, 360, 640, 12.5);
        if (name === 'drawBird') sprites[name](ctx, 90, 280, 34, 500);
      } catch (e) { error = e; }
      check(name + ' draws without errors', !error, error && error.message);
      check(name + ' uses save() and restore() in pairs', ctx.__depth === 0);
    }
  }
}

// ---------- 5. Sound (sounds.js) ----------
if (has('sounds.js')) {
  section('5. Sound (sounds.js)');
  let sounds;
  try {
    const page = makePage([['sounds.js', read('sounds.js')]]);
    sounds = page.sandbox.SOUNDS;
    if (sounds) {
      for (const name of SOUND_NAMES) {
        if (typeof sounds[name] !== 'function') { check(name + ' is a function', false); continue; }
        let error = null;
        try { sounds[name](); } catch (e) { error = e; }
        check(name + '() never crashes, even where sound is not available', !error, error && error.message);
      }
    }
  } catch (error) { check('sounds.js runs without errors', false, error.message); }
  check('sounds.js sets window.SOUNDS', sounds && typeof sounds === 'object');
}

// ---------- 6. Core (game.js): automatic play test ----------
if (has('game.js')) {
  section('6. Core (game.js): automatic play test');
  const gameCode = read('game.js');
  const scripts = [['game.js', gameCode]];
  check('game.js starts with window.CLONE_WARS_GAME = true', /window\.CLONE_WARS_GAME\s*=\s*true/.test(gameCode));
  check('game.js reads reduced motion with the exact spelling', gameCode.includes("'(prefers-reduced-motion: reduce)'") || gameCode.includes('"(prefers-reduced-motion: reduce)"'));

  const liveConfig = config && typeof config === 'object' ? config : undefined;
  const rec = makeRecorders();
  let page;
  try {
    page = makePage(scripts, { config: liveConfig, sprites: rec.sprites, sounds: rec.soundFns, onFrameStart: rec.reset });
  } catch (error) {
    check('game.js loads without errors', false, error.message);
  }

  if (page) {
    const settings = Object.assign({ canvasWidth: 360, canvasHeight: 640, groundHeight: 80, birdSize: 34, pipeGap: 150 }, liveConfig || {});
    const skyBottom = settings.canvasHeight - settings.groundHeight;
    const run = (label, fn) => { try { return fn(); } catch (error) { check(label + ': the game hit an error and stopped', false, error.message); return undefined; } };

    run('game.js loads without errors', () => check('game.js loads without errors', true));
    check('the game asks for animation frames', page.hasLoop());

    run('Ready screen', () => {
      page.step(30);
      check('Ready screen: the bird is drawn', !!rec.frame.bird);
      check('Ready screen: no pipes yet', rec.frame.pipes.length === 0);
      check('Ready screen: the overlay is showing', page.elements.overlay.hidden === false);
      check('Ready screen: the title shows', page.elements['overlay-title'].textContent.trim().length > 0);
    });

    run('Start', () => {
      const before = rec.frame.bird ? rec.frame.bird.y : null;
      page.key('Space');
      page.step(10);
      check('Space starts the game (overlay hides)', page.elements.overlay.hidden === true);
      check('Space starts the game (the bird moves)', rec.frame.bird && before !== null && Math.abs(rec.frame.bird.y - before) > 1);
      check('a pipe appears right after starting', rec.frame.pipes.length >= 1);
      check('starting plays the flap sound', rec.sounds.flap >= 1);
    });

    run('Crash', () => {
      let frames = 0;
      while (rec.sounds.crash === 0 && frames < 60 * 6) { page.step(1); frames += 1; }
      check('with no flaps, the bird crashes within 6 seconds', rec.sounds.crash === 1, 'crash sound played ' + rec.sounds.crash + ' times');
      check('game over shows the overlay again', page.elements.overlay.hidden === false);
      check('game over announces the score for screen readers', /Game over/i.test(page.elements.sr.textContent) && /\d/.test(page.elements.sr.textContent));
      page.step(2);
      check('the crash sound plays only once', rec.sounds.crash === 1);
    });

    run('Restart', () => {
      page.key('Space');
      page.step(2);
      check('pressing right after a crash does not restart yet', page.elements.overlay.hidden === false);
      page.step(30);
      page.key('Space');
      page.step(3);
      check('pressing after half a second restarts right away', page.elements.overlay.hidden === true);
      check('restart clears the old pipes', rec.frame.pipes.length === 1);
    });

    run('Mute', () => {
      const flaps = rec.sounds.flap;
      page.key('KeyM');
      page.key('Space');
      page.step(2);
      check('M turns sound off', rec.sounds.flap === flaps);
      page.key('KeyM');
      page.key('Space');
      page.step(2);
      check('M turns sound back on', rec.sounds.flap === flaps + 1);
    });

    run('Autopilot', () => {
      // Flies for 45 seconds, flapping whenever the bird drops below the next gap.
      let badGap = null;
      let crashes = rec.sounds.crash;
      let waitAfterCrash = 0;
      for (let i = 0; i < 60 * 45; i += 1) {
        page.step(1);
        const bird = rec.frame.bird;
        if (!bird) continue;
        for (const pipe of rec.frame.pipes) {
          if (pipe.gapTop < 0 || pipe.gapBottom > skyBottom + 0.5 || pipe.gapBottom - pipe.gapTop < settings.birdSize * 2.5) badGap = pipe;
        }
        if (rec.sounds.crash > crashes) { crashes = rec.sounds.crash; waitAfterCrash = 36; }
        if (waitAfterCrash > 0) { waitAfterCrash -= 1; if (waitAfterCrash === 0) page.key('Space'); continue; }
        const next = rec.frame.pipes.filter((p) => p.x + p.pipeWidth > bird.x - bird.size / 2).sort((a, b) => a.x - b.x)[0];
        const target = next ? next.gapBottom - bird.size * 1.35 : skyBottom * 0.5;
        if (bird.y > target && bird.velocity > 0) page.key('Space');
      }
      check('the autopilot scores at least 3 points in 45 seconds', rec.sounds.score >= 3, 'score sound played ' + rec.sounds.score + ' times');
      check('every pipe gap stays on screen and above the ground', !badGap, badGap && JSON.stringify(badGap));
      check('the score is drawn on the canvas', page.drawLog.text.some((t) => /^\d+$/.test(t.trim())));
      // Stop flapping so the bird crashes, then the best score should be saved.
      const crashesBefore = rec.sounds.crash;
      for (let i = 0; i < 60 * 5 && rec.sounds.crash === crashesBefore; i += 1) page.step(1);
      check('the best score is saved after a crash', Object.values(page.storage).some((v) => /^\d+$/.test(v) && parseInt(v, 10) > 0));
    });

    // Fix-specific checks
    const fix = liveConfig && liveConfig.fix;
    if (fix === 'easy-mode') {
      run('easy-mode', () => {
        const rec2 = makeRecorders();
        const p = makePage(scripts, { config: liveConfig, sprites: rec2.sprites, sounds: rec2.soundFns, onFrameStart: rec2.reset });
        const buttons = p.elements['fix-buttons'].children.filter((c) => c.tagName === 'BUTTON');
        check('easy-mode: two buttons appear', buttons.length === 2);
        const easy = buttons.find((b) => /easy/i.test(b.textContent));
        if (easy) {
          easy.fire('click', {});
          p.step(5);
          check('easy-mode: clicking a button does not start the game', p.elements.overlay.hidden === false);
          p.key('Space');
          p.step(3);
          const pipe = rec2.frame.pipes[0];
          check('easy-mode: Easy uses the easy gap', pipe && Math.abs((pipe.gapBottom - pipe.gapTop) - liveConfig.modes.easy.pipeGap) < 0.5, pipe && 'gap was ' + (pipe.gapBottom - pipe.gapTop));
        }
      });
    } else if (fix === 'gentle-start') {
      run('gentle-start', () => {
        const rec2 = makeRecorders();
        const p = makePage(scripts, { config: liveConfig, sprites: rec2.sprites, sounds: rec2.soundFns, onFrameStart: rec2.reset });
        p.step(2); p.key('Space'); p.step(3);
        const pipe = rec2.frame.pipes[0];
        check('gentle-start: the first pipe gap is 70 pixels wider', pipe && Math.abs((pipe.gapBottom - pipe.gapTop) - (liveConfig.pipeGap + 70)) < 0.5, pipe && 'gap was ' + (pipe.gapBottom - pipe.gapTop));
      });
    } else if (fix === 'checkpoints') {
      check('checkpoints: uses the contract code', /Math\.floor\(\s*score\s*\/\s*10\s*\)\s*\*\s*10/.test(gameCode));
    } else if (fix === 'custom') {
      console.log('  note  custom fix: play the game yourself to check it. The checker can\'t.');
    }

    run('Missing parts', () => {
      const p = makePage(scripts, {});
      p.step(5); p.key('Space'); p.step(120);
      const label = p.elements['missing-label'].textContent;
      check('with no settings, art or sound files, the game still runs', true);
      check('the missing label names settings, art and sound', /settings/.test(label) && /art/.test(label) && /sound/.test(label), 'label: ' + JSON.stringify(label));
    });
  }
}

finish();

// ---------- Optional: which files changed on this branch ----------
function filesCheck() {
  if (!process.argv.includes('--files')) return;
  section('7. Files changed on this branch');
  let changed = [];
  try {
    const mergeBase = (ref) => childProcess.execSync('git merge-base HEAD ' + ref, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    let base;
    try { base = mergeBase('origin/main'); } catch (error) { base = mergeBase('main'); }
    changed = childProcess.execSync('git diff --name-only ' + base + ' HEAD', { cwd: root }).toString().trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('  skip  not a git repo with a main branch');
    return;
  }
  const extra = changed.filter((f) => !BUILD_FILES.includes(f));
  check('only config.js, sprites.js, sounds.js and game.js changed', extra.length === 0, 'also changed: ' + extra.join(', '));
}

function finish() {
  filesCheck();
  console.log('\n' + passed + ' passed, ' + failed + ' failed.');
  if (failed === 0) console.log('All checks passed. Now play the game yourself.');
  process.exit(failed === 0 ? 0 : 1);
}
