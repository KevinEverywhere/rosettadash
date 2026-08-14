<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DB_YOUTUBE_EMBED_TAG,
		registerRdYoutubeEmbed,
	} from '@rosettadash/web-components/visual/media/youtube-embed';
	import { setHostAttribute } from '../../../lib/custom-element-host';
	import type { YoutubeEmbedProps } from './types';

	let {
		videoId,
		url,
		start,
		autoplay,
		mute,
		controls,
		title,
		className,
	}: YoutubeEmbedProps = $props();

	let host: HTMLElement;

	onMount(() => {
		registerRdYoutubeEmbed();
	});

	$effect(() => {
		if (!host) {
			return;
		}
		setHostAttribute(host, 'video-id', videoId);
		setHostAttribute(host, 'url', url);
		setHostAttribute(host, 'start', start);
		setHostAttribute(host, 'autoplay', autoplay);
		setHostAttribute(host, 'mute', mute);
		if (controls === false) {
			host.setAttribute('controls', 'false');
		} else {
			host.removeAttribute('controls');
		}
		setHostAttribute(host, 'embed-title', title);
	});
</script>

<svelte:element this={DB_YOUTUBE_EMBED_TAG} bind:this={host} class={className} />
