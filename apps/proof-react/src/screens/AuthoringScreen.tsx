import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AUTHORING_OUTPUT_CUSTOM_ID,
  AUTHORING_OUTPUT_PRESETS,
  getAuthoringOutputPreset,
  virtualCameraToCropRegion,
} from '@rosettadash/core';
import {
  EquirectSphereViewport,
  type EquirectSphereViewportHandle,
} from '@rosettadash/react/visual/media/equirect-sphere-viewport';
import { CheckboxInput } from '@rosettadash/react/visual/input/checkbox';
import { WasmMedia } from '@rosettadash/react/visual/wasm/media';
import { NumberInput } from '@rosettadash/react/visual/input/number';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import {
  DEFAULT_AUTHORING_EXAMPLE_ID,
  DESTINATION_ATLAS_AUTHORING_EXAMPLES,
  getAuthoringExampleById,
  getAuthoringExampleForDestinationId,
  getDestinationById,
  resolveEquirectSourceVideoUrl,
} from '@destination-atlas';
import { AuthoringPlaybackBar } from '../components/AuthoringPlaybackBar';
import { AuthoringCameraControls, LITTLE_PLANET_HFOV, LITTLE_PLANET_PITCH } from '../components/AuthoringCameraControls';
import { localizedDestinationName } from '../lib/atlas-utils';

export const AUTHORING_SOURCE = `<AuthoringScreen>
  <VideoSource onVideoFile={…} />
  <EquirectSphereViewport videoSrc={sourceUrl} yaw={…} pitch={…} />
  <WasmMedia operation="equirect-extract" inputFile={inputFile} />
</AuthoringScreen>`;

type CropRegion = Record<string, string | number | boolean | null | undefined>;

function probeVideoFile(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    video.src = url;
  });
}

function matchOutputPreset(width: number, height: number): string {
  const match = AUTHORING_OUTPUT_PRESETS.find((entry) => entry.width === width && entry.height === height);
  return match?.id ?? AUTHORING_OUTPUT_CUSTOM_ID;
}

