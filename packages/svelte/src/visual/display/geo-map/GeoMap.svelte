<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DB_GEO_MAP_TAG,
		registerRdGeoMap,
	} from '@rosettadash/web-components/visual/display/geo-map';
	import {
		attachHostEvents,
		setHostAttribute,
		setHostProperty,
	} from '../../../lib/custom-element-host';
	import type { GeoMapProps } from './types';

	let {
		provider,
		tileUrl,
		apiKey,
		center,
		zoom,
		markers,
		selectedId,
		className,
		onMarkerSelect,
	}: GeoMapProps = $props();

	let host: HTMLElement;
	let detachEvents = () => {};

	onMount(() => {
		registerRdGeoMap();
		detachEvents = attachHostEvents(host, {
			'marker-select': (detail) =>
				onMarkerSelect?.(detail as { id: string; lat: number; lng: number }),
		});
		return () => detachEvents();
	});

	$effect(() => {
		if (!host) {
			return;
		}
		setHostAttribute(host, 'provider', provider);
		setHostAttribute(host, 'tile-url', tileUrl);
		setHostAttribute(host, 'api-key', apiKey);
		setHostAttribute(host, 'center', center);
		setHostAttribute(host, 'zoom', zoom);
		setHostProperty(host, 'markers', markers);
		setHostAttribute(host, 'selected-id', selectedId);
	});
</script>

<svelte:element this={DB_GEO_MAP_TAG} bind:this={host} class={className} />
