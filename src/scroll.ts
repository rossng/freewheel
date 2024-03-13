import { linear as interpolate } from "@mozillareality/easing-functions";

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
  easing: "linear";
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

  function scroll() {
    if (isAborted) {
      return;
    }

    try {
      const elapsed = performance.now() - startTime;
      const normalizedTime = Math.min(elapsed / settings.duration, 1);
      const interpolatedPosition = interpolate(normalizedTime);
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
