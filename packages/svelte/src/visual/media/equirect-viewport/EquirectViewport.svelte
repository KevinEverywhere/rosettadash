<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DB_EQUIRECT_VIEWPORT_TAG,
		registerRdEquirectViewport,
		type EquirectPreviewMode,
	} from '@rosettadash/web-components/visual/media/equirect-viewport';
	import {
		attachHostEvents,
		setHostAttribute,
	} from '../../../lib/custom-element-host';
	import type { EquirectViewportProps } from './types';

	let {
		label,
		previewMode,
		sourceWidth,
		sourceHeight,
		cropX,
		cropY,
		cropWidth,
		cropHeight,
		outputWidth,
		outputHeight,
		yaw,
		pitch,
		horizontalFov,
		className,
		onCropRegion,
	}: EquirectViewportProps = $props();

	let host: HTMLElement;
	let detachEvents = () => {};

	onMount(() => {
		registerRdEquirectViewport();
		detachEvents = attachHostEvents(host, {
			'crop-region': (detail) =>
				onCropRegion?.(
					detail as Record<string, string | number | boolean | null | undefined>,
				),
		});
		return () => detachEvents();
	});

	$effect(() => {
		if (!host) {
			return;
		}
		setHostAttribute(host, 'label', label);
		setHostAttribute(host, 'preview-mode', previewMode);
		setHostAttribute(host, 'source-width', sourceWidth);
		setHostAttribute(host, 'source-height', sourceHeight);
		setHostAttribute(host, 'crop-x', cropX);
		setHostAttribute(host, 'crop-y', cropY);
		setHostAttribute(host, 'crop-width', cropWidth);
		setHostAttribute(host, 'crop-height', cropHeight);
		setHostAttribute(host, 'output-width', outputWidth);
		setHostAttribute(host, 'output-height', outputHeight);
		setHostAttribute(host, 'yaw', yaw);
		setHostAttribute(host, 'pitch', pitch);
		setHostAttribute(host, 'horizontal-fov', horizontalFov);
	});
</script>

<svelte:element this={DB_EQUIRECT_VIEWPORT_TAG} bind:this={host} class={className} />
