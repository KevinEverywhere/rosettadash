import { createElement, useEffect, useRef } from 'react';
import { attachDomStory, clearDomStoryHost } from './dom-story-mount.js';

export interface DomStoryHostProps {
  mount: () => HTMLElement;
}

/** Mount shared catalog/composition HTMLElement trees inside React Storybook stories. */
export function DomStoryHost({ mount }: DomStoryHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    attachDomStory(host, mount);
    return () => {
      clearDomStoryHost(host);
    };
  }, [mount]);

  return createElement('div', { ref: hostRef, className: 'rd-dom-story-host' });
}

export function renderDomStory(mount: () => HTMLElement) {
  return () => createElement(DomStoryHost, { mount });
}
