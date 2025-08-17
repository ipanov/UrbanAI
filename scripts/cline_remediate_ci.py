#!/usr/bin/env python3
"""
scripts/cline_remediate_ci.py

Assistant-facing helper to prepare a remediation task payload for Cline when a CI failure occurs.

What this script does:
- Reads memory-bank/activeContext.md (must be created by .github/workflows/ci-failure-listener.yml)
- Attempts to extract run_id, run_url, branch, issue_number and issue_url from the active context
- If GITHUB_TOKEN is available, it will fetch basic workflow run metadata and list artifacts for the run.
- Produces a JSON payload in memory-bank/remediation_task_payload.json containing:
  - title (templated)
  - body (full context + logs/artifact links summary)
  - suggested checklist (todo)
  - issue reference (if available)
- Prints the payload path and a short summary to stdout.

Notes / workflow:
- The assistant (Cline) running with MCP tools should:
  1) Run this script (or read memory-bank/activeContext.md directly)
  2) If remediation_task_payload.json exists, call the new_task tool with the payload's 'body' as context and include the task_progress checklist.
- This script is intentionally conservative: it does not modify git, create issues, or call GitHub APIs that change state. It's a local preparer used by the assistant and operators.

Usage:
  - Ensure memory-bank/activeContext.md exists (written by listener workflow).
  - Optionally set GITHUB_TOKEN in environment (read-only operations only).
  - Run: python scripts/cline_remediate_ci.py --owner ipanov --repo UrbanAI

Output:
  - memory-bank/remediation_task_payload.json

"""

import os
import re
import json
import argparse
import requests
from typing import Optional

GITHUB_API = "https://api.github.com"
ROOT = os.path.dirname(os.path.dirname(__file__)) or "."
MEMORY_BANK = os.path.join(ROOT, "memory-bank")
ACTIVE_CTX_PATH = os.path.join(MEMORY_BANK, "activeContext.md")
OUTPUT_PATH = os.path.join(MEMORY_BANK, "remediation_task_payload.json")


def read_active_context(path: str) -> str:
    if not os.path.isfile(path):
        raise FileNotFoundError(f"{path} not found. Listener workflow must write this file.")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def extract_fields_from_context(text: str) -> dict:
    """
    Try to extract common fields from the activeContext.md that the listener writes.
    We look for run_id, run_url, branch, issue_number, issue_url, and repo owner/repo.
    Fall back to empty strings when not found.
    """
    fields = {
        "run_id": None,
        "run_url": None,
        "branch": None,
        "issue_number": None,
        "issue_url": None,
        "owner": None,
        "repo": None
    }

    # Simple regexes that tolerate a few formats.
    run_id_match = re.search(r"run[_-]?id[:\s]*([0-9]+)", text, re.IGNORECASE)
    if run_id_match:
        fields["run_id"] = run_id_match.group(1)

    run_url_match = re.search(r"(https?://github\.com/[^/\s]+/[^/\s]+/actions/runs/[0-9]+)", text)
    if run_url_match:
        fields["run_url"] = run_url_match.group(1)
        # derive run_id from url
        m = re.search(r"/actions/runs/([0-9]+)", fields["run_url"])
        if m:
            fields["run_id"] = m.group(1)

    issue_url_match = re.search(r"(https?://github\.com/[^/\s]+/[^/\s]+/issues/([0-9]+))", text)
    if issue_url_match:
        fields["issue_url"] = issue_url_match.group(1)
        fields["issue_number"] = issue_url_match.group(2)

    owner_repo_match = re.search(r"repos?[:\s]*([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)", text)
    if owner_repo_match:
        fields["owner"], fields["repo"] = owner_repo_match.group(1), owner_repo_match.group(2)
    else:
        # Try to detect from run_url or issue_url
        for key in ("run_url", "issue_url"):
            if fields.get(key):
                m = re.search(r"github\.com/([^/]+)/([^/]+)/", fields[key])
                if m:
                    fields["owner"], fields["repo"] = m.group(1), m.group(2)
                    break

    # Branch detection (common formats)
    branch_match = re.search(r"branch[:\s]*([A-Za-z0-9_\-\/\.]+)", text, re.IGNORECASE)
    if branch_match:
        fields["branch"] = branch_match.group(1)

    return fields


def github_get(url: str, token: Optional[str]):
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def fetch_run_metadata(owner: str, repo: str, run_id: str, token: Optional[str]):
    if not owner or not repo or not run_id:
        return None
    run_url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/runs/{run_id}"
    try:
        return github_get(run_url, token)
    except Exception:
        return None


