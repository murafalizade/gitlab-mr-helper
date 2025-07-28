
# 🧠 GitLab Merge Request Helper

A CLI tool to track your GitLab Merge Requests (MRs) across branches (like `dev`, `test`, `master`) and notify you if your MR is not fully propagated to the target environment (e.g., not yet on `master`). Supports MR tracking across cherry-picks, rebases, and predicts with AI-based diffing in complex scenarios.

---

## ✨ Features

* 🔍 **List your merge requests** by state (`all`, `opened`, `merged`, `closed`)
* 📊 **Check MR propagation** across a defined branch order (e.g., `dev → test → master`)
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
npx gitlab-mr config set-project <project_id>
```

---

## 🛠️ Usage

### 🔍 List Your Merge Requests

* **Open MRs**

  ```bash
  npx gitlab-mr list opened
  ```

* **Merged MRs**

  ```bash
  npx gitlab-mr list merged
  ```

* **Closed MRs**

  ```bash
  npx gitlab-mr list closed
  ```

* **All MRs**

  ```bash
  npx gitlab-mr list all
  ```

---

### 🌱 Show MR Branch Propagation (Env Diff)

Check if your merge requests have been fully integrated into the main branches (`dev`, `test`, `master`, etc.)

* **Full Environment Diff**

  ```bash
  npx gitlab-mr show env-diff <target_branch> [mr_id]
  ```

---

## 🤖 How It Works

* Fetches **your** merge requests (authored by you) with their commit SHAs.
* Checks if those commits (or equivalent diffs) exist in each defined environment branch.

---

## 🚀 Upcoming Features

* [ ] GitHub/Bitbucket support
* [ ] Reminder logic for stale MRs
* [ ] AI based commit scoring

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
