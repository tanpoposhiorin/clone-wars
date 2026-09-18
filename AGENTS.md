# AGENTS.md · Rules for every agent in this repo

This repo is a Clone Wars build for Cal Poly Vibe Coding Club. A beginner (the **member**) directs a team: one **orchestrator** agent leads three **subagents** that build three parts of a game at the same time. Each subagent opens its **own** pull request. The member evaluates each one and combines them by merging them one at a time.

- If the member pasted the orchestrator prompt to you, you are the **orchestrator**. Read Part A.
- If the orchestrator started you with a job, you are a **subagent**. Read Part B.
- Everyone follows Part C.

The member is new to all of this. Talk in plain words. Short sentences. No jargon without a one-line explanation.

| Subagent | Branch | Files (only these) | Pull request title |
| --- | --- | --- | --- |
| **Core** | `clone-wars-core` | `game.js`, `config.js` | `Core: [Title]` |
| **Art** | `clone-wars-art` | `sprites.js` | `Art: [Title]` |
| **Sound** | `clone-wars-sound` | `sounds.js` | `Sound: [Title]` |

**Merge order for the member: Core, then Art, then Sound.**

---

## Part A · The orchestrator

You lead. You plan, start the subagents, check their work and make sure three pull requests exist. **You do not write `game.js`, `config.js`, `sprites.js` or `sounds.js` yourself** (the only exception is fallback 1 below). **You never combine the three parts into one pull request.** Combining is the member's job.

### Step 1 · Plan, then stop

1. Read `CONTRACT.md` and this file. Change nothing.
2. Check the member's **My version** block. If Title, Looks like, Sounds like or Plays differently is blank or still has square brackets like `[a name for your game]`, stop and ask the member to fill it in. Don't guess.
3. Reply with the plan in this exact shape, filled in with their version:

   > **Here's the plan for [Title].**
   >
   > **Three jobs that can run at the same time:**
   > 1. **Core** builds `game.js` and `config.js`: the game rules, the title "[Title]", and **how it plays differently**: [Plays differently].
   > 2. **Art** builds `sprites.js`: **how it looks**: [Looks like].
   > 3. **Sound** builds `sounds.js`: **how it sounds**: [Sounds like].
   >
   > **You changed three things about the game, and each builder builds one of them.**
   >
   > **Why they don't collide:** each job makes different files, in its own folder, on its own branch. They only share names from `CONTRACT.md`, like `drawBird` and `flap`.
   >
   > **The part that can't be split:** the crash check. It needs the bird and the pipes at the same moment, so the whole game loop stays with Core.
   >
   > **What you'll get back:** three pull requests, one from each builder. You'll check each one and merge them one at a time: **Core, then Art, then Sound.**
   >
   > Type **go** to start all three at once.

4. **Stop.** Do nothing else until the member types `go`.

### Step 2 · When the member types `go`

1. **Set up one folder per builder before you start anyone.** Builders that share one folder switch branches under each other and commit to the wrong branch. In the project folder, run:
   1. `git remote -v`. If there's no `origin`, run `git remote add origin [repo].git`. If `origin` is a different repository, stop and tell the member.
   2. `git fetch origin`
   3. `git worktree add .worktrees/core -b clone-wars-core origin/main`, then the same for `art` and `sound`. If a folder already exists, reuse it. If only the branch exists, leave out `-b`: `git worktree add .worktrees/core clone-wars-core`.

   A worktree is a separate folder with its own branch, made from the latest `main` on GitHub.
2. **Start all three subagents at the same time.** Do not wait for one to finish before starting the next. Use the model `gpt-5.6-luna` for every subagent. If that model isn't available, use the cheapest, fastest model you can.
3. Give each subagent exactly this, and nothing else:
   - "You are the [Core / Art / Sound] subagent. Read `AGENTS.md` Part B and Part C, and `CONTRACT.md`, in [repo]. Your folder is `[full path to .worktrees/core, art or sound]`. Work only there."
   - Its job section from Part B below, copied word for word.
   - The My version lines it uses (see the table in Part B).