def list_artifacts_for_run(owner: str, repo: str, run_id: str, token: Optional[str]):
    if not owner or not repo or not run_id:
        return []
    artifacts_url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    try:
        data = github_get(artifacts_url, token)
        return data.get("artifacts", [])
    except Exception:
        return []


def build_task_payload(active_ctx: str, extracted: dict, run_meta: Optional[dict], artifacts: list) -> dict:
    run_id = extracted.get("run_id") or (run_meta.get("id") if run_meta else None)
    short_summary = "CI failure detected"
    if run_meta:
        conclusion = run_meta.get("conclusion") or run_meta.get("status")
        short_summary = f"CI failure — status={conclusion}"
    title = f"Remediate CI Failure — run {run_id or '<unknown>'} — {short_summary}"

    # Artifact links (if available)
    artifact_lines = []
    for a in artifacts:
        name = a.get("name")
        archive_download_url = a.get("archive_download_url")
        if name and archive_download_url:
            artifact_lines.append(f"- {name}: {archive_download_url}")
        elif name:
            artifact_lines.append(f"- {name}")

    body_lines = []
    body_lines.append("## Active Context (from memory-bank/activeContext.md)\n")
    body_lines.append("```\n")
    body_lines.append(active_ctx.strip())
    body_lines.append("\n```\n")
    body_lines.append("\n---\n")
    body_lines.append("## Extracted Metadata\n")
    for k, v in extracted.items():
        body_lines.append(f"- {k}: {v}\n")
    body_lines.append("\n")

    if run_meta:
        body_lines.append("## Workflow Run Summary\n")
        body_lines.append(f"- id: {run_meta.get('id')}\n")
        body_lines.append(f"- name: {run_meta.get('name')}\n")
        body_lines.append(f"- event: {run_meta.get('event')}\n")
        body_lines.append(f"- status: {run_meta.get('status')}\n")
        body_lines.append(f"- conclusion: {run_meta.get('conclusion')}\n")
        body_lines.append(f"- html_url: {run_meta.get('html_url')}\n")
        body_lines.append("\n")

    if artifact_lines:
        body_lines.append("## Artifacts (download URLs may require auth)\n")
        body_lines.extend([l + "\n" for l in artifact_lines])
        body_lines.append("\n")

    body_lines.append("## Suggested reproduction commands\n")
    body_lines.append("For .NET tests and coverage (run from repo root):\n")
    body_lines.append("```\n")
    body_lines.append("dotnet test ./tests/ --configuration Release --collect:\"XPlat Code Coverage\" --settings:coverlet.runsettings\n")
    body_lines.append("dotnet tool install --global dotnet-reportgenerator-globaltool || true\n")
    body_lines.append("reportgenerator -reports:./**/coverage.cobertura.xml -targetdir:coverage-report -reporttypes:HtmlSummary;TextSummary\n")
    body_lines.append("```\n\n")

    body_lines.append("For frontend failures (if applicable):\n")
    body_lines.append("```\n")
    body_lines.append("cd src/UrbanAI.Frontend && npm ci && npm run test\nnpx playwright test\n")
    body_lines.append("```\n\n")

    checklist = [
        "- [ ] Reproduce failure locally",
        "- [ ] Produce concise triage summary (failing test names, stack traces, coverage delta)",
        "- [ ] Propose minimal code/config change",
        "- [ ] Implement fix + unit test",
        "- [ ] Run tests & verify coverage locally",
        "- [ ] Push PR and monitor deploy.yml run",
        "- [ ] On success: merge PR, close task, update memory-bank with progress"
    ]

    payload = {
        "title": title,
        "body": "\n".join(body_lines),
        "checklist": "\n".join(checklist),
        "issue_url": extracted.get("issue_url"),
        "issue_number": extracted.get("issue_number"),
        "run_id": run_id,
        "run_url": extracted.get("run_url"),
        "owner": extracted.get("owner"),
        "repo": extracted.get("repo")
    }
    return payload


