# Clone Wars · Session 03

You'll clone a Flappy Bird-style game and make it yours by changing how it **looks**, **sounds** and **plays**. A team of Codex agents builds it. You review their work, combine it, and publish it at your own link. About 40 minutes.

**The workflow:** verify access → brief the team → review each pull request → merge one at a time → check Actions → test the live link → fix problems with [docs/HELP.md](docs/HELP.md).

Stuck? Ask your AI first ([how](#troubleshooting)), then check [docs/HELP.md](docs/HELP.md).

---

## What you are building

A one-page game that plays at your own live link. You choose four things:

| Choice | Example |
| --- | --- |
| **Title** | Galaxy Flap |
| **Looks like** | Star Wars-inspired: a desert planet with two suns, laser gates as obstacles. I fly a small starfighter. |
| **Sounds like** | a laser pew, a hyperspace whoosh, an explosion |
| **Plays differently** | Lasers shoot from the right side of the screen to the left at different heights, and I have to dodge them. |

### The Codex team

- **Team lead (the orchestrator):** the main Codex agent you talk to. It plans the work, starts the builders, checks their work and gives you the pull-request links.
- **Builders (the sub-agents):** three helper agents. Each one has one job, works on its own branch, and opens its own pull request.
- **You:** review each pull request, merge it and test it. **Nobody merges but you.** Builders never merge their own work.

| Builder | Builds | Files it may change | Handles |
| --- | --- | --- | --- |
| **Core** | How the game works | `game.js`, `config.js` | Starting the game, player movement, moving obstacles, scoring, collisions and crashing, the title, your gameplay change, the mute key |
| **Art** | How it looks | `sprites.js` | The background, your character, how the obstacles look, making everything easy to see |
| **Sound** | How it sounds | `sounds.js` | The flap, score and crash sounds |

**Why they can work at the same time:** each builder changes different files, and they agree on shared names ahead of time in `CONTRACT.md` (like `drawBird`). The one part that can't be split is the **crash check**. It needs the player and the obstacles at the same moment, so it stays with Core.

### Two links: don't mix them up

| Link | Looks like | What it's for |
| --- | --- | --- |
| **Repository link** | `https://github.com/YOUR-USERNAME/clone-wars` | Where your files live. **Give this one to Codex.** |
| **Live link** | `https://YOUR-USERNAME.github.io/clone-wars/` | Your playable game. **Submit this one to the portal.** |

### Two different things: GitHub access and your local project

These sound the same and aren't. You need both.

| | What it is | Set up in |
| --- | --- | --- |
| **GitHub access** | Permission for Codex to look at your repository on github.com. | [Step 1b](#1b-start-a-new-codex-project-called-clone-wars) |
| **Your local Codex project** | The folder on your computer where Codex runs commands and edits files. | [Step 1c](#1c-put-the-files-in-your-local-codex-project) |

**Use this template copies the files on GitHub. It does not fill your local project folder.** That folder can still be completely empty after GitHub access is working, and connecting the GitHub app does not fill it either. Step 1c is where the files land on your computer.

---

## Before you start

- A **GitHub account** ([github.com](https://github.com)).
- **Codex**, signed in with a **personal** email. Your `calpoly.edu` email and the school Codex account won't work today. ([Help](docs/HELP.md#4-the-github-connector-is-unavailable))
- In Codex's model picker, **GPT-5.6 Luna** (or the cheapest, fastest model). Bigger models use up your limit fast.

In the room and not set up? Follow along on a neighbor's screen, then build yours after the meeting with this page.

---

## Step 1: Create your repository and connect GitHub

### 1a. Create your repository

1. Open the club template: **https://github.com/KyleStefan/clone-wars-flappy-bird**
2. Click **Use this template** → **Create a new repository**.
3. **Owner:** your account. **Repository name:** `clone-wars`. Choose **Public**. Click **Create repository**.
4. Check the address bar. It must say `github.com/YOUR-USERNAME/clone-wars`. If it says `KyleStefan`, you're still on the club template. ([Help](docs/HELP.md#6-i-used-the-club-template-instead-of-my-own-repository))

**The name must be exactly `clone-wars`.** Every command, prompt and permission in this guide uses that name, and a different name is the most common reason pull requests fail later. Already named it something else? Open your repository → **Settings** → **General** → **Repository name**, change it to `clone-wars`, and click **Rename**. No need to make a new one.

**Leave "Include all branches" off.** You still get the default branch and every file in it. Turning it on only copies extra branches you don't need.

### 1b. Start a new Codex project called Clone Wars

**Make a new project. Don't reuse an old one.** An old project is still tied to whatever repository you used it for last, and Codex will quietly work on that one instead of yours. A new project starts connected to nothing.

1. In Codex, create a **new project** and name it **Clone Wars**.
2. Connect it to **GitHub**. Connecting for the first time? In Codex, click **Plugins**, search for **GitHub**, and connect it there. Give it access to **only this repository**, not every repository in your account.
3. Work in that project for the rest of today.

**Already connected GitHub to Codex before?** On GitHub, click your profile picture → **Settings** → **Applications** → **Installed GitHub Apps** → the ChatGPT/Codex app → **Configure**. Under **Repository access**, choose **Only select repositories**, add **clone-wars**, and click **Save**.

This gives Codex permission to **view** your repository. It does not put the files on your computer. That's the next step.

### 1c. Put the files in your local Codex project

Your repository on GitHub has the files. Your local Codex project may still be empty. This step connects the two.

Open the **Terminal** in your Codex project and run these two commands:

```text
git remote -v
git status --short --branch
```

- **`git remote -v`** shows the **remote**: the GitHub repository your local folder talks to. You want two lines naming `YOUR-USERNAME/clone-wars`.
- **`git status --short --branch`** shows which **branch** you're on. A branch is one line of work, and `main` is the default one. You want `## main...origin/main`.

If both look right and you can see the template files in the project, this step is done.

**Folder empty, no remote listed, or it says "No commits yet"?** Run these three, with your GitHub username in place of `YOUR-USERNAME`:

```text
git remote add origin https://github.com/YOUR-USERNAME/clone-wars.git
git fetch origin
git switch -c main --track origin/main
```

`git fetch` downloads your repository's files from GitHub. The last command **checks out** `main`, which means your folder now shows that branch's files.

**Says `origin` already exists, or `git remote -v` names the wrong repository?** Point it at yours, then run the `git fetch` and `git switch` commands above again:

```text
git remote set-url origin https://github.com/YOUR-USERNAME/clone-wars.git
```

**Checkpoint: don't go on until your local Codex project shows all of these.**

```text
README.md
CONTRACT.md
AGENTS.md
index.html
docs/
tests/
```

**GitHub shows the files but your Codex folder is blank?** Nothing went wrong with the template. The copy worked. Your local folder just hasn't been connected and checked out yet, so run the commands above. Don't create the GitHub repository again.

You'll confirm all of this in [Step 2](#step-2-verify-access).

### 1d. Turn on your live link

1. In your repository, click **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, **Branch** to **main** and **/(root)**. Click **Save**.
3. Wait about a minute and refresh. When it says **Your site is live at …**, click **Visit site**.

You should see **"Your starter is live."** A 404 for the first minute or two is normal. ([Help](docs/HELP.md#13-the-live-link-shows-a-404-page))

**To find your live link any time:** Repository → **Settings** → **Pages** → **Visit site**. It's the `github.io` link, not the `github.com` link.

### 1e. Save your links and submit to the portal

1. Paste your **repository link** and **live link** into a note. You'll need both.
2. Open **[calpolyvibecoding.com/portal](https://calpolyvibecoding.com/portal)** → **Builds** → **Post this week's build**.
3. **Link:** your **live link** (`github.io`). **What is it?:** `Clone Wars (Session 03). Building now.` Click **Post it**.

Your live link stays the same as you update your repository, so this entry will show your finished game.

---

## Step 2: Verify access

This checks two separate things: that Codex can reach **your repository on GitHub**, and that **your local project folder** actually has the files. Seeing files on github.com does not mean your local folder has them.

**Use the Codex project you made in Step 1b.** Select **GPT-5.6 Luna**, then send this with your username:

```text
Can you verify that this local Codex project is connected to my GitHub
repository YOUR-USERNAME/clone-wars? First check the Git remote and
current branch, then list the files in the local project.
Answer yes or no. Don’t change anything.
```

- **Yes, with the remote naming `YOUR-USERNAME/clone-wars`, the branch `main`, and a file list including `README.md`, `CONTRACT.md`, `AGENTS.md` and `index.html`:** you're set. Stay in this project and go to Step 3.
- **Right repository, but no files or "No commits yet":** the local project isn't checked out yet. Go back to [Step 1c](#1c-put-the-files-in-your-local-codex-project) and run the commands there.
- **"No," or a different repository:** stop here. ([Help: can't see the repository](docs/HELP.md#1-codex-cannot-see-the-repository) · [wrong repository](docs/HELP.md#3-codex-is-connected-to-the-wrong-repository))

Do this **before** you write anything else. It confirms Codex is working in the right place, before anything changes.

---

## Step 3: Write your prompt and start the team

### 3a. Write your game prompt

Nothing goes into Codex yet. Copy this prompt into your note and replace the five **[brackets]**, including the brackets themselves.

```text
You are the orchestrator for my Clone Wars build. You lead a team of
three subagents.

My repo: [paste your REPOSITORY link, the github.com one]

My version:
- Title: [a name for your game]
- Looks like: [where it's set, what the obstacles are, and who you play as]
- Sounds like: [what the flap, score and crash sound like, or "whatever fits"]
- Plays differently: [Easy/Normal buttons, Easier first 3 obstacles, Checkpoints every 10 points, or your own idea]

Part 1. Plan, then stop.
Read AGENTS.md and CONTRACT.md in my repo. Change nothing yet.
Follow AGENTS.md Part A, Step 1: tell me the plan in plain words,
then stop and wait until I type go.

Part 2. When I type go.
Follow AGENTS.md Part A, Steps 2 to 4: start all three subagents at
the same time on gpt-5.6-luna, each on its own branch. Each subagent
opens its own pull request. Check their work, then give me the three
pull request links in merge order: Core, Art, Sound.
Do not merge anything, and do not combine them.
```

**Plays differently: pick one**

| Write this | What changes |
| --- | --- |
| **Easy/Normal buttons** | Easy and Normal buttons on the start screen. Easy has bigger gaps and slower obstacles. |
| **Easier first 3 obstacles** | The first three gaps are bigger and move slower. |
| **Checkpoints every 10 points** | After a crash, you restart from your last checkpoint (10, 20, 30…). |
| **Your own idea** | One sentence, like Galaxy Flap's: *lasers shoot from the right side of the screen to the left at different heights, and I have to dodge them.* Riskier, and not covered by the answer key. |

**Three examples**

| Title | Looks like | Sounds like | Plays differently |
| --- | --- | --- | --- |
| Galaxy Flap | Star Wars-inspired: a desert planet with two suns, laser gates as obstacles. I fly a small starfighter. | a laser pew, a hyperspace whoosh, an explosion | Lasers shoot from the right at different heights, and I dodge them |
| SLO Flap | San Luis Obispo at sunset, palm trees as obstacles. I play as a seagull. | a squawk, a beach bell, a splash | Easy/Normal buttons |
| Pigeon Flap | New York at night, skyscrapers as obstacles. I play as a pigeon. | a coo, a subway ding, a taxi horn | Easier first 3 obstacles |

Go for the vibe, not the brand: "Star Wars-inspired" is fine, but no named characters, logos or theme songs.

### 3b. Start the team

1. Paste your finished prompt from your note into the same Codex project you just verified, and send it.
2. The team lead replies with a plan and **stops**. Check that it lists:
   - [ ] **Core** (`game.js`, `config.js`), **Art** (`sprites.js`) and **Sound** (`sounds.js`)
   - [ ] Your title, how it looks, how it sounds and how it plays differently
   - [ ] Three pull requests, and **no merging**
3. Something's wrong? Tell it in plain words. Otherwise, type:

```text
go
```

---

## Step 4: Watch the builders work

You don't need to understand every message. Just confirm that **Core, Art and Sound each exist and each has its own job.**

Look for:

- Three agents being created, named **Core**, **Art** and **Sound**
- A message that the three sub-agents started working
- Activity from each one: reading files, editing code, testing, opening a pull request
- Separate branches (`clone-wars-core`, `clone-wars-art`, `clone-wars-sound`) or separate agent threads <!-- CONFIRM after Kyle's test: where sub-agent threads appear in Codex. -->
- A final summary with **three pull-request links**

| If Codex says | It means |
| --- | --- |
| **Created an agent** | The builder exists. |
| **Started working** | The builder is active. |
| **Finished** | The builder is done and should have opened a pull request. |

**Parallel or one after another?** When parallel sub-agents are available, all three work at the same time, and their pull requests arrive close together. If they run one after another, the work can still succeed, but it isn't parallel. ([Help](docs/HELP.md#9-sub-agents-ran-one-at-a-time))

Problems: [no sub-agents](docs/HELP.md#7-a-sub-agent-was-not-created) · [stuck sub-agent](docs/HELP.md#8-a-sub-agent-did-not-start-working) · [missing pull request](docs/HELP.md#10-a-pull-request-is-missing) · [out of usage](docs/HELP.md#23-codex-reached-its-usage-limit)

---

## Step 5: Review, merge, and test each pull request

**Merge in this order: Core → Art → Sound.**

- Core is the working game. Art and Sound plug into it.
- Testing one change at a time shows you exactly which builder caused a problem.

You *can* merge all three at once, but if the game breaks, you won't know which builder broke it.

### Review each pull request: three questions

**1. Did the builder stay in its lane?** Open the pull request → **Files changed**.

| Pull request | Should change only |
| --- | --- |
| Core | `game.js` and `config.js` |
| Art | `sprites.js` |
| Sound | `sounds.js` |

If it changes anything else, **don't merge it.** ([Help](docs/HELP.md#11-a-pull-request-changed-the-wrong-files))

**2. Did the builder follow your instructions?** Read the pull-request description and compare it with your choices:

- Core → your **Title** and **Plays differently**
- Art → your **Looks like**
- Sound → your **Sounds like**

**3. Does it actually work?** Test your live link after merging (see below).

### Do this for each pull request

**Review → merge one pull request → wait for deployment → test the live link → continue.**

1. Open the pull request.
2. Check **Files changed**.
3. Read the description.
4. Merge only if it passes: **Merge pull request** → **Confirm merge**.
5. Open your repository's **Actions** tab.
6. Wait for the newest workflow run to finish with a **green check**. ([Red X?](docs/HELP.md#12-github-actions-shows-a-red-x))
7. Open your **live link** (`github.io`).
8. Hard-refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).
9. Test the part you just merged, using the list below.
10. Go to the next pull request only if this version works.

### After Core: test how it works

- [ ] The game starts, and Space or click works
- [ ] The player moves
- [ ] The obstacles move
- [ ] Scoring works
- [ ] Hitting an obstacle or the ground ends the game
- [ ] You can play again
- [ ] Your title and your "plays differently" change are there

**Expected:** plain placeholder shapes, no sound, and a yellow label saying `placeholder: art, sound missing`. That's correct at this point.

### After Art: test how it looks

- [ ] The background matches your "Looks like"
- [ ] Your character is visible
- [ ] The obstacles are visible
- [ ] The character and obstacles stand out clearly from the background
- [ ] The game still plays correctly

**Expected:** the yellow label now says `placeholder: sound missing`.

### After Sound: test how it sounds

Turn your volume up and click the game first (browsers block sound until you click).

- [ ] The flap sound plays
- [ ] The score sound plays
- [ ] The crash sound plays
- [ ] **M** turns sound off and on
- [ ] The complete game plays
- [ ] The yellow placeholder label is gone

### What failure looks like

If you see any of these, **don't merge** the pull request, or don't move on to the next one.

| Where | It may have failed if |
| --- | --- |
| **Core** | The game is [blank](docs/HELP.md#17-the-game-is-blank), [doesn't start](docs/HELP.md#18-the-game-does-not-start), or [Space/click does nothing](docs/HELP.md#19-space-or-clicking-does-nothing). The player or obstacles don't move. Scoring or collisions don't work. Crashing doesn't end the game. |
| **Art** | The character is missing. The background is wrong. The obstacles are [invisible or blend into the background](docs/HELP.md#20-the-character-or-obstacles-are-invisible). |
| **Sound** | [No flap, score or crash sound](docs/HELP.md#21-sounds-do-not-play). (If only the **M** key is broken, that's Core's code.) |
| **Workflow** | [Wrong files changed](docs/HELP.md#11-a-pull-request-changed-the-wrong-files). Actions shows a [red X](docs/HELP.md#12-github-actions-shows-a-red-x). There's a [merge conflict](docs/HELP.md#16-there-is-a-merge-conflict). The description doesn't match your request. The live site shows an [older version](docs/HELP.md#14-the-live-link-still-shows-an-older-version) or a [404](docs/HELP.md#13-the-live-link-shows-a-404-page). |

### Request a fix

In the same Codex chat, send one builder back for **one** fix:

```text
fix core: pressing Space does nothing.
```

```text
fix art: I can't see the character against the background.
```

```text
fix sound: I hear no sound when I flap or score.
```

Review the updated or new pull request the same way before merging it.

**Core still broken after its fix?** Type `use the answer key`. The team lead swaps in the club's working `game.js`, and your title, art, sound and "plays differently" choice from the list still work. ([Help](docs/HELP.md#using-the-answer-key))

---

## Step 6: Update the portal

Open **[the portal](https://calpolyvibecoding.com/portal)** → **Builds** → edit your Clone Wars entry. Keep **Link** as your **live link**, and set **What is it?** to:

```text
[Title]: I cloned Flappy Bird and made it mine. It looks like [...], sounds like [...], and plays differently: [...]. The part that couldn't be split was [your answer].
```

---

## How to make future changes

Once your game is done, use the same review workflow for anything new.

1. Continue in your Clone Wars Codex project, the one with your repository checked out.
2. Verify the connection again ([Step 2](#step-2-verify-access)).
3. Ask Codex to read `AGENTS.md`, `CONTRACT.md` and the current code.
4. Describe the change you want.
5. Ask Codex to explain its plan and stop.
6. Review the plan.
7. Type `go`.
8. Codex implements the change, tests it and opens **one** pull request **into main**.
9. Don't let Codex merge it.
10. Review the pull request. At the top, it must say it wants to merge **into main**. If it names another branch (like `clone-wars-core`), don't merge. Send: `Open this pull request into main instead.` Then check **Files changed** and the description.
11. Merge only after checking the files, **Actions** and your live link.

**Example: make the lasers speed up**

```text
Read AGENTS.md, CONTRACT.md, and the current game code.

I want the lasers to get harder as I score:

- Every 5 points, lasers move a little faster.
- Cap the speed at twice the starting speed.
- Keep lasers coming from the right side at different heights.
- Preserve the current art, sounds, controls, scoring, and overall game style.

Start from the latest main on GitHub and open the pull request into main.

First, explain your plan and identify which files you will change. Then stop and wait for me to type "go".

After I type "go", implement the change, test it, and open one pull request. Do not merge the pull request.
```

The "cap the speed" line matters. Without a top speed, the lasers eventually get too fast to dodge, and the game becomes impossible.

### Cleaning up branches

- Builder branches (`clone-wars-core`, `clone-wars-art`, `clone-wars-sound`) are temporary.
- After a pull request is merged and tested, you may delete its branch: open the merged pull request and click **Delete branch**.
- Deleting a branch does **not** delete the pull request or the merged work. You can bring it back with **Restore branch** on the same pull request.
- You can also leave branches in place while you're learning.
- **Wait until all three pull requests are merged and tested** before deleting any.
- **Never delete `main`.**

---

## Troubleshooting

**Ask your AI first.** It can see your exact screen and error. Paste this into Codex (or ChatGPT on your phone), attach a screenshot, and fill in the brackets:

```text
I'm a beginner following this tutorial: [paste the link to this page]
and its help page: [paste the link to docs/HELP.md]
I'm on Step [number]. Here's what I see: [describe it or paste the error]
Tell me exactly what to do next, one small step at a time.
```

Then check **[docs/HELP.md](docs/HELP.md)**. Most common problems:

- [Codex cannot see the repository](docs/HELP.md#1-codex-cannot-see-the-repository)
- [The live link shows a 404](docs/HELP.md#13-the-live-link-shows-a-404-page) or [an older version](docs/HELP.md#14-the-live-link-still-shows-an-older-version)
- [A pull request is missing](docs/HELP.md#10-a-pull-request-is-missing)
- [The game is blank](docs/HELP.md#17-the-game-is-blank)
- [Codex reached its usage limit](docs/HELP.md#23-codex-reached-its-usage-limit)

Officers help with things AI can't fix: your account, permissions and the portal.

---

## Optional: Continue experimenting

- **Push your art further:** ask for a moving background or day turning into night, using the [future changes](#how-to-make-future-changes) workflow.
- **Try another gameplay change:** same workflow, one pull request at a time.
- **Clone something else:** make a new repository, give Codex access to only that repository, and ask a team lead to split the build into three jobs that only share names. Review and merge the same way. Keep it to one screen and one thing to do.
