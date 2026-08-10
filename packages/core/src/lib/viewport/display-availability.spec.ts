import {
  BUILDER_MIN_WIDTH_PX,
  landscapeViewportWidth,
  PHONE_MAX_WIDTH_PX,
  resolveDisplayAvailability,
} from './display-availability';

describe('display availability', () => {
  it('blocks all phone viewports with the minimum viewport message', () => {
    expect(resolveDisplayAvailability({ width: 430, height: 932, coarsePointer: true })).toEqual({
      width: 430,
      height: 932,
      coarsePointer: true,
      tier: 'phone',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('blocks phone landscape below the minimum width', () => {
    expect(resolveDisplayAvailability({ width: 844, height: 390, coarsePointer: true })).toEqual({
      width: 844,
      height: 390,
      coarsePointer: true,
      tier: 'small-tablet',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('asks iPad Mini portrait users to rotate to landscape', () => {
    expect(resolveDisplayAvailability({ width: 768, height: 1024, coarsePointer: true })).toEqual({
      width: 768,
      height: 1024,
      coarsePointer: true,
      tier: 'portrait',
      allowed: false,
      reason: 'portrait-rotate-required',
    });
  });

  it('asks large tablet portrait users to rotate when landscape width is sufficient', () => {
    expect(resolveDisplayAvailability({ width: 820, height: 1180, coarsePointer: true })).toEqual({
      width: 820,
      height: 1180,
      coarsePointer: true,
      tier: 'portrait',
      allowed: false,
      reason: 'portrait-rotate-required',
    });
  });

  it('blocks small tablets in landscape below 1024px', () => {
    expect(resolveDisplayAvailability({ width: 962, height: 601, coarsePointer: true })).toEqual({
      width: 962,
      height: 601,
      coarsePointer: true,
      tier: 'small-tablet',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('blocks small tablets in portrait that cannot reach 1024px landscape width', () => {
    expect(resolveDisplayAvailability({ width: 601, height: 962, coarsePointer: true })).toEqual({
      width: 601,
      height: 962,
      coarsePointer: true,
      tier: 'phone',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('allows tablet landscape at or above 1024px', () => {
    expect(resolveDisplayAvailability({ width: 1024, height: 768, coarsePointer: true })).toEqual({
      width: 1024,
      height: 768,
      coarsePointer: true,
      tier: 'tablet-landscape',
      allowed: true,
      reason: null,
    });
  });

  it('allows desktop layouts at or above 1024px landscape', () => {
    expect(resolveDisplayAvailability({ width: 1440, height: 900, coarsePointer: false })).toEqual({
      width: 1440,
      height: 900,
      coarsePointer: false,
      tier: 'desktop',
      allowed: true,
      reason: null,
    });
  });

  it('blocks narrow desktop windows below 1024px', () => {
    expect(resolveDisplayAvailability({ width: 980, height: 720, coarsePointer: false })).toEqual({
      width: 980,
      height: 720,
      coarsePointer: false,
      tier: 'narrow',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('blocks tall desktop windows with the minimum viewport message', () => {
    expect(resolveDisplayAvailability({ width: 900, height: 1200, coarsePointer: false })).toEqual({
      width: 900,
      height: 1200,
      coarsePointer: false,
      tier: 'portrait',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
  });

  it('documents breakpoint constants', () => {
    expect(BUILDER_MIN_WIDTH_PX).toBe(1024);
    expect(PHONE_MAX_WIDTH_PX).toBe(767);
    expect(landscapeViewportWidth(768, 1024)).toBe(1024);
  });
});
