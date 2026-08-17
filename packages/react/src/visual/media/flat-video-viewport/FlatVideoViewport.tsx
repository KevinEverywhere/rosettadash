import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type RefObject,
} from 'react';
import { clampCropToSource, type FlatCropRect } from '@rosettadash/core';

export type FlatVideoCropChange = FlatCropRect;

export interface FlatVideoViewportHandle {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPaused: () => boolean;
  getOutputCanvas: () => HTMLCanvasElement | null;
  startRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
}

export interface FlatVideoViewportProps {
  videoSrc?: string | null;
  sourceWidth: number;
  sourceHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  outputWidth?: number;
  outputHeight?: number;
  lockAspectRatio?: boolean;
  className?: string;
  style?: CSSProperties;
  outputPreviewHostRef?: RefObject<HTMLElement | null>;
  onCropChange?: (detail: FlatVideoCropChange) => void;
}

type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se';

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function pickRecorderMimeType(): string {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

function previewCanvasSize(cropWidth: number, cropHeight: number, maxEdge = 720) {
  const safeCropWidth = Math.max(2, Math.round(cropWidth));
  const safeCropHeight = Math.max(2, Math.round(cropHeight));
  const scale = Math.min(1, maxEdge / Math.max(safeCropWidth, safeCropHeight));
  return {
    width: Math.max(2, Math.round((safeCropWidth * scale) / 2) * 2),
    height: Math.max(2, Math.round((safeCropHeight * scale) / 2) * 2),
  };
}

function fitCropSizeInHost(
  cropWidth: number,
  cropHeight: number,
  hostWidth: number,
  hostHeight: number,
  dpr = 1,
) {
  const cropW = Math.max(2, Math.round(cropWidth));
  const cropH = Math.max(2, Math.round(cropHeight));
  const cropAspect = cropW / cropH;
  const hostAspect = hostWidth / hostHeight;

  let fitWidth: number;
  let fitHeight: number;
  if (cropAspect > hostAspect) {
    fitWidth = hostWidth;
    fitHeight = hostWidth / cropAspect;
  } else {
    fitHeight = hostHeight;
    fitWidth = hostHeight * cropAspect;
  }

  return {
    width: Math.max(2, Math.round((fitWidth * dpr) / 2) * 2),
    height: Math.max(2, Math.round((fitHeight * dpr) / 2) * 2),
  };
}

function applyPreviewCanvasLayout(
  canvas: HTMLCanvasElement,
  cropWidth: number,
  cropHeight: number,
  host?: HTMLElement | null,
) {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const rect = host?.getBoundingClientRect();
  const { width, height } =
    rect && rect.width > 0 && rect.height > 0
      ? fitCropSizeInHost(cropWidth, cropHeight, rect.width, rect.height, dpr)
      : previewCanvasSize(cropWidth, cropHeight);

  canvas.width = width;
  canvas.height = height;
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
  canvas.style.removeProperty('max-width');
  canvas.style.removeProperty('max-height');
  canvas.style.removeProperty('aspect-ratio');
}

function drawFlatCropPreview(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);
}

function cropToPercent(crop: FlatCropRect, sourceWidth: number, sourceHeight: number) {
  return {
    left: (crop.cropX / sourceWidth) * 100,
    top: (crop.cropY / sourceHeight) * 100,
    width: (crop.cropWidth / sourceWidth) * 100,
    height: (crop.cropHeight / sourceHeight) * 100,
  };
}

function pointerToSource(
  clientX: number,
  clientY: number,
  frameRect: DOMRect,
  sourceWidth: number,
  sourceHeight: number,
) {
  const x = clamp(((clientX - frameRect.left) / frameRect.width) * sourceWidth, 0, sourceWidth);
  const y = clamp(((clientY - frameRect.top) / frameRect.height) * sourceHeight, 0, sourceHeight);
  return { x, y };
}

