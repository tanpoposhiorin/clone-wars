# CONTRACT.md · The shared plan

Three subagents build three parts of one game **at the same time**. They never talk to each other. This file is the only reason their parts fit together. Every agent reads it first.

Think of three friends building one Lego car in three different rooms. If they agree on the exact size of the wheels and the axle before they start, the car snaps together at the end. This file is that agreement.

> **Members:** you don't need to read the code in this file. It's here so the agents get the tricky parts right on the first try. Read the two short sections at the bottom: **What can't be split** and **The answer key**.

| Subagent | Makes these files | Uses these lines from "My version" |
| --- | --- | --- |
| **Core** | `game.js`, `config.js` | Title, Plays differently |
| **Art** | `sprites.js` | Looks like |
| **Sound** | `sounds.js` | Sounds like |

Nobody edits `index.html`. It is the frame that loads the four files in this order: `config.js`, `sprites.js`, `sounds.js`, `game.js`.

---

## 1 · Settings: `config.js` (Core subagent)

`config.js` sets `window.GAME_CONFIG` to an object with **exactly** these names. All sizes are canvas pixels. All times are seconds.

| Name | What it means | Normal value |
| --- | --- | --- |
| `title` | The game's name from "My version". 1 to 30 characters. | `'Flap Clone'` |
| `fix` | Which fix is built. One of: `'none'`, `'easy-mode'`, `'gentle-start'`, `'checkpoints'`, `'custom'` | `'none'` |
| `canvasWidth` | Width of the game's drawing area | `360` |
| `canvasHeight` | Height of the game's drawing area | `640` |
| `gravity` | How fast the bird speeds up while falling (pixels per second, per second) | `1400` |
| `flapStrength` | Upward speed right after a flap (pixels per second). Positive number. | `420` |
| `birdSize` | Width and height of the bird's box | `34` |
| `pipeWidth` | Width of each pipe | `64` |
| `pipeGap` | Open space between top and bottom pipe. Must be 3 to 6 times `birdSize`. | `150` |
| `pipeSpacing` | Distance from one pipe's left edge to the next pipe's left edge | `260` |
| `pipeSpeed` | How fast pipes slide left (pixels per second) | `150` |
| `groundHeight` | Height of the ground strip. Under 25% of `canvasHeight`. | `80` |
| `modes` | Two difficulty levels, shown below | |

```js
modes: {
  easy:   { pipeGap: 190, pipeSpeed: 110 },
  normal: { pipeGap: 150, pipeSpeed: 150 }
}
```

Rules: `modes.easy.pipeGap` is at least `modes.normal.pipeGap`. Every gap is 3 to 6 times `birdSize`.

**Picking `fix` from "Plays differently":**

| Member wrote something like | `fix` |
| --- | --- |
| Easy/Normal buttons, easy mode, pick your difficulty | `'easy-mode'` |
| Easier first 3 obstacles, gentle start, not so hard at the beginning | `'gentle-start'` |
| Checkpoints every 10 points, don't start over from zero | `'checkpoints'` |
| Anything else | `'custom'` |
| Nothing, or "no change" | `'none'` |

---

## 2 · Art: `sprites.js` (Art subagent)

`sprites.js` sets `window.SPRITES` to an object with **exactly** these four functions. `ctx` is the canvas 2D drawing context. Draw everything with canvas shapes: no image files, no fonts, no emoji.

| Function | What it draws |
| --- | --- |
| `drawBackground(ctx, width, height, time)` | The whole canvas: sky and scenery from the place in "Looks like". `time` is seconds since the page loaded. The game sends `0` when the player wants less motion, so the picture must look complete at `time = 0`. |
| `drawGround(ctx, width, height, groundHeight, offset)` | The ground strip from `y = height - groundHeight` to `y = height`. `offset` is how many pixels the ground has scrolled. Use it to slide a pattern left. |
| `drawBird(ctx, x, y, size, velocity)` | The character from "Looks like" ("I play as..."), centered on `x, y`, fitting inside a `size` by `size` box. `velocity` is negative going up, positive falling. You may tilt it. |
| `drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height)` | One pair of obstacles. `x` is the left edge. The top one fills `y = 0` to `y = gapTop`. The bottom one fills `y = gapBottom` to `y = height`. `height` is the top of the ground, not the full canvas. |

Rules for every drawing function:

