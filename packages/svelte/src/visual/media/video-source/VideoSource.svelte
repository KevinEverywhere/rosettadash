<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DB_VIDEO_SOURCE_TAG,
		registerRdVideoSource,
	} from '@rosettadash/web-components/visual/media/video-source';
	import {
		attachHostEvents,
		setHostAttribute,
	} from '../../../lib/custom-element-host';
	import type { VideoFileDetail, VideoSourceProps } from './types';

	let {
		label,
		accept,
		sourceWidth,
		sourceHeight,
		className,
		onVideoFile,
		onMetadata,
	}: VideoSourceProps = $props();

	let host: HTMLElement;
	let detachEvents = () => {};

	onMount(() => {
		registerRdVideoSource();
		detachEvents = attachHostEvents(host, {
			'video-file': (detail) => onVideoFile?.(detail as VideoFileDetail),
			metadata: (detail) =>
				onMetadata?.(
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
		setHostAttribute(host, 'accept', accept);
		setHostAttribute(host, 'source-width', sourceWidth);
		setHostAttribute(host, 'source-height', sourceHeight);
	});
</script>

<svelte:element this={DB_VIDEO_SOURCE_TAG} bind:this={host} class={className} />