4. Note the real clock time you started each one.
5. Tell the member: "Three subagents are working at the same time now. Each one will open its own pull request. This takes a few minutes." If your app shows subagent threads, tell the member where to see them.
6. Don't write any of their files while they work.

### Step 3 · Check each subagent's work

When all three are done, check each pull request **separately**:

1. **Stayed in its lane:** its pull request changes only its own files (see the table at the top). If it changed anything else, put that file back the way it is on `main`, on that branch.
2. **Names match `CONTRACT.md`:** look hardest at `GAME_CONFIG`, `SPRITES`, `SOUNDS`, `drawBackground`, `drawGround`, `drawBird`, `drawPipe`, `flap`, `score`, `crash`. One wrong letter and that part won't plug in.
3. **Optional, if you can run commands:** copy the four files into one scratch folder with the rest of the repo and run `node tests/check.cjs`. Put the result in your summary to the member. Never merge or combine branches to do this.
4. If one subagent failed, or its work breaks a rule, start **one fresh subagent** for that job only, in the same folder on the same branch, with the same instructions plus one sentence saying what was wrong. Do this **once**. Don't fix its code yourself. If it fails again, say so in the summary.

### Step 4 · Hand the member three pull requests

1. Make sure all three pull requests exist and none are merged. **Do not merge.**
2. Send the member this summary, filled in with real links and times:

   > **Your three builders are done.**
   >
   > How they ran: **at the same time** (or: **one after another**, because subagents weren't available here)
   >
   > | Builder | Pull request | Started | Finished | What it made |
   > | --- | --- | --- | --- | --- |
   > | Core | [link] | 12:36:05 | 12:39:40 | ... |
   > | Art | [link] | 12:36:06 | 12:38:10 | ... |
   > | Sound | [link] | 12:36:06 | 12:37:30 | ... |
   >
   > Checks: [result of node tests/check.cjs, or "not run"]
   >
   > **Now evaluate each builder and combine them. Merge one at a time: Core, then Art, then Sound.** Follow Step 5 in README.md.

   Use the real clock times. Never make them up. If you can't see exact times, write "not shown".

   Then add: "These times are from my own records. To check for yourself, hover over each pull request's 'opened' time on GitHub." 

### Fallbacks

1. **You can't start subagents here.** Do the three jobs yourself, **one after another**: Core, then Art, then Sound, following each job section exactly. Still use the three folders from Step 2, three branches and three pull requests. Tell the member: "Subagents aren't available here, so I did the three jobs one at a time. You still get three pull requests to check."
2. **Subagents can't use their own branches or open pull requests.** Have each subagent send you its finished files and report instead. Then you save each subagent's files in its folder from Step 2, commit and push each branch, and open the three pull requests using its report.
3. **You can't create pull requests.** Tell the member the three branch names and that they can open each one from their GitHub repo page with **Compare & pull request**, or **Pull requests → New pull request**.

### When the member is stuck and asks for help

Members are told to ask you first, before an officer. You can see their situation better than anyone in the room.

1. Read `README.md` and `docs/HELP.md` if you haven't.
2. Find the step they're on. If they didn't say, ask one short question.
3. Answer with **one small action at a time**: exactly what to click or type, using the button names from the README. Wait for them to say it worked before giving the next action.
4. If `docs/HELP.md` covers their problem, follow it, and tell them which section it came from.
5. Don't change any files while helping unless they ask you to.
6. If it needs an account, permission or portal fix you can't do, say: "This one needs an officer."

### When the member's build stopped because they ran out of usage

1. Look for work that already exists: the three branches, open or merged pull requests, or files in the chat.
2. Keep every builder whose work is done and follows `CONTRACT.md`. Start fresh subagents only for the missing builders (Part A, Step 2), then do Steps 3 and 4.
3. If nothing was saved, start again from Part A, Step 1.

### When the member sends a builder back: "fix core:", "fix art:" or "fix sound:"

The member evaluated one builder's work and something is wrong. They'll describe it.

1. Start **one fresh subagent** for that builder only, with its job section from Part B, its My version lines, and the member's words about what's wrong. Use `gpt-5.6-luna`.
2. **If that builder's pull request isn't merged yet:** the subagent works in that builder's folder (`.worktrees/[core / art / sound]`, set up as in Step 2 if it's missing) and fixes its files on the same branch, so the same pull request updates.
3. **If it's already merged:** run `git fetch origin`, then `git worktree add .worktrees/fix-[core / art / sound] -b clone-wars-fix-[core / art / sound] origin/main`. The subagent works in that folder and opens a pull request **into `main`** titled `Fix [Core / Art / Sound]: [what was wrong]`.
4. It changes only that builder's files. Every `CONTRACT.md` name stays the same.
5. Don't merge. Tell the member what changed and to check and merge it again.
6. This is that builder's **one** fix try. If Core is still broken, tell the member to use the answer key. If Art or Sound is still broken, tell the member to keep going and flag it to an officer after the meeting.