- **Change the picture, not the rules.** Obstacles can look like anything (skyscrapers, palm trees, asteroids), but they must fill the same rectangle the game crashes you on. Nothing may stick out into the gap.
- **Readable:** the character and the obstacles must stand out clearly from the background. Give both a dark outline at least 2 pixels wide. A dark obstacle on a dark sky is a bug.
- Only draw. Don't read the clock, the page, `GAME_CONFIG`, `matchMedia` or random numbers. Use only the inputs you are given.
- Start every function with `ctx.save();` and end it with `ctx.restore();`.
- No logos, no real people, no brand names. No characters, ships or creatures from movies, TV or games, and don't use their names. Match the vibe with your own designs: "a small starfighter" is fine, a famous named ship is not.

---

## 3 · Sound: `sounds.js` (Sound subagent)

`sounds.js` sets `window.SOUNDS` to an object with **exactly** these three functions. Each one plays one short sound made with the Web Audio API. No audio files.

| Function | When the game calls it |
| --- | --- |
| `flap()` | Every flap, including the first one that starts a game |
| `score()` | Every time a pipe is passed |
| `crash()` | Once, when the game ends |

Rules:

- Make each sound match the member's "Sounds like" line (a seagull squawk, a subway ding, a laser pew). If it says "whatever fits", match "Looks like".
- Never play a melody from an existing song, movie, TV show or game (no theme songs). Short original beeps and effects only.
- Create the audio context the first time a sound plays, never when the page loads. Use this helper exactly:

  ```js
  let audio = null;
  function getAudio() {
    if (!audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audio = new AudioCtx();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }
  ```

- Every sound is under 0.5 seconds. Volume (gain) never above `0.2`.
- Wrap the inside of every function in `try { } catch (error) { }` so a sound can never crash the game.
- Wrap the whole file in `(function () { ... })();` so its helper names don't clash with the game.

---

## 4 · Core checklist: `game.js` (Core subagent)

`game.js` holds the whole game. Check every box. **Where a box shows code, copy that code exactly.**

**Start**

- [ ] The first line of code is `window.CLONE_WARS_GAME = true;` (this hides the starter page).
- [ ] Plain script. No `import`, `export` or modules.

**Settings**

- [ ] `DEFAULTS` holds every name and Normal value from the Settings table, including `modes`. Then:

  ```js
  const CONFIG = Object.assign({}, DEFAULTS, window.GAME_CONFIG || {});
  ```

**Missing parts** (so the game plays even before the other files exist)

- [ ] Build the missing list and label with exactly this code:

  ```js
  const ART_NAMES = ['drawBackground', 'drawGround', 'drawBird', 'drawPipe'];
  const SOUND_NAMES = ['flap', 'score', 'crash'];
  const missing = [];
  if (!window.GAME_CONFIG) missing.push('settings');
  else for (const key of Object.keys(DEFAULTS)) { if (!(key in window.GAME_CONFIG)) missing.push(key); }
  if (!window.SPRITES) missing.push('art');
  else for (const name of ART_NAMES) { if (typeof window.SPRITES[name] !== 'function') missing.push(name); }
  if (!window.SOUNDS) missing.push('sound');
  else for (const name of SOUND_NAMES) { if (typeof window.SOUNDS[name] !== 'function') missing.push(name); }
  document.getElementById('missing-label').textContent = missing.length ? 'placeholder: ' + missing.join(', ') + ' missing' : '';
  ```

- [ ] Write four placeholder drawing functions (`placeholderBackground`, `placeholderGround`, `placeholderBird`, `placeholderPipe`) that draw plain colored rectangles with the same inputs as the Art table.
- [ ] Pick each drawing function one at a time with exactly this pattern (all four):

  ```js
  const drawBird = (window.SPRITES && typeof window.SPRITES.drawBird === 'function') ? window.SPRITES.drawBird : placeholderBird;
  ```

- [ ] Play sounds only through this function, with exactly this code:

  ```js
  let muted = false;
  function play(name) {
    if (muted) return;
    const sound = window.SOUNDS && window.SOUNDS[name];
    if (typeof sound === 'function') { try { sound(); } catch (error) {} }
  }
  ```

**Page** (these elements already exist in `index.html`)

| Element id | What it's for |
| --- | --- |
| `game` | The canvas. Set `canvas.width = CONFIG.canvasWidth;` and `canvas.height = CONFIG.canvasHeight;` |
| `overlay` | The box over the game on the Ready and Game over screens. Show it with `overlay.hidden = false;`, hide it with `overlay.hidden = true;` |
| `overlay-title` | Big text: `CONFIG.title` on Ready, `'Game over'` on Game over |
| `overlay-text` | Lines under the title. Join lines with `'\n'` and set `.textContent` |
| `fix-buttons` | Empty box for buttons a "plays differently" change adds |
| `missing-label` | The missing-parts label |
| `sr` | Hidden text for screen readers |

