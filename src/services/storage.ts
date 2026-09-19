const CLOUDINARY_CLOUD_NAME = 'dhj5vquy';
const CLOUDINARY_UPLOAD_PRESET = 'gbmart_upload';

/**
 * Optimizes an image client-side to ensure crisp quality while keeping file size small.
 * Ensures fast upload and compatibility with Firestore document limits (<1MB).
 */
export function optimizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve({ blob: file, dataUrl: '' });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, dataUrl: reader.result as string });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType =
          file.type === 'image/png' && file.size < 600 * 1024
            ? 'image/png'
            : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: file, dataUrl });
            }
          },
          mimeType,
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file to Firebase Storage under 'products/' or 'categories/' folders,
 * and returns the download URL.
 * Uses the existing Firebase 'getStorage' instance.
 *
 * @param file The File object selected from the computer
 * @param folder The storage folder ('products' | 'categories')
 * @returns Promise<string> The public download URL for the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: 'products' | 'categories' | string = 'products'
): Promise<string> {
  // Validate image
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error(
      'Please select a valid image file (JPG, JPEG, PNG, or WEBP).'
    );
  }

  // Optimize image before uploading
  let uploadBlob: Blob = file;

  try {
    const optimized = await optimizeImage(file, 1200, 1200, 0.85);
    uploadBlob = optimized.blob;
  } catch (error) {
    console.warn('Image optimization skipped:', error);
  }

  // Prepare Cloudinary upload
  const formData = new FormData();

  formData.append(
    'file',
    uploadBlob,
    file.name
  );

  formData.append(
    'upload_preset',
    CLOUDINARY_UPLOAD_PRESET
  );

  formData.append(
    'folder',
    `gb-mart/${folder}`
  );

  // Upload directly to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error('Cloudinary upload error:', result);

    throw new Error(
      result?.error?.message || 'Cloudinary image upload failed.'
    );
  }

  if (!result.secure_url) {
    throw new Error('Cloudinary did not return an image URL.');
  }

  console.log('Cloudinary upload successful:', result.secure_url);

  return result.secure_url;
}

/**
 * Alias for backward compatibility with existing components
 */
export const uploadProductImage = uploadImage;
