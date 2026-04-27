#!/usr/bin/env bash
# Wire this clone for day-to-day work on YOUR fork while keeping the original as upstream.
#
# 1) On GitHub: open https://github.com/nellcodx/reservation → Fork (create your fork).
# 2) Run (HTTPS or SSH):
#    ./scripts/setup-fork-remote.sh https://github.com/<you>/reservation.git
#    ./scripts/setup-fork-remote.sh git@github.com:<you>/reservation.git
# 3) Push your dev main:  git push -u origin main
#
# After this:  git pull upstream main   (sync from stable)
#              git push origin main     (dev; does not touch original if you never push upstream)

set -euo pipefail
TOPLEVEL="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$TOPLEVEL" ]]; then
  echo "Run this from inside a git repository." >&2
  exit 1
fi
cd "$TOPLEVEL"

FORK_URL="${1:-}"
if [[ -z "$FORK_URL" && -n "${GITHUB_USER:-}" ]]; then
  FORK_URL="https://github.com/${GITHUB_USER}/reservation.git"
fi
if [[ -z "$FORK_URL" ]]; then
  echo "Usage: $0 <your-fork-url>" >&2
  echo "Example: $0 https://github.com/myuser/reservation.git" >&2
  exit 1
fi

STABLE_HTTPS="https://github.com/nellcodx/reservation.git"
STABLE_SSH="git@github.com:nellcodx/reservation.git"

# If 'origin' still points at the public template, rename it to upstream.
if git remote get-url origin &>/dev/null; then
  CUR="$(git remote get-url origin)"
  if [[ "$CUR" == "$STABLE_HTTPS" || "$CUR" == "$STABLE_SSH" ]]; then
    if git remote get-url upstream &>/dev/null; then
      echo "Remote 'upstream' already exists. Remove or rename it, then re-run." >&2
      exit 1
    fi
    echo "Renaming origin -> upstream (stable reference, do not push here for dev work)"
    git remote rename origin upstream
  fi
fi

# Point origin at your fork (default for push/pull in this clone).
if git remote get-url origin &>/dev/null; then
  echo "Setting origin URL to your fork"
  git remote set-url origin "$FORK_URL"
else
  echo "Adding origin -> your fork"
  git remote add origin "$FORK_URL"
fi

echo ""
echo "Remotes configured:"
git remote -v
echo ""
echo "Next:  git push -u origin main"
echo "Sync from stable:  git fetch upstream && git merge upstream/main   (or rebase)"
