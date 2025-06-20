# Git Branching Conventions in UrbanAI

This document outlines the Git branching conventions to be followed for the UrbanAI project, adhering to best practices for Azure DevOps integration, automatic work item linking, and pull request (PR) completion.

## Branching Strategy: GitFlow

The UrbanAI project utilizes a simplified GitFlow branching strategy with the following core branches:

*   **`main`**: Represents the production-ready code. All merges into `main` must come from `develop` via a pull request after the entire Epic is complete.
*   **`develop`**: Represents the latest integrated development code. All feature branches are merged into `develop` via pull requests.

## Feature Branches

All new features, bug fixes, and tasks should be developed in dedicated feature branches. These branches should be short-lived and merged into `develop` as soon as the work is complete and reviewed.

### Naming Convention for Feature Branches

To enable automatic work item linking and closure in Azure DevOps, feature branches **must** follow a consistent naming convention that includes the associated Work Item ID.

**Recommended Format:**

`feature/WI-ID-short-description`

Where:
*   `feature`: Indicates a feature branch (can also be `bugfix`, `hotfix`, `users/username`, etc.).
*   `WI-ID`: The Azure DevOps Work Item ID (e.g., Task ID, Bug ID, Feature ID).
*   `short-description`: A concise, hyphen-separated description of the work being done.

**Examples:**

*   `feature/37-setup-integration-tests` (for Task ID 37)
*   `bugfix/123-fix-login-issue` (for Bug ID 123)
*   `users/ilijapanov/45-implement-auth-flow` (for Task ID 45, assigned to Ilija Panov)

### Automatic Work Item Linking and PR Completion

When a branch name includes a Work Item ID in the specified format, Azure DevOps can automatically:
*   Link the branch to the work item.
*   Link any Pull Requests created from that branch to the work item.
*   Potentially transition the work item state (e.g., to "Closed") upon PR completion, if configured in branch policies.

**Important Note:** Ensure that the Work Item ID is present and correctly formatted in the branch name for these automatic integrations to function.

## Pull Request (PR) Titles

PR titles should clearly indicate the purpose of the changes and ideally reference the associated Work Item ID.

**Recommended Format:**

`[Type]: WI-ID - Short description of changes`

Where:
*   `[Type]`: Commit type (e.g., `feat`, `fix`, `chore`, `docs`, `refactor`).
*   `WI-ID`: The Azure DevOps Work Item ID.
*   `Short description of changes`: A brief summary of the changes.

**Example:**

`feat: 37 - Setup Integration Tests Project`

## Workflow Summary

1.  Create a new feature branch from `develop` using the `feature/WI-ID-short-description` convention.
2.  Implement changes and commit frequently.
3.  Push the feature branch to the remote repository.
4.  Create a Pull Request from the feature branch to `develop`, using the recommended PR title format.
5.  Ensure all branch policies are met (e.g., build validation, minimum reviewers).
6.  Once approved and merged, the associated work item should automatically link and potentially transition its state.
