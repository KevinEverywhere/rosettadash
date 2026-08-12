import { useEffect, useRef, type RefObject } from 'react';

type AttrValue = string | number | boolean | undefined | null;

export interface CustomElementHostOptions {
  register: () => void;
  attrs?: Record<string, string>;
  events?: Record<string, string>;
}

function toKebab(name: string): string {
  return name.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
}

function syncAttributes(
  el: HTMLElement,
  values: Record<string, AttrValue>,
  attrMap: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(values)) {
    const attr = attrMap[key] ?? toKebab(key);
    if (value === undefined || value === null || value === false) {
      el.removeAttribute(attr);
    } else if (value === true) {
      el.setAttribute(attr, '');
    } else {
      el.setAttribute(attr, String(value));
    }
  }
}

/**
 * Thin React host around a registered custom element.
 * Attributes use setAttribute only (WC getters often have no setters).
 */
export function useCustomElementHost(
  options: CustomElementHostOptions,
  values: Record<string, AttrValue>,
  handlers: Record<string, ((detail: unknown) => void) | undefined> = {},
): RefObject<HTMLElement | null> {
  const host = useRef<HTMLElement | null>(null);
  const attrMap = options.attrs ?? {};
  const eventMap = options.events ?? {};

  useEffect(() => {
    options.register();
  }, [options]);

  useEffect(() => {
    const el = host.current;
    if (!el) {
      return;
    }
    syncAttributes(el, values, attrMap);
  });

  useEffect(() => {
    const el = host.current;
    if (!el) {
      return;
    }
    const listeners: Array<[string, EventListener]> = [];
    for (const [domEvent, handlerKey] of Object.entries(eventMap)) {
      const handler = handlers[handlerKey];
      if (!handler) {
        continue;
      }
      const listener: EventListener = (event) => {
        handler((event as CustomEvent).detail);
      };
      el.addEventListener(domEvent, listener);
      listeners.push([domEvent, listener]);
    }
    return () => {
      for (const [domEvent, listener] of listeners) {
        el.removeEventListener(domEvent, listener);
      }
    };
  });

  return host;
}
