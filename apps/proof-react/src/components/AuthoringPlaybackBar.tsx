import { useEffect, useState } from 'react';
import type { EquirectSphereViewportHandle } from '@rosettadash/react/visual/media/equirect-sphere-viewport';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

type Props = {
  viewportRef: React.RefObject<EquirectSphereViewportHandle | null>;
  disabled?: boolean;
  onResetView?: () => void;
};

export function AuthoringPlaybackBar({ viewportRef, disabled = false, onResetView }: Props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [recording, setRecording] = useState(false);
  const [saveUrl, setSaveUrl] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (saveUrl) {
        URL.revokeObjectURL(saveUrl);
      }
    },
    [saveUrl],
  );

  const syncFromViewport = () => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    setCurrentTime(viewport.getCurrentTime());
    setDuration(viewport.getDuration());
    setPaused(viewport.isPaused());
  };

  useEffect(() => {
    const id = window.setInterval(syncFromViewport, 250);
    return () => window.clearInterval(id);
  }, [viewportRef]);

  const handlePlayPause = async () => {
    const viewport = viewportRef.current;
    if (!viewport || disabled) {
      return;
    }
    if (viewport.isPaused()) {
      await viewport.play();
    } else {
      viewport.pause();
    }
    syncFromViewport();
  };

  const handleStop = () => {
    viewportRef.current?.stop();
    syncFromViewport();
  };

  const handleSeek = (value: number) => {
    viewportRef.current?.seek(value);
    setCurrentTime(value);
  };

  const handleRecordToggle = async () => {
    const viewport = viewportRef.current;
    if (!viewport || disabled) {
      return;
    }
    if (!recording) {
      viewport.startRecording();
      setRecording(true);
      if (viewport.isPaused()) {
        await viewport.play();
      }
      return;
    }
    const blob = await viewport.stopRecording();
    setRecording(false);
    if (!blob) {
      return;
    }
    setSaveUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(blob);
    });
  };

  const handleSave = () => {
    if (!saveUrl) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = saveUrl;
    anchor.download = `authoring-recording-${Date.now()}.webm`;
    anchor.click();
  };

  return (
    <div className="da-authoring-playback" aria-label="Source playback and recording">
      <h4 className="da-authoring-playback__title">Playback</h4>
      <div className="da-authoring-playback__transport">
        <button type="button" className="da-authoring-playback__btn" disabled={disabled} onClick={() => void handlePlayPause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        <button type="button" className="da-authoring-playback__btn" disabled={disabled} onClick={handleStop}>
          Stop
        </button>
        <button
          type="button"
          className={`da-authoring-playback__btn${recording ? ' is-active' : ''}`}
          disabled={disabled}
          onClick={() => void handleRecordToggle()}
        >
          {recording ? 'Stop recording' : 'Record'}
        </button>
        <button type="button" className="da-authoring-playback__btn" disabled={disabled || !saveUrl} onClick={handleSave}>
          Save
        </button>
        <button type="button" className="da-authoring-playback__btn" disabled={disabled || !onResetView} onClick={onResetView}>
          Reset view
        </button>
      </div>
      <label className="da-authoring-playback__scrub">
        <span className="da-authoring-playback__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 0}
          step={0.05}
          value={Math.min(currentTime, duration || 0)}
          disabled={disabled || duration <= 0}
          onChange={(event) => handleSeek(Number(event.target.value))}
        />
        <span className="da-authoring-playback__time">{formatTime(duration)}</span>
      </label>
      <p className="da-note da-authoring-playback__hint">
        Drag on the sphere or use Camera framing sliders · FOV above 130° enters little-planet
      </p>
    </div>
  );
}
