# skillsio — Secure Agent Skills Installation

> **Stop blindly installing agent skills.** Scan them first.

## The Problem

The open agent skills ecosystem makes it trivial to install third-party instruction sets into coding agents — but that same ease is a vector for **prompt injection, data exfiltration, and credential theft**.

- [Snyk's analysis](https://snyk.io/blog/) of 3,984 published skills found **13.4% had critical security issues** and **76 were confirmed malicious**
- [Koi's ClawHavoc investigation](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting) uncovered **341 malicious skills** using AMOS stealer droppers, reverse shells, base64-encoded payloads, and macOS quarantine bypasses

## What is skillsio?

[skillsio](https://github.com/alonw0/secure-skills) is a security-hardened fork of Vercel's [skills CLI](https://github.com/vercel-labs/skills) that automatically scans agent skills for malicious content **before** installation.

It applies **~81 regex rules** and a **correlation engine** across 8 threat categories:

| Category | What it catches |
|---|---|
| **Exfiltration** | Sending files/env vars to external endpoints |
| **Prompt Injection** | "Ignore previous instructions", role hijacking |
| **Dangerous Filesystem** | `rm -rf`, mass deletion, wiping home directories |
| **Credential Access** | Reading SSH keys, AWS creds, `.env` files, keychains |
| **Suspicious Directives** | "Never ask for confirmation", stealth execution |
| **Downloads / RCE** | `curl \| sh`, downloading and executing remote scripts |
| **Obfuscation** | Base64-encoded commands, Unicode escapes, hex strings |
| **Reverse Shells** | Netcat listeners, cron persistence, service creation |

## Install

```bash
npm install -g skillsio
```

## Quick Start

```bash
# Install a skill (scanned automatically)
skillsio add vercel-labs/agent-skills

# List available skills in a repo without installing
skillsio add owner/repo --list

# Install all skills for all agents
skillsio add owner/repo --all

# Install from a local path
skillsio add ./my-local-skills
```

## Key Security Features

### 1. Automatic Pre-Install Scan

Every `skillsio add` runs a local security scan before anything is installed. Findings are categorized by severity:

- **Critical / High** → always prompts for confirmation (critical blocks even with `--yes`)
- **Medium and below** → noted and auto-continued

### 2. URL Transparency

The scanner extracts and displays all external URLs found in skill files before installation:

```
◆  External URLs found in skill files (2):
│  https://example.com/setup
│  https://hooks.slack.com/services/T00/B00/xxx
│
◆  This skill references external URLs. Continue with installation?
```

### 3. Third-Party Audits via skills.sh

For GitHub-sourced skills, the CLI checks [skills.sh](https://skills.sh) for independent security audits from **Snyk**, **Socket**, and **Gen Agent Trust Hub**:

```
◆ skills.sh: 3 audits  [Snyk ✗]  [Socket ✓]  [Trust Hub ✗]
```

A **Fail** verdict from any auditor escalates severity to at least **High**, triggering a confirmation prompt.

### 4. VirusTotal Integration (Optional)

Add threat intelligence by providing a VirusTotal API key:

```bash
# Via flag
skillsio add owner/repo --vt-key YOUR_API_KEY

# Via environment variable
VT_API_KEY=YOUR_API_KEY skillsio add owner/repo
```

```
◆ VirusTotal: ✗ malicious (14/72 engines)
  Code Insight: Downloads and executes external binary...

◆ VirusTotal: ✓ clean (0/72 engines)
```

### 5. Deep Taint Analysis

The `--deep-scan` flag enables lightweight taint analysis that tracks how data flows from **sources** (environment variables, credential files) to **sinks** (network calls, exec, file writes) — catching attacks that regex alone can't:

```bash
skillsio add owner/repo --deep-scan
```

Catches variable-mediated exfiltration, `getattr` tricks, and cross-file attack patterns in Python/JS/TS files.

### 6. Custom Organization Rules

Extend the scanner with your own rules:

```json
{
  "rules": [
    {
      "id": "no-internal-api",
      "severity": "critical",
      "description": "References internal API",
      "pattern": "https?://internal\\.company\\.com",
      "flags": "i"
    }
  ]
}
```

```bash
skillsio add owner/repo --rules ./company-rules.json
```

## CLI Reference

### Commands

| Command | Description |
|---|---|
| `add <source>` | Install skills from GitHub, git URLs, or local paths |
| `list` / `ls` | List installed skills |
| `find [query]` | Search for skills interactively |
| `remove` / `rm` | Remove installed skills |
| `check` | Check for available skill updates |
| `update` | Update all installed skills to latest |
| `init [name]` | Create a new SKILL.md template |

### Add Options

| Option | Description |
|---|---|
| `-g, --global` | Install to user-level directory instead of project |
| `-a, --agent <agents>` | Target specific agents (e.g. `claude-code`, `cursor`, `github-copilot`) |
| `-s, --skill <skills>` | Install specific skills by name (`'*'` for all) |
| `-l, --list` | List available skills without installing |
| `-y, --yes` | Skip confirmation prompts |
| `--all` | Install all skills to all agents without prompts |
| `--skip-scan` | Skip the security scan (use only for trusted sources) |
| `--deep-scan` | Enable deep taint analysis on Python/JS/TS files |
| `--vt-key <key>` | VirusTotal API key for threat intelligence |
| `--rules <path>` | Load additional scan rules from JSON file or directory |

## Supported Agents (40+)

Works with **Claude Code**, **GitHub Copilot**, **Cursor**, **Codex**, **Windsurf**, **Cline**, **Roo Code**, **Amp**, **OpenCode**, **Gemini CLI**, **Continue**, **Goose**, **Junie**, **Kilo Code**, and many more.

The CLI auto-detects which agents you have installed.

### Installation Scope

| Scope | Flag | Location | Use Case |
|---|---|---|---|
| **Project** | (default) | `./<agent>/skills/` | Committed with your project |
| **Global** | `-g` | `~/<agent>/skills/` | Available across all projects |

## Examples

```bash
# Scan and install a specific skill for Copilot
skillsio add vercel-labs/agent-skills --skill react-patterns --agent github-copilot

# Install globally with deep scanning and VirusTotal
VT_API_KEY=xxx skillsio add owner/repo -g --deep-scan

# Browse what's in a repo first
skillsio add owner/repo --list

# Remove a skill
skillsio remove react-patterns

# Check for updates
skillsio check
```

## Why Not Just Use the Original `skills` CLI?

| Feature | `skills` (Vercel) | `skillsio` |
|---|---|---|
| Install skills | ✅ | ✅ |
| Security scan before install | ❌ | ✅ (~81 rules) |
| URL transparency | ❌ | ✅ |
| VirusTotal integration | ❌ | ✅ |
| skills.sh third-party audits | ❌ | ✅ |
| Deep taint analysis | ❌ | ✅ |
| Custom organization rules | ❌ | ✅ |
| Telemetry | ✅ (sends events to Vercel) | ❌ (removed) |

## Links

- **Repository:** https://github.com/alonw0/secure-skills
- **Skills Directory:** https://skills.sh
- **Agent Skills Specification:** https://agentskills.io
