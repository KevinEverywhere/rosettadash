/** Attach a shared HTMLElement mount into a Storybook host (framework previews). */
export function attachDomStory(host: HTMLElement, mount: () => HTMLElement): void {
  host.replaceChildren();
  host.appendChild(mount());
}

/** Clear a Storybook DOM host on teardown. */
export function clearDomStoryHost(host: HTMLElement): void {
  host.replaceChildren();
}
