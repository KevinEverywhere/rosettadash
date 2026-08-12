export type DisplayTier =
  | 'desktop'
  | 'tablet-landscape'
  | 'phone'
  | 'small-tablet'
  | 'portrait'
  | 'narrow';

export type DisplayBlockReason = 'portrait-rotate-required' | 'minimum-viewport-unmet';

export interface ViewportMetrics {
  width: number;
  height: number;
  /** True when the primary pointer is coarse (touch). */
  coarsePointer: boolean;
}

export interface DisplayAvailability extends ViewportMetrics {
  tier: DisplayTier;
  allowed: boolean;
  reason: DisplayBlockReason | null;
}

/** Minimum viewport width (in landscape) required to open the builder workspace. */
export const BUILDER_MIN_WIDTH_PX = 1024;

/** Width at or below which we label the blocked tier as phone in metrics. */
export const PHONE_MAX_WIDTH_PX = 767;

export const DISPLAY_AVAILABILITY_COPY: Record<
  DisplayBlockReason,
  { title: string; lead: string; hint: string }
> = {
  'portrait-rotate-required': {
    title: 'Rotate to landscape',
    lead: 'RosettaDash requires at least 1024px width in landscape mode. Your device can meet that requirement when turned sideways.',
    hint: 'Rotate your tablet to landscape, then tap Try again below.',
  },
  'minimum-viewport-unmet': {
    title: 'Larger display required',
    lead: 'RosettaDash requires at least 1024px width in landscape mode to open the builder workspace.',
    hint: 'Use a tablet 10 inches or larger in landscape, or a desktop computer. Phones and smaller tablets (such as Samsung Galaxy Tab) cannot run the builder yet.',
  },
};

export function landscapeViewportWidth(width: number, height: number): number {
  return Math.max(width, height);
}

export function resolveDisplayAvailability(metrics: ViewportMetrics): DisplayAvailability {
  const { width, height, coarsePointer } = metrics;
  const base = { width, height, coarsePointer };
  const isLandscape = width >= height;
  const canMeetMinimumInLandscape = landscapeViewportWidth(width, height) >= BUILDER_MIN_WIDTH_PX;

  if (isLandscape && width >= BUILDER_MIN_WIDTH_PX) {
    return {
      ...base,
      tier: coarsePointer ? 'tablet-landscape' : 'desktop',
      allowed: true,
      reason: null,
    };
  }

  if (!isLandscape && canMeetMinimumInLandscape && coarsePointer) {
    return {
      ...base,
      tier: 'portrait',
      allowed: false,
      reason: 'portrait-rotate-required',
    };
  }

  let tier: DisplayTier;
  if (!isLandscape) {
    tier = width <= PHONE_MAX_WIDTH_PX ? 'phone' : 'portrait';
  } else if (width <= PHONE_MAX_WIDTH_PX) {
    tier = 'phone';
  } else if (coarsePointer) {
    tier = 'small-tablet';
  } else {
    tier = 'narrow';
  }

  return {
    ...base,
    tier,
    allowed: false,
    reason: 'minimum-viewport-unmet',
  };
}

export function readViewportMetrics(windowLike: Window): ViewportMetrics {
  const coarsePointer =
    typeof windowLike.matchMedia === 'function'
      ? windowLike.matchMedia('(pointer: coarse)').matches
      : false;

  return {
    width: windowLike.innerWidth,
    height: windowLike.innerHeight,
    coarsePointer,
  };
}
