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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--owner", required=False, help="Repo owner (used to fetch run metadata)", default=None)
    parser.add_argument("--repo", required=False, help="Repo name", default=None)
    parser.add_argument("--token", required=False, help="GitHub token (optional)", default=os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"))
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
    if args.token and extracted.get("owner") and extracted.get("repo") and extracted.get("run_id"):
        run_meta = fetch_run_metadata(extracted["owner"], extracted["repo"], extracted["run_id"], args.token)
        artifacts = list_artifacts_for_run(extracted["owner"], extracted["repo"], extracted["run_id"], args.token)

    payload = build_task_payload(active_ctx, extracted, run_meta, artifacts)
    saved = save_payload(payload, OUTPUT_PATH)

    print(json.dumps({
        "report": saved,
        "title": payload.get("title"),
        "issue_url": payload.get("issue_url"),
        "run_id": payload.get("run_id"),
        "owner": payload.get("owner"),
        "repo": payload.get("repo"),
        "artifacts_found": len(artifacts)
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
