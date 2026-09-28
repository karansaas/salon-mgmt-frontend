const MAX_DIMENSION = 1200;
const MAX_DATA_URL_LENGTH = 800000;

export const prepareProductImage = async (file: File): Promise<string> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');

  const source = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The selected image could not be read.'));
    image.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(source.src);

  const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
  if (imageUrl.length > MAX_DATA_URL_LENGTH) throw new Error('This image is still too large. Please choose a smaller photo.');
  return imageUrl;
};