export function AuthoringScreen({
  locale = 'en',
  selectedId,
}: {
  locale?: string;
  selectedId?: string;
}) {
  const [exampleId, setExampleId] = useState(DEFAULT_AUTHORING_EXAMPLE_ID);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceLoadBusy, setSourceLoadBusy] = useState(false);
  const [sourceLoadError, setSourceLoadError] = useState<string | null>(null);
  const [cropRegion, setCropRegion] = useState<CropRegion | null>(null);
  const [extractUrl, setExtractUrl] = useState<string | null>(null);
  const [extractFilter, setExtractFilter] = useState('');
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractBusy, setExtractBusy] = useState(false);

  const example = getAuthoringExampleById(exampleId) ?? DESTINATION_ATLAS_AUTHORING_EXAMPLES[0];
  const destination = example ? getDestinationById(example.destinationId) : undefined;

  const [yaw, setYaw] = useState(example?.defaultYaw ?? 25);
  const [pitch, setPitch] = useState(example?.defaultPitch ?? -8);
  const [horizontalFov, setHorizontalFov] = useState(example?.defaultHorizontalFov ?? 75);
  const [outputWidth, setOutputWidth] = useState(720);
  const [outputHeight, setOutputHeight] = useState(480);
  const [outputPresetId, setOutputPresetId] = useState('720x480');
  const [reverse, setReverse] = useState(false);
  const [sourceWidth, setSourceWidth] = useState<number | undefined>();
  const [sourceHeight, setSourceHeight] = useState<number | undefined>();

  const outputPreviewHostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<EquirectSphereViewportHandle>(null);
  const userPickedFileRef = useRef(false);

  const isEquirectExample = example?.projection === 'equirect';
  const isCustomOutput = outputPresetId === AUTHORING_OUTPUT_CUSTOM_ID;
  const sourceAspect =
    sourceWidth && sourceHeight && sourceHeight > 0 ? sourceWidth / sourceHeight : null;
  const equirectAspectWarning =
    isEquirectExample && sourceAspect !== null && Math.abs(sourceAspect - 2) > 0.05;

  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const linkedExample = getAuthoringExampleForDestinationId(selectedId);
    if (linkedExample) {
      setExampleId(linkedExample.id);
    }
  }, [selectedId]);

  useEffect(() => {
    userPickedFileRef.current = false;
  }, [selectedId, exampleId]);

  useEffect(() => {
    if (!example) {
      return;
    }
    if (userPickedFileRef.current) {
      return;
    }
    setYaw(example.defaultYaw);
    setPitch(example.defaultPitch);
    setHorizontalFov(example.defaultHorizontalFov);
    const preset = getAuthoringOutputPreset('720x480');
    setOutputPresetId('720x480');
    setOutputWidth(preset?.width ?? 720);
    setOutputHeight(preset?.height ?? 480);
    setSourceWidth(undefined);
    setSourceHeight(undefined);
    setCropRegion(null);
    setExtractFilter('');
    setExtractProgress(0);
    setExtractError(null);
    setExtractBusy(false);
    setExtractUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });

    const destination = selectedId ? getDestinationById(selectedId) : undefined;
    const shippedUrl = resolveEquirectSourceVideoUrl(destination);
    const shouldLoadShipped =
      Boolean(selectedId) &&
      example.destinationId === selectedId &&
      Boolean(shippedUrl);

    if (!shouldLoadShipped || !shippedUrl || !destination) {
      setInputFile(null);
      setSourceUrl(null);
      setSourceLoadBusy(false);
      setSourceLoadError(null);
      return;
    }

    let cancelled = false;
    setSourceLoadError(null);
    setSourceLoadBusy(true);
    setInputFile(null);
    setSourceUrl(null);

    void (async () => {
      try {
        const response = await fetch(shippedUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        if (cancelled || userPickedFileRef.current) {
          return;
        }
        const ext = shippedUrl.includes('.webm') ? 'webm' : 'mp4';
        setInputFile(
          new File([blob], `${destination.id}-equirect.${ext}`, {
            type: blob.type || `video/${ext}`,
          }),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }
        setSourceLoadError(
          error instanceof Error ? error.message : 'Could not load shipped 360° video',
        );
        setSourceUrl(shippedUrl);
      } finally {
        if (!cancelled) {
          setSourceLoadBusy(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exampleId, example, selectedId]);

  useEffect(() => {
    if (!inputFile) {
      return;
    }
    const url = URL.createObjectURL(inputFile);
    setSourceUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [inputFile]);

  useEffect(
    () => () => {
      if (extractUrl) {
        URL.revokeObjectURL(extractUrl);
      }
    },
    [extractUrl],
  );

  useEffect(() => {
    setCropRegion(
      virtualCameraToCropRegion({
        camera: { yaw, pitch, roll: 0, fov: horizontalFov },
        sourceWidth,
        sourceHeight,
        outputWidth,
        outputHeight,
        reverse,
      }),
    );
    const filter = virtualCameraToCropRegion({
      camera: { yaw, pitch, roll: 0, fov: horizontalFov },
      sourceWidth,
      sourceHeight,
      outputWidth,
      outputHeight,
      reverse,
    }).filter;
    setExtractFilter(typeof filter === 'string' ? filter : '');
  }, [yaw, pitch, horizontalFov, outputWidth, outputHeight, sourceWidth, sourceHeight, reverse]);

  const exampleLabel = useMemo(() => {
    if (!example || !destination) {
      return example?.label ?? 'Authoring example';
    }
    return `${example.label} · ${localizedDestinationName(destination, locale)}`;
  }, [destination, example, locale]);

  const handleOutputPresetChange = (presetId: string) => {
    setOutputPresetId(presetId);
    if (presetId === AUTHORING_OUTPUT_CUSTOM_ID) {
      return;
    }
    const preset = getAuthoringOutputPreset(presetId);
    if (preset) {
      setOutputWidth(preset.width);
      setOutputHeight(preset.height);
    }
  };

  const handleCustomDimensionChange = (width: number, height: number) => {
    setOutputWidth(width);
    setOutputHeight(height);
    setOutputPresetId(matchOutputPreset(width, height));
  };

  const handleVideoFile = (detail: {
    file: File;
    metadata: Record<string, string | number | boolean | null | undefined>;
  }) => {
    userPickedFileRef.current = true;
    setSourceLoadBusy(false);
    setSourceLoadError(null);
    setInputFile(detail.file);
    if (example) {
      setYaw(example.defaultYaw);
      setPitch(example.defaultPitch);
      setHorizontalFov(example.defaultHorizontalFov);
    }
    const width = Number(detail.metadata.sourceWidth);
    const height = Number(detail.metadata.sourceHeight);
    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      setSourceWidth(width);
      setSourceHeight(height);
    } else {
      setSourceWidth(undefined);
      setSourceHeight(undefined);
    }
    setExtractUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
    setExtractProgress(0);
    setExtractError(null);
    setExtractBusy(false);
  };

  const onAuthoringFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    void probeVideoFile(file).then(({ width, height }) => {
      handleVideoFile({
        file,
        metadata: {
          name: file.name,
          sourceWidth: width > 0 ? width : undefined,
          sourceHeight: height > 0 ? height : undefined,
          size: file.size,
        },
      });
    });
  };

  return (
    <section className="da-panel da-panel--authoring">
      <h2>Authoring</h2>

      <div className="da-authoring-workspace">
        <header className="da-authoring-workspace__headers">
          <h3 className="da-authoring-pane__title">Source</h3>
          <h3 className="da-authoring-pane__title">Output</h3>
        </header>

        <div className="da-authoring-workspace__videos">
          <div className="da-authoring-workspace__video-col">
            {sourceUrl && isEquirectExample ? (
              <EquirectSphereViewport
                ref={viewportRef}
                className="da-authoring-sphere-viewport"
                videoSrc={sourceUrl}
                flipInterior
                yaw={yaw}
                pitch={pitch}
                horizontalFov={horizontalFov}
                outputWidth={outputWidth}
                outputHeight={outputHeight}
                outputPreviewHostRef={outputPreviewHostRef}
                onCameraChange={({ yaw: nextYaw, pitch: nextPitch, horizontalFov: nextFov }) => {
                  setYaw(nextYaw);
                  setPitch(nextPitch);
                  setHorizontalFov(nextFov);
                }}
              />
            ) : sourceLoadBusy ? (
              <div
                className="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder"
                aria-busy="true"
                aria-label="Loading source video"
              />
            ) : (
              <div className="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder">
                <label className="da-authoring-choose-file">
                  <input
                    type="file"
                    className="da-authoring-choose-file__input"
                    accept="video/*"
                    onChange={onAuthoringFileChange}
                  />
                  Choose video file
                </label>
              </div>
            )}
          </div>

          <div className="da-authoring-workspace__video-col">
            {sourceUrl ? (
              <div ref={outputPreviewHostRef} className="da-authoring-program-preview-host" />
            ) : (
              <div className="da-authoring-program-preview-host da-authoring-program-preview-host--placeholder">
                <p className="da-authoring-output-placeholder">Choose source file to create output</p>
              </div>
            )}
          </div>
        </div>

        <div className="da-authoring-workspace__footers">
          <div className="da-authoring-pane da-authoring-pane--source" aria-label="Authoring source controls">
            <AuthoringPlaybackBar
              viewportRef={viewportRef}
              disabled={!sourceUrl}
              onResetView={() => {
                if (!example) {
                  return;
                }
                setYaw(example.defaultYaw);
                setPitch(example.defaultPitch);
                setHorizontalFov(example.defaultHorizontalFov);
              }}
            />
            <AuthoringCameraControls
              yaw={yaw}
              pitch={pitch}
              horizontalFov={horizontalFov}
              disabled={!sourceUrl || !isEquirectExample}
              onYawChange={setYaw}
              onPitchChange={setPitch}
              onHorizontalFovChange={setHorizontalFov}
              onReset={() => {
                if (!example) {
                  return;
                }
                setYaw(example.defaultYaw);
                setPitch(example.defaultPitch);
                setHorizontalFov(example.defaultHorizontalFov);
              }}
              onLittlePlanetPreset={() => {
                setHorizontalFov(LITTLE_PLANET_HFOV);
                setPitch(LITTLE_PLANET_PITCH);
              }}
            />
          </div>

          <div className="da-authoring-pane da-authoring-pane--output" aria-label="Authoring output controls">
            <p className="da-note">Same view as source — live mirror scaled to export dimensions.</p>

            {sourceWidth && sourceHeight ? (
              <p className={`da-note${equirectAspectWarning ? ' da-note--warn' : ''}`}>
                Source dimensions: {sourceWidth}×{sourceHeight} ({sourceAspect?.toFixed(2)}:1)
                {isEquirectExample ? ' — interior view flips texture for inside-out viewing' : ''}
                {equirectAspectWarning ? ' · aspect ratio differs from 2:1; extract may look wrong' : ''}
              </p>
            ) : null}

            <div className="da-media-extract-controls">
              <SelectInput
                label="Export rectangle size"
                value={outputPresetId}
                options={[
                  ...AUTHORING_OUTPUT_PRESETS.map((entry) => ({ value: entry.id, label: entry.label })),
                  { value: AUTHORING_OUTPUT_CUSTOM_ID, label: 'Custom' },
                ]}
                onChange={handleOutputPresetChange}
              />
              <NumberInput
                label="Yaw (°)"
                value={yaw}
                step={0.5}
                min={-180}
                max={180}
                onChange={setYaw}
              />
              <NumberInput
                label="Pitch (°)"
                value={pitch}
                step={0.5}
                min={-85}
                max={85}
                onChange={setPitch}
              />
              <NumberInput
                label="Horizontal FOV (°)"
                value={horizontalFov}
                step={1}
                min={30}
                max={360}
                onChange={setHorizontalFov}
              />
              <NumberInput
                label="Output width"
                value={outputWidth}
                step={2}
                min={160}
                max={3840}
                onChange={(value) => isCustomOutput && handleCustomDimensionChange(value, outputHeight)}
              />
              <NumberInput
                label="Output height"
                value={outputHeight}
                step={2}
                min={120}
                max={2160}
                onChange={(value) => isCustomOutput && handleCustomDimensionChange(outputWidth, value)}
              />
              <CheckboxInput label="Reverse playback" checked={reverse} onChange={setReverse} />
            </div>

            {extractFilter ? (
              <p className="da-note da-note--filter">
                Filter:{' '}
                <code className="da-value-ellipsis" tabIndex={0}>
                  {extractFilter}
                </code>
              </p>
            ) : null}

            {inputFile ? (
              <WasmMedia
                label="ffmpeg.wasm extract"
                operation="equirect-extract"
                extractionMode="rectilinear"
                outputFormat="mp4"
                showProgress
                yaw={yaw}
                pitch={pitch}
                horizontalFov={horizontalFov}
                outputWidth={outputWidth}
                outputHeight={outputHeight}
                reverse={reverse}
                inputFile={inputFile}
                cropRegion={cropRegion}
                onProgress={({ progress }) => {
                  setExtractBusy(true);
                  setExtractProgress(progress);
                }}
                onExtractComplete={({ blob, metadata }) => {
                  setExtractBusy(false);
                  setExtractProgress(100);
                  setExtractError(null);
                  setExtractUrl((previous) => {
                    if (previous) {
                      URL.revokeObjectURL(previous);
                    }
                    return URL.createObjectURL(blob);
                  });
                  const filter = metadata.filter;
                  setExtractFilter(typeof filter === 'string' ? filter : '');
                }}
                onExtractError={({ message }) => {
                  setExtractBusy(false);
                  setExtractError(message);
                }}
              />
            ) : (
              <p className="da-note">Attach a video file to enable ffmpeg.wasm extract.</p>
            )}

            {extractBusy ? (
              <p className="da-note" aria-live="polite">
                Extracting… {extractProgress > 0 ? `${extractProgress}%` : 'loading ffmpeg.wasm (~31 MB first run)'}
              </p>
            ) : null}
            {extractError ? (
              <p className="da-note da-note--warn" role="alert">
                Extract failed: {extractError}
              </p>
            ) : null}
            {extractUrl ? (
              <>
                <p className="da-note">Extracted MP4 (ffmpeg.wasm):</p>
                <video className="da-authoring-pane__video" src={extractUrl} controls playsInline autoPlay muted />
                <a
                  className="da-media-extract-output__download"
                  href={extractUrl}
                  download={`${example?.id ?? 'authoring'}-extract.mp4`}
                >
                  Download extracted video
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
