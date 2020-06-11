const contains = (regions: number[][], x: number, y: number) => {
  for (const region of regions) {
    if (
      x >= region[0] &&
      y >= region[1] &&
      x <= region[0] + region[2] &&
      y <= region[1] + region[3]
    ) {
      return true;
    }
  }

  return false;
};

export const registerMouseMove = async () => {
  if (!window.browser) return;

  let regions = await browser.overlayPrivate.getRegions();

  document.addEventListener('mousemove', (e) => {
    browser.overlayPrivate.setIgnoreMouseEvents(
      !contains(regions, e.pageX, e.pageY),
    );
  });

  browser.overlayPrivate.onRegionsUpdated.addListener((r) => (regions = r));
};
