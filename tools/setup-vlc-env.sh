#!/usr/bin/env bash
# Create optional local Python env for rosettadash tools (VLC helpers, etc.)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/tools/.venv-vlc"

echo "Creating Python virtual environment at tools/.venv-vlc ..."
python3 -m venv "$VENV"

echo "Installing python-vlc ..."
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/pip" install -r "$ROOT/tools/requirements-vlc.txt"

echo
echo "Optional Python env is ready at tools/.venv-vlc/"
echo
echo "To capture VLC viewpoint values (no Python needed), run:"
echo "  ./tools/vlc-viewpoint-dump.sh /path/to/your-360-video.mp4"
