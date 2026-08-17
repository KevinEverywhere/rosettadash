#!/usr/bin/env bash
# Print a reminder: viewpoint values cannot be read from a running VLC.app window.
set -euo pipefail

cat <<'EOF'
Cannot read viewpoint numbers from VLC.app after the fact.

Your VLC build (3.0.x macOS) does not expose libvlc_video_get_viewpoint, and
the viewpoint-* settings are not shown in the Settings UI.

Use the interactive framer instead (same libVLC engine, capturable numbers):

  ./tools/vlc-viewpoint-framer.sh /path/to/your-360-video.mp4

Drag/zoom to match your VLC framing, then press Enter to print values.

Or use the Authoring tab sliders on the same file — they already show yaw,
pitch, and horizontal FOV as you frame.
EOF
