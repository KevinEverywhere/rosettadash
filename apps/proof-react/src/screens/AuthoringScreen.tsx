import { useEffect, useMemo, useState } from 'react';
import { EquirectViewport } from '@rosettadash/react/visual/media/equirect-viewport';
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
import { localizedDestinationName } from '../lib/atlas-utils';

export const AUTHORING_SOURCE = `<AuthoringScreen>
  <VideoSource onVideoFile={…} />
  <EquirectViewport yaw={…} pitch={…} onCropRegion={…} />
  <WasmMedia operation="equirect-extract" inputFile={inputFile} />
  <video src={outputUrl} /> {/* output preview pane */}
</AuthoringScreen>`;

type CropRegion = Record<string, string | number | boolean | null | undefined>;

export function AuthoringScreen({ locale = 'en' }: { locale?: string }) {
  const [exampleId, setExampleId] = useState(DEFAULT_AUTHORING_EXAMPLE_ID);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [cropRegion, setCropRegion] = useState<CropRegion | null>(null);
  const [extractUrl, setExtractUrl] = useState<string | null>(null);
  const [extractFilter, setExtractFilter] = useState('');

  const example = getAuthoringExampleById(exampleId) ?? DESTINATION_ATLAS_AUTHORING_EXAMPLES[0];
  const destination = example ? getDestinationById(example.destinationId) : undefined;

  const [yaw, setYaw] = useState(example?.defaultYaw ?? 25);
  const [pitch, setPitch] = useState(example?.defaultPitch ?? -8);
  const [horizontalFov, setHorizontalFov] = useState(example?.defaultHorizontalFov ?? 75);
  const [outputWidth, setOutputWidth] = useState(example?.outputWidth ?? 1280);
  const [outputHeight, setOutputHeight] = useState(example?.outputHeight ?? 720);
  const [reverse, setReverse] = useState(false);
  const [sourceWidth, setSourceWidth] = useState<number | undefined>();
  const [sourceHeight, setSourceHeight] = useState<number | undefined>();

  const isEquirectExample = example?.projection === 'equirect';
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
    setOutputWidth(example.outputWidth);
    setOutputHeight(example.outputHeight);
    setInputFile(null);
    setSourceWidth(undefined);
    setSourceHeight(undefined);
    setCropRegion(null);
    setExtractFilter('');
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

  const exampleLabel = useMemo(() => {
    if (!example || !destination) {
      return example?.label ?? 'Authoring example';
    }
    return `${example.label} · ${localizedDestinationName(destination, locale)}`;
  }, [destination, example, locale]);

  return (
    <section className="da-panel">
      <h2>Authoring</h2>
      <p>
        Upload source video and frame a rectilinear extract with crop, scale, and optional reverse — processed in
        the browser via ffmpeg.wasm. The source pane is where you choose the recording rectangle; the output pane
        shows the rendered result.
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
        <section className="da-authoring-pane da-authoring-pane--source" aria-label="Authoring source">
          <h3 className="da-authoring-pane__title">Source</h3>
          <VideoSource
            label="Authoring video file"
            accept="video/*"
            sourceWidth={sourceWidth}
            sourceHeight={sourceHeight}
            onVideoFile={(detail) => {
              setInputFile(detail.file);
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
              setExtractFilter('');
            }}
          />

          {sourceUrl ? (
            <video
              className={[
                'da-authoring-pane__video',
                isEquirectExample ? 'da-authoring-pane__video--equirect' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              src={sourceUrl}
              controls
              playsInline
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                  setSourceWidth(video.videoWidth);
                  setSourceHeight(video.videoHeight);
                }
              }}
            />
          ) : (
            <p className="da-note">Choose a local equirect or flat video to begin authoring.</p>
          )}

          {sourceWidth && sourceHeight ? (
            <p className={`da-note${equirectAspectWarning ? ' da-note--warn' : ''}`}>
              Source dimensions: {sourceWidth}×{sourceHeight} ({sourceAspect?.toFixed(2)}:1)
              {isEquirectExample ? ' — equirectangular expects 2:1' : ''}
              {equirectAspectWarning ? ' · aspect ratio differs from 2:1; extract may look wrong' : ''}
            </p>
          ) : null}

          <div className="da-media-extract-controls">
            <NumberInput label="Yaw (°)" value={yaw} step={1} min={-180} max={180} onChange={setYaw} />
            <NumberInput label="Pitch (°)" value={pitch} step={1} min={-90} max={90} onChange={setPitch} />
            <NumberInput
              label="Horizontal FOV (°)"
              value={horizontalFov}
              step={1}
              min={10}
              max={120}
              onChange={setHorizontalFov}
            />
            <NumberInput label="Output width" value={outputWidth} step={2} min={160} max={3840} onChange={setOutputWidth} />
            <NumberInput label="Output height" value={outputHeight} step={2} min={120} max={2160} onChange={setOutputHeight} />
            <CheckboxInput label="Reverse playback" checked={reverse} onChange={setReverse} />
          </div>

          <EquirectViewport
            label={`Framing — ${exampleLabel}`}
            previewMode="rectilinear"
            sourceWidth={sourceWidth}
            sourceHeight={sourceHeight}
            yaw={yaw}
            pitch={pitch}
            horizontalFov={horizontalFov}
            outputWidth={outputWidth}
            outputHeight={outputHeight}
            onCropRegion={setCropRegion}
          />

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
              onExtractComplete={({ blob, metadata }) => {
                setExtractUrl((previous) => {
                  if (previous) {
                    URL.revokeObjectURL(previous);
                  }
                  return URL.createObjectURL(blob);
                });
                const filter = metadata.filter;
                setExtractFilter(typeof filter === 'string' ? filter : '');
              }}
            />
          ) : (
            <p className="da-note">Attach a video file to enable ffmpeg.wasm extract.</p>
          )}
        </section>

        <section className="da-authoring-pane da-authoring-pane--output" aria-label="Authoring output">
          <h3 className="da-authoring-pane__title">Output</h3>
          <p className="da-note">Live preview of the extracted subsection based on source framing controls.</p>
          {extractUrl ? (
            <>
              <video className="da-authoring-pane__video" src={extractUrl} controls playsInline autoPlay muted />
              {extractFilter ? (
                <p className="da-note">
                  Filter: <code>{extractFilter}</code>
                </p>
              ) : null}
              <a
                className="da-media-extract-output__download"
                href={extractUrl}
                download={`${example?.id ?? 'authoring'}-extract.mp4`}
              >
                Download extracted video
              </a>
            </>
          ) : (
            <div className="da-authoring-output-placeholder">
              <p>Run extract on the source pane to render output here.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
