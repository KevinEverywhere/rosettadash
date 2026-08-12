export type AttrValue = string | number | boolean | undefined | null;

/** Sync host attributes via setAttribute (WC getters often have no setters). */
export function setHostAttribute(
  host: HTMLElement,
  name: string,
  value: AttrValue,
): void {
  if (value === undefined || value === null || value === false) {
    host.removeAttribute(name);
  } else if (value === true) {
    host.setAttribute(name, '');
  } else {
    host.setAttribute(name, String(value));
  }
}

export function attachHostEvents(
  host: HTMLElement,
  handlers: Record<string, ((detail: unknown) => void) | undefined>,
): () => void {
  const listeners: Array<[string, EventListener]> = [];
  for (const [domEvent, handler] of Object.entries(handlers)) {
    if (!handler) {
      continue;
    }
    const listener: EventListener = (event) => {
      handler((event as CustomEvent).detail);
    };
    host.addEventListener(domEvent, listener);
    listeners.push([domEvent, listener]);
  }
  return () => {
    for (const [domEvent, listener] of listeners) {
      host.removeEventListener(domEvent, listener);
    }
  };
}
