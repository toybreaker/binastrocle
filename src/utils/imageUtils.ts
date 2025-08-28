// src/utils/imageUtils.ts
import type { ImageMetadata } from 'astro';

export function getWorkImagesSync(workHash: string): ImageMetadata[] {
  try {
    // Use eager: true and correct typing
    const images: Record<string, { default: ImageMetadata }> = import.meta.glob(
      '/src/content/works/**/*.{jpg,jpeg,png,webp,avif}',
      { eager: true }
    );

    // Filter and sort images for this work
    const workImages = Object.entries(images)
      .filter(([path]) => path.includes(`/works/${workHash}/`))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, imageModule]) => imageModule.default);

    return workImages;
  } catch (error) {
    console.warn(`Could not load images for work: ${workHash}`, error);
    return [];
  }
}
