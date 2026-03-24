/**
 * Simple client-side background removal using Canvas API
 * This works by detecting the background color from corners and making similar colors transparent
 */
export async function removeImageBackground(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Sample corners to detect background color
      const corners = [
        { x: 0, y: 0 },                           // top-left
        { x: canvas.width - 1, y: 0 },             // top-right
        { x: 0, y: canvas.height - 1 },            // bottom-left
        { x: canvas.width - 1, y: canvas.height - 1 }, // bottom-right
        { x: Math.floor(canvas.width / 2), y: 0 }, // top-center
        { x: 0, y: Math.floor(canvas.height / 2) }, // left-center
        { x: canvas.width - 1, y: Math.floor(canvas.height / 2) }, // right-center
        { x: Math.floor(canvas.width / 2), y: canvas.height - 1 }, // bottom-center
      ];
      
      // Average the corner colors to get background color
      let avgR = 0, avgG = 0, avgB = 0;
      corners.forEach(({ x, y }) => {
        const idx = (y * canvas.width + x) * 4;
        avgR += data[idx];
        avgG += data[idx + 1];
        avgB += data[idx + 2];
      });
      avgR /= corners.length;
      avgG /= corners.length;
      avgB /= corners.length;
      
      // Tolerance for color matching (adjust this value to control sensitivity)
      const tolerance = 60;
      
      // Make pixels with similar color to background transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate color distance
        const distance = Math.sqrt(
          Math.pow(r - avgR, 2) +
          Math.pow(g - avgG, 2) +
          Math.pow(b - avgB, 2)
        );
        
        // If color is close to background, make it transparent
        if (distance < tolerance) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}
