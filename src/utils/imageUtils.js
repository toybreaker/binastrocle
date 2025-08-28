// src/utils/imageUtils.js

/**
 * Get images from the work's content folder
 * @param {string} workHash - The work's hash/folder name
 * @returns {string[]} Array of image URLs sorted naturally
 */
export function getWorkImagesSync(workHash) {
  try {
    // Look for images in the content/works folder structure
    const images = import.meta.glob('/src/content/works/**/*.{jpg,jpeg,png,webp,avif}', { 
      eager: true, 
      query: '?url',
      import: 'default'
    });
    
    // Filter images for this specific work and sort them
    const workImages = Object.entries(images)
      .filter(([path]) => path.includes(`/works/${workHash}/`))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, url]) => url);
    
    return workImages;
  } catch (error) {
    console.warn(`Could not load images for work: ${workHash}`, error);
    return [];
  }
}

/**
 * Alternative: Get all work images grouped by work hash
 * @returns {Record<string, string[]>} Object with workHash as keys and image arrays as values
 */
export function getAllWorkImages() {
  try {
    const images = import.meta.glob('/src/content/works/**/*.{jpg,jpeg,png,webp,avif}', { 
      eager: true, 
      query: '?url',
      import: 'default'
    });
    
    // Group images by work hash
    const workImages = {};
    
    Object.entries(images).forEach(([path, url]) => {
      // Extract work hash from path: /src/content/works/unabox/image.jpg -> unabox
      const match = path.match(/\/works\/([^\/]+)\//);
      if (match) {
        const workHash = match[1];
        if (!workImages[workHash]) {
          workImages[workHash] = [];
        }
        workImages[workHash].push(url);
      }
    });
    
    // Sort images within each work
    Object.keys(workImages).forEach(workHash => {
      workImages[workHash].sort();
    });
    
    return workImages;
  } catch (error) {
    console.warn('Could not load work images:', error);
    return {};
  }
}