- [ ] Get them with exactly this code:

  ```js
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.width = CONFIG.canvasWidth;
  canvas.height = CONFIG.canvasHeight;
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayText = document.getElementById('overlay-text');
  const fixButtons = document.getElementById('fix-buttons');
  const sr = document.getElementById('sr');
  ```

- [ ] Always use `.textContent`. Never `innerHTML`.

**Screens**

There are three states: `'ready'`, `'playing'`, `'gameover'`. The page starts in `'ready'` with the overlay showing.

- [ ] **Ready:** title is `CONFIG.title`. Text lines: `Press Space, click or tap to start.` and `Press M to turn sound off.` (or `on.` when muted).
- [ ] **Playing:** overlay hidden. The score is drawn on the canvas, centered near the top, white with a dark outline. Canvas only, never as HTML text.
- [ ] **Game over:** title `Game over`. Text lines: `Score N   ·   Best N`, then `Press Space, click or tap to play again.`, then the sound line.
- [ ] Every Space, Enter, click or tap calls `press()`. Use exactly this code:

  ```js
  function press() {
    if (state === 'ready') startGame();
    else if (state === 'playing') { velocity = -CONFIG.flapStrength; play('flap'); }
    else if (state === 'gameover' && secondsSinceCrash >= 0.4) startGame();
  }
  ```

- [ ] `startGame()` sets `state = 'playing'`, puts the bird back at the middle of the sky, sets `velocity = -CONFIG.flapStrength`, empties `pipes`, sets `pipesMade = 0`, `groundOffset = 0`, `lastGapTop` to the middle of the sky, `score = checkpoint`, `secondsSinceCrash = 0`, hides the overlay, and calls `play('flap')`. (`checkpoint` starts at `0` and only changes with the checkpoints fix.)

**Input**

- [ ] Use exactly this code:

  ```js
  window.addEventListener('keydown', (event) => {
    if (event.target && event.target.closest && event.target.closest('button')) return;
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      press();
    } else if (event.code === 'KeyM') {
      muted = !muted;
      if (state === 'ready') showReady();
      if (state === 'gameover') showGameOver();
    }
  });
  window.addEventListener('pointerdown', (event) => {
    if (event.target && event.target.closest && event.target.closest('button')) return;
    press();
  });
  ```

**Movement** (every frame, while playing)

- [ ] `seconds` is the time since the last frame, capped at `0.05`.
- [ ] `velocity += CONFIG.gravity * seconds;` then `y += velocity * seconds;`
- [ ] The bird stays at `const birdX = CONFIG.canvasWidth / 4;`
- [ ] `groundOffset += pipeSpeed * seconds;` and send it as `offset` to `drawGround`.
- [ ] Pick this frame's gap and speed with exactly this code:

  ```js
  const mode = CONFIG.fix === 'easy-mode' ? CONFIG.modes[currentMode] : CONFIG;
  const pipeGap = mode.pipeGap;
  const pipeSpeed = mode.pipeSpeed * (CONFIG.fix === 'gentle-start' && score < 3 ? 0.75 : 1);
  ```

  (`currentMode` starts as `'normal'`.)

**Pipes**

- [ ] A new game starts with **zero** pipes. Add pipes with exactly this code:

  ```js
  if (pipes.length === 0) addPipe(pipeGap);
  else if (pipes[pipes.length - 1].x <= CONFIG.canvasWidth - CONFIG.pipeSpacing) addPipe(pipeGap);
  ```

- [ ] `addPipe` is exactly:

  ```js
  function addPipe(pipeGap) {
    const gap = pipeGap + (CONFIG.fix === 'gentle-start' && pipesMade < 3 ? 70 : 0);
    const lowest = CONFIG.canvasHeight - CONFIG.groundHeight - 60 - gap;
    const gapTop = Math.max(60, Math.min(lowest, lastGapTop + (Math.random() * 360 - 180)));
    const gapBottom = gapTop + gap;
    lastGapTop = gapTop;
    pipes.push({ x: CONFIG.canvasWidth, gapTop: gapTop, gapBottom: gapBottom, scored: false });
    pipesMade += 1;
  }
  ```

- [ ] Every pipe moves left: `pipe.x -= pipeSpeed * seconds;`. Remove pipes once `pipe.x + CONFIG.pipeWidth <= 0`.

