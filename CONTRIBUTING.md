# Contributing to UrbanAI

We welcome contributions to the UrbanAI project! To ensure a smooth and collaborative development process, please follow these guidelines.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Request Guidelines](#pull-request-guidelines)
- [Git Branching Conventions](#git-branching-conventions)
- [Development Setup](#development-setup)

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## How to Contribute

### Reporting Bugs
If you find a bug, please open an issue on our [GitHub Issues page](https://github.com/ipanov/UrbanAI/issues). When reporting a bug, please include:
- A clear and concise description of the bug.
- Steps to reproduce the behavior.
- Expected behavior.
- Screenshots or error messages if applicable.
- Your operating system and environment details.

### Suggesting Enhancements
For enhancement suggestions, please open an issue on our [GitHub Issues page](https://github.com/ipanov/UrbanAI/issues). Describe the enhancement, why it would be beneficial, and any potential solutions.

### Your First Code Contribution
If you're looking to make your first contribution, look for issues tagged with `good first issue`.

### Pull Request Guidelines
1.  **Fork the repository** and clone it to your local machine.
2.  **Create a new branch** from `develop` following our [Git Branching Conventions](#git-branching-conventions).
3.  **Implement your changes**. Ensure your code adheres to the project's coding style and best practices.
4.  **Write tests** for your changes.
5.  **Ensure all tests pass**.
6.  **Commit your changes** with clear and concise commit messages.
7.  **Push your branch** to your forked repository.
8.  **Create a Pull Request (PR)** from your branch to the `develop` branch of the main UrbanAI repository.
    *   **PR Title Format:** `[Type]: WI-ID - Short description of changes` (e.g., `feat: 37 - Setup Integration Tests Project`)
    *   Provide a clear description of your changes in the PR body.
    *   Reference any related issues.
9.  **Address review comments** promptly.

## Git Branching Conventions
The UrbanAI project uses a simplified GitFlow strategy with `main` (production-ready) and `develop` (latest integrated development) branches.

### Feature Branch Naming
Branches for new features, bug fixes, or tasks **must** include the associated Azure DevOps Work Item ID.
**Format:** `feature/WI-ID-short-description` (e.g., `feature/37-setup-integration-tests`)

### Pull Request (PR) Titles
PR titles should reference the Work Item ID and clearly state the purpose.
**Format:** `[Type]: WI-ID - Short description of changes` (e.g., `feat: 37 - Setup Integration Tests Project`)

## Development Setup
[Placeholder for development setup instructions. This section will be updated with specific steps for setting up the local development environment, including prerequisites, database setup, and running the application.]
