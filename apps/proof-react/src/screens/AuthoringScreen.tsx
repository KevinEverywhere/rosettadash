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
import { VideoSource } from '@rosettadash/react/visual/media/video-source';
import { WasmMedia } from '@rosettadash/react/visual/wasm/media';
import { CheckboxInput } from '@rosettadash/react/visual/input/checkbox';
import { NumberInput } from '@rosettadash/react/visual/input/number';
import { SelectInput } from '@rosettadash/react/visual/input/select';
import {
  DEFAULT_AUTHORING_EXAMPLE_ID,
  DESTINATION_ATLAS_AUTHORING_EXAMPLES,
  getAuthoringExampleById,
  getDestinationById,
} from '@destination-atlas';
import { AuthoringPlaybackBar } from '../components/AuthoringPlaybackBar';
import { AuthoringCameraControls } from '../components/AuthoringCameraControls';
import { localizedDestinationName } from '../lib/atlas-utils';

export const AUTHORING_SOURCE = `<AuthoringScreen>
  <VideoSource onVideoFile={…} />
  <EquirectSphereViewport videoSrc={sourceUrl} yaw={…} pitch={…} />
  <WasmMedia operation="equirect-extract" inputFile={inputFile} />
</AuthoringScreen>`;

type CropRegion = Record<string, string | number | boolean | null | undefined>;

function matchOutputPreset(width: number, height: number): string {
  const match = AUTHORING_OUTPUT_PRESETS.find((entry) => entry.width === width && entry.height === height);
  return match?.id ?? AUTHORING_OUTPUT_CUSTOM_ID;
}

export function AuthoringScreen({ locale = 'en' }: { locale?: string }) {
  const [exampleId, setExampleId] = useState(DEFAULT_AUTHORING_EXAMPLE_ID);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
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

  const isEquirectExample = example?.projection === 'equirect';
  const isCustomOutput = outputPresetId === AUTHORING_OUTPUT_CUSTOM_ID;
  const sourceAspect =
    sourceWidth && sourceHeight && sourceHeight > 0 ? sourceWidth / sourceHeight : null;
  const equirectAspectWarning =
    isEquirectExample && sourceAspect !== null && Math.abs(sourceAspect - 2) > 0.05;

  useEffect(() => {
    if (!example) {
      return;
    }
    setYaw(example.defaultYaw);
    setPitch(example.defaultPitch);
    setHorizontalFov(example.defaultHorizontalFov);
    const preset = getAuthoringOutputPreset('720x480');
    setOutputPresetId('720x480');
    setOutputWidth(preset?.width ?? 720);
    setOutputHeight(preset?.height ?? 480);
    setInputFile(null);
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
  }, [exampleId, example]);

  useEffect(() => {
    if (!inputFile) {
      setSourceUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return null;
      });
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

  return (
    <section className="da-panel da-panel--authoring">
      <h2>Authoring</h2>
      <p>
        Upload a 2:1 equirectangular video, use playback and record under the source view, and frame with the
        camera sliders or by dragging inside the sphere. The output pane mirrors the same view at export size.
      </p>

      <SelectInput
        label="Shipped example"
        value={exampleId}
        options={DESTINATION_ATLAS_AUTHORING_EXAMPLES.map((entry) => ({
          value: entry.id,
          label: entry.label,
        }))}
        onChange={setExampleId}
      />
      {example ? <p className="da-note">{example.summary}</p> : null}

      <div className="da-authoring-workspace">
        <header className="da-authoring-workspace__headers">
          <h3 className="da-authoring-pane__title">Source — {exampleLabel}</h3>
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
            ) : (
              <div className="da-authoring-sphere-viewport da-authoring-sphere-viewport--placeholder">
                <p className="da-authoring-output-placeholder">Choose a local equirect (2:1) video to open the sphere view.</p>
              </div>
            )}
          </div>

          <div className="da-authoring-workspace__video-col">
            <div ref={outputPreviewHostRef} className="da-authoring-program-preview-host">
              {!sourceUrl ? (
                <p className="da-authoring-output-placeholder">Load source video to preview output.</p>
              ) : null}
            </div>
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
            <VideoSource
              label="Authoring video file"
              accept="video/*"
              sourceWidth={sourceWidth}
              sourceHeight={sourceHeight}
              onVideoFile={(detail) => {
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
              <p className="da-note">
                Filter: <code>{extractFilter}</code>
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
