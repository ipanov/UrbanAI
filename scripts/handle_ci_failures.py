#!/usr/bin/env python3
"""
scripts/handle_ci_failures.py

Helper script to fetch open GitHub issues labeled `ci-failure` for this repository,
save a concise report into memory-bank/ci-failures.md and print a short JSON summary.

Purpose:
- Make it easy for an operator or Cline (assistant) to locate CI failure issues quickly.
- Persist a small report into the repository's memory-bank so Cline can read it at task start
  and use it to create a new task (via the new_task tool) containing the failure context.

Usage:
  - Ensure you have GITHUB_TOKEN (with repo scope) in environment.
  - Run: python scripts/handle_ci_failures.py --owner ipanov --repo UrbanAI
  - Script will populate memory-bank/ci-failures.md and print a short JSON to stdout.

Notes:
- This script is a convenience helper. The assistant (Cline) can call GitHub MCP server
  directly (recommended) to list workflow runs, download logs, and create a new task via the
  new_task tool. Use this script when you prefer a local helper.
"""

import os
import sys
import argparse
import requests
import datetime
import json

GITHUB_API = "https://api.github.com"

def get_ci_failure_issues(owner, repo, token):
    url = f"{GITHUB_API}/repos/{owner}/{repo}/issues"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json"
    }
    params = {
        "state": "open",
        "labels": "ci-failure,urgent",
        "per_page": 100
    }
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()

def format_issue_md(issue):
    number = issue.get("number")
    title = issue.get("title")
    body = issue.get("body") or ""
    created_at = issue.get("created_at")
    url = issue.get("html_url")
    user = issue.get("user", {}).get("login")
    labels = [l.get("name") for l in issue.get("labels", [])]
    return f"""### Issue #{number} — {title}

- URL: {url}
- Created At: {created_at}
- Author: {user}
- Labels: {', '.join(labels)}

Body:
```
{body}
```

---

"""

def ensure_memory_bank():
    path = "memory-bank"
    if not os.path.isdir(path):
        os.makedirs(path, exist_ok=True)

def save_report(owner, repo, issues):
    ensure_memory_bank()
    now = datetime.datetime.utcnow().isoformat() + "Z"
    md_path = os.path.join("memory-bank", "ci-failures.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# CI Failure Issues Report for {owner}/{repo}\n\n")
        f.write(f"Generated: {now}\n\n")
        if not issues:
            f.write("No open issues found with labels `ci-failure` and `urgent`.\n")
        else:
            for issue in issues:
                f.write(format_issue_md(issue))
    return md_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--owner", required=True, help="Repository owner/org")
    parser.add_argument("--repo", required=True, help="Repository name")
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        print("ERROR: GITHUB_TOKEN or GH_TOKEN must be set in environment", file=sys.stderr)
        sys.exit(2)

    try:
        issues = get_ci_failure_issues(args.owner, args.repo, token)
    except requests.HTTPError as e:
        print(f"HTTP error while fetching issues: {e}", file=sys.stderr)
        sys.exit(3)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(4)

    md_path = save_report(args.owner, args.repo, issues)

    # Print JSON summary for automation
    summary = {
        "repo": f"{args.owner}/{args.repo}",
        "fetched_at": datetime.datetime.utcnow().isoformat() + "Z",
        "open_ci_failure_count": len(issues),
        "report_path": md_path,
        "issues": []
    }
    for issue in issues:
        summary["issues"].append({
            "number": issue.get("number"),
            "title": issue.get("title"),
            "url": issue.get("html_url"),
            "created_at": issue.get("created_at"),
            "assignees": [a.get("login") for a in issue.get("assignees", [])],
            "labels": [l.get("name") for l in issue.get("labels", [])]
        })

    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()
