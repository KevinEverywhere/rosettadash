import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
  equirectSource4K,
  flatCropPresetCenter,
  flatCropPresetLeftThird,
  rectilinearPresetProgram,
  rectilinearPresetWide,
} from '../../../../../tools/storybook-shared/fixtures';
import {
  equirectInteractiveWorkbench,
  equirectViewportStyle,
  mountWithEventLog,
} from '../../../../../tools/storybook-shared/web-components-story-helpers';

const meta: Meta = {
  title: 'Visual/Media/Equirect Viewport',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Import: `@rosettadash/web-components/visual/media/equirect-viewport` — crop / filter metadata panel (not a Three.js renderer). Emits `crop-region` on load and when attributes change.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const viewportShell = (attrs: string) =>
  `<rd-equirect-viewport style="${equirectViewportStyle}" source-width="${equirectSource4K.sourceWidth}" source-height="${equirectSource4K.sourceHeight}" output-width="${equirectSource4K.outputWidth}" output-height="${equirectSource4K.outputHeight}" ${attrs}></rd-equirect-viewport>`;

export const FlatCropDefault: Story = {
  render: () =>
    viewportShell('label="Flat crop — default region" preview-mode="flat-crop"'),
};

export const FlatCropCenterWindow: Story = {
  render: () =>
    viewportShell(
      `label="Flat crop — center window" preview-mode="flat-crop" crop-x="${flatCropPresetCenter.cropX}" crop-y="${flatCropPresetCenter.cropY}" crop-width="${flatCropPresetCenter.cropWidth}" crop-height="${flatCropPresetCenter.cropHeight}"`,
    ),
};

export const FlatCropLeftThird: Story = {
  render: () =>
    viewportShell(
      `label="Flat crop — left third" preview-mode="flat-crop" crop-x="${flatCropPresetLeftThird.cropX}" crop-y="${flatCropPresetLeftThird.cropY}" crop-width="${flatCropPresetLeftThird.cropWidth}" crop-height="${flatCropPresetLeftThird.cropHeight}"`,
    ),
};

export const RectilinearProgramLens: Story = {
  render: () =>
    viewportShell(
      `label="Rectilinear — program lens" preview-mode="rectilinear" yaw="${rectilinearPresetProgram.yaw}" pitch="${rectilinearPresetProgram.pitch}" horizontal-fov="${rectilinearPresetProgram.horizontalFov}"`,
    ),
};

export const RectilinearWideFov: Story = {
  render: () =>
    viewportShell(
      `label="Rectilinear — wide FOV" preview-mode="rectilinear" yaw="${rectilinearPresetWide.yaw}" pitch="${rectilinearPresetWide.pitch}" horizontal-fov="${rectilinearPresetWide.horizontalFov}"`,
    ),
};

export const CropRegionEventLog: Story = {
  render: () =>
    mountWithEventLog(
      viewportShell(
        'label="Live crop-region stream" preview-mode="rectilinear" yaw="15" pitch="-5" horizontal-fov="80"',
      ),
      {
        selector: 'rd-equirect-viewport',
        events: ['crop-region'],
        hint: 'crop-region fires on mount and when attributes change.',
      },
    ),
};

export const InteractiveWorkbench: Story = {
  render: () =>
    equirectInteractiveWorkbench({
      yaw: rectilinearPresetProgram.yaw,
      pitch: rectilinearPresetProgram.pitch,
      horizontalFov: rectilinearPresetProgram.horizontalFov,
      previewMode: 'rectilinear',
    }),
};

export const AuthoringPairHint: Story = {
  render: () => `
    <div class="rd-story-stack" style="max-width:36rem;">
      <p style="margin:0;font-size:0.8125rem;color:var(--rd-color-muted,#6b7280);">
        Host apps (e.g. ffmp3Console) keep a Three.js equirect sphere for live preview; this element owns filter metadata.
      </p>
      ${viewportShell('label="Metadata panel" preview-mode="rectilinear" yaw="0" pitch="0" horizontal-fov="75"')}
    </div>
  `,
};
