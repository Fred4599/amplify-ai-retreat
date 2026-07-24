import type { Area } from 'react-easy-crop';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error('Could not load that photo for cropping.')));
    image.crossOrigin = 'anonymous';
    image.src = src;
  });
}

/** Export a square crop as a JPEG File suitable for avatar upload. */
export async function getCroppedAvatarFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName = 'avatar.jpg',
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const size = Math.max(1, Math.round(Math.min(pixelCrop.width, pixelCrop.height)));
  const output = 800;
  canvas.width = output;
  canvas.height = output;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not crop this photo.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    size,
    size,
    0,
    0,
    output,
    output,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (value) resolve(value);
        else reject(new Error('Could not export the cropped photo.'));
      },
      'image/jpeg',
      0.92,
    );
  });

  const base = fileName.replace(/\.[^.]+$/, '') || 'avatar';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
}