(If the member just types "fix it:", decide which builder the problem belongs to: how it plays is Core, how it looks is Art, how it sounds is Sound. Tell them which builder you're sending it back to.)

### When the member types "use the answer key"

1. Run `git fetch origin`, then `git worktree add .worktrees/answer-key -b answer-key origin/main`. Work only in that folder.
2. Read `game.js` from the public repo **https://github.com/KyleStefan/clone-wars-answer-key** (branch `main`).
3. Replace the member's `game.js` with it, **unchanged, every line.** If the member hasn't merged Core yet, also copy their Core branch's `config.js` onto this branch.
4. Look at `fix` in the member's `config.js`. If it's `'easy-mode'`, `'gentle-start'`, `'checkpoints'` or `'none'`, leave it. If it's `'custom'`, change it to `'none'` and tell the member: "The answer key doesn't include your own 'plays differently' idea, so the game plays like the original. Your title, how it looks and how it sounds are still yours."
5. Don't touch `sprites.js` or `sounds.js`.
6. Open a pull request **into `main`** titled `Use the answer key`. Don't merge. Tell the member to merge it in place of Core, then keep going with Art and Sound.

If you can't read the other repo, tell the member to follow **Use the answer key by hand** in `docs/HELP.md`.

### When the member asks for any other change

Anything after the first build: a new feature, a tweak, a bug they found.

1. Run `git fetch origin`. **Always start from the latest `main` on GitHub.** Never start from a builder branch or from whatever is checked out, even if earlier work in this chat used one.
2. Tell the member your plan and which files you'll change. Stop until they type `go`.
3. Pick a short branch name. Run `git worktree add .worktrees/[name] -b [name] origin/main` and work only in that folder.
4. Test, commit, push, and open **one** pull request **into `main`** (for example, `--base main`). Don't merge.
5. Tell the member: "Before you merge, check that the pull request says it merges **into main**."

---

## Part B · The subagents

| Subagent | Branch | Your files (create or change only these) | My version lines you use |
| --- | --- | --- | --- |
| **Core** | `clone-wars-core` | `game.js`, `config.js` | Title, Plays differently |
| **Art** | `clone-wars-art` | `sprites.js` | Looks like |
| **Sound** | `clone-wars-sound` | `sounds.js` | Sounds like (and Looks like, if Sounds like says "whatever fits") |

Work only in the folder the orchestrator gave you. It's already on your branch, made from `main`. Never switch branches there, and never work in the main project folder. No folder? Stop and ask the orchestrator for one. The other two subagents are working at the same time in their own folders. You will not see their files. **That is normal. Never create another subagent's files.** Trust `CONTRACT.md`.

**Every subagent finishes the same way:**

1. From your folder, commit only your files and push your branch.
2. Open a pull request from your branch to `main`, titled `[Core / Art / Sound]: [Title]`, with this description:

   ```
   ## What I built
   (2 or 3 plain sentences a beginner understands)

   ## How I used your version
   (which My version lines I used, and how)

   ## Files I changed
   (your files only)

   ## Started / Finished
   (real clock times, or "not shown")

   ## How to check my work after you merge
   (copy the check for your builder from README.md Step 5)
   ```

3. **Never merge.** Report back to the orchestrator: the pull request link, your start and finish times, and anything you're unsure about.

### Core subagent job

1. Read `CONTRACT.md` sections 1, 4 and 5 all the way through.
2. Create `config.js`: set `window.GAME_CONFIG` with every name in the Settings table. `title` is the member's Title. `fix` comes from **Plays differently**, using the table in section 1. Keep the Normal values unless the member's Plays differently line says otherwise.
3. Create `game.js`: build the game so it checks **every box** in section 4. **Where a box shows code, copy that code exactly.** Build the change from section 5 that matches `fix`.
4. Before you finish, reread section 4 one box at a time. Fix any box you missed.
5. `sprites.js` and `sounds.js` won't exist on your branch. That's normal. The game must still run with its placeholder boxes and no sound.
6. Finish the way every subagent finishes (above). Branch `clone-wars-core`, title `Core: [Title]`.

### Art subagent job

1. Read `CONTRACT.md` section 2 all the way through.
2. Create `sprites.js`: set `window.SPRITES` with the four drawing functions, exact names and inputs.
   - `drawBackground` and `drawGround`: the place in the member's **Looks like** line. Simple, bold shapes and silhouettes, not tiny details.
   - `drawBird`: the character in **Looks like** ("I play as..."), fitting in the `size` box. No character named? Pick one that fits the place.
   - `drawPipe`: the obstacles in **Looks like** (skyscrapers, palm trees, laser gates). None named? Pick ones that fit the place. They must fill exactly the pipe rectangles.
3. Check readability: the character and obstacles need dark outlines and colors that stand out from the sky.
4. Finish the way every subagent finishes (above). Branch `clone-wars-art`, title `Art: [Title]`.

### Sound subagent job

1. Read `CONTRACT.md` section 3 all the way through.
2. Create `sounds.js`: set `window.SOUNDS` with `flap`, `score` and `crash`, using the exact `getAudio` helper. Make each sound match the member's **Sounds like** line. If it says "whatever fits" or doesn't cover a sound, match the **Looks like** line.
3. Keep every sound under 0.5 seconds and quiet (gain 0.2 or less).
4. Finish the way every subagent finishes (above). Branch `clone-wars-sound`, title `Sound: [Title]`.

---

## Part C · Rules for everyone

- **Stay in your files.** Never edit `index.html`, `README.md`, `CONTRACT.md`, `AGENTS.md`, `docs/`, `tests/`, `.nojekyll`, or another agent's files.
- **Use the `CONTRACT.md` names exactly:** same spelling, same capital letters, same inputs in the same order.
- **Plain files only.** Classic scripts that set `window` globals. No `import`, `export`, modules, frameworks, packages or build steps.
- **Nothing from the internet.** No `fetch`, no web addresses, no API keys, no image files, no audio files, no web fonts.
- **No `innerHTML`.** Use `textContent`.
- **No brands or real people.** Don't use the words "Flappy Bird", logos, or real people's names or faces. If "Looks like" or "Sounds like" names a movie, show or game, match the vibe with original designs: no named characters, famous ships, logos or theme songs.
- **One folder per branch.** Never switch branches in the main project folder or in another agent's folder. Every pull request goes **into `main`**.
- **Never merge.** The member merges, one pull request at a time.
- **Never read or copy the answer key** unless the member typed "use the answer key".
- **If something is unclear, stop and ask.** Don't guess.
