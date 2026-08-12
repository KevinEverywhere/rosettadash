import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  flatCropPresetCenter,
  rectilinearPresetProgram,
} from '../../../../tools/storybook-shared/fixtures';
import { mountWithEventLog } from '../../../../tools/storybook-shared/web-components-story-helpers';

const meta: Meta = {
  title: 'Wasm/Wasm Media',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/wasm` — registers `<rd-wasm-media>`. Browser WASM extract requires optional `@ffmpeg/ffmpeg` + `@ffmpeg/util` peers. Emits `extract-complete`, `progress`, and `metadata`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const TranscodePlaceholder: Story = {
  render: () =>
    `<rd-wasm-media label="Generic transcode" operation="transcode" output-format="mp4"></rd-wasm-media>`,
};

export const EquirectExtractAwaitingFile: Story = {
  render: () =>
    `<rd-wasm-media
      label="Equirect extract"
      operation="equirect-extract"
      extraction-mode="flat-crop"
      output-format="mp4"
      crop-x="${flatCropPresetCenter.cropX}"
      crop-y="${flatCropPresetCenter.cropY}"
      crop-width="${flatCropPresetCenter.cropWidth}"
      crop-height="${flatCropPresetCenter.cropHeight}"
      output-width="1280"
      output-height="720"
    ></rd-wasm-media>`,
  parameters: {
    docs: {
      description: {
        story:
          'Extract button stays disabled until a video file is attached via `inputFile` / host wiring. Filter preview is shown for equirect-extract.',
      },
    },
  },
};

export const EquirectExtractRectilinear: Story = {
  render: () =>
    `<rd-wasm-media
      label="Rectilinear extract"
      operation="equirect-extract"
      extraction-mode="rectilinear"
      output-format="mp4"
      yaw="${rectilinearPresetProgram.yaw}"
      pitch="${rectilinearPresetProgram.pitch}"
      horizontal-fov="${rectilinearPresetProgram.horizontalFov}"
      output-width="1920"
      output-height="1080"
    ></rd-wasm-media>`,
};

export const FilterPreviewFlatCrop: Story = {
  render: () =>
    `<rd-wasm-media
      label="Filter preview only"
      operation="equirect-extract"
      extraction-mode="flat-crop"
      crop-x="512"
      crop-y="256"
      crop-width="2048"
      crop-height="1024"
      output-width="1280"
      output-height="640"
    ></rd-wasm-media>`,
  parameters: {
    docs: {
      description: {
        story: 'Shows the FFmpeg `-vf` string built from `@rosettadash/core` without running extract.',
      },
    },
  },
};

export const ProgressHidden: Story = {
  render: () =>
    `<rd-wasm-media
      label="Compact extract UI"
      operation="equirect-extract"
      show-progress="false"
      extraction-mode="flat-crop"
    ></rd-wasm-media>`,
};

export const EventListenersHint: Story = {
  render: () =>
    mountWithEventLog(
      `<rd-wasm-media
        label="Event wiring demo"
        operation="equirect-extract"
        extraction-mode="rectilinear"
        yaw="10"
        pitch="-4"
        horizontal-fov="90"
      ></rd-wasm-media>`,
      {
        selector: 'rd-wasm-media',
        events: ['progress', 'extract-complete', 'metadata'],
        hint: 'Attach a file and run extract (requires @ffmpeg peers) — progress / extract-complete / metadata log here.',
      },
    ),
};
