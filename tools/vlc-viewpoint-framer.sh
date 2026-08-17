#!/usr/bin/env bash
# Interactive 360 framer with live capturable viewpoint values.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/tools/.venv-vlc"
PYTHON="$VENV/bin/python"
SCRIPT="$ROOT/tools/vlc-viewpoint-framer.py"

if [[ ! -x "$PYTHON" ]]; then
  echo "Python env not found. Run this once first:" >&2
  echo "  ./tools/setup-vlc-env.sh" >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: ./tools/vlc-viewpoint-framer.sh /path/to/your-360-video.mp4" >&2
  exit 1
fi

VLC_LIB="/Applications/VLC.app/Contents/MacOS/lib"
VLC_PLUGINS="/Applications/VLC.app/Contents/MacOS/plugins"

if [[ ! -d "$VLC_LIB" ]]; then
  echo "VLC not found at /Applications/VLC.app" >&2
  exit 1
fi

export VLC_PLUGIN_PATH="$VLC_PLUGINS"
export DYLD_FALLBACK_LIBRARY_PATH="${VLC_LIB}${DYLD_FALLBACK_LIBRARY_PATH:+:$DYLD_FALLBACK_LIBRARY_PATH}"

exec "$PYTHON" "$SCRIPT" "$@"
