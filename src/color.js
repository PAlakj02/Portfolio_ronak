// Average color of an image (same-origin), sampled on a tiny canvas.
const cache = new Map();

export function averageColor(src) {
  if (cache.has(src)) return cache.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 24;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 24, 24);
        const d = ctx.getImageData(0, 0, 24, 24).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 10) continue;
          r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
        }
        n = n || 1;
        resolve([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
      } catch {
        resolve([62, 74, 46]);
      }
    };
    img.onerror = () => resolve([62, 74, 46]);
    img.src = src;
  });
  cache.set(src, p);
  return p;
}

export const rgb = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;
export const invert = ([r, g, b]) => [255 - r, 255 - g, 255 - b];
export const isLight = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b > 150;
