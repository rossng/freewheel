export function scrollPage(pixels: number) {
  window.scrollBy({
    behavior: "smooth",
    left: 0,
    top: pixels,
  });
}
