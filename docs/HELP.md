# Help · Clone Wars

Find your problem below. Each one lists what you might see, the likely cause, how to fix it, and when to ask an officer. Button names can move as apps update. If a label doesn't match exactly, look for the closest one.

**Ask your AI first.** It can see your exact screen and error. Paste this into Codex (or ChatGPT on your phone), attach a screenshot, and fill in the brackets:

```text
I'm a beginner following this tutorial: [link to your repository's README]
and its help page: [link to this page]
I'm on Step [number]. Here's what I see: [describe it or paste the error]
Tell me exactly what to do next, one small step at a time.
```

**Two links, two jobs.** Your **repository link** (`https://github.com/YOUR-USERNAME/clone-wars`) is for Codex. Your **live link** (`https://YOUR-USERNAME.github.io/clone-wars/`) is your playable game and goes in the portal.

**Jump to:**
**Access:** [1](#1-codex-cannot-see-the-repository) · [2](#2-codex-is-connected-to-the-wrong-github-account) · [3](#3-codex-is-connected-to-the-wrong-repository) · [4](#4-the-github-connector-is-unavailable) · [5](#5-github-access-or-permission-problems) · [6](#6-i-used-the-club-template-instead-of-my-own-repository)
**Sub-agents:** [7](#7-a-sub-agent-was-not-created) · [8](#8-a-sub-agent-did-not-start-working) · [9](#9-sub-agents-ran-one-at-a-time)
**Pull requests and deployment:** [10](#10-a-pull-request-is-missing) · [11](#11-a-pull-request-changed-the-wrong-files) · [12](#12-github-actions-shows-a-red-x) · [13](#13-the-live-link-shows-a-404-page) · [14](#14-the-live-link-still-shows-an-older-version) · [15](#15-the-merge-button-is-missing) · [16](#16-there-is-a-merge-conflict)
**The game:** [17](#17-the-game-is-blank) · [18](#18-the-game-does-not-start) · [19](#19-space-or-clicking-does-nothing) · [20](#20-the-character-or-obstacles-are-invisible) · [21](#21-sounds-do-not-play) · [22](#22-the-browser-is-muted-or-blocking-sound)
**Other:** [23](#23-codex-reached-its-usage-limit) · [24](#24-i-submitted-the-wrong-link-to-the-portal) · [25](#25-what-to-do-after-a-pull-request-is-merged) · [26](#26-should-i-delete-temporary-branches) · [Answer key](#using-the-answer-key) · [Undo a merge](#undo-a-merge)

---

## Access

### 1. Codex cannot see the repository

**What you see:** Codex answers "No" to the [access check](../README.md#step-2-verify-access), says the repository doesn't exist, or can't find it.

**Likely cause:** your repository isn't in the GitHub connector's list, the connector isn't connected, or the username or repository name is misspelled.

**Fix:**
1. Check the name. It must be exactly `YOUR-USERNAME/clone-wars`, with your username.
2. On GitHub: profile picture → **Settings** → **Applications** → **Installed GitHub Apps** → the ChatGPT/Codex app → **Configure**.
3. Under **Repository access**, choose **Only select repositories**, add **clone-wars**, and click **Save**.
4. Not in that list at all? The connector was never installed. Connect it from Codex ([Step 1b](../README.md#1b-start-a-new-codex-project-called-clone-wars)).
5. Send the access check again in the same chat. Still "No"? Start a new chat and try once more.

**Ask an officer if:** the repository is added and a new chat still says "No."

### 2. Codex is connected to the wrong GitHub account

**What you see:** Codex lists repositories you don't recognize, or says your repository doesn't exist. The profile picture at the top right of github.com isn't the account that owns `clone-wars`.

**Likely cause:** the connector was authorized while you were signed into a different GitHub account (for example, an old or school account).

**Fix:**
1. On github.com, click your profile picture and check the username. Sign out and sign in to the account that owns `clone-wars`.
2. In Codex, disconnect the GitHub connector, then connect it again while signed into the right account.
3. Choose **Only select repositories** → **clone-wars**.
4. Run the [access check](../README.md#step-2-verify-access) again.

**Ask an officer if:** you can't find where to disconnect the connector, or you don't know which account owns the repository.

### 3. Codex is connected to the wrong repository

**What you see:** the access check lists files that aren't yours (like `SPEC.md` or `profile-*.json`), or Codex names a different repository.

**Likely cause:** the chat is attached to an old project, often a folder on your laptop from an earlier session, or you pasted the wrong link.

**Fix:**
1. **Create a new project in Codex and name it Clone Wars.** A new project starts connected to nothing. An old one is still tied to the last repository you used it for, and that's usually what went wrong.
2. Connect that new project to GitHub, with access to your `clone-wars` repository only.
3. Send the [access check](../README.md#step-2-verify-access) with your exact `YOUR-USERNAME/clone-wars`.
4. Continue only when the list includes `README.md`, `CONTRACT.md`, `AGENTS.md` and `index.html`.

**Ask an officer if:** a new chat still shows the wrong files.

### 4. The GitHub connector is unavailable

**What you see:** there's no GitHub option in Codex, or it's grayed out.

**Likely cause:** you're signed into the school Codex account, or the app needs an update.

**Fix:**
1. Sign out of Codex and sign in with your **personal** account. Having trouble with the student offer? Open a private window (**Cmd+Shift+N** on Mac, **Ctrl+Shift+N** on Windows), sign in there with your personal email, then return to a normal window.
2. Update the Codex app and restart it.
3. Look for GitHub under Codex's connectors, plugins or apps settings.

**Ask an officer if:** you're on your personal account with an updated app and GitHub still isn't available.

### 5. GitHub access or permission problems

**What you see:** errors like "Resource not accessible," "permission denied," or Codex can't create a branch or open a pull request.

**Likely cause:** the connector can read the repository but wasn't given permission to change it, the repository isn't in its list, or you don't own the repository.

**Fix:**
1. Confirm the repository is under **your** account ([problem 6](#6-i-used-the-club-template-instead-of-my-own-repository)).
2. GitHub → **Settings** → **Applications** → **Installed GitHub Apps** → ChatGPT/Codex → **Configure**. Make sure **clone-wars** is selected.
3. If GitHub shows a banner asking you to approve new permissions for the app, review and accept them.
4. Try again in Codex.

**Ask an officer if:** GitHub asks for permissions you don't understand, or the repository belongs to an organization.

### 6. I used the club template instead of my own repository

**What you see:** your address bar or the link you gave Codex contains `KyleStefan/clone-wars-flappy-bird`. You can't change **Settings** or merge anything.

**Likely cause:** you skipped **Use this template**, or copied the template's link.

**Fix:**
1. Do [Step 1a](../README.md#1a-create-your-repository) to create your own `clone-wars` repository.
2. Update the repository link in your note and in your prompt.
3. Run the [access check](../README.md#step-2-verify-access) with your username.

**Ask an officer if:** you can't create the repository.

---

## Sub-agents

### 7. A sub-agent was not created

**What you see:** no Core, Art or Sound agents appear. The team lead does everything itself, or nothing happens after **go**.

**Likely cause:** the prompt was incomplete, or parallel sub-agents aren't available in your version of Codex.

**Fix:**
1. Make sure you pasted the whole prompt from [Step 3](../README.md#3a-write-your-game-prompt) and typed **go**.
2. Send: `Follow AGENTS.md Part A, Step 2: start the Core, Art and Sound subagents now.`
3. If sub-agents aren't available, the team lead should say so and do the three jobs one after another. You still get three pull requests. See [problem 9](#9-sub-agents-ran-one-at-a-time).

**Ask an officer if:** nothing happens after two tries.

### 8. A sub-agent did not start working

**What you see:** Codex says it **created** an agent, but that agent shows no activity for several minutes.

**Likely cause:** it's waiting for your approval, you've hit your usage limit, or it's stuck.

**Fix:**
1. Look in each agent's thread and the main chat for an approval request, and approve it.
2. Out of usage? See [problem 23](#23-codex-reached-its-usage-limit).
3. Send: `Is the [Core / Art / Sound] subagent working? If it's stuck, restart only that builder.`

**Ask an officer if:** the restarted builder is also stuck.

### 9. Sub-agents ran one at a time

**What you see:** the summary says the builders ran **one after another**, or the pull requests arrived in order (Core, then Art, then Sound) several minutes apart.

**Likely cause:** parallel sub-agents weren't available in your version of Codex.

**Fix:** nothing is broken. Continue to [Step 5](../README.md#step-5-review-merge-and-test-each-pull-request). To see GitHub's own timing (which the agents can't change): **Pull requests** → hover over "opened … ago" under each one.

**Ask an officer if:** you're curious whether parallel sub-agents should work on your setup. This doesn't block you.

---

## Pull requests and deployment

### 10. A pull request is missing

**What you see:** fewer than three pull requests under **Pull requests**.

**Likely cause:** a builder finished but didn't open its pull request, or it hasn't finished yet.

**Fix:**
1. Wait for the team lead's final summary.
2. On your repository page, look for a yellow **Compare & pull request** banner for `clone-wars-core`, `clone-wars-art` or `clone-wars-sound`. Click it → **Create pull request**.
3. No banner? **Pull requests** → **New pull request** → set **compare** to the builder's branch → **Create pull request**.
4. No branch at all? Send: `The [Core / Art / Sound] builder didn't open a pull request. Restart only that builder, following AGENTS.md.`

**Ask an officer if:** the branch exists but GitHub won't create the pull request.

### 11. A pull request changed the wrong files

**What you see:** **Pull requests** → **Files changed** shows files that don't belong to that builder.

| Pull request | Should change only |
| --- | --- |
| Core | `game.js`, `config.js` |
| Art | `sprites.js` |
| Sound | `sounds.js` |
| Use the answer key | `game.js` (and maybe `config.js`) |

**Likely cause:** the builder went outside its job.

**Fix:** **don't merge.** Send: `The [Core / Art / Sound] pull request changed files that aren't its own. Put every other file back exactly as it is on main.` Check **Files changed** again.

**Ask an officer if:** it keeps changing other files after you ask.

### 12. GitHub Actions shows a red X

**What you see:** **Actions** → the newest workflow run has a red X instead of a green check.

**Likely cause:** the GitHub Pages deployment failed. This is often temporary, or Pages isn't set up correctly.

**Fix:**
1. **Actions** → click the newest workflow run → **Re-run all jobs**. Wait for it to finish.
2. Still red? Check **Settings** → **Pages**: **Deploy from a branch**, **main**, **/(root)**.
3. Still red? Open the run, click the failed step, copy the error, and send: `My GitHub Pages deployment failed with this error: [paste]. What's wrong? Don't merge anything.`

**Ask an officer if:** it fails twice after re-running.

### 13. The live link shows a 404 page

**What you see:** "404 · There isn't a GitHub Pages site here."

**Likely cause:** Pages just turned on or just redeployed, Pages isn't set up, or the link is wrong.

**Fix:**
1. Wait 1 to 2 minutes, then refresh.
2. **Actions** → wait for the newest run to show a green check.
3. **Settings** → **Pages**: **Deploy from a branch**, **main**, **/(root)**. Use the link shown there (**Visit site**). It ends with `/clone-wars/`.
4. Your repository must be **Public**: **Settings** → **General** → bottom of the page → **Change visibility**.

**Ask an officer if:** it's still 404 five minutes after a green check.

### 14. The live link still shows an older version

**What you see:** you merged, but the live page looks the same (for example, still "Your starter is live." or still no art).

**Likely cause:** deployment isn't finished, or your browser is showing a saved copy.

**Fix:**
1. **Actions** → wait for the newest run to show a green check.
2. Hard-refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).
3. Still old? Open the live link in a private window, or wait a few minutes. GitHub can serve the old page briefly.
4. Check the pull request page says **merged into main**.

**Ask an officer if:** Actions is green, the pull request is merged, and a private window still shows the old version after 10 minutes.

### 15. The Merge button is missing

**What you see:** no green **Merge pull request** button.

**Likely cause and fix:**
- **It already says Merged (purple) or Closed.** It's done or was closed. Check the **Pull requests** → **Closed** list.
- **It says Draft.** Click **Ready for review**, then merge.
- **It says "This branch has conflicts."** See [problem 16](#16-there-is-a-merge-conflict).
- **You're in the club template or someone else's repository.** Only the owner can merge. See [problem 6](#6-i-used-the-club-template-instead-of-my-own-repository).

**Ask an officer if:** it's your repository, not a draft, no conflicts, and still no button.

### 16. There is a merge conflict

**What you see:** "This branch has conflicts that must be resolved."

**Likely cause:** the builder changed a file that was also changed on `main`. This usually happens with a fix after that builder was already merged, or when a builder touched another builder's file.

**Fix:**
1. **Don't use GitHub's conflict editor.**
2. Send: `The [Core / Art / Sound] pull request has a merge conflict. Update its branch from main so it only changes its own files. Don't merge.`
3. Review **Files changed** again before merging.

**Ask an officer if:** the conflict is still there after the team lead updates the branch.

---

## The game

### 17. The game is blank

**What you see:** the live link shows an empty or black page: no starter message and no game.

**Likely cause:** `game.js` has an error, deployment isn't finished, or you're seeing an old copy.

**Fix:**
1. **Actions** → wait for the green check, then hard-refresh.
2. Send: `fix core: the game page is blank after merging Core.` Review and merge the fix, then test again.
3. Still blank? Type `use the answer key` ([below](#using-the-answer-key)).

Still seeing **"Your starter is live."**? Core isn't merged yet, or see [problem 14](#14-the-live-link-still-shows-an-older-version).

**Ask an officer if:** the answer key is merged and it's still blank.

### 18. The game does not start

**What you see:** the start screen shows, but the game never begins.

**Likely cause:** a bug in Core's `game.js`.

**Fix:**
1. Click the game once, then press **Space**.
2. Send: `fix core: the start screen shows but the game never starts.`
3. Still broken after that fix? Type `use the answer key`.

**Ask an officer if:** the answer key is merged and it still won't start.

### 19. Space or clicking does nothing

**What you see:** pressing **Space** or clicking doesn't start the game or flap.

**Likely cause:** the page doesn't have focus, you just clicked a button (like **Easy**) that kept focus, or Core has an input bug.

**Fix:**
1. Click an empty part of the game once, then press **Space**.
2. Still nothing? Send: `fix core: pressing Space and clicking do nothing.`
3. Still broken after that fix? Type `use the answer key`.

**Ask an officer if:** it works on a neighbor's computer but not yours.

### 20. The character or obstacles are invisible

**What you see:** you crash into things you can't see, or your character blends into the background.

**Likely cause:** Art used colors too close to the background.

**Fix:** send `fix art: I can't see the [character / obstacles] against the background. Make them stand out with brighter colors and a dark outline.` Review and merge, then test again. This is one of the most common art bugs, and catching it is exactly the point of testing.

**Ask an officer if:** the second try is still hard to see.

### 21. Sounds do not play

**What you see:** no flap, score or crash sounds.

**Likely cause:** Sound isn't merged yet (the yellow label still says `sound missing`), sound is muted, or the browser is blocking it.

**Fix:**
1. Check the yellow label. Does it say `sound missing`? Merge the Sound pull request first.
2. Press **M** once. Sound may be switched off.
3. See [problem 22](#22-the-browser-is-muted-or-blocking-sound).
4. Still silent? Send: `fix sound: I hear no sound when I flap, score or crash.`

**Ask an officer if:** sound works for neighbors on the same browser but not for you after all of this.

### 22. The browser is muted or blocking sound

**What you see:** the game plays but makes no sound, even after Sound is merged.

**Likely cause:** browsers don't allow sound until you click or press a key on the page, or the tab or computer is muted.

**Fix:**
1. Click the game, then press **Space**. The first sound only plays after you interact.
2. Check your computer's volume.
3. Unmute the tab. In Chrome: right-click the tab → **Unmute site**. In Safari: click the speaker icon in the address bar.
4. Press **M** to toggle game sound.

**Ask an officer if:** no website plays sound on your computer.

---

## Other

### 23. Codex reached its usage limit

**What you see:** Codex says you've hit your limit and stops responding.

**Likely cause:** four agents use a lot of your allowance, especially on bigger models.

**Fix:**
1. **Nothing is lost.** Your live link is already in the portal from [Step 1e](../README.md#1e-save-your-links-and-submit-to-the-portal).
2. Watch a neighbor's build for the rest of the session.
3. After your limit resets (a short limit resets within hours, a weekly limit can take days), send in the same chat: `Read AGENTS.md in my repo. My Clone Wars build stopped because I ran out of usage. Check which builders already have a branch or pull request. Restart only the missing builders. Don't merge.`
4. Next time, select **GPT-5.6 Luna** before you start.

**Ask an officer if:** you hit the limit before sending your first prompt.

### 24. I submitted the wrong link to the portal

**What you see:** your portal entry opens GitHub's file view instead of your game.

**Likely cause:** you submitted the **repository link** (`github.com`) instead of the **live link** (`github.io`).

**Fix:** open the portal → **Builds** → edit your entry → set **Link** to `https://YOUR-USERNAME.github.io/clone-wars/` (find it at **Settings** → **Pages** → **Visit site**). Save.

**Ask an officer if:** the portal won't let you edit or post.

### 25. What to do after a pull request is merged

1. **Actions** → wait for the green check.
2. Open your live link and hard-refresh.
3. Test that builder's part ([checklists](../README.md#after-core-test-how-it-works)).
4. Works? Move to the next pull request in the order **Core → Art → Sound**.
5. Broken? Don't merge the next one yet. [Request a fix](../README.md#request-a-fix).
6. After Sound: [update the portal](../README.md#step-6-update-the-portal).

### 26. Should I delete temporary branches?

- Builder branches (`clone-wars-core`, `clone-wars-art`, `clone-wars-sound`, and any `clone-wars-fix-…` or `answer-key` branch) are temporary.
- **Wait until all three pull requests are merged and tested.** Then you may delete them: open each merged pull request → **Delete branch**.
- Deleting a branch doesn't delete the pull request or the merged work. You can undo it with **Restore branch** on the same pull request.
- It's fine to leave branches in place while you're learning.
- **Never delete `main`.**

---

## Using the answer key

If Core is still broken after one fix, the club has a working `game.js`. It follows the same plan as yours, so your title, art, sound and "plays differently" choice from the list still work. Only a custom gameplay idea is lost.

In your Codex chat, type `use the answer key`. Review the new **Use the answer key** pull request (**Files changed**: `game.js`, and maybe `config.js`), merge it, wait for **Actions**, and test.

### Use the answer key by hand

If the agent can't swap it for you:

1. Open **https://github.com/KyleStefan/clone-wars-answer-key/blob/main/game.js** and click **Copy raw file**.
2. In **your** repository, click `game.js` → pencil icon (**Edit this file**).
3. Select everything (**Cmd+A** or **Ctrl+A**), paste, and click **Commit changes** → **Commit changes**.
4. If your "plays differently" was your own idea: edit `config.js`, change `fix: 'custom'` to `fix: 'none'`, and commit.
5. Wait for **Actions**, then test.

## Undo a merge

Merged something that made the game worse?

1. **Pull requests** → **Closed** → open the pull request you merged.
2. Click **Revert**. This creates a new pull request that undoes it.
3. **Merge pull request** → **Confirm merge**, wait for **Actions**, then hard-refresh your live link.
