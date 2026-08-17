# DAS-140 — VLC viewpoint calibration

Reference screenshot: `vlc-reference-little-planet.png`

## Capture viewpoint numbers from VLC (macOS)

## Capture viewpoint numbers

VLC.app on macOS **does not expose** `viewpoint-yaw/pitch/roll/fov` in Settings, and the
installed libvlc build **omits** `libvlc_video_get_viewpoint`. You cannot pause in VLC.app
and read the numbers back with Python afterward.

### Option 1 — interactive framer (recommended)

Uses the same libVLC engine with live, capturable numbers:

```bash
cd /Volumes/Three/apps/dashbuilder/rosettadash
./tools/setup-vlc-env.sh          # one-time
./tools/vlc-viewpoint-framer.sh /path/to/your-360-video.mp4
```

Drag to frame, scroll for FOV, press **Enter** to print values.

### Option 2 — Authoring tab (same codebase)

Load the same file in the Authoring tab. Match the VLC frame visually; read
**Yaw**, **Pitch**, and **Horizontal FOV** from the sliders (already capturable).

### Method B — Advanced Preferences (no Python)

1. Open the same video in VLC.
2. Frame the shot (drag + zoom), then **pause** (Space).
3. **VLC → Settings…** (⌘,) → bottom-left **All**.
4. Search each name and note the value:

| Search term | Meaning |
|-------------|---------|
| `viewpoint-yaw` | Horizontal rotation |
| `viewpoint-pitch` | Vertical rotation |
| `viewpoint-roll` | Roll |
| `viewpoint-fov` | Field of view |
| `viewpoint-zoom` | Zoom factor |

**Note:** These fields may show startup defaults until VLC writes them back. If values look like 0 while the view is clearly rotated, use Method A instead.

### Method C — Messages log

1. **Window → Messages**
2. Set verbosity to **2**
3. Drag/zoom; search the log for `viewpoint` or `INPUT_SET_VIEWPOINT`

## User workflow (confirmed)

The reference view was made in **360° Sphere** mode by **click-dragging in circles** plus **scroll zoom** — not necessarily **Video → Projection → Little Planet**. DAS-140 should calibrate against this drag+zoom workflow first.
