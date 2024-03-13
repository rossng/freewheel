import {
  backInOut,
  bounceInOut,
  circularInOut,
  cubicInOut,
  elasticInOut,
  exponentialInOut,
  linear,
  quadraticInOut,
  quarticInOut,
  sinusoidalInOut,
} from "@mozillareality/easing-functions";

export const interpolationMethods = [
  "linear",
  "quadratic",
  "cubic",
  "quartic",
  "sinusoidal",
  "exponential",
  "circular",
  "elastic",
  "back",
  "bounce",
] as const;
type InterpolationMethod = (typeof interpolationMethods)[number];

export function isInterpolationMethod(value: string): value is InterpolationMethod {
  return interpolationMethods.includes(value as any);
}

export interface ScrollOptions {
  /**
   * Number of pixels to scroll in the y direction.
   */
  pixels: number;
  /**
   * Duration of the scroll in milliseconds.
   */
  duration: number;
  /**
   * The easing function to use for the scroll.
   */
  easing: InterpolationMethod;
}

/**
 * Scroll the page downwards with the given settings.
 */
export function scrollPage(settings: ScrollOptions) {
  const startTime = performance.now();
  const startY = window.scrollY;

  let isAborted = false;

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === "Escape") {
      isAborted = true;
      document.removeEventListener("keydown", onKeyPress);
    }
  }

  document.addEventListener("keydown", onKeyPress);

  function interpolate(type: InterpolationMethod, t: number) {
    switch (type) {
      case "linear":
        return linear(t);
      case "quadratic":
        return quadraticInOut(t);
      case "cubic":
        return cubicInOut(t);
      case "quartic":
        return quarticInOut(t);
      case "sinusoidal":
        return sinusoidalInOut(t);
      case "exponential":
        return exponentialInOut(t);
      case "circular":
        return circularInOut(t);
      case "elastic":
        return elasticInOut(t);
      case "back":
        return backInOut(t);
      case "bounce":
        return bounceInOut(t);
    }
  }

  function scroll() {
    if (isAborted) {
      return;
    }

    try {
      const elapsed = performance.now() - startTime;
      const normalizedTime = Math.min(elapsed / settings.duration, 1);
      const interpolatedPosition = interpolate(settings.easing, normalizedTime);
      const targetY = startY + settings.pixels * interpolatedPosition;

      window.scrollTo(0, targetY);

      if (elapsed < settings.duration) {
        requestAnimationFrame(scroll);
      } else {
        document.removeEventListener("keydown", onKeyPress);
      }
    } catch {
      document.removeEventListener("keydown", onKeyPress);
    }
  }

  requestAnimationFrame(scroll);
}
