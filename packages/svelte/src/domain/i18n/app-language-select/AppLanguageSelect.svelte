<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DB_APP_LANGUAGE_SELECT_TAG,
		registerRdAppLanguageSelect,
	} from '@rosettadash/web-components/domain/i18n/app-language-select';
	import {
		attachHostEvents,
		setHostAttribute,
		setHostProperty,
	} from '../../../lib/custom-element-host';
	import type { AppLanguageSelectProps } from './types';

	let {
		locales,
		value,
		defaultLocale,
		label,
		placeholder,
		className,
		onLocaleChange,
	}: AppLanguageSelectProps = $props();

	let host: HTMLElement;
	let detachEvents = () => {};

	onMount(() => {
		registerRdAppLanguageSelect();
		detachEvents = attachHostEvents(host, {
			'locale-change': (detail) =>
				onLocaleChange?.(detail as { locale: string }),
		});
		return () => detachEvents();
	});

	$effect(() => {
		if (!host) {
			return;
		}
		setHostProperty(host, 'locales', locales);
		setHostAttribute(host, 'value', value);
		setHostAttribute(host, 'default-locale', defaultLocale);
		setHostAttribute(host, 'label', label);
		setHostAttribute(host, 'placeholder', placeholder);
	});
</script>

<svelte:element this={DB_APP_LANGUAGE_SELECT_TAG} bind:this={host} class={className} />
