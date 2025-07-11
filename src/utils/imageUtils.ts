/**
 * Returns a local image path if available, falls back to Firebase URL
 * This helps reduce Firebase bandwidth usage
 */
export const getImagePath = (imageName: string, firebaseUrl?: string): string => {
    // List of images available locally 
    const localImages = [
      'nousrire.webp',
      'nousrire_logo.svg',
      'nousrire_bg.webp',
      'distribution_optimized.webp',
      'action_optimized.webp',
      'social_optimized.webp',
      'benevoles_optimized.webp',
      'placeholder.webp'
    ];
    
    // If the image name is in our local images list, use the local path
    if (localImages.includes(imageName)) {
      return `/images/optimized/${imageName}`;
    }
    
    // If no Firebase URL is provided, use a placeholder
    if (!firebaseUrl) {
      return '/images/optimized/placeholder.webp';
    }
    
    // Fall back to Firebase URL for dynamic content
    return firebaseUrl;
  };