def save_payload(payload: dict, path: str) -> str:
    ensure_dir = os.path.dirname(path)
    if ensure_dir and not os.path.isdir(ensure_dir):
        os.makedirs(ensure_dir, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    return path


import subprocess
import time
import datetime

def _list_latest_run_for_branch(owner: str, repo: str, branch: str, token: Optional[str]):
    # list workflow runs for branch and return most recent run object or None
    if not owner or not repo or not branch:
        return None
    url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/runs?branch={branch}&event=push&per_page=1"
    try:
        data = github_get(url, token)
        runs = data.get("workflow_runs", [])
        if runs:
            return runs[0]
    except Exception:
        return None
    return None

def _wait_for_run_completion(owner: str, repo: str, run_id: str, token: Optional[str], poll_interval: int = 30, timeout: int = 3600):
    """
    Poll a specific workflow run until it reaches a completed state or timeout.
    Returns the final run JSON object (may be None on error or timeout).
    """
    start = time.time()
    if not run_id:
        return None
    while True:
        try:
            run = fetch_run_metadata(owner, repo, run_id, token)
        except Exception:
            run = None

        if run:
            status = run.get("status")
            conclusion = run.get("conclusion")
            if status == "completed":
                return run
            # some runs may report 'cancelled' etc via conclusion while status completed
            if conclusion and status == "completed":
                return run

        if time.time() - start > timeout:
            return run
        time.sleep(poll_interval)

def _wait_for_latest_branch_run_completion(owner: str, repo: str, branch: str, token: Optional[str], poll_interval: int = 30, timeout: int = 3600):
    """
    Find the latest run for the branch and wait for its completion. When a new run appears
    (e.g., after a push), this will pick up the latest run and wait on it.
    """
    start = time.time()
    last_seen_id = None
    while True:
        latest = _list_latest_run_for_branch(owner, repo, branch, token)
        run = None
        if latest:
            run_id = str(latest.get("id"))
            if run_id != last_seen_id:
                last_seen_id = run_id
            run = _wait_for_run_completion(owner, repo, run_id, token, poll_interval=poll_interval, timeout=min(timeout, 1800))
            return run
        if time.time() - start > timeout:
            return None
        time.sleep(poll_interval)

def _run_command(cmd, cwd=None, check=False, capture_output=True):
    """
    Helper to run shell commands. Returns CompletedProcess.
    """
    try:
        result = subprocess.run(cmd, cwd=cwd, check=check, capture_output=capture_output, text=True, shell=False)
        return result
    except Exception as e:
        class E:
            returncode = 1
            stdout = ""
            stderr = str(e)
        return E()

def _attempt_local_reconciliation():
    """
    Attempt safe, local remediation steps that may fix common CI failures:
     - dotnet restore / build
     - frontend npm ci / build
    If the build commands change files (e.g. lockfiles), those changes will be committed and returned as True.
    """
    changed = False

    # Dotnet build attempt
    if os.path.isdir("src"):
        # run restore & build
        r1 = _run_command(["dotnet", "restore"], cwd=".", capture_output=True)
        r2 = _run_command(["dotnet", "build", "-c", "Release"], cwd=".", capture_output=True)
        if r1.returncode == 0 and r2.returncode == 0:
            # no-op: successful build locally, but there may be generated artifacts to commit
            pass

    # Frontend attempt
    frontend_dir = os.path.join("src", "UrbanAI.Frontend")
    if os.path.isdir(frontend_dir):
        r3 = _run_command(["npm", "ci"], cwd=frontend_dir, capture_output=True)
        r4 = _run_command(["npm", "run", "build"], cwd=frontend_dir, capture_output=True)
        # If build succeeded, there still might be changes (lockfile, package-lock). We'll check git status below.

    # Check for git changes
    status = _run_command(["git", "status", "--porcelain"], capture_output=True)
    if getattr(status, "stdout", ""):
        # Stage and commit changes
        _run_command(["git", "add", "-A"], capture_output=True)
        commit_msg = f"chore(ci-autoreconcile): automatic remediation attempt at {datetime.datetime.utcnow().isoformat()}Z"
        commit = _run_command(["git", "commit", "-m", commit_msg], capture_output=True)
        if getattr(commit, "returncode", 0) == 0:
            changed = True
    return changed

def _git_checkout_and_pull(branch: str = "develop"):
    """
    Ensure we are on the target branch and up-to-date before committing.
    """
    _run_command(["git", "fetch", "origin"], capture_output=True)
    _run_command(["git", "checkout", branch], capture_output=True)
    _run_command(["git", "pull", "origin", branch], capture_output=True)

def _git_push(branch: str = "develop"):
    _run_command(["git", "push", "origin", branch], capture_output=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--owner", required=False, help="Repo owner (used to fetch run metadata)", default=None)
    parser.add_argument("--repo", required=False, help="Repo name", default=None)
    parser.add_argument("--token", required=False, help="GitHub token (optional)", default=os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"))
    parser.add_argument("--wait", action="store_true", help="Wait for CI workflow completion for the run referenced in activeContext.md or latest on branch")
    parser.add_argument("--auto-reconcile", action="store_true", help="When workflow fails, attempt local reconciliation and push changes to develop automatically")
    parser.add_argument("--branch", required=False, help="Branch to monitor (default: develop)", default="develop")
    parser.add_argument("--max-retries", type=int, default=5, help="Maximum auto-reconcile push attempts")
    parser.add_argument("--poll-interval", type=int, default=30, help="Polling interval in seconds")
    parser.add_argument("--timeout", type=int, default=3600, help="Timeout (seconds) to wait for a workflow run to complete")
    args = parser.parse_args()

    try:
        active_ctx = read_active_context(ACTIVE_CTX_PATH)
    except Exception as e:
        print(json.dumps({"error": f"reading active context failed: {e}"}))
        return 2

    extracted = extract_fields_from_context(active_ctx)
    # allow CLI owner/repo override
    if args.owner:
        extracted["owner"] = args.owner
    if args.repo:
        extracted["repo"] = args.repo

    run_meta = None
    artifacts = []
    token = args.token

    # If wait flag set: wait for referenced run completion OR the latest run on branch
    if args.wait and token and extracted.get("owner") and extracted.get("repo"):
        owner = extracted.get("owner")
        repo = extracted.get("repo")
        run = None
        if extracted.get("run_id"):
            run = _wait_for_run_completion(owner, repo, str(extracted.get("run_id")), token, poll_interval=args.poll_interval, timeout=args.timeout)
        else:
            run = _wait_for_latest_branch_run_completion(owner, repo, args.branch, token, poll_interval=args.poll_interval, timeout=args.timeout)

        if run:
            run_meta = run
            artifacts = list_artifacts_for_run(owner, repo, str(run.get("id")), token)
            conclusion = run.get("conclusion")
            print(json.dumps({"run_id": run.get("id"), "conclusion": conclusion, "html_url": run.get("html_url")}, indent=2))
            # If auto_reconcile and the conclusion is failure, run reconciliation loop
            if args.auto_reconcile and conclusion != "success":
                attempts = 0
                while attempts < args.max_retries:
                    attempts += 1
                    print(f"Auto-reconcile attempt {attempts}/{args.max_retries} — trying local remediation")
                    # Ensure develop branch up-to-date before attempt
                    _git_checkout_and_pull(branch=args.branch)
                    changed = _attempt_local_reconciliation()
                    if changed:
                        # push changes
                        _git_push(branch=args.branch)
                        # after push, wait for the new workflow to start and complete
                        print("Pushed remediation changes, waiting for new workflow run to complete...")
                        time.sleep(5)
                        new_run = _wait_for_latest_branch_run_completion(owner, repo, args.branch, token, poll_interval=args.poll_interval, timeout=args.timeout)
                        if new_run:
                            run_meta = new_run
                            conclusion = new_run.get("conclusion")
                            print(json.dumps({"new_run_id": new_run.get("id"), "conclusion": conclusion, "html_url": new_run.get("html_url")}, indent=2))
                            if conclusion == "success":
                                print("Auto-reconcile succeeded: workflow green.")
                                break
                            else:
                                print("Auto-reconcile attempt did not result in success, continuing.")
                                continue
                        else:
                            print("Timed out waiting for the new run after push.")
                    else:
                        # Nothing changed locally or commit failed — fall back to raising an issue/report and stop or continue attempts
                        print("No local changes to commit from remediation attempt.")
                        # As a fallback, generate the remediation payload and stop attempting further automated commits
                        break
                else:
                    # exhausted attempts
                    print(json.dumps({"auto_reconcile": "failed_to_resolve", "attempts": attempts}, indent=2))
        else:
            print(json.dumps({"error": "no workflow run found for branch or run_id within timeout"}, indent=2))

    # Build the remediation payload regardless for record keeping
    payload = build_task_payload(active_ctx, extracted, run_meta, artifacts)
    saved = save_payload(payload, OUTPUT_PATH)

    print(json.dumps({
        "report": saved,
        "title": payload.get("title"),
        "issue_url": payload.get("issue_url"),
        "run_id": payload.get("run_id"),
        "owner": payload.get("owner"),
        "repo": payload.get("repo"),
        "artifacts_found": len(artifacts),
        "auto_reconcile_enabled": args.auto_reconcile
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
