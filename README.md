
# 🧠 GitLab Merge Request Helper

A CLI tool to track your GitLab Merge Requests (MRs) across branches (like `dev`, `test`, `master`) and notify you if your MR is not fully propagated to the target environment (e.g., not yet on `master`). Supports MR tracking across cherry-picks, rebases, and predicts with AI-based diffing in complex scenarios.

---

## ✨ Features

* 🔍 **List your merge requests** by state (`open`, `merged`, `closed`)
* 📊 **Check MR propagation** across a defined branch order (e.g., `dev → test → master`)
* 🧠 **AI-enhanced detection** for cherry-picks, rebases, or renamed commits
* 🔔 **Optional reminders** if MRs are not yet fully merged to production branches

---

## 📦 Installation

```bash
npx gitlab-mr [command]
```

Or install globally:

```bash
npm install -g gitlab-mr
```

---

## ⚙️ Configuration
```
# Set your GitLab API token
npx gitlab-mr config set-token <your_token>

# Set GitLab API URL (optional, defaults to gitlab.com)
npx gitlab-mr config set-url https://gitlab.example.com/api/v4

# Set target branch flow for a project (in order of promotion)
npx gitlab-mr config set-branches <project_id> dev test master
```

---

## 🛠️ Usage

### 🔍 List Your Merge Requests

* **Open MRs**

  ```bash
  npx gitlab-mr list --open
  ```

* **Merged MRs**

  ```bash
  npx gitlab-mr list --merged
  ```

* **Closed MRs**

  ```bash
  npx gitlab-mr list --closed
  ```

* **All MRs**

  ```bash
  npx gitlab-mr list --all
  ```

---

### 🌱 Show MR Branch Propagation (Env Diff)

Check if your merge requests have been fully integrated into the main branches (`dev`, `test`, `master`, etc.)

* **Full Environment Diff**

  ```bash
  npx gitlab-mr show env-diff
  ```

* **Diff against a specific target branch (e.g. master)**

  ```bash
  npx gitlab-mr show env-diff --target master
  ```

---

## 🤖 How It Works

* Fetches **your** merge requests (authored by you) with their commit SHAs.
* Checks if those commits (or equivalent diffs) exist in each defined environment branch.
* Uses AI (optional flag `--ai`) to compare diffs when commits are cherry-picked or rebased.

---

## 🚀 Upcoming Features

* [ ] Slack/email notifications for stale MRs
* [ ] MR approval tracking
* [ ] Enhanced diff UI
* [ ] GitHub support

---

## 🧠 Example Output

```bash
$ npx gitlab-mr show env-diff

🔎 Checking MR Propagation (dev → test → master)...

✅ MR #42 is fully merged to master ✅
⚠️ MR #47 is on dev and test but NOT on master
✅ MR #51 is merged up to test
```

---

Let me know if you'd like this tool scaffolded with real CLI code, GitLab API hooks, or AI-based diff logic (e.g. using `diff-match-patch`, `cosine similarity`, or OpenAI embedding comparisons).
