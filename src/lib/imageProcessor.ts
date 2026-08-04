/**
 * Removes background from a garment photo and places it on a pristine studio white background (#FFFFFF).
 * Samples edge/corner background colors and applies distance thresholding + alpha masking.
 */
export async function removeBackgroundToWhite(imageSrc: string, tolerance: number = 45): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(imageSrc);
      }

      // Maintain good resolution (max 1024px)
      let width = img.width;
      let height = img.height;
      const maxDim = 1024;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // 1. Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Get ImageData
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // 3. Sample background colors from 4 corners and borders
      const bgSamples: Array<[number, number, number]> = [];
      const samplePoints = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [Math.floor(width / 2), 0],
        [0, Math.floor(height / 2)],
        [width - 1, Math.floor(height / 2)],
        [Math.floor(width / 2), height - 1],
        [10, 10],
        [width - 11, 10],
      ];

      samplePoints.forEach(([x, y]) => {
        const idx = (y * width + x) * 4;
        bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
      });

      // Helper to check color distance against background samples
      const isBgColor = (r: number, g: number, b: number) => {
        for (const [bgR, bgG, bgB] of bgSamples) {
          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );
          if (dist < tolerance) return true;
        }
        return false;
      };

      // 4. Create flood-fill / mask from edges inward to avoid removing garment parts that share colors with bg
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      // Add border pixels to floodfill queue if they match background samples
      for (let x = 0; x < width; x++) {
        queue.push(x, 0);
        queue.push(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        queue.push(0, y);
        queue.push(width - 1, y);
      }

      while (queue.length > 0) {
        const cy = queue.pop()!;
        const cx = queue.pop()!;
        const pos = cy * width + cx;

        if (visited[pos]) continue;
        visited[pos] = 1;

        const idx = pos * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (isBgColor(r, g, b)) {
          // Mark as background -> set to pure white (255, 255, 255)
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;

          // Check 4 neighbors
          if (cx > 0 && !visited[pos - 1]) queue.push(cx - 1, cy);
          if (cx < width - 1 && !visited[pos + 1]) queue.push(cx + 1, cy);
          if (cy > 0 && !visited[pos - width]) queue.push(cx, cy - 1);
          if (cy < height - 1 && !visited[pos + width]) queue.push(cx, cy + 1);
        }
      }

      // 5. Draw output on canvas with solid white background
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outCtx = outputCanvas.getContext('2d')!;

      // Fill background pure white
      outCtx.fillStyle = '#FFFFFF';
      outCtx.fillRect(0, 0, width, height);

      // Put modified image data
      ctx.putImageData(imgData, 0, 0);
      outCtx.drawImage(canvas, 0, 0);

      resolve(outputCanvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
