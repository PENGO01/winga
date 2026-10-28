---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read `rules.md` in this folder (or fetch the latest from the source URL below)
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Read the rules from `rules.md` in this folder (a pinned copy of vercel-labs/web-interface-guidelines `command.md`, commit 434b7f9, MIT).
If the network allows, you may also fetch the latest copy and note any new rules:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Niagize is plain HTML + JS (no React): skip the Hydration Safety rules. Where a rule clashes with `DESIGN.md` at the repo root, DESIGN.md wins; report the clash instead of "fixing" it.

## Usage

When a user provides a file or pattern argument:
1. Read `rules.md` (or fetch the latest from the source URL above)
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
