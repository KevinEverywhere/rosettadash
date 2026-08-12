import { type Ref, type RefCallback } from 'react';

/** Assign a node to the host ref and an optional forwarded ref. */
export function mergeRef<T>(
  hostRef: Ref<T>,
  forwardedRef?: Ref<T | null>,
): RefCallback<T> {
  return (node) => {
    if (typeof hostRef === 'function') {
      hostRef(node);
    } else if (hostRef && typeof hostRef === 'object') {
      hostRef.current = node;
    }

    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef && typeof forwardedRef === 'object') {
      forwardedRef.current = node;
    }
  };
}
