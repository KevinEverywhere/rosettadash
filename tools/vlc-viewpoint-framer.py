#!/usr/bin/env python3
"""Interactive 360° framer with capturable yaw/pitch/roll/fov/zoom.

VLC.app does not expose viewpoint numbers in Settings, and the macOS libvlc
build omits libvlc_video_get_viewpoint — so we cannot read values back from a
running VLC window. This script opens the same libVLC engine in a small window,
lets you drag/zoom like VLC, tracks the numbers locally, and prints them on Enter.

Usage:
  ./tools/vlc-viewpoint-framer.sh /path/to/your-360-video.mp4
"""

from __future__ import annotations

import sys
import tkinter as tk
from tkinter import ttk

try:
    import vlc
except ImportError:
    print("Run ./tools/setup-vlc-env.sh first.", file=sys.stderr)
    sys.exit(1)

MIN_FOV = 20.0
MAX_FOV = 150.0
DRAG_SENSITIVITY = 0.25
WHEEL_FOV_STEP = 3.0


class ViewpointFramer:
    def __init__(self, video_path: str) -> None:
        self.video_path = video_path
        self.yaw = 0.0
        self.pitch = 0.0
        self.roll = 0.0
        self.fov = 80.0
        self.zoom = 0.0
        self._drag_last: tuple[int, int] | None = None

        self.root = tk.Tk()
        self.root.title("VLC viewpoint framer — drag to frame, Enter to print values")
        self.root.geometry("960x640")

        self.video_frame = tk.Frame(self.root, bg="#000")
        self.video_frame.pack(fill=tk.BOTH, expand=True)

        panel = ttk.Frame(self.root, padding=8)
        panel.pack(fill=tk.X)

        self.status = tk.StringVar(value=self._status_text())
        ttk.Label(panel, textvariable=self.status, font=("Menlo", 11)).pack(anchor="w")
        ttk.Label(
            panel,
            text="Drag = yaw/pitch · Scroll = FOV · r = reset · Enter = print & quit",
        ).pack(anchor="w", pady=(6, 0))

        self.instance = vlc.Instance("--quiet")
        self.player = self.instance.media_player_new()
        media = self.instance.media_new(video_path)
        self.player.set_media(media)

        # macOS embed
        self.root.update_idletasks()
        self.player.set_nsobject(self.video_frame.winfo_id())

        self.video_frame.bind("<ButtonPress-1>", self._on_press)
        self.video_frame.bind("<B1-Motion>", self._on_drag)
        self.video_frame.bind("<ButtonRelease-1>", self._on_release)
        self.video_frame.bind("<MouseWheel>", self._on_wheel)
        self.root.bind("<Return>", self._on_enter)
        self.root.bind("r", self._on_reset)

        self.root.after(200, self._start_playback)
        self.root.after(400, self._poll_scale)

    def _status_text(self) -> str:
        return (
            f"yaw={self.yaw:7.2f}  pitch={self.pitch:7.2f}  roll={self.roll:7.2f}  "
            f"fov={self.fov:7.2f}  zoom={self.zoom:7.3f}"
        )

    def _apply_viewpoint(self) -> None:
        vp = vlc.libvlc_video_new_viewpoint()
        c = vp.contents
        c.f_yaw = self.yaw
        c.f_pitch = self.pitch
        c.f_roll = self.roll
        c.f_field_of_view = self.fov
        self.player.video_update_viewpoint(vp, True)
        self.status.set(self._status_text())

    def _start_playback(self) -> None:
        self.player.play()
        self._apply_viewpoint()

    def _poll_scale(self) -> None:
        try:
            scale = float(self.player.video_get_scale())
            if scale != 0.0:
                self.zoom = scale
                self.status.set(self._status_text())
        except Exception:
            pass
        self.root.after(250, self._poll_scale)

    def _on_press(self, event: tk.Event) -> None:
        self._drag_last = (event.x, event.y)

    def _on_drag(self, event: tk.Event) -> None:
        if self._drag_last is None:
            return
        dx = event.x - self._drag_last[0]
        dy = event.y - self._drag_last[1]
        self._drag_last = (event.x, event.y)
        self.yaw = (self.yaw - dx * DRAG_SENSITIVITY) % 360.0
        self.pitch = max(-90.0, min(90.0, self.pitch - dy * DRAG_SENSITIVITY))
        self._apply_viewpoint()

    def _on_release(self, _event: tk.Event) -> None:
        self._drag_last = None

    def _on_wheel(self, event: tk.Event) -> None:
        delta = 1 if event.delta > 0 else -1
        self.fov = max(MIN_FOV, min(MAX_FOV, self.fov - delta * WHEEL_FOV_STEP))
        self._apply_viewpoint()

    def _on_reset(self, _event: tk.Event | None = None) -> None:
        self.yaw = 0.0
        self.pitch = 0.0
        self.roll = 0.0
        self.fov = 80.0
        self.zoom = 0.0
        self.player.video_set_scale(0)
        self._apply_viewpoint()

    def _on_enter(self, _event: tk.Event | None = None) -> None:
        print("\nFinal viewpoint values (paste into chat or DAS-140):")
        print(
            f"  yaw={self.yaw:.2f}  pitch={self.pitch:.2f}  roll={self.roll:.2f}  "
            f"fov={self.fov:.2f}  zoom={self.zoom:.3f}"
        )
        self.player.stop()
        self.root.quit()

    def run(self) -> None:
        self.root.mainloop()


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: vlc-viewpoint-framer.py <video-file>", file=sys.stderr)
        return 1
    if not __import__("os").path.isfile(sys.argv[1]):
        print(f"File not found: {sys.argv[1]}", file=sys.stderr)
        return 1

    ViewpointFramer(sys.argv[1]).run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