**Score**

- [ ] Exactly: `if (!pipe.scored && pipe.x + CONFIG.pipeWidth < birdX) { pipe.scored = true; score += 1; play('score'); }`
- [ ] Best score: read it once at the start with `try { bestScore = parseInt(localStorage.getItem('cloneWarsBest'), 10) || 0; } catch (error) {}` and save it in `crash()` inside `try { } catch (error) { }`.

**Crash**

- [ ] The bird's box is `birdSize` wide and tall, centered on `birdX, y`. Game over when it touches the ground (`y + birdSize / 2 >= canvasHeight - groundHeight`), the top (`y - birdSize / 2 <= 0`), or a pipe's top or bottom rectangle.
- [ ] `crash()` sets `state = 'gameover'`, `secondsSinceCrash = 0`, calls `play('crash')` once, saves the best score, sets `checkpoint = CONFIG.fix === 'checkpoints' ? Math.floor(score / 10) * 10 : 0;`, sets `sr.textContent` to `Game over. Score N. Best N.`, and shows the Game over screen.
- [ ] While in `'gameover'`, `secondsSinceCrash += seconds;` every frame.

**Drawing order, every frame, in every state**

`drawBackground`, then `drawPipe` for each pipe, then `drawGround`, then `drawBird`, then the score (only while playing). Then `requestAnimationFrame(frame);`

- [ ] `drawPipe` gets `height = CONFIG.canvasHeight - CONFIG.groundHeight`.
- [ ] Reduced motion. Copy this line exactly (the word is "reduced," with a d): `const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` When it's true, send `time = 0` to `drawBackground`.

**Last lines of the file**

```js
showReady();
requestAnimationFrame(frame);
```

**Don'ts**

- [ ] No `fetch`, web addresses, image or audio files, `innerHTML`.
- [ ] The words "Flappy Bird" appear nowhere in any file.

---

## 5 · Plays differently (Core subagent)

Build only the change that matches `CONFIG.fix`.

- **`'easy-mode'`:** the Movement code above already switches gaps and speeds. Also add two buttons, **Easy** and **Normal**, into `#fix-buttons`, with exactly this code:

  ```js
  if (CONFIG.fix === 'easy-mode') {
    for (const mode of ['easy', 'normal']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = mode === 'easy' ? 'Easy' : 'Normal';
      button.setAttribute('aria-pressed', String(mode === currentMode));
      button.addEventListener('click', (event) => {
        currentMode = mode;
        for (const other of fixButtons.querySelectorAll('button')) {
          other.setAttribute('aria-pressed', String(other === event.currentTarget));
        }
        event.currentTarget.blur();
      });
      fixButtons.appendChild(button);
    }
  }
  ```

- **`'gentle-start'`:** already handled by the Movement and `addPipe` code above (first 3 gaps 70 pixels wider, pipes at 75% speed until the score reaches 3). Nothing else to add.
- **`'checkpoints'`:** already handled by `crash()` and `startGame()` above. Also add the line `Next game starts at checkpoint N.` to the Game over text when `checkpoint > 0`.
- **`'custom'`:** build the member's fix inside `game.js` in the smallest way that works. Keep every box above working. Say in your report exactly what you built.

---

## What can't be split, and why

The game loop and the crash check **cannot** be split between agents.

Every frame, the game moves the bird, moves the pipes, then asks "are they touching?" That question needs the bird and the pipes **at the same moment**. If one agent built bird movement and another built pipe movement, neither could write the crash check, and both would be editing the same loop and overwriting each other. So the loop, movement, pipes, crash and score all live in one file, built by one agent: Core.

What **can** be split: the art and the sound. The game only needs their **names** from this file (`drawBird`, `flap`), not how they were made. So Art and Sound work at the same time as Core.

**Rule of thumb:** if two parts need each other every single frame, keep them together. If one part only needs the other's name, split them.

---

## The answer key

The Core subagent builds `game.js` from scratch, and it's the file most likely to break. The club keeps a working `game.js` in a separate repo, the answer key: **https://github.com/KyleStefan/clone-wars-answer-key**

Because it follows this exact plan, you can swap in its `game.js` and your `config.js`, `sprites.js` and `sounds.js` still plug in. You keep your title, how it looks, how it sounds, and how it plays if you picked from the list. You lose only your own `'custom'` idea.

Agents: **never read or copy the answer key unless the member types "use the answer key."** See `AGENTS.md` for the swap steps.
