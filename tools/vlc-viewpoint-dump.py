#!/usr/bin/env python3
"""Print VLC 360° viewpoint values while you drag/zoom in the player.

Requires: pip install python-vlc  (and VLC 3.0+ installed on the system)

Usage:
  python3 tools/vlc-viewpoint-dump.py /path/to/your-360-video.mp4

Frame the shot in VLC (drag + scroll zoom), then read the printed yaw/pitch/roll/fov/zoom.
Press Ctrl+C to stop and print final values for DAS-140 calibration.
"""

from __future__ import annotations

import sys
import time

try:
    import vlc
except ImportError:
    print("Install python-vlc first: pip install python-vlc", file=sys.stderr)
    sys.exit(1)


def read_viewpoint(player: vlc.MediaPlayer) -> tuple[float, float, float, float, float]:
    vp = vlc.libvlc_video_new_viewpoint()
    if vp is None:
        raise RuntimeError("libvlc_video_new_viewpoint() returned null")

    get_fn = getattr(vlc, "libvlc_video_get_viewpoint", None)
    if get_fn is None:
        raise RuntimeError(
            "This python-vlc build lacks libvlc_video_get_viewpoint. "
            "Use Advanced Preferences method in docs/assets/DAS-140/README.md instead."
        )

    rc = get_fn(player, vp)
    if rc != 0:
        raise RuntimeError(f"libvlc_video_get_viewpoint failed with code {rc}")

    c = vp.contents
    # field_of_view / zoom exist on newer libvlc; fall back to 0 if missing.
    fov = float(getattr(c, "field_of_view", 0.0))
    zoom = float(getattr(c, "zoom", 0.0))
    return float(c.yaw), float(c.pitch), float(c.roll), fov, zoom


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: vlc-viewpoint-dump.py <video-file>", file=sys.stderr)
        return 1

    path = sys.argv[1]
    instance = vlc.Instance("--quiet")
    player = instance.media_player_new()
    media = instance.media_new(path)
    player.set_media(media)

    if player.play() == -1:
        print("Failed to start playback", file=sys.stderr)
        return 1

    print("VLC viewpoint monitor — drag/zoom in the video window, values update below.")
    print("Columns: yaw°  pitch°  roll°  fov°  zoom")
    print("-" * 56)

    last: tuple[float, float, float, float, float] | None = None

    try:
        while True:
            row = read_viewpoint(player)
            if row != last:
                print(
                    f"yaw={row[0]:7.2f}  pitch={row[1]:7.2f}  roll={row[2]:7.2f}  "
                    f"fov={row[3]:7.2f}  zoom={row[4]:7.3f}"
                )
                last = row
            time.sleep(0.25)
    except KeyboardInterrupt:
        print("\nFinal values (paste into DAS-140 or Authoring calibration):")
        row = read_viewpoint(player)
        print(
            f"  yaw={row[0]:.2f}  pitch={row[1]:.2f}  roll={row[2]:.2f}  "
            f"fov={row[3]:.2f}  zoom={row[4]:.3f}"
        )
        player.stop()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