export const FlatVideoViewport = forwardRef<FlatVideoViewportHandle, FlatVideoViewportProps>(
  function FlatVideoViewport(
    {
      videoSrc,
      sourceWidth,
      sourceHeight,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      outputWidth = 640,
      outputHeight = 360,
      lockAspectRatio = false,
      className,
      style,
      outputPreviewHostRef,
      onCropChange,
    },
    ref,
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const propsRef = useRef({
      sourceWidth,
      sourceHeight,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      outputWidth,
      outputHeight,
      lockAspectRatio,
      onCropChange,
    });
    propsRef.current = {
      sourceWidth,
      sourceHeight,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      outputWidth,
      outputHeight,
      lockAspectRatio,
      onCropChange,
    };

    const dragRef = useRef<{
      mode: DragMode;
      startX: number;
      startY: number;
      origin: FlatCropRect;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      play: async () => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        await video.play();
      },
      pause: () => videoRef.current?.pause(),
      stop: () => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        video.pause();
        video.currentTime = 0;
      },
      seek: (time: number) => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        video.currentTime = clamp(time, 0, video.duration || time);
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      getDuration: () => videoRef.current?.duration ?? 0,
      isPaused: () => videoRef.current?.paused ?? true,
      getOutputCanvas: () => outputCanvasRef.current,
      startRecording: () => {
        const canvas = outputCanvasRef.current;
        const host = hostRef.current as (HTMLDivElement & { __recorder?: MediaRecorder | null; __recordedChunks?: Blob[] }) | null;
        if (!canvas || !host || host.__recorder) {
          return;
        }
        const stream = canvas.captureStream(30);
        const chunks: Blob[] = [];
        host.__recordedChunks = chunks;
        const recorder = new MediaRecorder(stream, { mimeType: pickRecorderMimeType() });
        host.__recorder = recorder;
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        recorder.start(200);
      },
      stopRecording: () =>
        new Promise((resolve) => {
          const host = hostRef.current as (HTMLDivElement & { __recorder?: MediaRecorder | null; __recordedChunks?: Blob[] }) | null;
          const recorder = host?.__recorder;
          if (!recorder || recorder.state === 'inactive') {
            resolve(null);
            return;
          }
          recorder.onstop = () => {
            const chunks = host?.__recordedChunks ?? [];
            host.__recorder = null;
            host.__recordedChunks = [];
            resolve(new Blob(chunks, { type: recorder.mimeType || 'video/webm' }));
          };
          recorder.stop();
        }),
    }));

    useEffect(() => {
      const host = outputPreviewHostRef?.current;
      if (!host) {
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.className = 'rd-flat-video-viewport__mirror';
      canvas.setAttribute('aria-label', 'Output view (cropped region)');
      host.appendChild(canvas);
      outputCanvasRef.current = canvas;

      const resize = () => {
        const { cropWidth: cw, cropHeight: ch } = propsRef.current;
        applyPreviewCanvasLayout(canvas, cw, ch, host);
      };
      resize();

      let animationId = 0;
      const tick = () => {
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        if (video && ctx && video.readyState >= 2) {
          const { cropX: cx, cropY: cy, cropWidth: cw, cropHeight: ch } = propsRef.current;
          drawFlatCropPreview(ctx, video, cx, cy, cw, ch, canvas.width, canvas.height);
        }
        animationId = requestAnimationFrame(tick);
      };
      tick();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        canvas.remove();
        outputCanvasRef.current = null;
      };
    }, [outputPreviewHostRef, videoSrc]);

    useEffect(() => {
      const canvas = outputCanvasRef.current;
      if (!canvas) {
        return;
      }
      applyPreviewCanvasLayout(canvas, cropWidth, cropHeight, outputPreviewHostRef?.current);
    }, [cropWidth, cropHeight, outputPreviewHostRef]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !videoSrc) {
        return;
      }
      video.src = videoSrc;
      video.load();
      void video.play().catch(() => undefined);
    }, [videoSrc]);

    const emitCrop = (next: FlatCropRect) => {
      const clamped = clampCropToSource(next, propsRef.current.sourceWidth, propsRef.current.sourceHeight);
      propsRef.current.onCropChange?.(clamped);
    };

    const applyDrag = (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      const frame = frameRef.current;
      if (!drag || !frame) {
        return;
      }
      const { sourceWidth: sw, sourceHeight: sh, lockAspectRatio: lock } = propsRef.current;
      const frameRect = frame.getBoundingClientRect();
      const pointer = pointerToSource(clientX, clientY, frameRect, sw, sh);
      const dx = pointer.x - drag.startX;
      const dy = pointer.y - drag.startY;
      const origin = drag.origin;
      const outputAspect = propsRef.current.outputWidth / propsRef.current.outputHeight;

      if (drag.mode === 'move') {
        emitCrop({
          cropX: origin.cropX + dx,
          cropY: origin.cropY + dy,
          cropWidth: origin.cropWidth,
          cropHeight: origin.cropHeight,
        });
        return;
      }

      let nextX = origin.cropX;
      let nextY = origin.cropY;
      let nextW = origin.cropWidth;
      let nextH = origin.cropHeight;

      if (drag.mode.includes('e')) {
        nextW = origin.cropWidth + dx;
      }
      if (drag.mode.includes('w')) {
        nextW = origin.cropWidth - dx;
        nextX = origin.cropX + dx;
      }
      if (drag.mode.includes('s')) {
        nextH = origin.cropHeight + dy;
      }
      if (drag.mode.includes('n')) {
        nextH = origin.cropHeight - dy;
        nextY = origin.cropY + dy;
      }

      if (lock && outputAspect > 0) {
        nextH = nextW / outputAspect;
        if (drag.mode.includes('n')) {
          nextY = origin.cropY + origin.cropHeight - nextH;
        }
        if (drag.mode.includes('w')) {
          nextX = origin.cropX + origin.cropWidth - nextW;
        }
      }

      nextW = Math.max(2, nextW);
      nextH = Math.max(2, nextH);
      emitCrop({ cropX: nextX, cropY: nextY, cropWidth: nextW, cropHeight: nextH });
    };

    const onPointerDown = (event: React.PointerEvent, mode: DragMode) => {
      const frame = frameRef.current;
      if (!frame || event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const frameRect = frame.getBoundingClientRect();
      const pointer = pointerToSource(event.clientX, event.clientY, frameRect, sourceWidth, sourceHeight);
      dragRef.current = {
        mode,
        startX: pointer.x,
        startY: pointer.y,
        origin: { cropX, cropY, cropWidth, cropHeight },
      };

      const onWindowMove = (moveEvent: PointerEvent) => {
        applyDrag(moveEvent.clientX, moveEvent.clientY);
      };
      const onWindowUp = () => {
        dragRef.current = null;
        window.removeEventListener('pointermove', onWindowMove);
        window.removeEventListener('pointerup', onWindowUp);
        window.removeEventListener('pointercancel', onWindowUp);
      };
      window.addEventListener('pointermove', onWindowMove);
      window.addEventListener('pointerup', onWindowUp);
      window.addEventListener('pointercancel', onWindowUp);
    };

    const cropPct = cropToPercent({ cropX, cropY, cropWidth, cropHeight }, sourceWidth, sourceHeight);
    const rootClass = ['rd-flat-video-viewport', className].filter(Boolean).join(' ');

    return (
      <div ref={hostRef} className={rootClass} style={style} data-testid="rd-flat-video-viewport">
        <div
          ref={frameRef}
          className="rd-flat-video-viewport__frame"
          style={{ aspectRatio: `${sourceWidth} / ${sourceHeight}` }}
        >
          <video
            ref={videoRef}
            className="rd-flat-video-viewport__video"
            muted
            playsInline
            loop={false}
            crossOrigin="anonymous"
          />
          <div
            className="rd-flat-video-viewport__crop"
            style={{
              left: `${cropPct.left}%`,
              top: `${cropPct.top}%`,
              width: `${cropPct.width}%`,
              height: `${cropPct.height}%`,
            }}
            onPointerDown={(event) => onPointerDown(event, 'move')}
          >
            {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
              <span
                key={handle}
                className={`rd-flat-video-viewport__handle rd-flat-video-viewport__handle--${handle}`}
                onPointerDown={(event) => onPointerDown(event, handle)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);
